<template>
  <!-- 订单评价列表/商品-商品详情-评价列表 -->
  <div class="vh-100 bg-grey">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.rate.review')" />
    <!-- 评价列表分类 -->
    <div class="plr-20 pt-20 bg-white">
      <div class="flex between vcenter">
        <!-- 是否只看当前商品的评价 -->
        <van-checkbox class="flex" @click="isCurrent = !isCurrent">
          <template #icon>
            <BmImage
              :url="isCurrent ? require('@/assets/images/icon/choose-icon.png') : require('@/assets/images/icon/choose-default-icon.png')"
              :width="'0.32rem'" 
              :height="'0.32rem'"
              :isLazy="false"
              :isShow="false"
            />
          </template>
          <span class="ml-12 fs-14 lh-20 black">Current commodity</span>
        </van-checkbox>
        <div class="fs-14 lh-20 light-grey">Rating of 94%</div>
      </div>

      <!-- 标签 -->
      <div class="mt-20 flex flex-wrap between">
        <span class="ptb-4 plr-12 round-8 border fs-14 lh-20 color-666 mb-10">Soft and comfortable 290</span>
        <span class="ptb-4 plr-12 round-8 border fs-14 lh-20 color-666 mb-10">New fashion</span>
        <span class="ptb-4 plr-12 round-8 border fs-14 lh-20 color-666 mb-10">Size of the appropriate 20</span>
      </div>

      <!-- 评价分类 -->
      <van-tabs sticky swipeable animated :offset-top="44" color="#42B7AE" class="customs-van-tabs" :ellipsis="false" @change="getList" v-model="tabActive">
        <van-tab v-for="(categoryItem, tabIndex) in $t('me.report.categoryList')" :title="categoryItem" :key="'scroll-tab-' + tabIndex" title-class="pb-0" :name="tabIndex">
        </van-tab>
      </van-tabs>
    </div>

    <!-- 评价列表 -->
    <template v-if="list.length">
      <div class="mt-12 plr-20 pt-14 bg-white pb-20" v-for="(item, index) in list" :key="'review-' + index">
        <!-- 用户头像、昵称、日期 -->
        <div class="flex between vcenter" @click="goDetail(item.id)">
          <div class="flex vcenter">
            <BmImage
              :url="item.buyerPortrait"
              :width="'0.64rem'" 
              :height="'0.64rem'"
              :isLazy="false"
              :isShow="true"
              :fit="'cover'"
              :round="true"
              :errorUrl="require('@/assets/images/icon/user-icon.png')"
            />
            <p class="ml-14 fs-14 black fw">{{ item.buyerName }}</p>          
          </div>
          <div class="light-grey fs-14">{{ item.createTime }}</div>
        </div>
        <!-- 评分 -->
        <div class="mt-14 flex vcenter" @click="goDetail(item.id)">
          <van-rate v-model="item.goodsScores" allow-half readonly size="14" color="#F7B500" void-color="#DDDDDD" void-icon="star" />
          <div class="grey ml-12">{{ item.saleAttr }}</div>
        </div>
        <!-- 描述 -->
        <p class="black fs-14 mt-10" @click="goDetail(item.id)">{{ item.content }}</p>
        <!-- 展示图片 -->
        <div class="mt-20 flex flex-wrap" v-if="item.pictures.length > 0" @click="goDetail(item.id)">
          <div v-for="(picItem, picIndex) in item.pictures" :key="'pic-' + picItem.id">
            <BmImage
              :url="picItem.imgUrl"
              :width="'2.12rem'" 
              :height="'2.12rem'"
              :isLazy="false"
              :isShow="true"
              :fit="'cover'"
              :class="{'border round-2 hidden': true, 'ml-8': picIndex != 0}"
              v-if="picItem.fileType == 1"
            />
          </div>
        </div>
        
        <!--  -->
        <van-cell-group class="mt-20" :border="false">
          <!-- 追加评论 -->
          <template v-if="item.additionalEvaluates.length > 0">
            <p class="fw black fs-14">购买后追评</p>
            <div v-for="addItem in item.additionalEvaluates" :key="'add-review-' + addItem.id">
              <!-- 描述 -->
              <p class="black fs-14 mt-10">{{ addItem.content }}</p>
              <!-- 展示图片 -->
              <div class="mt-20 flex flex-wrap">
                <div v-for="(addPicItem, addPicIndex) in addItem.pictures" :key="'add-pic-' + addPicItem.id">
                  <BmImage
                    :url="addPicItem.imgUrl"
                    :width="'2.12rem'" 
                    :height="'2.12rem'"
                    :isLazy="false"
                    :isShow="true"
                    :fit="'cover'"
                    :class="{'border round-2 hidden': true, 'ml-8': addPicIndex != 0}"
                    v-if="addPicItem.fileType == 1"
                  />
                </div>
              </div>
            </div>
          </template>
          <van-cell class="plr-0 ptb-20" :title="$t('me.report.reviewAfterPurchase')" title-class="fw black fs-14" label-class="fs-14 color-666" label="The quality is very good. Mom likes it very much" />
          <!-- 卖家回复 -->
          <template v-if="item.sellerReplyList.length > 0">
            <van-cell class="plr-0 ptb-10" title-class="fs-14" v-for="(replyItem, replyIndex) in item.sellerReplyList" :key="'reply-' + replyIndex">
              <template #title>
                <span class="red">{{ replyItem.replyName }} Official customer service: </span>
                <span class="color-666">{{ replyItem.replyContent }}</span>
              </template>
            </van-cell>
          </template>
        </van-cell-group>

        <div class="clear flex hend vcenter mt-12">
          <!-- report按钮 -->
          <BmButton :type="'info'" class="h-30 round-8 black time-out fr" @btnClick="onReport">{{ $t('me.report.report') }}</BmButton>
          <div class="ml-20">
            <BmImage
              :url="require('@/assets/images/icon/message-icon.png')"
              :width="'0.48rem'" 
              :height="'0.48rem'"
              :isLazy="false"
              :isShow="false"
              :fit="'cover'"
              class=""
            />
          </div>
          <div class="ml-12">
            <span>{{ item.glike }}</span>
            <BmIcon :name="'likes-icon'" :width="'0.48rem'" :height="'0.48rem'" :color="'#262626'" @iconClick="addGive(item.id)"/>
          </div>
        </div>
      </div>
    </template>
    

  </div>
</template>

<script>
import { Checkbox, Cell, Tab, Tabs, Rate, CellGroup } from 'vant';
import { getRateList, addGive } from '@/api/product';

export default {
  middleware: 'authenticated',
  components: {
    vanCheckbox: Checkbox,
    vanCell: Cell,
    vanTab: Tab,
    vanTabs: Tabs,
    vanRate: Rate,
    vanCellGroup: CellGroup
  },
  data() {
    return {
      isCurrent: false,
      rate: 2.5,
      tabActive: 0,
      list: []
    }
  },
  async fetch() {

  },
  activated() {
    this.getList();
    // this.$fetch(); // 评价列表每次进入都要重新刷新数据
  },
  methods: {
    getList() { // 获取数据
      getRateList({ goodsId: this.$route.query.id }).then(res => {
        if (res.code != 0) return false;

        this.list = res.data.records.map(item => {
          return {
            ...item,
            pictures: item.pictures.filter((picItem, picIndex) => {
              return picIndex < 3;
            })
          }
        });
      })
    },
    onReport() { // 举报
      this.$router.push({
        name: 'me-order-rate-report-id',
        params: {
          id: 0
        }
      })
    },
    addGive(id) { // 点赞
      addGive(id).then(res => {
        if (res.code != 0) return false;
        this.getList();
      })
    },
    goDetail(id) { // 跳转到评价详情
      this.$router.push({
        name: 'me-order-rate-detail-id',
        params: {
          id: id
        }
      })
    }
  },
}
</script>

<style lang="less" scoped>
.color-666{
  color: #666;
}
.h-30{
  height: 30px!important;
}
.time-out{
  border-color: #eee!important;
  background-color: transparent!important;
}
</style>
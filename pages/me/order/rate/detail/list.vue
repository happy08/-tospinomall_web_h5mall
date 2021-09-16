<template>
  <!-- 订单评价列表/商品-商品详情-评价列表 -->
  <div class="v-percent-100 bg-grey">
    <van-sticky>
      <BmHeaderNav :left="{ isShow: true }" :title="$t('product_evaluation')" />

      <!-- 评价列表分类 -->
      <div class="plr-20 bg-white">
        <!-- 是否只看当前商品的评价 -->
        <!-- <div class="flex between vcenter">
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
            <span class="ml-8 fs-14 lh-20 black">{{ $t('current_commodity') }}</span>
          </van-checkbox>
          <div class="fs-14 lh-20 light-grey">{{ $t('rating_num', { replace_tip: '94%' }) }}</div>
        </div> -->

        <!-- 标签 -->
        <!-- <div class="mt-20 flex flex-wrap between">
          <span class="ptb-4 plr-12 round-8 border fs-14 lh-20 color-666 mb-10">Soft and comfortable 290</span>
          <span class="ptb-4 plr-12 round-8 border fs-14 lh-20 color-666 mb-10">New fashion</span>
          <span class="ptb-4 plr-12 round-8 border fs-14 lh-20 color-666 mb-10">Size of the appropriate 20</span>
        </div> -->

        <!-- 评价分类 -->
        <van-tabs sticky swipeable animated :offset-top="44" color="#42B7AE" class="customs-van-tabs" :ellipsis="false" @change="onChangeTab" v-model="tabActive">
          <van-tab v-for="(categoryItem, tabIndex) in $t('product_rate_tab')" :title="categoryItem" :key="'scroll-tab-' + tabIndex" title-class="pb-0" :name="tabIndex">
          </van-tab>
        </van-tabs>
      </div>
    </van-sticky>

    <PullRefresh :refreshing="refreshing" @refresh="onRefresh" class="custom-min-height-94">
      <!-- 无数据时展示 -->
      <empty-status v-if="list.length === 0" :image="require('@/assets/images/empty/order.png')" />
      <!-- 评价列表 -->
      <van-list
        v-else
        v-model="loading"
        :finished="finished"
        @load="onLoad"
        :finished-text="list.length == 0 ? '' : ''"
      >
        <div class="mt-12 pt-14 bg-white pb-20" v-for="(item, index) in list" :key="'review-' + index">
          <!-- 用户头像、昵称、日期 -->
          <div class="flex between vcenter plr-20" @click="goDetail(item)">
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
                :alt="'Tospino user icon'"
              />
              <p class="ml-14 fs-14 black fw">{{ item.buyerName }}</p>          
            </div>
            <div class="light-grey fs-14">{{ item.createTime }}</div>
          </div>
          <!-- 评分 -->
          <div class="mt-14 flex vcenter plr-20" @click="goDetail(item)">
            <van-rate v-model="item.goodsScores" readonly size="14" color="#F7B500" void-color="#DDDDDD" void-icon="star" />
            <div class="grey ml-12">{{ item.saleAttr }}</div>
          </div>
          <!-- 描述 -->
          <p class="black fs-14 mt-10 border-b plr-20 pb-20" @click="goDetail(item)">{{ item.content }}</p>
          <!-- 展示图片 -->
          <div class="mt-20 flex flex-wrap plr-20" v-if="item.pictures.length > 0">
            <div v-for="(picItem, picIndex) in item.pictures" :key="'pic-' + picItem.id">
              <BmImage
                :url="picItem.imgUrl"
                :width="item.pictures.length > 1 ? '2.12rem' : '6.68rem'" 
                :height="item.pictures.length > 1 ? '2.12rem' : '6.68rem'"
                :isLazy="false"
                :isShow="true"
                :fit="'cover'"
                :class="{'border round-2 hidden': true, 'ml-8': picIndex != 0}"
                v-if="picItem.fileType == 1"
                @onClick="onPreview(item.pictures, picIndex)"
                :alt="item.goodTitle"
              />
            </div>
          </div>
          
          <van-cell-group class="mt-10 plr-20" :border="false">
            <!-- 追加评论 -->
            <template v-if="item.additionalEvaluates && item.additionalEvaluates.length > 0">
              <p class="fw black fs-14">{{ $t('review_after_purchase') }}</p>
              <div v-for="addItem in item.additionalEvaluates" :key="'add-review-' + addItem.id">
                <p class="black fs-14 mt-10" @click="goDetail(item)">{{ addItem.content }}</p>
                <div class="mt-10 flex flex-wrap">
                  <div v-for="(addPicItem, addPicIndex) in addItem.pictures" :key="'add-pic-' + addPicItem.id">
                    <BmImage
                      :url="addPicItem.imgUrl"
                      :width="'2.12rem'" 
                      :height="'2.12rem'"
                      :isLazy="false"
                      :isShow="true"
                      :fit="'cover'"
                      :class="{'border round-2 hidden block mt-8': true, 'ml-8': addPicIndex % 3 != 0}"
                      v-if="addPicItem.fileType == 1"
                      @onClick="onPreview(addItem.pictures, addPicIndex)"
                      :alt="item.goodTitle"
                    />
                  </div>
                </div>
              </div>
            </template>
            <!-- <van-cell class="plr-0 ptb-20" :title="$t('me.report.reviewAfterPurchase')" title-class="fw black fs-14" label-class="fs-14 color-666" label="The quality is very good. Mom likes it very much" /> -->
            <!-- 卖家回复 -->
            <template v-if="item.sellerReplyList">
              <van-cell class="plr-0 ptb-10" title-class="fs-14" v-for="(replyItem, replyIndex) in item.sellerReplyList" :key="'reply-' + replyIndex" @click="goDetail(item)">
                <template #title>
                  <span class="red">{{ replyItem.replyName }}: </span>
                  <span class="color-666">{{ replyItem.replyContent }}</span>
                </template>
              </van-cell>
            </template>
          </van-cell-group>

          <div class="clear flex hend vcenter mt-12 plr-20">
            <!-- report按钮 -->
            <BmButton :type="'info'" class="h-30 round-8 black time-out fr" @btnClick="onReport(item.id)">{{ $t('report') }}</BmButton>
            <div class="ml-20 flex vcenter black fs-14" @click="goDetail(item)">
              <span>{{ item.replyCount }}</span>
              <BmImage
                :url="require('@/assets/images/icon/message-icon.png')"
                :width="'0.48rem'" 
                :height="'0.48rem'"
                :isLazy="false"
                :isShow="false"
                :fit="'cover'"
                class="ml-4"
                :alt="'Tospino message icon'"
              />
            </div>
            <div class="ml-12 flex vcenter black fs-14">
              <span>{{ item.glike }}</span>
              <BmIcon :name="'likes-icon'" class="ml-4" :width="'0.48rem'" :height="'0.48rem'" :color="item.isGiveLike ? '#42b7ae' : '#262626'" @iconClick="addGive(item)"/>
            </div>
          </div>
        </div>
      </van-list>
    
    </PullRefresh>
  </div>
</template>

<script>
import { Checkbox, Cell, Tab, Tabs, Rate, CellGroup, List, ImagePreview, Sticky } from 'vant';
import { getRateList, addGive } from '@/api/product';
import PullRefresh from '@/components/PullRefresh';
import EmptyStatus from '@/components/EmptyStatus';

export default {
  components: {
    vanCheckbox: Checkbox,
    vanCell: Cell,
    vanTab: Tab,
    vanTabs: Tabs,
    vanRate: Rate,
    vanCellGroup: CellGroup,
    vanList: List,
    vanSticky: Sticky,
    PullRefresh,
    EmptyStatus
  },
  data() {
    return {
      isCurrent: false,
      rate: 2.5,
      tabActive: 0,
      list: [],
      refreshing: {
        isFresh: false
      },
      pageNum: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      finished: false,
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.name === 'cart-product-id') {
        vm.tabActive = 0;
      }
    });
  },
  activated() {
    this.pageNum = 1;
    this.getList();
  },
  methods: {
    getList() { // 获取数据
      if (this.pageNum == 1) {
        this.$toast.loading({
          forbidClick: true,
          loadingType: 'spinner',
          duration: 0
        });
      }

      let _params = { goodsId: this.$route.query.id, pageNum: this.pageNum, pageSize: this.pageSize, createUser: this.$store.state.user.userInfo.id }
      if (this.tabActive == 1) {
        _params.sortType = 1; // 最新创建时间排序
      }
      if (this.tabActive == 2) { // 有图片
        _params.hasType = 1;
      }
      if (this.tabActive == 3) { // 追评 todo
        _params.hasType = 5;
      }
      if (this.tabActive == 4) { // 好评
        _params.explainType = 1;
      }
      if (this.tabActive == 5) { // 中评
        _params.explainType = 2;
      }
      if (this.tabActive == 6) { // 差评
        _params.explainType = 3;
      }
      getRateList(_params).then(res => {
        this.$toast.clear();

        let list = res.data.records.map(item => {
          return {
            ...item,
            pictures: item.pictures.filter((picItem, picIndex) => {
              return picIndex < 3;
            }),
            sellerReplyList: item.sellerReplyList.length > 0 ? [item.sellerReplyList[0]] : []
          }
        });
        
        this.list = this.pageNum == 1 ? list : this.list.concat(list);
        this.total = res.data.total;
        this.loading = false;
        this.refreshing.isFresh = false;
        if (parseFloat(this.total) > this.list.length) {
          this.finished = false;
        }
      })
    },
    onReport(id) { // 举报
      if (!this.$store.state.user.authToken) {
        this.$router.push({
          name: 'login'
        })
        return false;
      }
      this.$router.push({
        name: 'me-order-rate-report-id',
        params: {
          id: id
        }
      })
    },
    addGive(item) { // 点赞
      if (!this.$store.state.user.authToken) {
        this.$router.push({
          name: 'login'
        })
        return false;
      }
      
      addGive(item.id).then(res => {
        if (item.isGiveLike == 1) { // 已点赞，取消点赞
          item.isGiveLike = 0;
          item.glike -= 1;
          return false;
        }
        item.isGiveLike = 1;
        item.glike += 1;
      })
    },
    goDetail(item) { // 跳转到评价详情
      this.$router.push({
        name: 'me-order-rate-detail-id',
        params: {
          id: item.id
        },
        query: {
          buyerId: item.buyerId
        }
      })
    },
    onRefresh() { // 下拉刷新
      this.pageNum = 1;
      this.getList();
    },
    onLoad() { // 加载更多
      this.finished = false;
      if (parseFloat(this.total) == this.list.length) {
        this.loading = false;
        this.finished = true;
        return false;
      }
      this.pageNum += 1;
      this.getList();
    },
    onPreview(item, index) { // 图片预览
      const imgs = item.map(picItem => {
        return picItem.imgUrl;
      });
      ImagePreview({
        images: imgs,
        startPosition: index,
        loop: false
      })
    },
    onChangeTab() { // tab切换
      this.pageNum = 1;
      if (process.client) {
        window.scrollTo({
          top: 0
        });
      }
      this.getList();
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
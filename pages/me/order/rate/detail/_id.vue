<template>
  <!-- 商品-评价-评价详情/ 我的-评价-评价详情 -->
  <div class="vh-100 bg-grey pb-20">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.report.detail')" />

    <!-- 订单展示 -->
    <div class="p-20 bg-white flex between">
      <BmImage
        :url="require('@/assets/images/product-bgd-90.png')"
        :width="'1.2rem'" 
        :height="'1.2rem'"
        :isLazy="false"
        :isShow="false"
        :fit="'cover'"
        class="border round-2 flex-shrink"
      />
      <p class="fs-14 black ml-12 lh-20 hidden-2">Hassen’s new fall single shoes fashion wedding…</p>
      <!-- 加入购物车 -->
      <BmImage
        :url="require('@/assets/images/icon/add-cart-btn.png')"
        :width="'0.96rem'" 
        :height="'0.56rem'"
        :isLazy="false"
        :isShow="false"
        :fit="'cover'"
        class="mt-8 flex-shrink"
        @click="goCart"
      />
    </div>
    
    <!-- 评价详情 -->
    <div class="mt-12 plr-20 pt-14 bg-white pb-20">
      <!-- 用户头像、昵称、日期 -->
      <div class="flex between vcenter">
        <div class="flex vcenter">
          <div>
            <BmImage
              :url="detailData.buyerPortrait"
              :width="'0.64rem'" 
              :height="'0.64rem'"
              :isLazy="false"
              :isShow="true"
              :fit="'cover'"
              :round="true"
              :errorUrl="require('@/assets/images/icon/user-icon.png')"
            />
          </div>
          <p class="ml-14 fs-14 black fw">{{ detailData.buyerName }}</p>          
        </div>
        <div class="light-grey fs-14">{{ detailData.createTime }}</div>
      </div>
      <!-- 评分 -->
      <div class="mt-14 flex vcenter">
        <van-rate v-model="rate" allow-half size="14" color="#F7B500" void-color="#DDDDDD" void-icon="star" />
        <div class="grey ml-12">{{ detailData.saleAttr }}</div>
      </div>
      <!-- 描述 -->
      <p class="black fs-14 mt-10">{{ detailData.content }}</p>
      <!-- 展示图片 -->
      <div v-for="picItem in detailData.pictures" :key="'pic-' + picItem.id" class="mt-10">
        <BmImage
          :url="picItem.imgUrl"
          :width="'6.68rem'" 
          :height="'6.68rem'"
          :isLazy="false"
          :isShow="true"
          :fit="'cover'"
          :class="{'border round-8 hidden': true}"
          v-if="picItem.fileType == 1"
        />
      </div>
      <!-- 追加评论 -->
      <template v-if="detailData.additionalEvaluates && detailData.additionalEvaluates.length > 0">
        <p class="fw black fs-14 mt-20">购买后追评</p>
        <div v-for="addItem in detailData.additionalEvaluates" :key="'add-review-' + addItem.id">
          <!-- 描述 -->
          <p class="black fs-14 mt-10">{{ addItem.content }}</p>
          <!-- 展示图片 -->
          <div class="flex flex-wrap">
            <div v-for="addPicItem in addItem.pictures" :key="'add-pic-' + addPicItem.id">
              <BmImage
                :url="addPicItem.imgUrl"
                :width="'6.68rem'" 
                :height="'6.68rem'"
                :isLazy="false"
                :isShow="true"
                :fit="'cover'"
                :class="{'border round-8 hidden mt-10': true}"
                v-if="addPicItem.fileType == 1"
              />
            </div>
          </div>
        </div>
      </template>
      <!-- 卖家回复 -->
      <template v-if="detailData.sellerReplyList && detailData.sellerReplyList.length > 0">
        <van-cell class="plr-0 ptb-10" title-class="fs-14" v-for="(replyItem, replyIndex) in detailData.sellerReplyList" :key="'reply-' + replyIndex">
          <template #title>
            <span class="red">{{ replyItem.replyName }} Official customer service: </span>
            <span class="color-666">{{ replyItem.replyContent }}</span>
          </template>
        </van-cell>
      </template>
      
      <!-- 你的意见、信息、点赞 -->
      <div class="mt-43 flex between vcenter">
        <van-field v-model="thoughts" class="custom-field" :border="false" :placeholder="$t('me.report.writeThoughts')" />
        <!-- 评价人数 -->
        <div class="flex vcenter">
          <span class="mr-4">1</span>
          <BmImage
            :url="require('@/assets/images/icon/message-icon.png')"
            :width="'0.48rem'" 
            :height="'0.48rem'"
            :isLazy="false"
            :isShow="false"
            :fit="'cover'"
          />
        </div>
        <!-- 点赞 -->
        <div class="flex vcenter">
          <span class="mr-4">{{ detailData.glike }}</span>
          <BmIcon :name="'likes-icon'" :width="'0.48rem'" :height="'0.48rem'" :color="'#262626'" @iconClick="addGive(detailData.id)"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Rate, Field, Cell } from 'vant';
import { getRateDetail, addGive } from '@/api/product';

export default {
  middleware: 'authenticated',
  components: {
    vanRate: Rate,
    vanField: Field,
    vanCell: Cell
  },
  data() {
    return {
      rate: 2.5,
      thoughts: '',
      detailData: {}
    }
  },
  activated() {
    this.getRateDetail();
  },
  methods: {
    goCart() { // 加入购物车

    },
    getRateDetail() { // 获取评价详情
      getRateDetail(this.$route.params.id).then(res => {
        if (res.code != 0) return false;
        this.detailData = res.data;
      })
    },
    addGive(id) { // 点赞
      addGive(id).then(res => {
        if (res.code != 0) return false;
        this.getList();
      })
    },
  },
}
</script>

<style lang="less" scoped>
.mt-43{
  margin-top: 43px;
}
.custom-field{
  width: 238px;
  background-color: #F8F8F8;
  line-height: 20px;
  border-radius: 20px;
}
</style>
<template>
  <!-- 我的-我的优惠券 -->
  <div class="bg-grey v-percent-100 pb-64">
    <van-sticky>
      <BmHeaderNav :left="{ isShow: true }" :title="$t('my_coupon')">
        <!-- 使用说明 -->
        <nuxt-link slot="header-right" class="fs-16 green" :to="{ name: 'service-type', params: { type: 'coupon' }, query: { isH5: 1 } }">{{ $t('coupon_use_instruction') }}</nuxt-link>
      </BmHeaderNav>

      <van-tabs v-model="tabActive" color="#42B7AE" class="customs-van-tabs" @click="onChangeTab">
        <van-tab :title="'全部(' + allCount + ')'" name="100"></van-tab>
        <van-tab :title="'平台券(' + platformCount + ')'" name="1"></van-tab>
        <van-tab :title="'店铺券(' + shopCount + ')'" name="0"></van-tab>
      </van-tabs>
    </van-sticky>

    <PullRefresh :refreshing="refreshing" @refresh="onRefresh" class="custom-min-height-94">
      <div class="pb-20 bg-grey mlr-10">
        <!-- 空列表 -->
        <empty-status v-if="lists.length === 0" :image="require('@/assets/images/empty/order.png')" :description="$t('empty')" />
        <van-list
          v-else
          v-model="loading"
          :finished="finished"
          finished-text=""
          @load="onLoad"
          class="bg-grey"
        >
          <coupon-single v-for="item in lists" :key="item" class="mt-12"></coupon-single>
        </van-list>
      </div>
    </PullRefresh>

    <!-- <div class="mlr-10">
      
      <coupon-single v-for="item in 10" :key="item" class="mt-12"></coupon-single>
    </div> -->
    <button @click="isCouponShow = !isCouponShow">isCouponShow</button>

    <div class="flex tc coupon-tabbar">
      <nuxt-link :to="{ name: 'me-coupon-record' }" class="fw black flex-1 pb-14 pt-20 border-r">优惠券使用记录</nuxt-link>
      <nuxt-link :to="{ name: 'me-coupon-center' }" class="fw black flex-1 pb-14 pt-20">去领券中心</nuxt-link>
    </div>

    <!-- 确认订单弹窗 -->
    <!-- <van-popup v-model="isCouponShow" style="height: 80%" position="bottom" class="border-tlr-radius-12 coupon-popup">
      <div class="coupon-popup__top">
        <h1 class="fs-16 tc pt-12">优惠</h1>
        <van-tabs v-model="couponActive" class="customs-van-tabs border-b">
          <van-tab title="可用优惠券"></van-tab>
          <van-tab title="不可用优惠券"></van-tab>
        </van-tabs>
        <p class="fs-12 p-10">您已选中优惠券1张，共抵用<span>¥120.0</span></p>
      </div>
      <div class="coupon-popup__bottom">
        <coupon-order-single class="mt-10 mlr-10" v-for="item in 10" :key="item"></coupon-order-single>
      </div>
    </van-popup> -->

    <!-- <dialog-gift-coupon></dialog-gift-coupon> -->
  </div>
</template>

<script>
import CouponSingle from '@/components/CouponSingle';
// import CouponOrderSingle from '@/components/CouponOrderSingle';
// import DialogGiftCoupon from '@/components/DialogGiftCoupon';
import PullRefresh from '@/components/PullRefresh';
import { Tab, Tabs, Sticky, Popup, List } from 'vant';
import { getCouponList, getCouponCount } from '@/api/coupon';

export default {
  middleware: 'authenticated',
  components: {
    vanTab: Tab,
    vanTabs: Tabs,
    vanSticky: Sticky,
    vanPopup: Popup,
    vanList: List,
    CouponSingle,
    PullRefresh,
    // CouponOrderSingle,
    // DialogGiftCoupon
  },
  data() {
    return {
      tabActive: 0,
      isCouponShow: true,
      couponActive: 0,
      pageNum: 0,
      pageSize: 20,
      lists: [],
      total: 0,
      loading: false,
      finished: false,
      refreshing: {
        isFresh: false
      },
      allCount: 0, // 所有券
      platformCount: 0, // 平台券
      shopCount: 0, // 店铺券
    }
  },
  activated() {
    this.getCouponCount();
    this.getCouponList();
  },
  methods: {
    getCouponList() { // 获取我的优惠券列表
      // couponType 优惠券类型:(0:店铺券 1:平台券),不传默认全部
      // pageNum: 0 , pageSize: 10
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      if (parseFloat(this.tabActive) != 100) {
        params.couponType = this.tabActive;
      }
      this.$toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      });
      getCouponList(params).then(res => {
        this.lists = this.pageNum == 0 ? res.data.records : this.lists.concat(res.data.records);
        this.total = parseFloat(res.data.total);
        this.finished = this.total == this.lists.length ? true : false;
        this.$toast.clear();
      }).catch(error => {
        console.log(error);
        this.$toast.clear();
      })
    },
    onChangeTab(name, title) { // tab切换 name 100全部 1平台券 0店铺券
      console.log(name, title)
      this.pageNum = 0;
      this.getCouponList();
    },
    onLoad() { // 滚动加载
      if (this.total == this.lists.length) {
        this.loading = false;
        this.finished = true;
        return false;
      }
      this.pageNum += 1;
      this.getCouponList();
    },
    onRefresh() { // 刷新
      this.pageNum = 0;
      this.finished = false;
      this.getCouponList();
    },
    getCouponCount() { // 获取优惠券数量
      getCouponCount().then(res => {
        this.allCount = res.data.allCount;
        this.platformCount = res.data.platformCount;
        this.shopCount = res.data.shopCount;
      })
    }
  }
}
</script>

<style lang="less" scoped>
.coupon-tabbar{
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  z-index: 10;
  min-height: 54px;
}
.flex-1{
  flex: 1;
}
.border-r{
  position: relative;
  &::after{
    content: '';
    display: block;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 20px;
    background-color: #F4F4F4;
  }
}
.pb-64{
  padding-bottom: 64px;
}
.border-tlr-radius-12{
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}
.coupon-popup{
  // position: relative;
  .coupon-popup__bottom{
    height: calc(100% - 113px);
    overflow-y: auto;
  }
}
</style>
<template>
  <!-- 我的-我的优惠券 -->
  <div class="bg-grey v-percent-100 pb-64">
    <van-sticky>
      <BmHeaderNav :left="{ isShow: true }" :title="$t('my_coupon')">
        <!-- 使用说明 -->
        <nuxt-link slot="header-right" class="fs-16 green" :to="{ name: 'service-type', params: { type: 'coupon' }, query: { isH5: 1 } }">{{ $t('coupon_use_instruction') }}</nuxt-link>
      </BmHeaderNav>

      <van-tabs v-model="tabActive" color="#42B7AE" class="customs-van-tabs">
        <van-tab title="全部"></van-tab>
        <van-tab title="平台券"></van-tab>
        <van-tab title="店铺券"></van-tab>
      </van-tabs>
    </van-sticky>

    <div class="mlr-10">
      <coupon-single v-for="item in 10" :key="item" class="mt-12"></coupon-single>
    </div>
    <button @click="isCouponShow = !isCouponShow">isCouponShow</button>

    <div class="flex tc coupon-tabbar">
      <nuxt-link :to="{ name: 'me-coupon-record' }" class="fw black flex-1 pb-14 pt-20 border-r">优惠券使用记录</nuxt-link>
      <nuxt-link :to="{ name: 'me-coupon-center' }" class="fw black flex-1 pb-14 pt-20">去领券中心</nuxt-link>
    </div>

    <!-- 确认订单弹窗 -->
    <van-popup v-model="isCouponShow" style="height: 80%" position="bottom" class="border-tlr-radius-12 coupon-popup">
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
    </van-popup>

    <dialog-gift-coupon></dialog-gift-coupon>
  </div>
</template>

<script>
import CouponSingle from '@/components/CouponSingle';
import CouponOrderSingle from '@/components/CouponOrderSingle';
import DialogGiftCoupon from '@/components/DialogGiftCoupon';
import { Tab, Tabs, Sticky, Popup } from 'vant';

export default {
  components: {
    vanTab: Tab,
    vanTabs: Tabs,
    vanSticky: Sticky,
    vanPopup: Popup,
    CouponSingle,
    CouponOrderSingle,
    DialogGiftCoupon
  },
  data() {
    return {
      tabActive: 0,
      isCouponShow: false,
      couponActive: 0
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
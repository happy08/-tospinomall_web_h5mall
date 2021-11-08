<template>
  <!-- 我的-我的优惠券使用记录 -->
  <div class="bg-grey v-percent-100">
    <van-sticky>
      <BmHeaderNav :left="{ isShow: true }" :title="$t('my_coupon')"></BmHeaderNav>

      <van-tabs v-model="recordTabActive" color="#42B7AE" class="customs-van-tabs">
        <van-tab title="已使用"></van-tab>
        <van-tab title="已过期"></van-tab>
      </van-tabs>
    </van-sticky>

    <div class="mlr-10">
      <coupon-single v-for="item in 10" :key="item" class="mt-12" :type="1"></coupon-single>
    </div>
  </div>
</template>

<script>
import CouponSingle from '@/components/CouponSingle';
import { Tab, Tabs, Sticky } from 'vant';

export default {
  components: {
    vanTab: Tab,
    vanTabs: Tabs,
    vanSticky: Sticky,
    CouponSingle
  },
  data() {
    return {
      recordTabActive: 0
    }
  }
}
</script>
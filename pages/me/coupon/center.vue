<template>
  <!-- 我的-优惠券领券中心 -->
  <div class="bg-grey v-percent-100 pb-64">
    <van-sticky>
      <BmHeaderNav :left="{ isShow: true }" :title="$t('my_coupon')">
        <!-- 使用说明 -->
        <nuxt-link slot="header-right" class="fs-16 green" :to="{ name: 'service-type', params: { type: 'coupon' }, query: { isH5: 1 } }">{{ $t('coupon_use_instruction') }}</nuxt-link>
      </BmHeaderNav>

      <van-tabs v-model="centerTabActive" color="#42B7AE" class="customs-van-tabs">
        <van-tab title="全部"></van-tab>
        <van-tab title="平台券"></van-tab>
        <van-tab title="店铺券"></van-tab>
      </van-tabs>
    </van-sticky>

    <div class="mlr-10">
      <coupon-single v-for="item in 10" :key="item" class="mt-12"></coupon-single>
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
      centerTabActive: 0
    }
  }
}
</script>
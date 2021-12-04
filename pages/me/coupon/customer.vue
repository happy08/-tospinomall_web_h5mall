<template>
  <!-- 客服优惠券领取页面 -->
  <div class="bg-grey">
    <coupon-order-single class="mt-10 mlr-10" v-for="(item, index) in couponList" :key="'good-coupon-' + index" :item="item"></coupon-order-single>
  </div>
</template>

<script>
import CouponOrderSingle from '@/components/CouponOrderSingle';
import { getLinkCoupon, getCouponDetail } from '@/api/coupon';

export default {
  components: {
    CouponOrderSingle
  },
  data() {
    return {
      couponList: []
    }
  },
  activated() {
    getCouponDetail({ linkCouponId: this.$route.query.linkCouponId }).then(res => {
      this.couponList = res.data ? [{
        ...res.data,
        isH5CouponType: 1 // 客服链接优惠券
      }]: [];
    })
  }
}
</script>
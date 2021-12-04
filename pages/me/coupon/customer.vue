<template>
  <!-- 客服优惠券领取页面 -->
  <div class="bg-grey m-375 m-auto vh-100 pt-10 plr-10">
    <coupon-order-single v-for="(item, index) in couponList" :key="'good-coupon-' + index" :item="item" @onReceive="item.isReceive = $event"></coupon-order-single>
  </div>
</template>

<script>
import CouponOrderSingle from '@/components/CouponOrderSingle';
import { getCouponDetail } from '@/api/coupon';

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
        isH5CouponType: 1, // 客服链接优惠券
        isReceive: res.data.receiveStatus
      }]: [];
    })
  }
}
</script>

<style lang="less" scoped>
html, body{
  width: 375PX;
}
.m-375{
  max-width: 375px;
}
</style>
<template>
  <!-- 客服优惠券领取页面 -->
  <div class="bg-grey m-375 m-auto vh-100 pt-10 plr-10" v-if="isShowLink">
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
      couponList: [],
      isShowLink: false
    }
  },
  activated() {
    let isMobile = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
    // pc打开，跳转到pc页面
    if (!isMobile) {
      let pc_link = 'http://192.168.2.37:8100';
      if (process.env.APP_MODE) {
        if (process.env.APP_MODE == 'test') pc_link = 'https://pcmall.fyynet.com'; // 测试环境
        if (process.env.APP_MODE == 'ghana') pc_link = 'https://www.tospinomall.com.gh'; // 加纳环境
      }
      location.replace(`${pc_link}/user/coupon/customer?linkCouponId=${this.$route.query.linkCouponId}`);
      return false;
    }
    this.$toast.loading({
      forbidClick: true,
      loadingType: 'spinner',
      duration: 0
    });
    // 登录之后要跳转到这个页面，所以在一开始进来这个页面时需要打个标记
    sessionStorage.setItem('customerCouponLink', this.$route.query.linkCouponId);
    getCouponDetail({ linkCouponId: this.$route.query.linkCouponId }).then(res => {
      this.$toast.clear();
      this.isShowLink = true;
      this.couponList = res.data ? [{
        ...res.data,
        isH5CouponType: 1, // 客服链接优惠券
        isReceive: res.data.receiveStatus
      }]: [];
    }).catch(error => {
      console.log(error);
      this.$toast.clear();
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
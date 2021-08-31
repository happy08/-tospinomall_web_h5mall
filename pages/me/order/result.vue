<template>
  <!-- 我的-订单-确认订单结果页面 -->
  <div>
    <BmHeaderNav :title="$t(title)" :border="false" />
    
    <div class="plr-20 tc result-page__container">
      <van-icon v-if="$route.query.type == 'failed'" name="clear" color="#FF3B30" size="54" />
      <van-icon v-else name="checked" color="#52C41A" size="54" />
      <!-- 状态语 -->
      <p class="fs-18 fw black mt-30 result-page__container--title">{{ $t(status) }}</p>
      <!-- 订单支付成功提示语 -->
      <p class="light-grey fs-14 mt-12">{{ $t(desc) }}</p>
      <!-- 继续购物 -->
      <van-button
        class="mt-60 btn_h48 round-8 fw fs-16 w-100"
        color="linear-gradient(270deg, #3EB5AE 0%, #70CEB6 100%)"
        @click="goShop"> 
        {{ $t(btntext) }}
      </van-button>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'authenticated',
  data() {
    return {
      title: '',
      status: '',
      desc: '',
      btntext: ''
    }
  },
  activated() {
    if (this.$route.query.type == 'success' || !this.$route.query.type) { // 成功结果展示
      this.title = 'me.order.paymentSuccess';
      this.status = 'me.order.success';
      this.desc = 'me.order.paidSuccess';
      this.btntext = 'me.order.continueShop';
    }
    if (this.$route.query.type == 'failed') { // 失败结果展示
      this.title = 'me.order.paymentFailed';
      this.status = 'me.order.failed';
      this.desc = 'me.order.paidSuccess';
      this.btntext = 'me.order.viewOrder';
    }
  },
  methods: {
    goShop() { // 继续购物
      this.$router.replace({
        name: 'me'
      })
    }
  },
}
</script>

<style lang="less" scoped>
.result-page__container{
  padding-top: 40px;
  .result-page__container--title{
    line-height: 28px;
  }
}
</style>
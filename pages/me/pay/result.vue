<template>
  <!-- 我的-设置-支付设置-账户登录密码-修改结果展示页 -->
  <div class="result-page">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.pay.pwdResultTitle')" />
    <div class="plr-20 tc result-page__container">
      <van-icon name="checked" color="#52C41A" size="64" />
      <p class="fs-18 fw black mt-24 result-page__container--title">{{ $t('me.authentication.success') }}</p>
      <!-- 修改成功提示语 -->
      <p class="light-grey fs-14 mt-12">{{ $t('me.pay.pwdResultDesc') }}</p>
      <van-button
        class="mt-60 btn_h48 round-8 fw fs-16 w-100 result-page__btn"
        color="linear-gradient(270deg, #3EB5AE 0%, #70CEB6 100%)"
        @click="onConfirm"> 
        {{ $t('me.authentication.iknow') }}
      </van-button>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'authenticated',
  methods: {
    onConfirm() {
      if (this.$route.query.from) { // 主要判断从订单页面回来要跳回去
        this.$router.go(-5);
        return false;
      }
      this.$router.push({
        name: 'me-pay'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.result-page__container{
  padding-top: 34px;
  .result-page__container--title{
    line-height: 22px;
  }
  .result-page__btn{
    margin-top: 44px;
  }
}
</style>
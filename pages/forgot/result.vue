<template>
  <div class="result-page">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('forgot.title')"></BmHeaderNav>

    <div class="plr-20 tc result-page__container">
      <van-icon name="checked" color="#52C41A" size="54" />
      <p class="fs-18 fw result-page__container--title">{{ $t('common.congratulations') }}</p>
      <p class="light-grey fs-14 result-page__container--tip">{{ $t('forgot.successTip') }}</p>
      <van-button class="mt-60 btn_h48 fw fs-16 w-100" color="linear-gradient(270deg, #3EB5AE 0%, #70CEB6 100%)" @click="login">
        {{ $t('login.loginNow') }}
      </van-button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    login() { // 点击立即登录跳转到登录页面
      this.$router.push({
        name: 'login-login'
      })
    }
  },
}
</script>

<style lang="less" scoped>
.result-page{
  background-color: #fff;
  .result-page__container{
    padding-top: 40px;
    .result-page__container--title{
      color: #383838;
      margin-top: 30px;
      line-height: 28px;
    }
    .result-page__container--tip{
      line-height: 18px;
      margin-top: 12px;
    }
  }
}
</style>
<template>
  <div class="result-page">
    <!-- 注册、修改密码成功结果页面 -->
    <BmHeaderNav :left="{ isShow: true }" :title="title"></BmHeaderNav>
    <div class="plr-20 tc result-page__container">
      <van-icon name="checked" color="#52C41A" size="54" />
      <p class="fs-18 fw black result-page__container--title">{{ $t('common.congratulations') }}</p>
      <!-- 注册成功提示语 -->
      <p class="light-grey fs-14 result-page__container--tip">{{ desc }}</p>
      <van-button
        class="mt-60 btn_h48 fw fs-16 w-100"
        color="linear-gradient(270deg, #3EB5AE 0%, #70CEB6 100%)"
        @click="loginClick"> 
        {{ $t('login.loginNow') }}
      </van-button>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    title() { // 头部标题
      return this.$route.query.type === 'forgot' ? this.$t('forgot.title') : this.$t('register.register');
    },
    desc() {
      return this.$route.query.type === 'forgot' ? this.$t('forgot.successTip') : this.$t('register.successTip');
    }
  },
  methods: {
    loginClick() { // 点击登录 
      this.$router.push({
        name: 'login'
      })
    },
    login() {

    }
  }
}
</script>

<style lang="less" scoped>
.result-page{
  background-color: #fff;
  .result-page__container{
    padding-top: 40px;
    .result-page__container--title{
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
<template>
  <div class="login-page__container">
    <!-- 验证码 -->
    <van-field v-model="account" :placeholder="$t('login.accountPlaceholder')" />
    <van-field v-model="password" type="password" :placeholder="$t('login.pwdPlaceholder')" />
    <div class="fs-14 login-page__container--forgot">{{ $t('login.forgotPwd') }}</div>
    <!-- 登录 -->
    <van-button class="mt-60 btn_h48 fw fs-16 w-100" color="linear-gradient(270deg, #3EB5AE 0%, #70CEB6 100%)">
      {{ $t('login.loginBtn') }}
    </van-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      account: '',
      password: ''
    }
  }
}
</script>

<style lang="less" scoped>
.login-page__container--forgot{
  margin-top: 12px;
  color: #BFBFBF;
  text-align: right;
  line-height: 20px;
  padding-right: 2px;
}
</style>
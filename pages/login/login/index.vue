<template>
  <div class="tc login-page__container">
    <!-- 验证码 -->
    <van-field class="field-container" v-model="account" :placeholder="$t('login.accountPlaceholder')" />
    <van-field class="field-container" v-model="password" type="password" :placeholder="$t('login.pwdPlaceholder')" />
    <div class="fs-14 login-page__container--forgot">{{ $t('login.forgotPwd') }}</div>
    <!-- 登录 -->
    <van-button
      class="mt-60 btn_h48 fw fs-16 w-100"
      color="linear-gradient(270deg, #3EB5AE 0%, #70CEB6 100%)"
      :disabled="account.length === 0 || password.length === 0"
      @click="login">
      {{ $t('login.loginBtn') }}
    </van-button>
    <nuxt-link class="green iblock login-page__container--register" :to="{ name: 'register' }">立即注册</nuxt-link>
  </div>
</template>

<script>
import { Field } from 'vant';

export default {
  components: {
    vanField: Field
  },
  data() {
    return {
      account: '',
      password: ''
    }
  },
  methods: {
    login() { // 登录
      this.$api.authLogin().then(res => {
        console.log(res)
      })
    }
  },
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
.login-page__container--register{
  line-height: 20px;
  margin-top: 10px;
}
</style>
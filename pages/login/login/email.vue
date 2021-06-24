<template>
  <div class="login-page__container">
    <!-- 验证码 -->
    <van-field v-model="account" :placeholder="$t('login.enterEmail')" />
    <van-field
      v-model="code"
      center
      clearable
      :placeholder="$t('login.enterCode')"
    >
      <template #button>
        <button class="fs-14 verification-btn" @click="sendCode">Get It</button>
      </template>
    </van-field>
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
      code: ''
    }
  },
  methods: {
    sendCode() {
      console.log('code');
    }
  },
}
</script>

<style lang="less" scoped>
.verification-btn{
  padding: 5px 11px 6px 12px;
  color: #42B7AE;
  line-height: 20px;
  border-radius: 7.5px;
  background-color: rgba(61, 235, 220, .1);
  border: 1px solid #46B0B0;
}
</style>
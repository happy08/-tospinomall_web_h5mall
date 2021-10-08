<template>
  <div>
    <!-- 注册、修改密码成功结果页面 -->
    <BmHeaderNav :left="{ isShow: true }" :title="title" />
    
    <div class="plr-20 tc result-page__container">
      <van-icon name="checked" color="#52C41A" size="54" />
      <p class="fs-18 fw black mt-30 result-page__container--title">{{ $t('congratulations') }}</p>
      <!-- 注册成功提示语 -->
      <p class="light-grey fs-14 mt-12" v-if="$route.query.type === 'forgot'">{{ $t('congratulations_you_have_successfully_set_the_password') }}</p>
      <p class="light-grey fs-14 mt-12" v-else>{{ $t('register_success_tip', { replace_tip: countdown }) }}</p>
      <van-button
        class="mt-60 btn_h48 fw fs-16 round-8 w-100"
        color="linear-gradient(270deg, #3EB5AE 0%, #70CEB6 100%)"
        @click="login"> 
        {{ $t('log_in_now') }}
      </van-button>
    </div>
  </div>
</template>

<script>
import { authLogin } from '@/api/login';

export default {
  data() {
    return {
      countdown: 5,
      timer: null
    }
  },
  computed: {
    title() { // 头部标题
      return this.$route.query.type === 'forgot' ? this.$t('forgot_password') : this.$t('register');
    }
  },
  activated() {
    if (!this.$route.query.type) {
      this.countdown = 5;
      this.timer = setInterval(() => {
        if (this.countdown == 1) {
          this.login();
          clearInterval(this.timer);
        }
        this.countdown -= 1;
      }, 1000)
    }
  },
  methods: {
    login() { // 点击登录 
      if (this.$route.query.type) { // 忘记密码
        this.$router.push({
          name: 'login'
        })
        return false;
      }
      this.$toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      });
      let _data = {
        username: this.$route.query.phone ? this.$route.query.phone : this.$route.query.email,
        password: this.$route.query.password,
        grant_type: 'password'
      }
      if (this.$route.query.phone) {
        _data.phonePrefix = this.$route.query.phonePrefix;
      }

      authLogin(_data).then(res => {
        clearInterval(this.timer);
        this.$store.commit('user/SET_TOKEN', res.data.token_type + ' ' + res.data.access_token);
        this.$store.commit('user/SET_REFRESHTOKEN', res.data.refresh_token);
        this.$store.commit('user/SET_SCOPE', res.data.scope);
        // 获取用户信息
        this.$store.dispatch('user/GetUserInfo', res.data.token_type + ' ' + res.data.access_token);
        // 获取消息信息
        this.$store.commit('user/SET_WEBSOCKET', res.data.user_info.passUrl);
        // 当前登录账号
        this.$store.commit('user/SET_ACCOUNT', { email: res.data.user_info.email, phone: res.data.user_info.phone });
        this.$toast.clear();
        // 登录成功跳转到首页
        setTimeout(() => {
          this.$router.push({
            name: 'home'
          })
        }, 100);
      })
    }
  }
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
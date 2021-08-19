<template>
  <!-- 我的-设置-安全认证-账户登录密码-修改结果展示页 -->
  <div class="result-page">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('change_password')" />
    
    <div class="plr-20 tc result-page__container">
      <van-icon name="checked" color="#52C41A" size="64" />
      <p class="fs-18 fw black result-page__container--title">{{ $t('success') }}</p>
      <!-- 修改成功提示语 -->
      <p class="light-grey fs-14 mt-12 result-page__container--tip">{{ $t('login_password_set_successfully_tips', { replace_tip: countDown }) }}</p>
      <van-button
        class="mt-60 btn_h48 round-8 fw fs-16 w-100 result-page__btn"
        color="linear-gradient(270deg, #3EB5AE 0%, #70CEB6 100%)"
        @click="onConfirm"> 
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
      countDown: 5
    }
  },
  activated() {
    this.countDown = 5;
    let timer = setInterval(() => {
      if (this.countDown <= 1) {
        clearInterval(timer);
        this.onConfirm();
        return false;
      }
      this.countDown --;
    }, 1000);
  },
  methods: {
    onConfirm() { // 点击登录
      this.$toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      });
      this.$api.logout().then(res => {
        if (res.code != 0) return false;
        this.$store.commit('SET_TOKEN', null);
        this.login();
      })
    },
    login() {
      authLogin({ username: this.$store.state.user.account, password: this.$route.query.pwd, grant_type: 'password' }).then(res => {
        this.$toast.clear();
        this.$store.commit('user/SET_TOKEN', res.data.token_type + ' ' + res.data.access_token);
        this.$store.commit('user/SET_REFRESHTOKEN', res.data.refresh_token);
        this.$store.commit('user/SET_SCOPE', res.data.scope);
        // 获取用户信息
        this.$store.dispatch('user/GetUserInfo', res.data.token_type + ' ' + res.data.access_token);
        // 获取消息信息
        this.$store.commit('user/SET_WEBSOCKET', res.data.user_info.passUrl);
        this.$toast.clear();
        // 登录成功跳转到首页
        setTimeout(() => {
          this.account = '';
          this.password = '';
          this.$router.push({
            name: 'home'
          })
        }, 300);
      })
    }
  }
}
</script>

<style lang="less" scoped>
.result-page__container{
  padding-top: 34px;
  .result-page__container--title{
    margin-top: 24px;
    line-height: 22px;
  }
  .result-page__container--tip{
    line-height: 18px;
  }
  .result-page__btn{
    margin-top: 44px;
  }
}
</style>
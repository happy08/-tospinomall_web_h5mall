<template>
  <div>
    <BmHeaderNav :left="{ isShow: true, url: '/login' }" :title="$t('associated_mailbox')" ></BmHeaderNav>

    <div class="mlr-20 pb-30 flex between column register-page">
      <van-field
        v-model="account_email"
        :placeholder="$t('enter_your_email')"
        class="field-container phone-code-field"
        maxlength="254"
        type="email"
      ></van-field>

      <!-- 验证码 -->
      <van-field
        v-model="code"
        center
        clearable
        :placeholder="$t('enter_verification_code')"
        class="field-container"
        type="digit"
        maxlength="6"
      >
        <template #button>
          <van-button class="fs-14 green lh-20 round-8 verification-btn" v-show="countdown === 0" @click="sendCode" :disabled="account_email.length === 0">{{ $t('get_it') }}</van-button>
          <button class="fs-14 lh-20 round-8 verification-countdown-btn" v-show="countdown > 0">{{ countdown }}S</button>
        </template>
      </van-field>
      <van-button class="mt-60 btn_h48 fw fs-16 w-100" color="linear-gradient(270deg, #3EB5AE 0%, #70CEB6 100%)" :disabled="account_email.length === 0 || code.length === 0" @click="jumpPwd">
        {{ $t('determine') }}
      </van-button>
    </div>
  </div>
</template>

<script>
import { Field, Checkbox } from 'vant';
import { getEmailCode, checkEmailCode, facebookLogin } from '@/api/login';

export default {
  components: {
    vanField: Field,
    vanCheckbox: Checkbox
  },
  data() {
    return {
      account_email: '',
      code: '',
      countdown: 0,
      isCodeFlag: false,
      isNextFlag: false
    }
  },
  methods: {
    sendCode() {
      if (this.isCodeFlag) {
        return false;
      }
      this.isCodeFlag = true;
      this.$toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      });
      
      let reg = /^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/;
      if (!reg.test(this.account_email)) {
        this.isCodeFlag = false;
        this.$toast(this.$t('email_format_error'));
        return false;
      }
      // 接口返回操作
      getEmailCode({ email: this.account_email, userType: 'buyer', type: 1 }).then(res => {
        this.isCodeFlag = false;
        this.$toast(res.data); // 提示验证码
        this.countdown = 60; // 设置倒计时60s
        let timer = setInterval(() => {
          if (this.countdown === 0) {
            clearInterval(timer);
            return false;
          }
          this.countdown --;
        }, 1000);
      }).catch(() => {
        this.isCodeFlag = false;
      })
    },
    jumpPwd() {
      if (this.isNextFlag) {
        return false;
      }
      this.isNextFlag = true;
      this.$toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      });

      let reg = /^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/;
      if (!reg.test(this.account_email)) {
        this.isNextFlag = false;
        this.$toast(this.$t('email_format_error'));
        return false;
      }
      checkEmailCode({ code: this.code, email: this.account_email, userType: 'buyer', isDelCode: 0 }).then(() => {
        // 校验成功自动登录
        facebookLogin({ mobile: { userId: this.$route.query.userId, email: this.account_email, name: this.$route.query.name }, grant_type: 'facebook' }, { email: this.account_email, code: this.code }).then(res => {
          this.isNextFlag = false;
          this.$store.commit('user/SET_TOKEN', res.data.token_type + ' ' + res.data.access_token);
          this.$store.commit('user/SET_REFRESHTOKEN', res.data.refresh_token);
          this.$store.commit('user/SET_SCOPE', res.data.scope);
          // 获取用户信息
          this.$store.dispatch('user/GetUserInfo', res.data.token_type + ' ' + res.data.access_token);
          // 获取消息信息
          this.$store.commit('user/SET_WEBSOCKET', res.data.user_info.passUrl);
          // 当前登录账号
          this.$store.commit('user/SET_ACCOUNT', res.data.user_info.email);
          this.$toast.clear();
          // 登录成功跳转到首页
          setTimeout(() => {
            this.account_email = '';
            this.code = '';
            this.countdown = 0;
            this.$router.push({
              name: 'home'
            })
          }, 100);
        }).catch(() => {
          this.isNextFlag = false;
        })
      }).catch(() => {
        this.isNextFlag = false;
      });
    }
  }
}
</script>

<style lang="less" scoped>
.verification-btn{
  padding: 5px 11px 6px 12px;
  background-color: rgba(61, 235, 220, .1);
  border: 1px solid #46B0B0;
  .van-button__content, &.van-button{
    height: auto!important;
  }
}
.verification-countdown-btn{
  padding: 5px 16px 6px 12px;
  height: 31px;
  color: #BFBFBF;
  background-color: #eee;
  border: none;
}
</style>
<template>
  <!-- 支付密码-修改支付密码-发送验证码 -->
  <div class="bg-grey vh-100">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('payment_password')" />

    <div class="mlr-20 code-container">
      <p class="fs-18 black tc">{{ $t('please_enter_6_number_verification_code') }}</p>

      <!-- 密码输入框 -->
      <van-password-input
        :value="value"
        :focused="showKeyboard"
        @focus="showKeyboard = true"
        length="6"
        class="round-8 mt-20 custom-pwd-ipt"
        gutter="0.14rem"
      />
      <!-- 数字键盘 -->
      <van-number-keyboard
        v-model="value"
        :show="showKeyboard"
        @blur="showKeyboard = false"
        @input="onInput"
        :extra-key="''"
        :maxlength="6"
      />
      <!-- 没有得到 重新发送 -->
      <div class="mt-12 flex hend vcenter">
        <!-- <span class="fs-14 black">{{ $t('dont_get_code') }}</span> -->
        <span class="fs-14 resend-content" v-show="countdown > 0">{{ $t('resend_after', { replace_tip: countdown }) }}</span>
        <span class="fs-14 green" v-show="countdown == 0" @click="getCode">{{ $t('resend') }}</span>
      </div>
      <!-- 使用当前支付密码进行身份验证 -->
      <!-- <p class="fs-14 green mt-20 tc">{{ $t('me.pay.useCurrentPayPwd') }}</p> -->
      <p class="fs-14 light-grey mt-16 pre-wrap" v-html="$t('payment_password_sms_tips')"></p>
    </div>
  </div>
</template>

<script>
import { PasswordInput, NumberKeyboard } from 'vant';
import { getCurrentCode, checkCurrentCode } from '@/api/user';

export default {
  middleware: 'authenticated',
  components: {
    vanPasswordInput: PasswordInput,
    vanNumberKeyboard: NumberKeyboard
  },
  data() {
    return {
      value: '',
      showKeyboard: false,
      countdown: 0
    }
  },
  beforeRouteEnter(to, from, next) { // 从绑定或修改页面进入重置值为空
    next(vm => {
      if (from.name === 'me-account-verifymethod') {
        vm.value = '';
        vm.countdown = 0;
      }
    });
  },
  activated() {
    if (this.countdown > 0) return false;

    this.getCode();
  },
  methods: {
    onInput() { // 监听数字输入
      if (this.value.length >= 5) { // 校验验证码，正确跳转到设置支付密码页面
        setTimeout(() => {
          let _axios;
          _axios = this.$route.query.changeWay === 'email' ? checkCurrentCode({ code: this.value, type: 2, isDelCode: 0 }) : checkCurrentCode({ code: this.value, type: 1, isDelCode: 0 });
          _axios.then(res => {
            if (res.code != 0) return false;

            this.$router.push({
              name: 'me-pay-changePwd',
              query: {
                code: this.value,
                changeWay: this.$route.query.changeWay === 'email' ? 'email' : 'phone',
                from: this.$route.query.from
              }
            })
          })
        }, 100);
      }
    },
    getCode() { // 获取验证码
      // 加载图标
      this.$toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      });

      let _axios;
      _axios = this.$route.query.changeWay === 'email' ? getCurrentCode(2) : getCurrentCode(1);
      // 接口返回操作
      _axios.then(res => {
        this.$toast(res.data); // 提示验证码
        this.countdown = 120; // 设置倒计时120s
        let timer = setInterval(() => {
          if (this.countdown === 0) {
            clearInterval(timer);
            return false;
          }
          this.countdown --;
        }, 1000);
      })
    }
  },
}
</script>

<style lang="less" scoped>
.code-container{
  margin-top: 24px;
}
.resend-content{
  color: #BFBFBF;
}
.mt-16{
  margin-top: 16px;
}
</style>

<style lang="less">
.custom-pwd-ipt li{
  background-color: transparent;
  border-bottom: 2px solid #BFBFBF;
  &.van-password-input__item--focus{
    border-bottom-color: #42B7AE;
  }
}
</style>
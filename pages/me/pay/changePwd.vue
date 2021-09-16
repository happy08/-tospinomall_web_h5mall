<template>
  <!-- 我的-设置-支付设置-设置/修改支付密码 -->
  <div class="bg-grey vh-100">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('payment_password')" />

    <!-- 设置密码 -->
    <div class="mlr-12 payment-container">
      <!-- 首次设置输入密码提示 -->
      <p class="fs-18 black tc">{{ $t('payment_password_limit_tips') }}</p>
      <!-- 密码输入框 -->
      <van-password-input
        :value="value"
        :focused="showKeyboard"
        @focus="showKeyboard = true"
        length="6"
        class="round-8 payment-container__pwd"
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

      <!-- 首次设置支付密码的提示语 -->
      <div class="fs-14 light-grey pre-wrap mt-20" v-html="$t('warm_input_password')"></div>
      
    </div>
  </div>
</template>

<script>
import { PasswordInput, NumberKeyboard } from 'vant';

export default {
  middleware: 'authenticated',
  components: {
    vanPasswordInput: PasswordInput,
    vanNumberKeyboard: NumberKeyboard
  },
  data() {
    return {
      value: '',
      showKeyboard: true
    }
  },
  beforeRouteEnter(to, from, next) { // 从初始页面进入重置值为空
    next(vm => {
      if (from.name === 'me-pay-password' || from.name === 'me-pay-code' || from.name === 'me-pay-payment') {
        vm.value = '';
      }
    });
  },
  activated() {
    this.showKeyboard = true;
  },
  methods: {
    onInput() { // 点击按键时触发
      if (this.value.length >= 5) { // 输入密码长度等于6时说明该进行下一步确认密码
        setTimeout(() => {
          let _query = {
            pwd: this.value
          }
          if (this.$route.query.payPwd) { // 旧的支付密码
            _query.payPwd = this.$route.query.payPwd;
          }
          if (this.$route.query.code) { // 验证码
            _query.code = this.$route.query.code;
          }
          if (this.$route.query.changeWay) { // 验证方式
            _query.changeWay = this.$route.query.changeWay;
          }
          if (this.$route.query.from) { // 主要是为了订单页面的回退
            _query.from = this.$route.query.from;
          }
          this.$router.push({
            name: 'me-pay-confirmPwd',
            query: _query
          })
        }, 100);
      }
    }
  },
}
</script>

<style lang="less" scoped>
.payment-container{
  margin-top: 24px;
  .payment-container__pwd{
    margin-top: 50px;
  }
}
.tip-container{
  margin-top: 23px;
  ul>li{
    list-style: auto;
    list-style-position: inside;
    line-height: 17px;
  }
}
</style>
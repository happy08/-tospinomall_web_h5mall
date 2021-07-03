<template>
  <!-- 我的-设置-账户设置-支付方式-设置/修改支付 确认密码 -->
  <div class="bg-grey vh-100">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.pay.paymentPwd')"></BmHeaderNav>
    <!-- 设置密码 -->
    <div class="mlr-12 payment-container">
      <!-- 首次设置再次输入密码提示 -->
      <p class="fs-18 black tc">{{ $t('me.pay.firstSetPwdAgain') }}</p>
      <!-- 密码输入框 -->
      <van-password-input
        :value="password"
        :focused="showKeyboard"
        @focus="showKeyboard = true"
        class="round-8 payment-container__pwd"
        :error-info="errorInfo"
        length="6"
      />
      <!-- 数字键盘 -->
      <van-number-keyboard
        v-model="password"
        :show="showKeyboard"
        @blur="showKeyboard = false"
        @input="onInput"
        :extra-key="''"
        :maxlength="6"
      />
      <!-- 首次设置支付密码的提示语 -->
      <ul class="mt-24" v-if="isFirstPwd === true">
        <li class="fs-14 light-grey" v-for="(tipItem, tipIndex) in $t('me.pay.firstSetPwdTip')" :key="tipIndex" v-html="tipItem"></li>
      </ul>
      
      <!-- 修改密码提示语 -->
      <div v-else>
        <p class="fs-14 green tc mt-24">{{ $t('me.pay.messageVerify') }}</p>
        <!-- 温馨提示 -->
        <div class="fs-14 light-grey mt-24">
          <p>{{ $t('me.pay.warnTip') }}:</p>
          <ul>
            <li v-for="(tipItem, tipIndex) in $t('me.pay.warnTipsList')" :key="tipIndex" v-html="tipItem"></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { PasswordInput, NumberKeyboard } from 'vant';

export default {
  components: {
    vanPasswordInput: PasswordInput,
    vanNumberKeyboard: NumberKeyboard
  },
  data() {
    return {
      password: '',
      showKeyboard: true,
      errorInfo: '',
      isFirstPwd: false // 是不是首次设置密码
    }
  },
  methods: {
    onInput() { // 点击按键时触发
      if (this.password.length >= 5) { // 判断密码是否相等，提交支付密码
        setTimeout(() => { // 得到数据有延迟
          if (this.password !== this.$route.query.pwd) { // 密码错误
            this.errorInfo = this.$t('me.pay.pwdError');
            return false;
          }
          // 密码正确提交成功跳转到成功结果页面
          this.$router.push({
            name: 'me-setting-pay-result'
          })
        }, 300);
      }
    }
  },
}
</script>

<style lang="less" scoped>
.mt-24{
  margin-top: 24px;
}
.payment-container{
  margin-top: 24px;
  .payment-container__pwd{
    margin-top: 50px;
  }
}
</style>
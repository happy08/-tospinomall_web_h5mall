<template>
  <!-- 支付密码-修改支付密码-发送验证码 -->
  <div class="bg-grey vh-100">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.pay.paymentPwd')"></BmHeaderNav>

    <div class="mlr-20 code-container">
      <p class="fs-18 black tc">{{ $t('me.pay.firstSetPwd') }}</p>

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
      <div class="mt-12 flex between vcenter">
        <span class="fs-14 black">{{ $t('common.dontGet') }}</span>
        <span class="fs-14 resend-content">{{ $t('common.resend') }}</span>
      </div>
      <!-- 使用当前支付密码进行身份验证 -->
      <p class="fs-14 green mt-20 tc">{{ $t('me.pay.useCurrentPayPwd') }}</p>
      <div class="fs-14 light-grey mt-16">
        <p>{{ $t('me.pay.warnTip') }}:</p>
        <ul>
          <li v-for="(tipItem, tipIndex) in $t('me.pay.warnTipsList')" :key="tipIndex" v-html="tipItem"></li>
        </ul>
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
      value: '',
      showKeyboard: false
    }
  },
  methods: {
    onInput() { // 监听数字输入

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
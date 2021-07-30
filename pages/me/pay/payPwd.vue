<template>
  <!-- 支付密码验证 -->
  <div class="bg-grey vh-100">
    <BmHeaderNav :left="{ isShow: true }" :title="'支付密码'" />

    <!-- 设置密码 -->
    <div class="mlr-12 payment-container">
      <!-- 首次设置输入密码提示 -->
      <p class="fs-18 black tc">请输入支付密码</p>
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
      <ul class="mt-20">
        <li class="fs-14 light-grey" v-for="(tipItem, tipIndex) in $t('me.pay.firstSetPwdTip')" :key="tipIndex" v-html="tipItem"></li>
      </ul>
      
    </div>
  </div>
</template>

<script>
import { PasswordInput, NumberKeyboard } from 'vant';
import { checkPayPwd } from '@/api/pay';

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
      if (from.name === 'me-pay-password') {
        vm.value = '';
      }
    });
  },
  activated() {
    this.showKeyboard = true;
  },
  methods: {
    onInput() { // 点击按键时触发
      if (this.value.length >= 5) { // 输入密码长度等于6时说明该进行下一步校验支付密码
        console.log(this.value)
        
        setTimeout(() => { // 得到数据有延迟
          checkPayPwd(this.value).then(res => {
            if (res.code != 0) return false;

            if (!res.data) {
              this.$toast.fail('支付密码错误');
              return false;
            }

            this.$router.push({ // 校验之后跳转到设置密码页面
              name: 'me-pay-changePwd',
              query: {
                payPwd: this.value
              }
            })
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
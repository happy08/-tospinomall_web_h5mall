<template>
  <!-- 我的-设置-支付方式-设置/修改支付 确认密码 -->
  <div class="bg-grey vh-100">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('payment_password')" />
    
    <!-- 设置密码 -->
    <div class="mlr-12 payment-container">
      <!-- 首次设置再次输入密码提示 -->
      <p class="fs-18 black tc">{{ $t('enter_password_again') }}</p>
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
      <div v-if="isFirstPwd === true" class="fs-14 light-grey pre-wrap mt-24" v-html="$t('warm_input_password')"></div>
      
      <!-- 修改密码提示语 -->
      <div v-else>
        <p class="fs-14 green tc mt-24">{{ $t('message_authentication') }}</p>
        <!-- 温馨提示 -->
        <p class="fs-14 light-grey mt-24 pre-wrap" v-html="$t('forgot_password_tips')"></p>
      </div>
    </div>
  </div>
</template>

<script>
import { PasswordInput, NumberKeyboard } from 'vant';
import { firstSetPayPwd, updatePayPwd } from '@/api/pay';

export default {
  middleware: 'authenticated',
  components: {
    vanPasswordInput: PasswordInput,
    vanNumberKeyboard: NumberKeyboard
  },
  data() {
    return {
      password: '',
      showKeyboard: true,
      errorInfo: '',
      isFirstPwd: true // 是不是首次设置密码
    }
  },
  beforeRouteEnter(to, from, next) { // 从初始页面进入重置值为空
    next(vm => {
      if (from.name === 'me-pay-changePwd') {
        vm.password = '';
        vm.errorInfo = '';
      }
    });
  },
  activated() {
    this.showKeyboard = true;
  },
  methods: {
    onInput() { // 点击按键时触发
      if (this.password.length >= 5) { // 判断密码是否相等，提交支付密码
        setTimeout(() => { // 得到数据有延迟
          if (this.password !== this.$route.query.pwd) { // 密码错误
            this.errorInfo = this.$t('the_two_passwords_entered_are_inconsistent');
            return false;
          }
          
          // this.$store.state.user.userInfo.payPassword == '' 首次设置密码
          let _data;
          if (this.$store.state.user.userInfo.payPassword == '') { // 首次设置密码
            _data = {
              payPassword: this.password, 
              repeatPayPassword: this.password
            }
          } else {
            _data = {
              newPayPassword: this.password
            }
            if (this.$route.query.payPwd) _data.oldPayPassword = this.$route.query.payPwd; // 就支付密码
            if (this.$route.query.changeWay) _data.type = this.$route.query.changeWay == 'email' ? 2 : 1; // 验证方式
            if (this.$route.query.code) _data.code = this.$route.query.code; // 验证码
          }

          let _ajax = this.$store.state.user.userInfo.payPassword == '' ? firstSetPayPwd(_data) : updatePayPwd(_data);
          
          _ajax.then(res => {
            if (res.code != 0) return false;

            let _query = {};
            if (this.$route.query.from) { // 主要是为了订单页面的回退
              _query.from = this.$route.query.from;
            } else {
              this.$store.commit('SET_USERINFO', null);
              this.$store.dispatch('user/GetUserInfo', this.$store.state.user.authToken);
            }

            // 密码正确提交成功跳转到成功结果页面
            this.$router.push({
              name: 'me-pay-result',
              query: _query
            })
          }).catch(error => {
            console.log(error);
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
</style>
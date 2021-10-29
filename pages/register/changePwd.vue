<template>
  <div class="forgot-page">
    <!-- 忘记密码-修改密码页面 -->
    <BmHeaderNav :left="{ isShow: true }" :title="$t('forgot_password')" />
    
    <div class="mlr-20">
      <van-field
        v-model="pwd"
        center
        clearable
        :placeholder="$t('enter_password_6_20')"
        :type="pwdType"
        class="field-container"
        maxlength="20"
      >
        <template #button>
          <!-- 睁眼 -->
          <van-icon v-if="pwdType === 'text'" :name="require('@/assets/images/icon/eye-o.png')" size="24" color="#666" @click="changeType('pwdType', 'password')" />
          <!-- 闭眼 -->
          <van-icon v-else :name="require('@/assets/images/icon/eye-close.png')" size="24" color="#666" @click="changeType('pwdType', 'text')" />
        </template>
      </van-field>
      <van-field
        v-model="confirmPwd"
        center
        clearable
        :placeholder="$t('enter_again')"
        :type="confirmPwdType"
        class="field-container"
        maxlength="20"
      >
        <template #button>
          <!-- 睁眼 -->
          <van-icon v-if="confirmPwdType === 'text'" :name="require('@/assets/images/icon/eye-o.png')" size="24" color="#666" @click="changeType('confirmPwdType', 'password')" />
          <!-- 闭眼 -->
          <van-icon v-else :name="require('@/assets/images/icon/eye-close.png')" size="24" color="#666" @click="changeType('confirmPwdType', 'text')" />
        </template>
      </van-field>

      <!-- 提交新密码 -->
      <van-button
        class="mt-30 btn_h48 fw fs-16 w-100" 
        color="linear-gradient(270deg, #3EB5AE 0%, #70CEB6 100%)"
        :disabled="pwd.length < 6 || confirmPwd.length < 6"
        @click="submit">
        {{ $t('confirm') }}
      </van-button>
    </div>
  </div>
</template>

<script>
import { Field } from 'vant';
import { forgetPwd } from '@/api/login';

export default {
  components: {
    vanField: Field
  },
  data() {
    return {
      pwd: '',
      confirmPwd: '',
      pwdType: 'password',
      confirmPwdType: 'password'
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.name === 'register') {
        vm.pwd = '';
        vm.confirmPwd = '';
      }
    });
  },
  methods: {
    changeType(key, val) {
      this[key] = val;
    },
    submit() { // 忘记密码 提交新密码
      const reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)(?=[\w!@~#\$%\^&\*\(\)\-\+=\{\}\[\]\|\\,\.<>\?/:;"']+$).{6,20}$/;

      if (!reg.test(this.confirmPwd) || !reg.test(this.pwd)) {
        this.$toast(this.$t('t_format_error'));
        return false;
      }
      if (this.pwd !== this.confirmPwd) {
        this.$Toast(this.$t('the_two_passwords_entered_are_inconsistent'));
        return false;
      }
      let _account = this.$route.query.email ? { email: this.$route.query.email } : { phone: this.$route.query.phone, phonePrefix: this.$route.query.phonePrefix };
      forgetPwd({ code: this.$route.query.code, password: this.pwd, repeatPassword: this.confirmPwd, ..._account }).then(() => {
        this.$router.push({ // 忘记密码 修改成功页面
          name: 'register-result',
          query: {
            type: 'forgot'
          }
        })
      }).catch(error => {
        console.log(error);
      })
    }
  },
}
</script>

<style lang="less" scoped>
.forgot-page{
  background-color: #fff;
  height: 100vh;
}
</style>
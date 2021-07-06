<template>
  <div class="forgot-page">
    <!-- 忘记密码-修改密码页面 -->
    <BmHeaderNav :title="$t('forgot.title')" />
    
    <div class="mlr-20">
      <van-field
        v-model="pwd"
        center
        clearable
        placeholder="6-12 new Password"
        :type="pwdType"
        class="field-container"
      >
        <template #button>
          <!-- 睁眼 -->
          <van-icon v-if="pwdType === 'text'" name="eye-o" size="24" color="#666" @click="changeType('pwdType', 'password')" />
          <!-- 闭眼 -->
          <van-icon v-else name="closed-eye" size="24" color="#666" @click="changeType('pwdType', 'text')" />
        </template>
      </van-field>
      <van-field
        v-model="confirmPwd"
        center
        clearable
        placeholder="Enter again"
        :type="confirmPwdType"
        class="field-container"
      >
        <template #button>
          <!-- 睁眼 -->
          <van-icon v-if="confirmPwdType === 'text'" name="eye-o" size="24" color="#666" @click="changeType('confirmPwdType', 'password')" />
          <!-- 闭眼 -->
          <van-icon v-else name="closed-eye" size="24" color="#666" @click="changeType('confirmPwdType', 'text')" />
        </template>
      </van-field>

      <!-- 提交新密码 -->
      <van-button
        class="mt-30 btn_h48 fw fs-16 w-100" 
        color="linear-gradient(270deg, #3EB5AE 0%, #70CEB6 100%)"
        :disabled="pwd.length < 6 || confirmPwd.length < 6"
        @click="submit">
        {{ $t('common.confirm') }}
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
  methods: {
    changeType(key, val) {
      this[key] = val;
    },
    submit() { // 忘记密码 提交新密码
      if (this.pwd !== this.confirmPwd) {
        this.$Toast('密码不相等');
        return false;
      }
      let _account = this.$route.query.email ? { email: this.$route.query.email } : { phone: this.$route.query.phone, phonePrefix: this.$route.query.phonePrefix };
      forgetPwd({ code: this.$route.query.code, password: this.pwd, repeatPassword: this.confirmPwd, ..._account }).then(res => {
        this.$router.push({ // 忘记密码 修改成功页面
          name: 'register-result',
          query: {
            type: 'forgot'
          }
        })
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
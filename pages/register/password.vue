<template>
  <!-- 设置密码 -->
  <div class="register-pwd">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('register.title')" />

    <div class="plr-20">
      <!-- 验证码 -->
      <van-field
        clickable
        v-model="password"
        :placeholder="$t('register.enterPwd')"
        class="field-container phone-code-field"
        :type="pwdType"
      >
        <template #button>
          <!-- 睁眼 -->
          <van-icon v-if="pwdType === 'text'" name="eye-o" size="24" color="#666" @click="pwdType = 'password'" />
          <!-- 闭眼 -->
          <van-icon v-else name="closed-eye" size="24" color="#666" @click="pwdType = 'text'" />
        </template>
      </van-field>
      <p class="fs-14 register-pwd__tip">The password consists of 6-20 letters, numbers or symbols, and the letters should be case sensitive</p>
      <!-- 注册 -->
      <van-button 
        class="mt-60 btn_h48 fw fs-16 w-100"
        color="linear-gradient(270deg, #3EB5AE 0%, #70CEB6 100%)"
        :disabled="password.length < 6"
        maxlength="20"
        @click="registerClick">
        {{ $t('register.register') }}
      </van-button>
    </div>
  </div>
</template>

<script>
import { Field } from 'vant';
import { buyerRegister } from '@/api/login';

export default {
  components: {
    vanField: Field
  },
  data() {
    return {
      password: '',
      pwdType: 'password'
    }
  },
  methods: {
    registerClick() { // 买家用户注册
      // 通过路由获取上一步输入的信息
      const _params = {
        ...this.$route.query,
        password: this.password,
        repeatPassword: this.password
      }
      
      buyerRegister(_params).then(res => {
        this.$router.push({
          name: 'register-result'
        })
      })
    }
  },
}
</script>

<style lang="less" scoped>
.register-pwd{
  height: 100vh;
  background-color: #fff;
  .register-pwd__tip{
    line-height: 21px;
    margin-top: 23px;
    color: rgba(153, 153, 153, .58);
  }
}
</style>
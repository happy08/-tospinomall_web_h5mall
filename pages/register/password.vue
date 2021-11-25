<template>
  <!-- 设置密码 -->
  <div class="register-pwd">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('individual_registration')" />

    <div class="plr-20">
      <van-field
        clickable
        v-model="password"
        :placeholder="$t('enter_password_6_20')"
        class="field-container phone-code-field"
        :type="pwdType"
        maxlength="20"
      >
        <template #button>
          <!-- 睁眼 -->
          <van-icon v-if="pwdType === 'text'" :name="require('@/assets/images/icon/eye-o.png')" size="0.48rem" @click="pwdType = 'password'" />
          <!-- 闭眼 -->
          <van-icon v-else :name="require('@/assets/images/icon/eye-close.png')" size="0.48rem" @click="pwdType = 'text'" />
        </template>
      </van-field>
      <p v-show="isError" class="fs-14 mt-14 red">{{ $t(isError) }}</p>
      <p class="fs-14 mt-14 register-pwd__tip">{{ $t('verify_password_tip') }}</p>
      <!-- 注册 -->
      <van-button 
        class="mt-60 btn_h48 fw fs-16 w-100 round-8"
        color="linear-gradient(270deg, #3EB5AE 0%, #70CEB6 100%)"
        :disabled="password.length < 6"
        maxlength="20"
        @click="registerClick">
        {{ $t('register') }}
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
      pwdType: 'password',
      isError: false
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.name === 'register') {
        vm.password = '';
      }
    });
  },
  methods: {
    registerClick() { // 买家用户注册
      const reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)(?=[\w!@~#\$%\^&\*\(\)\-\+=\{\}\[\]\|\\,\.<>\?/:;"']+$).{6,20}$/;
      if (!reg.test(this.password)) {
        // this.$toast(this.$t('t_format_error'));
        this.isError = 'pwd_letter_number';
        return false;
      }
      this.$toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      });
      // 通过路由获取上一步输入的信息
      const _params = {
        ...this.$route.query,
        password: this.password,
        repeatPassword: this.password
      }
      
      buyerRegister(_params).then(() => {
        this.$toast.clear();
        this.$router.push({
          name: 'register-result',
          query: {
            ...this.$route.query,
            password: this.password,
          }
        })
        this.isError = false;
      }).catch(error => {
        console.log(error);
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
    color: rgba(153, 153, 153, .58);
  }
}
</style>
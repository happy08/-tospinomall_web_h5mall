<template>
  <div class="forgot-page">
    <BmHeaderNav :title="$t('forgot.title')"></BmHeaderNav>
    <div class="plr-20">
      <van-field
        v-model="pwd"
        center
        clearable
        :placeholder="$t('login.enterCode')"
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
        v-model="comfirmPwd"
        center
        clearable
        :placeholder="$t('login.enterCode')"
        :type="comfirmPwdType"
        class="field-container"
      >
        <template #button>
          <!-- 睁眼 -->
          <van-icon v-if="comfirmPwdType === 'text'" name="eye-o" size="24" color="#666" @click="changeType('comfirmPwdType', 'password')" />
          <!-- 闭眼 -->
          <van-icon v-else name="closed-eye" size="24" color="#666" @click="changeType('comfirmPwdType', 'text')" />
        </template>
      </van-field>

      <!-- 提交新密码 -->
      <van-button class="mt-30 btn_h48 fw fs-16 w-100" color="linear-gradient(270deg, #3EB5AE 0%, #70CEB6 100%)">
        {{ $t('common.confirm') }}
      </van-button>
    </div>
  </div>
</template>

<script>
import { Field } from 'vant';

export default {
  components: {
    vanField: Field
  },
  data() {
    return {
      pwd: '',
      comfirmPwd: '',
      pwdType: 'password',
      comfirmPwdType: 'password'
    }
  },
  methods: {
    changeType(key, val) {
      console.log(key, val)
      this[key] = val;
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
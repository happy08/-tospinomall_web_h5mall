<template>
  <!-- 我的-设置-安全认证-修改密码-使用密码认证 -->
  <div class="bg-grey vh-100">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.authentication.title')" />

    <div class="plr-20 bg-white">
      <!-- 当前登录密码 -->
      <van-field
        v-model="pwd"
        center
        clearable
        :placeholder="$t('me.authentication.currentPlaceholder')"
        :type="pwdType"
        class="field-container"
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
        :placeholder="$t('me.authentication.pwdPlaceholder')"
        :type="confirmPwdType"
        class="field-container"
      >
        <template #button>
          <!-- 睁眼 -->
          <van-icon v-if="confirmPwdType === 'text'" :name="require('@/assets/images/icon/eye-o.png')" size="24" color="#666" @click="changeType('confirmPwdType', 'password')" />
          <!-- 闭眼 -->
          <van-icon v-else :name="require('@/assets/images/icon/eye-close.png')" size="24" color="#666" @click="changeType('confirmPwdType', 'text')" />
        </template>
      </van-field>
    </div>
    
    <div class="plr-20 w-100 mt-14">
      <p class="fs-14">{{ $t('me.authentication.tip') }}</p>
      <!-- 下一步 -->
      <BmButton class="w-100 round-8 authentication-btn" @click="jump">{{ $t('common.next') }}</BmButton>
      <!-- 其他认证方式 -->
      <p class="fs-14 green tc mt-20" @click="goback">{{ $t('me.authentication.otherMethod') }}</p>
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
      confirmPwd: '',
      pwdType: 'password',
      confirmPwdType: 'password'
    }
  },
  methods: {
    changeType(key, val) { // 修改密码输入框状态
      this[key] = val;
    },
    goback() { // 返回上一级目录
      if(window.history.length < 2){ //解决部分机型拿不到history
        this.$router.replace('/me/setting/account/verifymethod');
      }else{
        console.log('back');
        history.back();
      }
    },
    jump() { // 跳转到实用密码验证-请确认新密码页面
      this.$router.push({
        name: 'me-setting-verify-verifypwd'
      })
    }
  },
}
</script>

<style lang="less" scoped>
.authentication-btn{
  margin-top: 40px;
}
</style>
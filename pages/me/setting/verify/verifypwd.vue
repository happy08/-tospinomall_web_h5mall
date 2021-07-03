<template>
  <!-- 我的-设置-账户设置-安全设置-使用密码-验证新密码 -->
  <div class="bg-grey vh-100">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.authentication.confirmPwdTitle')"></BmHeaderNav>

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
          <van-icon v-if="pwdType === 'text'" name="eye-o" size="24" color="#666" @click="pwdType = 'password'" />
          <!-- 闭眼 -->
          <van-icon v-else name="closed-eye" size="24" color="#666" @click="pwdType = 'text'" />
        </template>
      </van-field>
    </div>

    <!-- 提交确认密码 -->
    <div class="plr-20 w-100 mt-14">
      <p class="fs-14 mt-28">{{ $t('me.authentication.tip') }}</p>
      <BmButton class="w-100 round-8 confirm-btn" @click="confirm">{{ $t('common.next') }}</BmButton>
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
      pwdType: 'password'
    }
  },
  methods: {
    confirm() {
      this.$router.push({
        name: 'me-setting-verify-result'
      })
    }
  },
}
</script>

<style lang="less" scoped>
.mt-28{
  margin-top: 28px;
}
.confirm-btn{
  margin-top: 40px;
}
</style>
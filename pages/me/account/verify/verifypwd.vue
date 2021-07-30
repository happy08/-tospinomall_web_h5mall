<template>
  <!-- 我的-设置-安全认证-使用密码-验证新密码 -->
  <div class="bg-grey vh-100">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.authentication.confirmPwdTitle')" />

    <div class="plr-20 bg-white">
      <!-- 新密码 -->
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
          <van-icon v-if="pwdType === 'text'" :name="require('@/assets/images/icon/eye-o.png')" size="24" color="#666" @click="pwdType = 'password'" />
          <!-- 闭眼 -->
          <van-icon v-else :name="require('@/assets/images/icon/eye-close.png')" size="24" color="#666" @click="pwdType = 'text'" />
        </template>
      </van-field>
    </div>

    <!-- 提交确认密码 -->
    <div class="plr-20 w-100 mt-14">
      <p class="fs-14 mt-28">{{ $t('me.authentication.tip') }}</p>
      <BmButton class="w-100 round-8 confirm-btn" :disabled="pwd.length < 6 || pwd.length > 20" @click="confirm">{{ $t('common.next') }}</BmButton>
    </div>
  </div>
</template>

<script>
import { Field } from 'vant';
import { updatePassword } from '@/api/user';
import { forgetPwd } from '@/api/login';

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
    confirm() { // 确认修改密码
      if (this.$route.query.code) { // 使用验证码修改密码
        forgetPwd({ code: this.$route.query.code, password: this.pwd, repeatPassword: this.pwd }).then(res => {
          if (res.code != 0) return false;

          // 密码修改成功之后需要重新登录
          this.$store.commit('user/SET_TOKEN', null);
          this.pwd = '';
          this.$router.push({
            name: 'me-account-verify-result'
          })
        })
        return false;
      }

      // 使用当前账户密码修改密码
      if (this.$route.query.newPassword !== this.pwd) {
        this.$toast('两次输入新密码不一致');
        return false;
      }
      updatePassword({ newPassword: this.pwd, oldPassword: this.$route.query.oldPassword }).then(res => {
        if (res.code != 0) return false;
        // 密码修改成功之后需要重新登录
        this.$store.commit('user/SET_TOKEN', null);
        this.pwd = '';
        this.$router.push({
          name: 'me-account-verify-result'
        })
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
<template>
  <!-- 我的-设置-安全认证-使用密码-验证新密码 -->
  <div class="bg-grey vh-100">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('authentication')" />

    <div class="plr-20 bg-white">
      <!-- 新密码 -->
      <van-field
        v-model="pwd"
        center
        clearable
        :placeholder="$t('enter_the_login_password')"
        :type="pwdType"
        class="field-container"
        maxlength="20"
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
      <p class="fs-14 mt-28">{{ $t('verify_password_tip') }}</p>
      <BmButton class="w-100 round-8 confirm-btn" :disabled="pwd.length < 6 || pwd.length > 20" @click="confirm">{{ $t('confirm') }}</BmButton>
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
  beforeRouteEnter(to, from, next) { // 从认证页面进入重置值为空
    next(vm => {
      if (from.name === 'me-account-verify') {
        vm.pwd = '';
      }
    });
  },
  methods: {
    confirm() { // 确认修改密码
      const reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![-=+_.,]+$)[\da-zA-Z-=+_.,]{6,18}$/;
      if (!reg.test(this.pwd)) {
        this.$toast(this.$t('t_format_error'));
        return false;
      }
      if (this.$route.query.code) { // 使用验证码修改密码
        forgetPwd({ code: this.$route.query.code, password: this.pwd, repeatPassword: this.pwd }).then(res => {
          if (res.code != 0) return false;

          // 密码修改成功之后需要重新登录
          this.$store.commit('user/SET_TOKEN', null);
          this.$router.push({
            name: 'me-account-verify-result',
            query: {
              pwd: this.pwd
            }
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
        // this.$store.commit('user/SET_TOKEN', null);
        
        this.$router.push({
          name: 'me-account-verify-result',
          query: {
            pwd: this.pwd
          }
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
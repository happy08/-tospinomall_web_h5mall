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
        v-model="newPwd"
        center
        clearable
        :placeholder="$t('me.authentication.pwdPlaceholder')"
        :type="newPwdType"
        class="field-container"
      >
        <template #button>
          <!-- 睁眼 -->
          <van-icon v-if="newPwdType === 'text'" :name="require('@/assets/images/icon/eye-o.png')" size="24" color="#666" @click="changeType('newPwdType', 'password')" />
          <!-- 闭眼 -->
          <van-icon v-else :name="require('@/assets/images/icon/eye-close.png')" size="24" color="#666" @click="changeType('newPwdType', 'text')" />
        </template>
      </van-field>
    </div>
    
    <div class="plr-20 w-100 mt-14">
      <p class="fs-14">{{ $t('me.authentication.tip') }}</p>
      <!-- 下一步 -->
      <BmButton class="w-100 round-8 authentication-btn" @click="jump" :disabled="pwd.length < 6 || pwd.length > 20 || newPwd.length < 6 || newPwd.length > 20">{{ $t('common.next') }}</BmButton>
      <!-- 其他认证方式 -->
      <p class="fs-14 green tc mt-20" @click="goback">{{ $t('me.authentication.otherMethod') }}</p>
    </div>
  </div>
</template>

<script>
import { Field } from 'vant';
import { checkPassword } from '@/api/user';

export default {
  middleware: 'authenticated',
  components: {
    vanField: Field
  },
  data() {
    return {
      pwd: '',
      newPwd: '',
      pwdType: 'password',
      newPwdType: 'password'
    }
  },
  beforeRouteEnter(to, from, next) { // 从认证页面进入重置值为空
    next(vm => {
      if (from.name === 'me-account-verifymethod') {
        vm.pwd = '';
        vm.newPwd = '';
      }
    });
  },
  methods: {
    changeType(key, val) { // 修改密码输入框状态
      this[key] = val;
    },
    goback() { // 返回上一级目录
      if(window.history.length < 2){ //解决部分机型拿不到history
        this.$router.replace('/me/account/verifymethod');
      }else{
        console.log('back');
        history.back();
      }
    },
    jump() { // 校验登录密码，成功之后跳转到确认新密码页面
      checkPassword(this.pwd).then(res => {
        if (res.code != 0) return false;

        if (!res.data) {
          this.$toast.fail('当前密码错误');
          return false;
        }

        this.newPwd = '';
        this.pwd = '';
        this.$router.push({
          name: 'me-account-verify-verifypwd',
          query: {
            newPassword: this.newPwd,
            oldPassword: this.pwd
          }
        })
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
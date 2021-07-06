<template>
  <!-- 我的-设置-安全认证-修改密码-短信/邮箱验证 -->
  <div class="bg-grey vh-100">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.authentication.smsTitle')" />

    <div class="bg-white pt-20 plr-20">
      <p class="fs-16 black">{{ $t('me.authentication.completeVerify') }}</p>
      <p class="fs-14 lh-12 mt-12 sms-tip">{{ $t('me.authentication.smsReceivedTip') }} {{ account }}</p>
      <van-field
        v-model="code"
        center
        clearable
        :placeholder="$t('login.enterCode')"
        class="field-container"
      >
        <template #button>
          <van-button class="fs-14 green lh-20 verification-btn" v-show="countdown === 0" @click="sendCode" :disabled="account.length === 0">Get It</van-button>
          <button class="fs-14 lh-20 round-8 verification-countdown-btn" v-show="countdown > 0">{{ countdown }}S</button>
        </template>
      </van-field>
    </div>

    <div class="plr-20 w-100">
      <!-- 下一步 -->
      <BmButton class="w-100 round-8 sms-btn" @click="jump">{{ $t('common.next') }}</BmButton>
      <!-- 其他认证方式 -->
      <p class="fs-14 green tc mt-24" @click="goback">{{ $t('me.authentication.otherMethod') }}</p>
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
      account: '139****6474',
      code: '',
      countdown: 0
    }
  },
  created() {
    this.account = this.$route.query.changeWay === 'email' ? this.$store.state.user.userInfo.email : this.$store.state.user.userInfo.phone;
  },
  methods: {
    sendCode() { // 发送验证码
      // this.$route.query.changeWay === 'email' // 邮箱
    },
    goback() { // 返回上一级目录
      if(window.history.length < 2){ //解决部分机型拿不到history
        this.$router.replace('/me/setting/account/verifymethod');
      }else{
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
.sms-tip{
  color: #666;
}
.sms-btn{
  margin-top: 27px;
}
.verification-btn{
  padding: 5px 11px 6px 12px;
  border-radius: 7.5px;
  background-color: rgba(61, 235, 220, .1);
  border: 1px solid #46B0B0;
  .van-button__content, &.van-button{
    height: auto!important;
  }
}
.verification-countdown-btn{
  padding: 5px 16px 6px 12px;
  height: 31px;
  color: #BFBFBF;
  background-color: #eee;
  border: none;
}
</style>
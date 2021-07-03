<template>
  <!-- 修改绑定手机/邮箱-短信认证-提交已绑定手机/邮箱的验证码 -->
  <div class="bg-grey vh-100">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.authentication.smsTitle')"></BmHeaderNav>

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

      <!-- 温馨提示 -->
      <div class="fs-14 light-grey tip-container">
        <p>{{ $t('common.tips') }}:</p>
        <ul>
          <li v-for="(tipItem, tipIndex) in $t('me.authentication.phoneVerifyTips')" :key="tipIndex" v-html="tipItem"></li>
        </ul>
      </div>
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
  mounted() {
    this.account = this.$route.query.changeWay === 'email' ? this.$store.state.user.userInfo.email : this.$store.state.user.userInfo.phone;
  },
  methods: {
    sendCode() { // 发送验证码
      // this.$route.query.changeWay === 'email' // 邮箱
    },
    goback() { // 返回上一级目录
      if(window.history.length < 2){ //解决部分机型拿不到history
        this.$router.replace('/me/setting/bind');
      }else{
        history.back();
      }
    },
    jump() { // 跳转到重新绑定电话/邮箱页面
      this.$router.push({
        name: 'me-setting-bind-rebind',
        query: {
          changeWay: this.$route.query.changeWay
        }
      })
    }
  },
}
</script>

<style lang="less" scoped>
.sms-tip{
  color: #666;
}
.mt-24{
  margin-top: 24px;
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
.tip-container{
  margin-top: 70px;
  ul>li{
    list-style: auto;
    list-style-position: inside;
    line-height: 17px;
  }
}
</style>
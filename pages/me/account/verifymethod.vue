<template>
  <!-- 我的-设置-账户安全-修改密码-认证方式 -->
  <div>
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.accountSetting.verifyMethod')" />

    <!-- 登录密码验证 -->
    <van-cell class="ptb-20 plr-20" :title="$t('me.accountSetting.loginPwdVerify')" is-link title-class="black" :to="{ name: $route.query.type == 'pay' ? 'me-pay-payPwd' : 'me-account-verify' }" v-if="$route.query.type != 'payForget'" />
    <!-- 短信验证 -->
    <van-cell v-if="$store.state.user.userInfo.phone" class="ptb-20 plr-20" :title="$t('me.accountSetting.smsVerify')" is-link title-class="black" :to="{ name: $route.query.type == 'pay' || $route.query.type == 'payForget' ? 'me-pay-code' : 'me-account-verify-code' }" />
    <!-- 电子邮件验证 -->
    <van-cell v-if="$store.state.user.userInfo.email" class="ptb-20 plr-20" :title="$t('me.accountSetting.emailVerify')" is-link title-class="black" :to="{ name: $route.query.type == 'pay' || $route.query.type == 'payForget' ? 'me-pay-code' : 'me-account-verify-code', query: { changeWay: 'email' } }" />
  </div>
</template>

<script>
import { Cell, CellGroup } from 'vant';

export default {
  middleware: 'authenticated',
  components: {
    vanCell: Cell,
    vanCellGroup: CellGroup,
  },
}
</script>
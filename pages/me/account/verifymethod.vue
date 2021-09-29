<template>
  <!-- 我的-设置-账户安全-修改密码-认证方式 -->
  <div>
    <BmHeaderNav :left="{ isShow: true }" :title="$t('verification_method')" />

    <!-- 登录密码验证 -->
    <van-cell class="ptb-20 plr-20" :title="$route.query.type == 'pay' ? $t('verify_pay_by_password') : $t('verify_by_password')" is-link title-class="black" :to="{ name: $route.query.type == 'pay' ? 'me-pay-payPwd' : 'me-account-verify' }" v-if="$route.query.type != 'payForget'" />
    <!-- 短信验证 -->
    <van-cell v-if="$store.state.user.userInfo && $store.state.user.userInfo.phone" class="ptb-20 plr-20" :title="$t('verify_by_sms')" is-link title-class="black" :to="{ name: $route.query.type == 'pay' || $route.query.type == 'payForget' ? 'me-pay-code' : 'me-account-verify-code', query: { from: $route.query.from } }" />
    <!-- 电子邮件验证 -->
    <van-cell v-if="$store.state.user.userInfo && $store.state.user.userInfo.email" class="ptb-20 plr-20" :title="$t('verify_by_email')" is-link title-class="black" :to="{ name: $route.query.type == 'pay' || $route.query.type == 'payForget' ? 'me-pay-code' : 'me-account-verify-code', query: { changeWay: 'email', from: $route.query.from } }" />
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
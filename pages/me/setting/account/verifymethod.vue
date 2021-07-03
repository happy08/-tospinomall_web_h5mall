<template>
  <!-- 我的-设置-账户安全-修改密码-认证方式 -->
  <div>
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.accountSetting.verifyMethod')"></BmHeaderNav>

    <!-- 登录密码验证 -->
    <van-cell class="ptb-20 plr-20" :title="$t('me.accountSetting.loginPwdVerify')" is-link title-class="black" :to="{ name: 'me-setting-verify' }" />
    <!-- 短信验证 -->
    <van-cell class="ptb-20 plr-20" :title="$t('me.accountSetting.smsVerify')" is-link title-class="black" :to="{ name: 'me-setting-verify-code' }" />
    <!-- 电子邮件验证 -->
    <van-cell class="ptb-20 plr-20" :title="$t('me.accountSetting.emailVerify')" is-link title-class="black" :to="{ name: 'me-setting-verify-code', query: { changeWay: 'email' } }" />
  </div>
</template>

<script>
import { Cell, CellGroup } from 'vant';

export default {
  components: {
    vanCell: Cell,
    vanCellGroup: CellGroup,
  },
}
</script>
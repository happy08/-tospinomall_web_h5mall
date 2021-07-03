<template>
  <!-- 我的-设置-安全认证-修改绑定手机-认证方式 -->
  <div class="bg-grey vh-100">
    <BmHeaderNav :left="{ isShow: true, url: '/me/setting/account/security', isRep: true }" :title="$t('me.accountSetting.verifyMethod')"></BmHeaderNav>

    <!-- 短信验证 -->
    <van-cell class="ptb-20 plr-20" :title="$t('me.accountSetting.smsVerify')" is-link title-class="black" :to="{ name: 'me-setting-bind-code' }" />
    <!-- 电子邮件验证 -->
    <van-cell class="ptb-20 plr-20" :title="$t('me.accountSetting.emailVerify')" is-link title-class="black" :to="{ name: 'me-setting-bind-code', query: { changeWay: 'email' } }" />
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
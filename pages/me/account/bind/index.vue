<template>
  <!-- 我的-设置-安全认证-修改绑定手机-认证方式 -->
  <div class="bg-grey vh-100">
    <BmHeaderNav :left="{ isShow: true, url: '/me/account/security', isRep: true }" :title="$t('me.accountSetting.verifyMethod')" />

    <!-- 短信验证 -->
    <van-cell v-if="$store.state.user.userInfo.phone" class="ptb-20 plr-20" :title="$t('me.accountSetting.smsVerify')" is-link title-class="black" :to="{ name: 'me-account-verify-code', query: { type: 'bind', changeType: this.$route.query.changeType } }" />
    <!-- 电子邮件验证 -->
    <van-cell v-if="$store.state.user.userInfo.email" class="ptb-20 plr-20" :title="$t('me.accountSetting.emailVerify')" is-link title-class="black" :to="{ name: 'me-account-verify-code', query: { changeWay: 'email', type: 'bind', changeType: this.$route.query.changeType } }" />
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
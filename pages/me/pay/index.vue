<template>
  <!-- 我的-设置-支付设置页面 -->
  <div class="bg-grey vh-100">
    <BmHeaderNav :left="{ isShow: true, url: '/me/account' }" :title="$t('payment_settings')" />

    <div class="plr-20 bg-white">
      <!-- 支付密码方式 -->
      <van-cell class="plr-0 ptb-20" :title="$t('payment_password')" :label="$t('used_for_payment_verification')" center is-link :to="{ name: 'me-pay-password' }" />
      <!-- 管理银行卡 -->
      <!-- <van-cell class="plr-0 ptb-20" :title="$t('me.pay.myBackCard')" :label="$t('me.pay.myBackManage')" center is-link :to="{ name: 'me-pay-bank' }" /> -->
    </div>
  </div>
</template>

<script>
import { Cell, CellGroup } from 'vant';

export default {
  middleware: 'authenticated',
  components: {
    vanCell: Cell,
    vanCellGroup: CellGroup
  },
}
</script>
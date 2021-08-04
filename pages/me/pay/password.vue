<template>
  <!-- 我的-设置-支付设置-支付密码 -->
  <div>
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.pay.paymentPwd')" />
    
    <div class="mlr-20">
      <van-cell-group>
        <!-- 修改支付密码,注意要判断是不是首次修改支付密码 -->
        <van-cell class="plr-0 ptb-20" :title="$t('me.pay.modifyPwd')" center is-link :to="{ name: $store.state.user.userInfo.payPassword == '' ? 'me-pay-changePwd' : 'me-account-verifymethod', query: { type: 'pay' } }" />
        <!-- 忘记支付密码 -->
        <van-cell class="plr-0 ptb-20" :title="$t('me.pay.forgotPwd')" center is-link :to="{ name: 'me-account-verifymethod', query: { type: 'payForget' } }" />
      </van-cell-group>
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
  }
}
</script>

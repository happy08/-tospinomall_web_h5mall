<template>
  <!-- 我的-设置-支付设置-支付密码 -->
  <div>
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.pay.paymentPwd')"></BmHeaderNav>
    
    <div class="mlr-20">
      <van-cell-group>
        <!-- 修改支付密码,注意要判断是不是首次修改支付密码 -->
        <van-cell class="plr-0 ptb-20" :title="$t('me.pay.modifyPwd')" center is-link :to="{ name: 'me-setting-pay-changePwd' }" />
        <!-- 忘记支付密码 -->
        <van-cell class="plr-0 ptb-20" :title="$t('me.pay.forgotPwd')" center is-link :to="{ name: 'me-setting-pay-changePwd' }" />
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import { Cell, CellGroup } from 'vant';

export default {
  components: {
    vanCell: Cell,
    vanCellGroup: CellGroup
  }
}
</script>

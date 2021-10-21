<template>
  <!-- 账单详情 -->
  <div>
    <BmHeaderNav :left="{ isShow: true }" :title="$t('bill_detail')" />

    <!-- 金额 -->
    <div class="ptb-24 tc">
      <p class="fs-24 black fw">{{ detail.collectPaymentType == 1 ? '+' : '-' }}{{ $store.state.rate.currency }}{{ detail.realAmount }}</p>
      <!-- 状态status:（0失败 1成功 2待支付 3已取消） -->
      <p class="fs-14 black mt-12" v-if="detail.status == 0">{{ $t('transaction_failed') }}</p>
      <p class="fs-14 black mt-12" v-if="detail.status == 1">{{ $t('successful_transaction') }}</p>
      <p class="fs-14 black mt-12" v-if="detail.status == 2">{{ $t('bill_to_pay') }}</p>
      <p class="fs-14 black mt-12" v-if="detail.status == 3">{{ $t('cancelled') }}</p>
    </div>

    <!-- 分界线 -->
    <div class="bg-grey pt-12"></div>

    <!-- 详情 -->
    <van-cell-group>
      <!-- 退款原因(退款账单才显示)  -->
      <van-cell center v-if="detail.type == 3" class="ptb-20 plr-20" :title="$t('refund_reason')" label="Wrong color.wrong size. Wrong color,wrong size and lesson" />
      <!-- 订单账单 -->
      <!-- <van-cell v-if="detail.type == 2" class="ptb-20 plr-20" :title="$t('commodity')" is-link>
        <template #label>
          <div class="flex between">
            <BmImage 
              :url="require('@/assets/images/product-bgd-90.png')"
              :width="'1.5rem'" 
              :height="'1.5rem'"
              :isLazy="false"
              :isShow="false"
              v-for="item in 4"
              :key="item"
            />
          </div>
        </template>
      </van-cell> -->

      <!-- 支付方式 -->
      <van-cell center class="ptb-20 plr-20 between" value-class="f-auto" title-class="f-auto" :title="$t('method_of_payment')" :value="detail.payTypeLabel" />
      <!-- 交易时间 -->
      <van-cell center class="ptb-20 plr-20 between" value-class="f-auto" title-class="f-auto" :title="$t('transaction_hour')" :value="detail.createTime" />
      <!-- 订单号 -->
      <van-cell center class="ptb-20 plr-20 between" value-class="f-auto" title-class="f-auto" :title="$t('order_number')" :value="detail.tradeNo" />
      <!-- 商户订单号 -->
      <van-cell center class="ptb-20 plr-20 between" value-class="f-auto" title-class="f-auto" :title="$t('merchant_order_number')" :value="detail.merchantNumber" />
    </van-cell-group>
  </div>
</template>

<script>
import { Cell, CellGroup } from 'vant';
import { getBillDetail } from '@/api/pay';

export default {
  middleware: 'authenticated',
  components: {
    vanCell: Cell,
    vanCellGroup: CellGroup
  },
  data() {
    return {
      detail: {
        collectPaymentType: 0,
        title: ''
      }
    }
  },
  activated() {
    getBillDetail(this.$route.params.id).then(res => {
      if (res.code != 0) return false;
      
      this.detail = {
        ...res.data,
        payTypeLabel: res.data.payType == 0 ? this.$t('system_payment') : res.data.payType == 1 ? this.$t('balance_payment') : res.data.payType == 2 ? 'MTN' : res.data.payType == 3 ? 'VODAFONE' : res.data.payType == 4 ? 'ARTLTIGO' : '',
      }
    }).catch(error => {
      console.log(error);
    })
  }
}
</script>

<style lang="less" scoped>
.f-auto{
  flex: auto!important;
}
</style>
<template>
  <!-- 账单详情 -->
  <div>
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.wallet.bill')" />

    <!-- 金额 -->
    <div class="ptb-24 tc">
      <p class="fs-24 black fw">{{ detail.collectPaymentType == 1 ? '+' : '-' }}{{ detail.realAmount }}</p>
      <p class="fs-14 black mt-12">{{ detail.title }}</p>
    </div>

    <!-- 分界线 -->
    <div class="bg-grey pt-12"></div>

    <!-- 详情 -->
    <van-cell-group>
      <!-- 退款原因(退款账单才显示)  -->
      <van-cell center v-if="detail.type === 3" class="ptb-20 plr-20" title="Refund reason" label="Wrong color.wrong size. Wrong color,wrong size and lesson" />
      <!-- 订单账单 -->
      <van-cell v-if="detail.type === 2" class="ptb-20 plr-20" title="Commodity" is-link>
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
      </van-cell>

      <!-- 支付方式 -->
      <van-cell center class="ptb-20 plr-20" title="Method of payment" :value="detail.payTypeLabel" />
      <!-- 交易时间 -->
      <van-cell center class="ptb-20 plr-20" title="Transaction hour" :value="detail.createTime" />
      <!-- 订单号 -->
      <van-cell center class="ptb-20 plr-20" title="Order number" :value="detail.tradeNo" />
      <!-- 商户订单号 -->
      <van-cell center class="ptb-20 plr-20" title="Merchant order number" :value="detail.merchantNumber" />
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
        payTypeLabel: res.data.payType == 2 ? 'MTN' : res.data.payType == 3 ? 'VODAFONE' : res.data.payType == 4 ? 'ARTLTIGO' : '',
      }
    })
  }
}
</script>

<style lang="less" scoped>

</style>
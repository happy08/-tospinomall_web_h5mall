<template>
  <!-- 账单详情 -->
  <div>
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.wallet.bill')" />

    <!-- 金额 -->
    <div class="ptb-24 tc">
      <p class="fs-24 black fw">+49.90</p>
      <p class="fs-14 black mt-12">Refund successfully</p>
    </div>

    <!-- 分界线 -->
    <div class="bg-grey pt-12"></div>

    <!-- 详情 -->
    <van-cell-group>
      <!-- 退款原因(退款账单才显示)  -->
      <van-cell center class="ptb-20 plr-20" title="Refund reason" label="Wrong color.wrong size. Wrong color,wrong size and lesson" />
      <!-- 订单账单 -->
      <van-cell class="ptb-20 plr-20" title="Commodity" is-link>
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
            ></BmImage>
          </div>
        </template>
      </van-cell>

      <!-- 支付方式 -->
      <van-cell center class="ptb-20 plr-20" title="Method of payment" value="MTN" />
      <!-- 交易时间 -->
      <van-cell center class="ptb-20 plr-20" title="Transaction hour" :value="date | format" />
      <!-- 订单号 -->
      <van-cell center class="ptb-20 plr-20" title="Order number" value="2987384059872746" />
      <!-- 商户订单号 -->
      <van-cell center class="ptb-20 plr-20" title="Merchant order number" value="2987384059872746" />
    </van-cell-group>
  </div>
</template>

<script>
import { Cell, CellGroup } from 'vant';
import Moment from 'moment';

export default {
  middleware: 'authenticated',
  components: {
    vanCell: Cell,
    vanCellGroup: CellGroup
  },
  data() {
    return {
      date: new Date()
    }
  },
  filters: {
    format(val) {
      return Moment(val).format('MMMM DD YYYY hh:mm:ss');
    }
  }
}
</script>

<style lang="less" scoped>

</style>
<template>
  <!-- 我的-售后-售后申请 -->
  <div class="bg-grey vh-100">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.afterSale.afterSaleService')" />

    <!-- 订单详情 -->
    <OrderSingle class="bg-white p-20" :product_num="1" :product_desc="'Hassen’s new fall 2019 suede pointe…'" :product_size="'Black / L'" :price="256.23" />

    <van-cell-group class="mt-20">
      <!-- 选择售后类型 type: 1仅退款 2退货退款 3换货 -->
      <van-cell class="ptb-20 plr-20" :title="$t('me.afterSale.selectAfterSalesType')" title-class="fs-14 black"/>
      <!-- 退货退款 -->
      <van-cell class="ptb-20 plr-20" :title="$t('me.afterSale.returnRefund')" title-class="fs-14 black" is-link :to="{ name: 'me-aftersale-apply-type', params: { type: 2 } }" />
      <!-- 换货 -->
      <van-cell class="ptb-20 plr-20" :title="$t('me.afterSale.exchange')" title-class="fs-14 black"  is-link :to="{ name: 'me-aftersale-apply-type', params: { type: 3 } }" />
      <!-- 仅退款 -->
      <van-cell class="ptb-20 plr-20" :title="$t('me.afterSale.refundNoReturn')" title-class="fs-14 black"  is-link :to="{ name: 'me-aftersale-apply-type', params: { type: 1 } }"  />
    </van-cell-group>

    <!-- 返回和交换指令? -->
    <div class="mt-60 tc">
      <nuxt-link :to="{}" class="green">{{ $t('me.afterSale.returnAndChange') }}</nuxt-link>
    </div>
  </div>
</template>

<script>
import OrderSingle from '@/components/OrderSingle';
import { Cell, CellGroup } from 'vant';

export default {
  middleware: 'authenticated',
  components: {
    vanCell: Cell,
    vanCellGroup: CellGroup,
    OrderSingle
  }
}
</script>
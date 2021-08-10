<template>
  <!-- 我的-售后-售后申请 -->
  <div class="bg-grey vh-100">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.afterSale.afterSaleService')" />

    <!-- 订单详情 -->
    <OrderSingle class="bg-white p-20" :image="detail.goodImg" :product_num="detail.goodQuantity" :product_desc="detail.goodName" :product_size="detail.goodAttr" :price="detail.goodPrice" />

    <van-cell-group class="mt-12">
      <!-- 选择售后类型 type: 1仅退款 2退货退款 3换货 -->
      <van-cell class="ptb-20 plr-20" :title="$t('me.afterSale.selectAfterSalesType')" title-class="fs-14 black fw"/>
      <!-- 退货退款 -->
      <van-cell class="ptb-20 plr-20" :title="$t('me.afterSale.returnRefund')" :title-class="{'fs-14': true, 'black': detail.status != 1, 'grey': detail.status == 1 }" is-link @click="onApply(2)" />
      <!-- 换货,暂时不做 -->
      <!-- <van-cell class="ptb-20 plr-20" :title="$t('me.afterSale.exchange')" title-class="fs-14 black"  is-link @click="onApply(3)" /> -->
      <!-- 仅退款 -->
      <van-cell class="ptb-20 plr-20" :title="$t('me.afterSale.refundNoReturn')" title-class="fs-14 black"  is-link @click="onApply(1)"  />
    </van-cell-group>

    <!-- 退货退款说明 -->
    <div class="mt-60 tc">
      <nuxt-link :to="{ name: 'service-type', params: { type: 'aftersale' } }" class="green">{{ $t('me.afterSale.returnAndChange') }}</nuxt-link>
    </div>
  </div>
</template>

<script>
import OrderSingle from '@/components/OrderSingle';
import { Cell, CellGroup } from 'vant';
import { getOrderItem } from '@/api/order';

export default {
  middleware: 'authenticated',
  data() {
    return {
      detail: {}
    }
  },
  fetch() {
    getOrderItem(this.$route.query.itemId).then(res => {
      if (res.code != 0) return false;

      this.detail = res.data
    })
  },
  activated() {
    this.$fetch();
  },
  components: {
    vanCell: Cell,
    vanCellGroup: CellGroup,
    OrderSingle
  },
  methods: {
    onApply(type) {
      if (type == 2 && this.detail.status == 1) return false; // 待发货时不可选择退货退款

      this.$router.push({ 
        name: 'me-aftersale-apply-type', 
        params: { type: type }, 
        query: { itemId: this.$route.query.itemId } 
      })
    }
  },
}
</script>
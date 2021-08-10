<template>
  <!-- 我的-售后-协商历史 type: 1仅退款 2退货退款 3换货 4审核不通过 -->
  <div class="vh-100 bg-grey">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.afterSale.negotiationHistory')" />

    <!-- 历史记录 -->
    <div class="plr-20 pb-30 pt-20 bg-white mb-12" v-for="(item, index) in lists" :key="index">
      <OrderStoreSingle :name="item.name" :logo="item.headPortrait" />
      <p class="mt-12 fs-14 grey flex between fs-14">
        <span>{{ item.createTime }}</span>
        <!-- 物流信息 -->
        <nuxt-link v-if="item.orderReturn.deliveryType == 2 && item.status == 4" :to="{ name: '' }" class="green">Logistics information</nuxt-link>
      </p>
      <!-- 状态显示 -->
      <p class="mt-12 fs-14 grey" v-if="item.status == 1">买家发起{{ item.orderReturn.returnType | returnTypeFormat }},原因: {{ item.orderReturn.applyReason }}</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 2 && item.userType == 2">商家同意了本次售后服务申请</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 2 && item.userType == 3">平台同意了本次售后服务申请</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 3">商家驳回了本次售后服务申请, 驳回原因: {{ item.reason }}</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 4">已填写退货快递单号: {{ item.orderReturn.deliverySn }}</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 5">上门取件-快递员取件成功</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 6 && item.userType == 2">商家已收到货品, 同意退款</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 6 && item.userType == 3">平台已收到货品, 同意退款</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 7">商家已拒收您的货物</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 8">退款成功</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 9">平台驳回了本次售后服务申请, 驳回原因:{{ item.reason }}，售后单关闭订单</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 10">因买家超时未寄出货物，售后单关闭</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 11">因商家驳回后，买家超时未客服介入，售后单关闭</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 12">因商家拒收后，买家超时未客服介入，售后单关闭</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 13">平台拒收了您的货物,拒收原因:{{ item.reason }}，售后单关闭订单</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 14">您已撤销申请，售后单关闭</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 15">平台关闭了您的订单</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 16">买家修改售后单</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 17">您修改了运单号: {{ item.orderReturn.deliverySn }}</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 18">因商家超时未处理, 系统自动审核通过</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 19">因商家超时未确认收货，系统自动收货</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 20">买家取消上门取件</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 21">您撤销了工单，售后单关闭</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 22">工单完结，售后单关闭</p>
    </div>
  </div>
</template>

<script>
import OrderStoreSingle from '@/components/OrderStoreSingle';
import { getNegotiationHistory } from '@/api/order';

export default {
  middleware: 'authenticated',
  components: {
    OrderStoreSingle
  },
  data() {
    return {
      lists: []
    }
  },
  filters: {
    returnTypeFormat(val) {
      return val == 0 ? '仅退款' : val == 1 ? '退货退款' : '';
    }
  },
  activated() {
    getNegotiationHistory(this.$route.params.id).then(res => {
      if (res.code != 0) return false;

      this.lists = res.data;
    })
  }
}
</script>
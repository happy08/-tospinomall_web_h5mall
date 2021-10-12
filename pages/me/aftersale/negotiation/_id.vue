<template>
  <!-- 我的-售后-协商历史 type: 1仅退款 2退货退款 3换货 4审核不通过 -->
  <div class="v-percent-100 bg-grey pt-46">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('negotiation_history')" :fixed="true" />

    <!-- 历史记录 -->
    <div class="plr-20 pb-30 pt-20 bg-white mb-12" v-for="(item, index) in lists" :key="index">
      <OrderStoreSingle :name="item.name" :logo="item.headPortrait" />
      <p class="mt-12 fs-14 grey flex between fs-14">
        <span>{{ item.createTime }}</span>
        <!-- 物流信息 -->
        <nuxt-link v-if="item.orderReturn.deliveryType == 2 && item.status == 4" :to="{ name: '' }" class="green">{{ $t('logistics_information') }}</nuxt-link>
      </p>
      <!-- 状态显示 -->
      <p class="mt-12 fs-14 grey" v-if="item.status == 1">{{ $t('negotiation_status_1', { replace_tip: item.orderReturn.returnType == 0 ? $t('refund_no_return') : $t('return_refund'), replace_tip2: item.orderReturn.applyReason }) }}</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 2 && item.userType == 2">{{ $t('negotiation_status_2_user_type_2') }}</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 2 && item.userType == 3">{{ $t('negotiation_status_2_user_type_3') }}</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 3">{{ $t('negotiation_status_3', { replace_tip: item.reason }) }}</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 4">{{ $t('negotiation_status_4', { replace_tip: item.orderReturn.deliverySn }) }}</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 5">{{ $t('negotiation_status_5') }}</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 6 && item.userType == 2">{{ $t('negotiation_status_6_user_type_2') }}</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 6 && item.userType == 3">{{ $t('negotiation_status_6_user_type_3') }}</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 7">{{ $t('negotiation_status_7') }}</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 8">{{ $t('negotiation_status_8') }}</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 9">{{ $t('negotiation_status_9', { replace_tip: item.reason }) }}</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 10">{{ $t('negotiation_status_10') }}</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 11">{{ $t('negotiation_status_11') }}</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 12">{{ $t('negotiation_status_12') }}</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 13">{{ $t('negotiation_status_13', { replace_tip: item.reason }) }}</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 14">{{ $t('negotiation_status_14') }}</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 15">{{ $t('negotiation_status_15') }}</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 16">{{ $t('negotiation_status_16') }}</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 17">{{ $t('negotiation_status_17', { replace_tip: item.orderReturn.deliverySn }) }}</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 18">{{ $t('negotiation_status_18') }}</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 19">{{ $t('negotiation_status_19') }}</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 20">{{ $t('buyer_cancels_pick_up') }}</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 21">{{ $t('you_cancel_the_work_order') }}</p>
      <p class="mt-12 fs-14 grey" v-if="item.status == 22">{{ $t('the_work_order_is_closed') }}</p>
    </div>
  </div>
</template>

<script>
import OrderStoreSingle from '@/components/OrderStoreSingle';
import { getNegotiationHistory } from '@/api/order';
import userIcon from '@/assets/images/icon/user-icon.png';

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
  activated() {
    getNegotiationHistory(this.$route.params.id).then(res => {
      if (res.code != 0) return false;

      this.lists = res.data.map(item => {
        return {
          ...item,
          headPortrait: item.headPortrait == '' ? userIcon : item.headPortrait
        }
      });
    })
  }
}
</script>
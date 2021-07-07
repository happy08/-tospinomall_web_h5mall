<template>
  <!-- 我的-售后-协商历史 type: 1仅退款 2退货退款 3换货 4审核不通过 -->
  <div class="vh-100 bg-grey">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.afterSale.negotiationHistory')" />

    <!-- 历史记录 -->
    <div class="plr-20 pb-30 pt-20 bg-white mb-12" v-for="item, index in lists" :key="index">
      <OrderStoreSingle />
      <p class="mt-12 fs-14 grey flex between fs-14">
        <span>March 6 2020 17:08:02</span>
        <!-- 物流信息 -->
        <nuxt-link :to="{ name: '' }" class="green">Logistics information</nuxt-link>
      </p>
      <p class="mt-12 fs-14 grey">The merchant rejected the application for after-sale service. The reason for rejection: the express has signed for recei</p>
    </div>
  </div>
</template>

<script>
import OrderStoreSingle from '@/components/OrderStoreSingle';

export default {
  components: {
    OrderStoreSingle
  },
  asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    return {
      lists: [
        {
          id: 1,
        },
        {
          id: 2,
        },
        {
          id: 3,
        }
      ]
    }
  },
}
</script>
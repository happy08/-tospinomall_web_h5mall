<template>
  <!-- 我的-我的优惠券 -->
  <div class="bg-grey v-percent-100">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('my_coupon')">
      <!-- 使用说明 -->
      <nuxt-link slot="header-right" class="fs-16 green" :to="{ name: 'service-type', params: { type: 'coupon' }, query: { isH5: 1 } }">{{ $t('coupon_use_instruction') }}</nuxt-link>
    </BmHeaderNav>

    <coupon-single></coupon-single>
  </div>
</template>

<script>
import CouponSingle from '@/components/CouponSingle';

export default {
  components: {
    CouponSingle
  }
}
</script>

<style lang="less" scoped>

</style>
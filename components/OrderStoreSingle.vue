<template>
  <!-- 订单店铺入口展示 -->
  <div class="flex between vcenter w-100">
    <div class="flex vcenter w-100 between" @click="goStoreDetail">
      <div class="flex vcenter m-68">
        <BmImage
          :url="logo"
          :width="'0.36rem'" 
          :height="'0.36rem'"
          :isLazy="false"
          :isShow="false"
          :alt="name"
          v-if="logo"
          class="flex-shrink"
        />
        <BmIcon v-else :name="'store-icon1'" :width="'0.40rem'" :height="'0.40rem'"></BmIcon>
        <span class="ml-10 fs-14 fw black hidden-1 iblock w-100">{{ name }}</span>
        <van-icon name="arrow" size="0.2rem" v-if="showArrow" />
      </div>
      <span class="plr-8 round-10 ptb-2 bg-linear-F9083B red-e02 fs-12 flex-shrink" v-if="isCoupon">{{ $t('coupon') }}</span>
    </div>
    <div class="flex vcenter">
      <!-- 订单状态 --> 
      <span class="light-grey fs-14">{{ status }}</span>
      <!-- 其他处理操作 -->
      <slot name="other-deal"></slot>
    </div>
  </div>
</template>

<script>
import { Icon } from 'vant';

export default {
  components: {
    vanIcon: Icon
  },
  props: {
    name: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      default: ''
    },
    logo: {
      type: String,
      default: ''
    },
    showArrow: {
      type: Boolean,
      default: true
    },
    isCoupon: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    goStoreDetail() {
      this.$emit('goStoreDetail');
    }
  },
}
</script>

<style lang="less" scoped>
.line-style{
  background-color: rgba(0, 0, 0, 0.25);
  width: 1px;
  height: 10px;
  margin-left: 8px;
  margin-right: 8px;
}
.bg-linear-F9083B{
  background: linear-gradient(to right, #FB6028 0%, #F9083B 100%);
}
.red-e02{
  color: #E02020;
}
.m-68{
  max-width: 68%;
}
</style>
<template>
  <!-- 订单店铺入口展示 -->
  <div class="flex between vcenter w-100 hidden-1">
    <div class="flex vcenter hidden-1" @click="goStoreDetail">
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
      <span class="ml-10 fs-14 pr-10 fw black hidden-1 w-100 iblock">{{ name }}</span>
      <van-icon name="arrow" size="0.2rem" class="mr-10" v-if="showArrow" />
    </div>
    <div class="flex vcenter flex-shrink">
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
</style>
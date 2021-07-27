<template>
  <!-- 订单店铺入口展示 -->
  <div class="flex between vcenter w-100" @click="goStoreDetail">
    <div class="flex vcenter">
      <BmImage
        :url="logo"
        :width="'0.36rem'" 
        :height="'0.36rem'"
        :isLazy="false"
        :isShow="false"
        v-if="logo"
      />
      <BmIcon v-else :name="'store-icon1'" :width="'0.40rem'" :height="'0.40rem'"></BmIcon>
      <span class="ml-10 fs-14 fw black">{{ name }}</span>
      <van-icon name="arrow" size="0.2rem" />
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
<template>
  <!-- 订单店铺入口展示 -->
  <div class="flex between vcenter w-100">
    <div class="flex vcenter">
      <i class="iconfont icon-dianpu fs-18 black"></i>
      <span class="ml-10 fs-14 fw black">{{ 'COMELY' }}</span>
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
    }
  }
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
<template>
  <!-- 我的优惠券-组件样式 -->
  <!-- <van-collapse-item name="1" class="w-100 round-8 bg-white">
    <template #title> -->
      <div class="light-green coupon-content-title">
        <div class="flex center">
          <span>商品优惠券</span>
          <span>...</span>
        </div>
      </div>
    <!-- </template>
    <p>1.该商品券仅可使用于店铺的某某视频
    2.虚拟商品及部分商品流程不可使用，特殊流程如秒杀等不适用，请合理的使用优惠券，如发现不合规使用商家有权收回
    3.所有解释权归商家所有</p>
  </van-collapse-item> -->
</template>

<script>
import { CollapseItem } from 'vant';

export default {
  components: {
    vanCollapseItem: CollapseItem
  },
  data() {
    return {
    }
  }
}
</script>

<style lang="less" scoped>
.light-green{
  background-color: #D9F1EF;
}
.coupon-content-title{
  padding: 6px 6px 10px 20px;
}
</style>
<template>
  <!-- 优惠券购物车 -->
  <div class="round-8 bg-white">
    <div class="dark-green flex coupon-orde-single">
      <div class="round-8 coupon-orde-single__left">
        <div class="fw">
          <span class="fs-16">Rp</span>
          <span class="fs-22">40.000</span>
        </div>
        <div class="fs-10 mt-6 hidden-2">Buy Rp50,00 cap at Rp10,000 off</div>
      </div>
      <div class="round-8 coupon-orde-single__right">
        <BmIcon :name="type != 0 ? 'collapsed' : 'collapse'" :width="'0.28rem'" :height="'0.28rem'" @iconClick="isOpenCollapse = !isOpenCollapse" class="coupon-collapse"></BmIcon>
        <h2 class="fs-14">Free Shipping</h2>
        <p class="fs-12 mt-2">Tospino specific product</p>
        <div class="flex between mt-18">
          <span class="fs-10 mt-4">5-5 Nov.2021</span>
          <BmButton class="fs-12 fw white round-100 plr-12 h-24 bg-green-linear">COLLECT</BmButton>
        </div>
      </div>
    </div>
    <div class="pl-16 pr-10 bg-white pt-2" v-show="isOpenCollapse">
      <div class="fs-10 light-grey mt-8 pb-12">1.该商品券仅可使用于店铺的某某视频<br/>2.虚拟商品及部分商品流程不可使用，特殊流程如秒杀等不适用，请合理的使用优惠券，如发现不合规使用商家有权收回<br/>3.所有解释权归商家所有</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: { // 优惠券状态 0未使用 1已使用 2 已过期 3用完
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isOpenCollapse: false
    }
  }
}
</script>

<style lang="less" scoped>
.coupon-orde-single{
  background-image: url('../assets/images/coupon/coupon-green-bgd.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  position: relative;
  .coupon-orde-single__left{
    width: 111px;
    padding: 20px 6px 14px 12px;
  }
  .coupon-orde-single__right{
    width: 244px;
    padding: 14px 15px 8px 11px;
  }
}
.h-24{
  height: 24px!important;
}
.round-100{
  border-radius: 100px!important;
}
.mt-18{
  margin-top: 18px;
}
.coupon-collapse{
  position: absolute;
  right: 9px;
  top: 7px;
}
.w-230{
  width: 230px;
}
.mt-6{
  margin-top: 6px;
}
</style>
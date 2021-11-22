<template>
  <van-dialog v-model="isGiftShow" :showConfirmButton="false" class="pale-yellow top-50">
    <template #title>
      <h1 class="dark-red flex center ">
        <span class="title-line"></span>
        <span class="fs-24 mlr-6 lh-12">新人礼券</span>
        <span class="title-line"></span>
      </h1>
      <p class="dark-red fs-12 mt-2 tc">X16 张优惠券</p>
    </template>
    <template #default>
      <div class="pb-20 tc">
        <!-- 这里最多展示4张优惠券 -->
        <div class="m-auto mt-12 flex center coupon-gift-single" v-for="item in 4" :key="item">
          <div class="red-f11 flex vcenter coupon-gift-single__middle">
            <span class="pl-10 fs-12">-₵</span>
            <span class="fs-20 ml-2">11.00</span>
          </div>
          <div class="white fs-14 flex vcenter tl coupon-gift-single__top">Your order of GH ₵ 138.00 or more</div>
        </div>
        <!-- 去逛逛 -->
        <BmButton class="fs-12 mt-12 dark-red fw white h-33 round-16 bg-yellow-linear">去逛逛</BmButton>
        <p class="fs-10 black-3c mt-12">已放入我的-优惠券中</p>
        <p class="fs-10 black-3c mt-5">2021.11.1 00:00-2021.11.3 23:59 可用</p>
      </div>
    </template>
  </van-dialog>
</template>

<script>
export default {
  data() {
    return {
      isGiftShow: false
    }
  }
}
</script>

<style lang="less" scoped>
.dark-red{
  color: #C80B2F!important;
}
.red-f11{
  color: #F11A29;
}
.pale-yellow{
  background-color: #FDFFFE;
}
.title-line{
  width: 18px;
  height: 2px;
  background-color: #C80B2F;
  display: block;
  border-radius: 16px;
}
.mlr-6{
  margin-left: 6px;
  margin-right: 6px;
}
.black-3c{
  color: #3C3C3C;
}
.bg-yellow-linear{
  min-width: 120px;
  background: linear-gradient(to bottom, #FFF4D8, #FDF9E8 25%, #FECD95)!important;
}
.h-33{
  height: 33px!important;
}
.round-16{
  border-radius: 16px;
}
.coupon-gift-single{
  width: 270px;
  height: 88px;
  position: relative;
  overflow: hidden;
  background-image: url('../assets/images/coupon/gift-bgd.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center center;
  .coupon-gift-single__middle{
    width: 113px;
  }
  .coupon-gift-single__top{
    width: 211px;
  }
}
.mt-5{
  margin-top: 5px;
}
.top-50{
  top: 50%;
}
</style>
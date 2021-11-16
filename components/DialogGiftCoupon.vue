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
        <div class="m-auto mt-12 coupon-gift-single" v-for="item in 4" :key="item">
          <div class="coupon-gift-single__bottom"></div>
          <div class="red-f11 flex vcenter coupon-gift-single__middle">
            <span class="pl-10 fs-12">-₵</span>
            <span class="fs-20 ml-2">11.00</span>
          </div>
          <div class="white flex vcenter tl coupon-gift-single__top">
            <span class="fs-14 pl-36">Your order of GH ₵ 138.00 or more</span>
          </div>
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
      isGiftShow: true
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
  background: linear-gradient(to bottom, #FDF9E8, #FFF4D8, #FECD95)!important;
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
  .coupon-gift-single__bottom{
    position: absolute;
    left: 13px;
    width: 77px;
    top: 0;
    bottom: 0;
    background: linear-gradient(90deg, #DF2820 0%, #A80E16 100%);
    border-top-left-radius: 18px;
    border-bottom-left-radius: 18px;
    z-index: 1;
  }
  .coupon-gift-single__middle{
    position: absolute;
    left: 0;
    top: 10px;
    height: 72px;
    width: 113px;
    z-index: 2;
    background: linear-gradient(180deg, #FFFFFF 0%, #FCE8E7 100%);
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
  }
  .coupon-gift-single__top{
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 211px;
    z-index: 3;
    background: radial-gradient(circle 55px at -30px 50%, transparent 55px,#F8492B 0%, #F01629 100%);
    border-top-right-radius: 18px;
    border-bottom-right-radius: 18px;
  }
}
.pl-36{
  padding-left: 36px;
}
.mt-5{
  margin-top: 5px;
}
.top-50{
  top: 50%;
}
</style>
<template>
  <van-dialog v-model="isGiftShow" :showConfirmButton="false" class="top-50 w-334 bg-transparent">
    <!-- 第一版样式 -->
    <!-- <template #title>
      <h1 class="dark-red flex center ">
        <span class="title-line"></span>
        <span class="fs-24 mlr-6 lh-12">新人礼券</span>
        <span class="title-line"></span>
      </h1>
      <p class="dark-red fs-12 mt-2 tc">X16 张优惠券</p>
    </template> -->
    <template #default>
      <!-- 第一版样式 -->
      <!-- <div class="pb-20 tc">
        <div class="m-auto mt-12 flex center coupon-gift-single" v-for="item in 4" :key="item">
          <div class="red-f11 flex vcenter coupon-gift-single__middle">
            <span class="pl-10 fs-12">-₵</span>
            <span class="fs-20 ml-2">11.00</span>
          </div>
          <div class="white fs-14 flex vcenter tl coupon-gift-single__top">Your order of GH ₵ 138.00 or more</div>
        </div>
        <BmButton class="fs-12 mt-12 dark-red fw white h-33 round-16 bg-yellow-linear">去逛逛</BmButton>
        <p class="fs-10 black-3c mt-12">已放入我的-优惠券中</p>
        <p class="fs-10 black-3c mt-5">2021.11.1 00:00-2021.11.3 23:59 可用</p>
      </div> -->
      <!-- 第二版样式 -->
      <div class="gift-container">
        <div class="gift-container__top">
          <h1 class="dark-red flex center pt-14">
            <span class="title-line"></span>
            <span class="fs-24 mlr-6 lh-12">{{ $t('newcomer_gift_coupon') }}</span>
            <span class="title-line"></span>
          </h1>
          <p class="dark-red fs-12 mt-4 tc pb-4 w-230 border-b-E2D7C6 m-auto">{{ $t('added_to_my_coupon') }}</p>

          <div class="gift-container__top--single">
            <div class="m-auto mt-6 center coupon-gift-single2" v-for="item, index in lists" :key="'gift-' + index">
              <div class="tc pt-18 white">
                <span class="fs-24">{{ $store.state.rate.currency }}</span>
                <span class="fs-28">{{ item.subtractAmount }}</span>
              </div>
              <p class="fs-14 white mt-10 tc hidden-1 plr-10">Your order of GH ₵ 138.00 or more</p>
            </div>
          </div>
        </div>
        <div class="tc gift-container__bottom">
          <button class="tc dark-red fs-12 gift-container__bottom--btn" @click="$emit('goAround', [])">{{ $t('go_shopping') }}</button>
        </div>
      </div>
    </template>
  </van-dialog>
</template>

<script>
export default {
  props: {
    lists: {
      type: Array,
      default: []
    },
    isGiftShow: {
      type: Boolean,
      default: () => {
        return this.lists.length > 0 ? true : false;
      }
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
.w-230{
  width: 230px;
}
.w-334{
  width: 334px!important;
}
.gift-container{
  height: 458px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  .gift-container__top{
    width: 303px;
    height: 429px;
    background-image: url('../assets/images/coupon/coupon-gift-bgd.png');
    background-size: 100% 100%;
    background-position: center center;
    background-repeat: no-repeat;
    margin: 0 auto;
    .gift-container__top--single{
      height: 382px;
      overflow-y: auto;
      padding-bottom: 89px;
    }
  }
  .gift-container__bottom{
    position: absolute;
    bottom: -9px;
    left: 0;
    right: 0;
    height: 89px;
    background-image: url('../assets/images/coupon/gift-btn-bgd.png');
    background-size: 100% 100%;
    background-position: bottom;
    background-repeat: no-repeat;
    .gift-container__bottom--btn{
      width: 159px;
      height: 32px;
      background-image: url('../assets/images/coupon/gift-btn.png');
      background-size: 100% 100%;
      background-position: center center;
      background-repeat: no-repeat;
      outline: none;
      border: none;
      margin: 30px auto 0;
      background-color: transparent;
    }
  }
}
::v-deep .van-dialog{
  background-color: transparent!important;
}
.border-b-E2D7C6{
  border-bottom: 1px solid #E2D7C6;
}
.mt-6{
  margin-top: 6px;
}
.coupon-gift-single2{
  width: 245px;
  height: 91px;
  background-image: url('../assets/images/coupon/gift-bgd-2.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center center;
}
.fs-28{
  font-size: 28px;
}
.pt-18{
  padding-top: 18px;
}
</style>
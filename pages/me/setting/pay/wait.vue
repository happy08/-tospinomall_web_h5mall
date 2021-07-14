<template>
  <!-- 订单-支付-等待支付页面 -->
  <div class="bg-grey vh-100">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.pay.payment')" />

    <!-- 详情 -->
    <div class="mt-24 tc plr-20">
      <BmImage
        :url="require('@/assets/images/icon/choose-icon.svg')"
        :width="'0.96rem'" 
        :height="'0.96rem'"
        :isLazy="false"
        :isShow="false"
      ></BmImage>
      <h3 class="fs-16 black mt-24">Awaiting Payment</h3>
      <p class="mt-12 fs-14 black">If you have paid, click“Payment complete” to check</p>
    </div>

    <!-- 详情描述 -->
    <div class="bg-white mt-30 mlr-12 pt-14 pb-20 plr-14">
      <p class="color-666 fs-14">You will receive a prompt on your mobile number <span class="fs-18 red lh-20">233208457440</span> to enter your pay-ment request of <span class="fs-18 red lh-20">GHS 86.30 </span></p>
    </div>
  </div>
</template>

<style lang="less" scoped>
.color-666{
  color: #666;
}
</style>
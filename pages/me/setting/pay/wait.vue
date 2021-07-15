<template>
  <!-- 订单-支付-等待支付页面 -->
  <div class="bg-grey vh-100 flex column between">
    <div>
      <BmHeaderNav :left="{ isShow: true }" :title="$t('me.pay.payment')" />
      <!-- 支付详情 -->
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
        <p class="fs-14 black mt-10 lh-20">If you do not receive the prompt within 10s follow the Instructions below:
            1.Dia l*170# to see the main MTN USSD menu
            2.Choose 6) My Wallet
            3.Choose 3) My Approvals
            4.Enter your PIN to proceed
            5.Look for the transaction and follow the prompts to authorise it,make sure the amount is correct
            6.Simply dial and try again if not success, or you can change payment method
        </p>
        <!-- 支付完成 -->
        <BmButton class="fs-16 round-8 w-100 mt-24" @click="onPayCompleted">Payment completed</BmButton>
        <!-- 修改支付方式 -->
        <BmButton :type="'info'" class="fs-16 round-8 w-100 mt-10 change-btn" @click="onChangePayMethod">Payment completed</BmButton>
      </div>
    </div>
    

    <!-- 取消支付 -->
    <p class="green fs-14 lh-20 mt-8 tc pb-24" @click="onCancel">Cancel payment</p>
  </div>
</template>

<script>
export default {
  methods: {
    onPayCompleted() { // 支付完成

    },
    onChangePayMethod() { // 修改支付方式

    },
    onCancel() { // 取消支付
      this.$dialog({
        title: 'Are you sure want to leave',
        message: 'This order will automatically be can-celed if not paid within 30 mins.',
        confirmButtonText: 'Reconsider',
        confirmButtonColor: '#42B7AE',
        showCancelButton: true,
        cancelButtonText: 'Leave',
        cancelButtonColor: '#383838'
      }).then(res => { // on confirm

      }).catch(() => { // on cancel

      })
    }
  },
}
</script>

<style lang="less" scoped>
.color-666{
  color: #666;
}
.change-btn{
  border-color: #eee!important;
  background: transparent!important;
  height: 48px!important;
}
</style>
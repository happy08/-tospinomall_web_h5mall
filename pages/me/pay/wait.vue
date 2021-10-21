<template>
  <!-- 订单-支付-等待支付页面 -->
  <div class="vh-100">
    <BmHeaderNav :left="{ isShow: true, isEmit: true }" :title="$t('payment')" @leftClick="leftClick" />
    <!-- 支付详情 -->
    <div class="mt-24 tc plr-20">
      <BmImage
        :url="require('@/assets/images/icon/'+ logo +'.png')"
        :width="'0.96rem'" 
        :height="'0.96rem'"
        :isLazy="false"
        :isShow="false"
        :alt="'Tospino '+ logo +' icon'"
      />
      <h3 class="fs-16 black mt-24">{{ $t('awaiting_payment') }}</h3>
      <p class="mt-12 fs-14 black">{{ $t('if_you_have_paid') }}</p>
    </div>

    <!-- 详情描述 -->
    <div class="bg-white mt-30 mlr-12 pt-14 pb-20 plr-14">
      <p class="color-666 fs-14" v-html="paid_receive_prompt_tip"></p>
      <!-- <p class="fs-14 black mt-10 lh-20">If you do not receive the prompt within 10s follow the Instructions below:
          1.Dia l*170# to see the main MTN USSD menu
          2.Choose 6) My Wallet
          3.Choose 3) My Approvals
          4.Enter your PIN to proceed
          5.Look for the transaction and follow the prompts to authorise it,make sure the amount is correct
          6.Simply dial and try again if not success, or you can change payment method
      </p> -->
      <!-- 支付完成 -->
      <BmButton class="fs-16 round-8 w-100 mt-24" @click="onPayCompleted">{{ $t('payment_completed') }}</BmButton>
      <!-- 修改支付方式 -->
      <BmButton :type="'info'" class="fs-16 round-8 w-100 mt-10 change-btn" @click="onChangePayMethod">{{ $t('change_payment_method') }}</BmButton>
      <!-- 取消支付 -->
      <p class="green fs-14 lh-20 mt-30 tc pb-24" @click="onCancel">{{ $t('cancel_payment') }}</p>
    </div>
  </div>
</template>

<script>
import { cancelPayOrder, checkPayOrder, buyerCancelRecharge, checkBuyerRecharge, callBackRecharge } from '@/api/pay';

export default {
  middleware: 'authenticated',
  computed: {
    logo() {
      return this.$route.query.network ? this.$route.query.network : 'ARTLTIGO';
    },
    paid_receive_prompt_tip() {
      return this.$t('paid_receive_prompt_tip', { replace_tip: `<span class="fs-18 red lh-20">${this.$route.query.phone}</span>`, replace_tip2: `<span class="fs-18 red lh-20">${this.$store.state.rate.currency}${ this.$route.query.amount }</span>` });
    }
  },
  methods: {
    async onPayCompleted() { // 支付完成
      let data;
      if (this.$route.query.orderId) { // 确认订单是否支付
        data = await checkPayOrder(this.$route.query.refNo);
      } else {
        data = await checkBuyerRecharge(this.$route.query.refNo); // 判断买家充值是否成功
      }

      if (data.code != 0) {
        this.$dialog.confirm({
          title: this.$t('payment_failed'),
          message: this.$t('order_payment_failed_tips'),
          confirmButtonText: this.$t('ok')
        })
        return false;
      }
      if (this.$route.query.orderId) {
        this.$router.push({ // 校验之后成功跳转到订单支付结果页面
          name: 'cart-order-confirm',
          query: {
            orderId: this.$route.query.orderId
          }
        })
      } else {
        // callBackRecharge(this.$route.query.refNo).then(res => {
          this.$router.replace({
            name: 'me-wallet'
          })
        // })
      }
    },
    onChangePayMethod() { // 修改支付方式时, 要先取消该订单再返回上一级
      if (this.$route.query.orderId) { // 取消订单支付
        this.cancelPayOrder();
        return false;
      }
      this.cancelBuyerRecharge(); // 取消买家余额充值
    },
    onCancel() { // 取消支付
      this.$dialog({
        title: this.$t('are_you_sure_you_want_to_cancel_the_payment'),
        // message: 'This order will automatically be can-celed if not paid within 30 mins.',
        confirmButtonText: this.$t('continue_pay'),
        confirmButtonColor: '#42B7AE',
        showCancelButton: true,
        cancelButtonText: this.$t('leave'),
        cancelButtonColor: '#383838'
      }).then(() => { // on confirm
        
      }).catch(() => { // on cancel
        if (this.$route.query.orderId) { // 取消订单支付
          this.cancelPayOrder();
          return false;
        }
        this.cancelBuyerRecharge(); // 取消买家余额充值
      })
    },
    cancelPayOrder() { // 取消订单支付
      cancelPayOrder(this.$route.query.refNo).then(() => {
        this.$router.go(-1);
      }).catch(error => {
        console.log(error);
      })
    },
    leftClick() { // 页面回退
      this.onCancel();
    },
    cancelBuyerRecharge() { // 买家取消充值
      buyerCancelRecharge(this.$route.query.refNo).then(() => {
        this.$router.go(-1);
      }).catch(error => {
        console.log(error);
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
<template>
  <!-- 订单-支付-等待支付页面 -->
  <div class="vh-100">
    <BmHeaderNav :left="{ isShow: countdown == -1 ? true : false, isEmit: true }" :title="countdown == -1 ? $t('payment') : $t('pay_wait')" @leftClick="leftClick" />
    <!-- 支付详情 -->
    <div class="mt-24 tc plr-20">
      <BmImage
        :url="logo"
        :width="'0.96rem'" 
        :height="'0.96rem'"
        :isLazy="false"
        :isShow="false"
        :alt="'TospinoMall'"
      />
      <h3 class="fs-16 black mt-24" v-if="countdown == -1">{{ $t('awaiting_payment') }}</h3>
      <p class="mt-12 fs-14 black" v-if="countdown == -1">{{ $t('if_you_have_paid') }}</p>
      <p class="mt-20 grey" v-if="countdown != -1">{{ $t('pay_wait_confirm') }}</p>
      <van-count-down class="mt-24 black fs-24" v-if="countdown != -1" :time="countdown" @finish="onPayCompleted(1)" />
    </div>

    <!-- 详情描述 -->
    <div class="bg-white mt-30 mlr-12 pt-14 pb-20 plr-14" v-if="countdown == -1">
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
      <BmButton class="fs-16 round-8 w-100 mt-24" @click="onPayCompleted(0)">{{ $t('payment_completed') }}</BmButton>
      <!-- 修改支付方式 -->
      <BmButton :type="'info'" class="fs-16 round-8 w-100 mt-10 change-btn" @click="onChangePayMethod">{{ $t('change_payment_method') }}</BmButton>
      <!-- 取消支付 -->
      <p class="green fs-14 lh-20 mt-30 tc pb-24" @click="onCancel">{{ $t('cancel_payment') }}</p>
    </div>
  </div>
</template>

<script>
import { cancelPayOrder, buyerCancelRecharge, checkBuyerRecharge, callBackRecharge } from '@/api/pay';
import { CountDown } from 'vant';

export default {
  middleware: 'authenticated',
  components: {
    vanCountDown: CountDown
  },
  data() {
    return {
      countdown: -1
    }
  },
  computed: {
    logo() {
      return this.$route.query.network && this.$route.query.network != 'payWay' ? require('@/assets/images/icon/'+ this.$route.query.network +'.png') : this.$route.query.iconUrl ? JSON.parse(this.$route.query.iconUrl).iconUrl : '';
    },
    paid_receive_prompt_tip() {
      return this.$t('paid_receive_prompt_tip', { replace_tip: `<span class="fs-18 red lh-20">${this.$route.query.phone}</span>`, replace_tip2: `<span class="fs-18 red lh-20">${this.$store.state.rate.currency}${ this.$route.query.amount }</span>` });
    }
  },
  methods: {
    async onPayCompleted(num) { // 支付完成
      this.$toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      });
      let data;
      if (this.$route.query.orderId) { // 确认订单是否支付
        data = await this.$api.checkPayOrder(this.$route.query.refNo);
      } else {
        data = await checkBuyerRecharge(this.$route.query.refNo); // 判断买家充值是否成功
      }
      // num +=1;
      if (data.data != 1) {
        // if (num < 3) { // 因为有延迟，所以每次延迟1秒再次请求接口，请求三次还失败就进行错误提示
        //   setTimeout(() => {
        //     this.onPayCompleted(num);
        //   }, 2000)
        // } else {
          this.$toast.clear();
          this.countdown = num == 1 ? 0 : this.countdown;
          if (this.countdown == 0) { // 倒计时结束
            if (this.$route.query.orderId) { // 订单
              this.$router.push({ // 校验之后成功跳转到订单支付结果页面
                name: 'cart-order-confirm',
                query: {
                  orderId: this.$route.query.orderId,
                  isSuccess: data.data == 1 ? 0 : 2
                }
              })
              return false;
            }
            this.$dialog.alert({
              title: this.$t('payment_failed'),
              message: this.$t('order_payment_failed_tips'),
              confirmButtonText: this.$t('i_know')
            }).then(() => {
              this.$router.replace({
                name: 'me-wallet'
              })
            })
          } else{
            this.countdown = 1 * 2 * 60 * 1000;
          }
          
        // }
        return false;
      }
      if (this.$route.query.orderId) {
        this.$router.push({ // 校验之后成功跳转到订单支付结果页面
          name: 'cart-order-confirm',
          query: {
            orderId: this.$route.query.orderId,
            isSuccess: data.data == 1 ? 0 : 2
          }
        })
      } else {
        // callBackRecharge(this.$route.query.refNo).then(res => {
          this.$router.replace({
            name: 'me-wallet'
          })
        // })
      }
      this.$toast.clear();
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
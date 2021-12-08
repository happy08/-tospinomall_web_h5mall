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
      <p class="mt-30 grey" v-if="countdown != -1">{{ $t('pay_wait_confirm') }}</p>
      <van-count-down class="mt-30 black fs-24" v-if="countdown != -1" ref="countDown" :time="countdown" @finish="onPayCompleted(-2)" @change="onCountChange"/>
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
      <BmButton class="fs-16 round-8 w-100 mt-24" @click="onPayCompleted(-1)">{{ $t('payment_completed') }}</BmButton>
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
      countdown: -1,
      timer: null,
      goNum: 0
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
  beforeRouteUpdate(to, from, next) {
      if (to.name == 'me-pay-wait' && to.query.paywait) {
          this.onPayCompleted(0);
      }
      next();
  },
  activated() {
    // 倒计时存储到sessionStorage中
    this.countdown = sessionStorage.getItem('payCountDown') || this.countdown;
    if (this.countdown && this.countdown != 'NaN' && this.$route.query.paywait) {
        if (this.countdown == '00:00:00') { // 倒计时结束
          this.onPayCompleted(-2);
        } else if (this.countdown != -1) {
          this.onPayCompleted(3, this.countdown);
        }
    } else {
      this.countdown = -1;
    }
    this.goNum = 0;
  },
  deactivated() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  },
  methods: {
    async onPayCompleted(num, sessionTime) { // 支付完成
      if (this.timer) {clearTimeout(this.timer);this.timer=null}
      
      if (num == -1 && !this.$route.query.paywait) { // 点击完成
          this.countdown = 1 * 2 * 60 * 1000;
          this.$router.push({
              name: 'me-pay-wait',
              query: {
                  ...this.$route.query,
                  paywait: '1'
              }
          })
          return false;
      }
      if (num == 0) {
        this.$toast.loading({
          forbidClick: true,
          loadingType: 'spinner',
          duration: 0
        });
      }
      if (sessionTime) { // 倒计时等待中,赋值时间
        this.countdown = sessionTime;
      }
      num += 1;

      try {
        let data;
        if (this.$route.query.orderId) { // 确认订单是否支付
          data = await this.$api.checkPayOrder(this.$route.query.refNo);
        } else {
          data = await checkBuyerRecharge(this.$route.query.refNo); // 判断买家充值是否成功
        }

        if (num == -1) { // 倒计时结束
          clearTimeout(this.timer);
          sessionStorage.setItem('payCountDown', '00:00:00');
          this.goLeave(data, data.data == 1);
          return false;
        }
        if (data.data != 1) { 
          // 订单支付：0->未支付 1->已经支付
          // 钱包支付：0->失败 1->已经支付 2->待支付 3->已取消
            this.$toast.clear();
            if (num == 1) { // 倒计时开始
              this.countdown = 1 * 2 * 60 * 1000;
              this.onPayCompleted(num);
              return false;
            }
            this.timer = setTimeout(() => {
              if (num == -1) {
                clearTimeout(this.timer);
                return false;
              }
              if ((this.$route.query.orderId && data.data == 0) || (!this.$route.query.orderId && data.data == 2)) { // 订单 || 钱包充值
                this.onPayCompleted(num);
              } else {
                clearTimeout(this.timer);
                this.$refs.countDown.pause();
                this.goLeave(data); // 其他失败状态直接跳转结果页面
              }
              clearTimeout(this.timer)
            }, 2000);
            
          return false;
        }
        this.goLeave(data, true);
        this.$toast.clear();
      } catch (error) {
        if (num == -1) { // 倒计时结束
          clearTimeout(this.timer);
          sessionStorage.setItem('payCountDown', '00:00:00');
          this.goLeave();
        } else {
          this.timer = setTimeout(() => {
            if (num == -1) {
              clearTimeout(this.timer);
              sessionStorage.setItem('payCountDown', '00:00:00');
              this.goLeave();
              return false;
            }
            this.onPayCompleted(num);
            clearTimeout(this.timer)
          }, 2000);
        }
        this.$toast.clear();
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
      this.$toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      });
      cancelPayOrder(this.$route.query.refNo).then(() => {
        this.$router.go(-1);
        this.$toast.clear();
      }).catch(error => {
        console.log(error);
        this.$toast.clear();
      })
    },
    leftClick() { // 页面回退
      this.onCancel();
    },
    cancelBuyerRecharge() { // 买家取消充值
      this.$toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      });
      buyerCancelRecharge(this.$route.query.refNo).then(() => {
        this.$router.go(-1);
        this.$toast.clear();
      }).catch(error => {
        console.log(error);
        this.$toast.clear();
      })
    },
    goLeave(data, flag) { // 跳转到结果页面
      if (this.goNum == 1) {
        return false;
      }
      this.goNum == 1;
      if (flag) { // 成功
        if (this.$route.query.orderId) {
          this.$router.push({ // 校验之后成功跳转到订单支付结果页面
            name: 'cart-order-confirm',
            query: {
              orderId: this.$route.query.orderId,
              isSuccess: data && data.data == 1 ? 0 : 2
            }
          })
        } else {
          this.$router.replace({
            name: 'me-wallet-bill'
          })
        }
        return false;
      }
      // 失败
      this.$dialog.alert({
        title: this.$route.query.orderId || (!this.$route.query.orderId && data.data == 0) ? this.$t('payment_failed') : this.$t('wallet_timeout'),
        message: this.$route.query.orderId ? this.$t('order_payment_failed_tips') : this.$t('wallet_no_pay'),
        confirmButtonText: this.$t('i_know')
      }).then(() => {
        if (this.$route.query.orderId) { // 订单
          this.$router.push({ // 校验之后成功跳转到订单支付结果页面
            name: 'cart-order-confirm',
            query: {
              orderId: this.$route.query.orderId,
              isSuccess: data && data.data == 1 ? 0 : 2
            }
          })
          return false;
        }
        this.$router.replace({
          name: 'me-wallet-bill'
        })
      })
    },
    onCountChange(timeData) { // 倒计时变化
      let minutes = timeData.minutes > 0 ? timeData.minutes * 60 : 0;
      sessionStorage.setItem('payCountDown', (minutes + timeData.seconds) * 1000);
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
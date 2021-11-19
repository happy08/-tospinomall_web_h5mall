<template>
  <!-- 我的-订单-待付款-支付方式选择页面 -->
  <div class="bg-grey vh-100">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('payment')" />
    <!-- brij钱包支付 -->
    <van-radio-group v-model="payRadio" v-if="brijData.length > 0">
      <van-cell-group v-for="(item, index) in brijData" :key="index" class="bg-white">
        <van-cell class="ptb-20 vcenter" clickable @click="onChangePayment(item)" :border="false">
          <!-- 左侧图标 -->
          <template #icon>
            <BmImage
              :url="item.icon_url"
              :width="'0.8rem'" 
              :height="'0.8rem'"
              :isLazy="false"
              :isShow="false"
              :alt="'TospinoMall'"
            />
          </template>
          <template #title>
            <div class="ml-8">
              <h1 class="fs-14 lh-1">{{ item.name }}</h1>
              <p class="fs-12 lh-1 mt-8 color-65">{{ item.description }}</p>
            </div>
          </template>
          <!-- 右侧图标-单选图标 -->
          <template #right-icon>
            <van-radio :name="item.id" icon-size="0.48rem">
              <template #icon="props">
                <BmImage
                  :url="props.checked ? require('@/assets/images/icon/choose-icon.png') : require('@/assets/images/icon/choose-default-icon.png')"
                  :width="'0.32rem'" 
                  :height="'0.32rem'"
                  :isLazy="false"
                  :isShow="false"
                  :alt="'TospinoMall choose icon'"
                />
              </template>
            </van-radio>
          </template>
        </van-cell>
        <!-- 支持输入手机号 -->
        <van-field
          v-model="item.phone"
          :placeholder="$t('phone_number')"
          :class="{'field-container phone-code-field pt-0 pb-20': true, 'is-active': payRadio == item.id}"
          type="number"
          maxlength="20"
        >
          <template #label>
            <span @click="$router.push({ name: 'me-address-areacode', query: { ...$route.query, paymentWay: item.label } })" class="iblock fs-14 black lh-20 pl-4">
              {{ item.prefixCode }}
              <img class="prefix-container--icon" src="@/assets/images/triangle-icon.png">
            </span>
          </template>
        </van-field>
      </van-cell-group>
    </van-radio-group>

    <!-- 底部金额以及支付按钮 -->
    <div class="w-100 bg-white flex between pl-20 vcenter pay-content__btn">
      <div class="red fs-18 fw">{{ $store.state.rate.currency }}{{ $route.query.amount }}</div>
      <BmButton class="fs-16 round-0 pay-content__btn--pay" @click="onPay">{{ $t('payment') }}</BmButton>
    </div>
  </div>
</template>

<script>
import { RadioGroup, Radio, Cell, CellGroup, Field, Popup, Picker, NumberKeyboard, PasswordInput } from 'vant';
import { getAvailable, buyerRecharge, payOrder } from '@/api/pay';

export default {
  middleware: 'authenticated',
  components: {
    vanRadioGroup: RadioGroup,
    vanRadio: Radio,
    vanCell: Cell,
    vanCellGroup: CellGroup,
    vanField: Field,
    vanPopup: Popup,
    vanPicker: Picker,
    vanNumberKeyboard: NumberKeyboard,
    vanPasswordInput: PasswordInput
  },
  data() {
    return {
      brijData: [],
      payRadio: 100
    }
  },
  fetch() {
    this.brijData = [];
    this.payRadio = 100;
    this.$toast.loading({
      forbidClick: true,
      loadingType: 'spinner',
      duration: 0
    });

    // brij钱包支付
    if (this.$route.query.payWay && this.$route.query.payWay == 'Brij') {
      // 获取所有的支付方式
      fetch('/brij/api/v2/payviabrij/paymentmethods', {
        method: 'POST',
        body: JSON.stringify({
          currency: 'GHS'
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 773|zuhKE0MLWvfAnZHo5dJU9oRQOUILNHt6JWokxeer'
        },
        // mode: 'no-cors',
      }).then(res => {
        return res.json();
      }).then(response => {
        console.log(response);
        this.brijData = response.data.map(item => {
          return {
            ...item,
            phone: '',
            prefixCode: this.$route.query.phonePrefix && item == this.$route.query.paymentWay ? this.$route.query.phonePrefix : this.$t('prefix_tip')
          }
        });
        this.$toast.clear();
      })
    }
  },
  activated() {
    this.$fetch();
  },
  methods: {
    onPay() { // 提交支付,成功跳转到确认订单页面
      if (this.payRadio == 100) {
        return false;
      }

      let phone = this.brijData.filter(item => {
        return item.id === this.payRadio;
      })[0].phone;

      let phonePrefix = this.brijData.filter(item => {
        return item.id === this.payRadio;
      })[0].prefixCode;
      
      if (phone.length == 0) {
        return false;
      }

      // 订单支付
      if (this.$route.query.orderIds) {
        if (this.$route.query.payWay == 'Brij') { // Brij支付
          this.payOrder({ payType: 3, network: this.payRadio, sourceType: 4, orderIds: JSON.parse(this.$route.query.orderIds).orderIds, phone: phone, phonePrefix: phonePrefix });
          return false;
        }
        this.payOrder({ payType: 2, network: this.payRadio, phone: phone, phonePrefix: phonePrefix, sourceType: 4, orderIds: JSON.parse(this.$route.query.orderIds).orderIds });
        return false;
      }

      // 买家充值
      buyerRecharge({ amount: parseFloat(this.$route.query.amount), msisdn: phone, network: this.payRadio, type: this.$route.query.type }).then(res => {
        if (res.code != 0) return false;
        this.$router.push({
          name: 'me-pay-wait',
          query: {
            network: this.payRadio,
            phone: phone,
            amount: this.$route.query.amount,
            refNo: res.data.refNo
          }
        })
      }).catch(error => {
        console.log(error);
      })
    },
    onChangePayment(item) { // 选择支付方式
      this.payRadio = item.id;
    },
    payOrder(params) { // 订单支付 payType: 1余额支付 2UniwalletPay 0系统支付, sourceType订单来源4->h5
      let phone = this.brijData.filter(item => {
        return item.id === this.payRadio;
      })[0].phone;
      
      if (phone.length == 0 && this.payRadio !== 'balance') {
        return false;
      }

      // 加载图标
      this.$toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      });

      payOrder(params).then(res => {
        if (res.code != 0) return false;

        // brij支付
        if (this.$route.query.payWay == 'Brij') {
          // 进行支付
          this.onBrijPay({ ...params, orderId: JSON.stringify({orderId: res.data.orderIds}) });
          return false;
        }
        // tingg支付
        // if (params.payType == 3) {
        //   // Tingg.renderPayButton({ // 按钮初始化
        //   //   className: 'pay-content__btn--pay', 
        //   //   checkoutType: 'modal' // or 'modal'
        //   // });
          
        //   this.onTinggPay({ ...res.data.tinggPayInfo, phone: params.phone, phonePrefix: params.phonePrefix, orderId: JSON.stringify({orderId: res.data.orderIds})});
        //   return false;
        // }
        this.$toast.clear();
        // 不是余额支付的话，需要先跳转到收银台
        if (res.data.refNo) { // 有流水号跳转到收银台
          this.$router.push({
            name: 'me-pay-wait',
            query: {
              network: this.payRadio,
              phone: phone,
              amount: this.$route.query.amount,
              refNo: res.data.refNo,
              orderId: JSON.stringify({orderId: res.data.orderIds})
            }
          })
        } else { // 没有流水号直接成功
          this.$router.push({ // 校验之后成功跳转到订单支付结果页面
            name: 'cart-order-confirm',
            query: {
              orderId: JSON.stringify({orderId: res.data.orderIds})
            }
          })
        }
      }).catch(error => {
        if (error.code == 11000) { // 支付失败
          if (this.payRadio === 'balance') { // 余额支付，直接跳转到支付订单结果页
            this.$router.push({ // 校验之后成功跳转到订单支付结果页面
              name: 'cart-order-confirm',
              query: {
                orderId: JSON.stringify({orderId: error.data.orderIds}),
                isSuccess: 2
              }
            })
            return false;
          }
        }
      })
    },
    onBrijPay(params) {
      fetch('/brij/api/v2/payviabrij/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 773|zuhKE0MLWvfAnZHo5dJU9oRQOUILNHt6JWokxeer'
        },
        body: JSON.stringify({
          "transaction_id" : "brij6233222",
          "merchant_id" : "003542",
          "currency" : this.$store.state.rate.payParamObj.currencyCode || "GHS",
          "payment_details" : {"momo_number": params.phonePrefix + '' + params.phone},
          "payment_method_id" : this.payRadio,
          "amount" : "0.1"
        }),
        // mode: 'no-cors',
      }).then(res => {
        return res.json();
      }).then(response => {
        if (response.status == 200) { // 成功
          this.onCheckPayOrder({ orderId: params.orderId });
          return false;
        }
        this.$toast.clear();
        console.log(response.json())
      }).catch(() => {
        this.$toast.clear();
      })
    },
    onCheckPayOrder(orderId) {
      this.$api.checkPayOrder(this.$route.query.refNo).then(checkData => {
        if (this.$route.query.type == 'order') {
          this.$router.push({ // 校验之后成功跳转到订单支付结果页面
            name: 'cart-order-confirm',
            query: {
              orderId: orderId,
              isSuccess: checkData.code != 0 ? 2 : 5
            }
          })
        } else {
          this.$router.replace({
            name: 'me-wallet'
          })
        }
        this.$toast.clear();
      })
    }
  }
}
</script>

<style lang="less" scoped>
.pay-content__btn{
  height: 56px;
  position: absolute;
  bottom: 0;
  .pay-content__btn--pay{
    height: 100%!important;
    width: 120px;
  }
}
.prefix-container--icon{
  margin-left: 1px;
  width: 20px;
  height: 20px;
  object-fit: cover;
  vertical-align: top;
}
.phone-code-field{
  display: none;
  padding: 20px!important;
}
.is-active{
  display: flex;
}
.pb-244{
  padding-bottom: 244px;
}
.color-65{
  color: #656565;
}
</style>
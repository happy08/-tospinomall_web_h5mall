<template>
  <!-- 我的-订单-待付款-支付页面 -->
  <div class="bg-grey vh-100">
    <BmHeaderNav :left="{ isShow: true, isEmit: true }" :title="$t('payment')" @leftClick="leftClick" />

    <!-- 选择-单选 -->
    <van-radio-group v-model="payRadio" v-if="list.length > 0" class="mlr-12">
      <van-cell-group v-for="(item, index) in list" :key="index" class="bg-white">
        <van-cell class="ptb-10 mt-12 vcenter pl-6 pr-12" clickable @click="onChangePayment(item)" :border="false" :is-link="item.label == 'Brij' || item.label == 'Paystack'">
          <!-- 左侧图标 -->
          <template #icon v-if="item.label != 'Paystack'">
            <BmImage
              :url="require('@/assets/images/icon/'+ (item.label) +'.png')"
              :width="'0.8rem'" 
              :height="'0.8rem'"
              :isLazy="false"
              :isShow="false"
              :alt="'TospinoMall ' + item.label + ' icon'"
            />
          </template>
          <template #title>
            <div class="ml-8">
              <h1 class="fs-14 lh-1">{{ item.label }}</h1>
              <p class="fs-12 lh-1 mt-8 color-65">{{ item.desc }}</p>
            </div>
          </template>
          <template #default v-if="item.label == 'Balances'">
            <span class="fs-16 fw tr black pr-10">{{ $store.state.rate.currency }}{{ balance }}</span>
          </template>
          <!-- 右侧图标-单选图标 -->
          <template #right-icon v-if="item.label != 'Brij' && item.label != 'Paystack'">
            <van-radio :name="item.label" icon-size="0.48rem">
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
          :class="{'field-container phone-code-field pt-0 pb-20': true, 'is-active': payRadio == item.label}"
          type="number"
          maxlength="20"
          v-if="item.label != 'Balances' && item.label != 'Brij' && item.label != 'Paystack'"
        >
          <template #label>
            <span @click="$router.push({ name: 'me-address-areacode', query: { ...$route.query, payment: item.label } })" class="iblock fs-14 black lh-20 pl-4">
              {{ item.prefixCode }}
              <img class="prefix-container--icon" src="@/assets/images/triangle-icon.png">
            </span>
          </template>
        </van-field>
      </van-cell-group>
    </van-radio-group>

    <!-- tingg支付 -->
    <!-- <button class="awesome-checkout-button" @click="onTinggPay"></button> -->
    <!-- brij钱包支付 -->
    <!-- <button class="plr-20 ptb-20 brij-checkout-button">Brij钱包支付</button> -->
    <!-- <button class="plr-20 ptb-20" @click="onPayswitch">Theteller 钱包支付</button> -->
    <!-- <form >
      <a class="ttlr_inline"
            data-APIKey="MjM0Mjk3YzRkOWU2YThjNDI4YmEyOWRlZDY0YjllZWU="
            data-transid="000000000003"
            data-amount="0.1"
            data-customer_email="152@qq.com"
            data-currency="GHS"
            data-redirect_url="http://192.168.2.45:8000/me/pay/payment"
            data-pay_button_text="Pay Now"
            data-custom_description="Payment Using InlineJS"
            data-payment_method="both">
        </a>
    </form> -->

    <!-- 底部金额以及支付按钮 -->
    <div class="w-100 bg-white flex between pl-20 vcenter pay-content__btn">
      <div class="red fs-18 fw">{{ $store.state.rate.currency }}{{ $route.query.amount }}</div>
      <BmButton class="fs-16 round-0 pay-content__btn--pay" @click="onPay">{{ $t('payment') }}</BmButton>
    </div>

    <!-- 余额支付点击支付按钮，需要输入支付密码 -->
    <van-popup v-model="balanceShow" position="bottom" class="w-100 pb-244" closeable close-icon-position="top-left" close-icon="arrow-left">
      <h3 class="black fs-16 tc mt-16">{{ $t('enter_payment_password') }}</h3>
      <!-- 密码输入框 -->
      <div class="plr-10 mt-20">
        <van-password-input
          :value="payPwd"
        />
      </div>
      
      <nuxt-link :to="{ name: 'me-account-verifymethod', query: { type: 'payForget', from: 'order' } }" class="tc grey fs-12 block mtb-10">{{ $t('forgot_password') }}</nuxt-link>
      <!-- 数字键盘 -->
      <van-number-keyboard
        v-model="payPwd"
        :show="true"
        @input="onInput"
      />
    </van-popup>

    <van-dialog v-model="isWaittingPay" title="" :showConfirmButton="false" class="tc ptb-30">
      <p class="black fs-14 pb-24">{{ $t('wait_pay_result') }}</p>
      <van-loading type="spinner" color="#42b7ae" />
    </van-dialog>
    
  </div>
</template>

<script>
import { RadioGroup, Radio, Cell, CellGroup, Field, Popup, Picker, NumberKeyboard, PasswordInput } from 'vant';
import { getAvailable, buyerRecharge, payOrder, getAllPayments, getRechargeCard, checkBuyerRecharge } from '@/api/pay';
const Encryption = require('@/assets/js/encryption');
import { url } from '@/api/config'; // 导入配置域名

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
      payRadio: 100,
      list: [],
      isBackDialog: false,
      balanceShow: false,
      payPwd: '',
      isWaittingPay: false,
      balance: 0
    }
  },
  beforeRouteEnter(to, from, next) { // 从初始页面进入重置值为空
    next(vm => {
      if (from.name === 'me-wallet' || from.name == 'me-order' || from.name == 'cart-order-id') {
        vm.payRadio = 100;
        vm.isBackDialog = false;
        vm.payPwd = '';
        vm.balanceShow = false;
      } else if (from.name === 'me-pay-wait') { // 从确认订单页面回来
        vm.isBackDialog = true;
      }
    });
  },
  head: {
    script: [
      { src: 'https://developer.tingg.africa/checkout/v2/tingg-checkout.js', type: 'text/javascript', charset: 'utf-8' },
      // { src: 'https://test.theteller.net/checkout/resource/api/inline/theteller_inline.js', type: 'text/javascript', charset: 'utf-8' },
      { src: 'https://js.paystack.co/v2/inline.js' }
    ]
  },
  async fetch() {
  },
  activated() {
    this.$toast.loading({
      forbidClick: true,
      loadingType: 'spinner',
      duration: 0
    });

    if (this.$route.query.tingg && (this.$route.query.tingg == 'success' || this.$route.query.tingg == 'failed') || (Array.isArray(this.$route.query.tingg) && (this.$route.query.tingg.indexOf('success') > 0 || this.$route.query.tingg.indexOf('failed') > 0))) { // 只有成功和失败时才调取接口
      this.isWaittingPay = true;
      // 失败
      if (this.$route.query.tingg == 'failed') {
        this.$dialog.confirm({
          title: this.$t('payment_failed'),
          message: this.$t('order_payment_failed_tips'),
          confirmButtonText: this.$t('pay_again')
        }).then(() => {
          this.onPay();
        })
        return false;
      }
      // 成功,校验订单是否支付成功
      this.checkPayOrder(0);
    }
    
    this.list = [
      {
        label: 'Paystack',
        phone: '',
        desc: this.$t('tospinomall_wallet')
      }
    ];
    if (this.$route.query.type == 'order') { // 说明是从订单结算页面跳转过来的，支付方式就有余额
      this.list.push({
        label: 'Balances',
        phone: '',
        desc: this.$t('tospinomall_wallet')
      });
    }
    if (this.payRadio == 100) {
      this.balanceShow = false;
    }

    // 获取余额
    getRechargeCard().then(res => {
      this.balance = res.data.balance
    }).catch(error => {
      console.log(error);
    })
    // 获取所有支付方式
    getAllPayments().then(res => {
      let list = res.data.map(item => {
        return {
          ...item,
          label: item.value,
          desc: item.label,
          phone: '',
          prefixCode: this.$route.query.phonePrefix && item == this.$route.query.payment ? this.$route.query.phonePrefix : this.$t('prefix_tip')
        }
      });
      this.list = this.list.concat(list);
      this.$toast.clear();
    }).catch(error => {
      console.log(error);
      this.$toast.clear();
    })
  },
  methods: {
    onPay() { // 提交支付,成功跳转到确认订单页面
      if (this.payRadio == 100) {
        return false;
      }
      if (this.payRadio == 'Balances') { // 余额支付
        if (this.$store.state.user.userInfo.payPassword == '') { // 未设置支付密码
          this.$router.push({
            name: 'me-pay-changePwd',
            query: { 
              from: 'me-pay-payment',
            }
          })
          return false;
        }
        this.balanceShow = true;
        return false;
      }

      let phone = this.list.filter(item => {
        return item.label === this.payRadio;
      })[0].phone;

      let phonePrefix = this.list.filter(item => {
        return item.label === this.payRadio;
      })[0].prefixCode;
      
      if (phone.length == 0) {
        return false;
      }

      // 订单支付
      if (this.$route.query.orderIds) {
        if (this.payRadio == 'Payswitch') {
          this.onPayswitch();
          return false;
        }
        if (this.payRadio == 'Tingg') { // tingg支付
          this.payOrder({ payType: 3, platformPayType: this.payRadio, sourceType: 4, orderIds: JSON.parse(this.$route.query.orderIds).orderIds, phone: phone, phonePrefix: phonePrefix });
          return false;
        }
        this.payOrder({ payType: 2, platformPayType: this.payRadio, phone: phone, phonePrefix: phonePrefix, sourceType: 4, orderIds: JSON.parse(this.$route.query.orderIds).orderIds });
        return false;
      }

      // 买家充值
      buyerRecharge({ amount: parseFloat(this.$route.query.amount), type: this.$route.query.type, platformPayType: this.payRadio, payType: 3, platformPayTypeName: name }).then(res => {
        if (res.code != 0) return false;
        // brij有具体的支付方式选择页面，故不在这里调用
      
        // tingg支付
        if (this.payRadio == 'Tingg') {
          Tingg.renderPayButton({ // 按钮初始化
            className: 'pay-content__btn--pay', 
            checkoutType: 'redirect' // or 'modal'
          });
          
          this.onTinggPay({ ...res.data, phone: phone, phonePrefix: phonePrefix, merchantTransactionID: res.data.refNo, requestAmount: parseFloat(this.$route.query.amount) });
          return false;
        }
        // Payswitch支付
        if (this.payRadio == 'Payswitch') {
          this.onPayswitch();
          return false;
        }
        this.$router.push({
          name: 'me-pay-wait',
          query: {
            network: this.payRadio,
            phone: phone,
            amount: this.$route.query.amount,
            refNo: res.data.refNo
          }
        })
        this.$toast.clear();
      }).catch(error => {
        console.log(error);
        this.$toast.clear();
      })
    },
    leftClick() {
      if (this.$route.query.comfirmOrder) { // 从确认订单页面进来，返回的时候1个订单返回订单详情，2个及以上跳到订单列表
        let orderIds = JSON.parse(this.$route.query.orderIds).orderIds;
        if (orderIds.length == 1) {
          this.$router.push({
            name: 'me-order-detail-id',
            params: {
              id: orderIds[0]
            },
            query: {
              back: 'me-order'
            }
          })
        } else {
          this.$router.push({
            name: 'me-order'
          })
        }
        
        return false;
      }

      if (!this.isBackDialog) { // 充值 等待支付
        history.back();
        return false;
      }

      // this.$dialog({
      //   title: this.$t('are_you_sure_want_to_leave'),
      //   message: this.$t('paid_wait_time_tip'),
      //   confirmButtonText: this.$t('reconsider'),
      //   confirmButtonColor: '#42B7AE',
      //   showCancelButton: true,
      //   cancelButtonText: this.$t('leave'),
      //   cancelButtonColor: '#383838'
      // }).then(() => { // on confirm

      // }).catch(() => { // on leave
        this.$router.go(-1);
      // })
    },
    onInput() { // 密码按键时触发
      if (this.payPwd.length >= 5) {
        setTimeout(() => {
          this.payOrder({ payType: 1, pwd: this.payPwd, sourceType: 4, orderIds: JSON.parse(this.$route.query.orderIds).orderIds }); // 确认密码之后进行账单支付
        }, 100);
      }
    },
    payOrder(params) { // 订单支付 payType: 1余额支付 2UniwalletPay 0系统支付, sourceType订单来源4->h5
      let phone = this.list.filter(item => {
        return item.label === this.payRadio;
      })[0].phone;
      
      if (phone.length == 0 && this.payRadio !== 'Balances') {
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

        // if (this.payRadio == 'Payswitch') {
        //   this.onPayswitch();
        //   return false;
        // }
        // tingg支付
        if (params.payType == 3) {
          Tingg.renderPayButton({ // 按钮初始化
            className: 'pay-content__btn--pay', 
            checkoutType: 'redirect' // or 'modal'
          });
          
          this.onTinggPay({ ...res.data.payInfo, phone: params.phone, phonePrefix: params.phonePrefix, orderId: JSON.stringify({orderId: res.data.orderIds})});
          return false;
        }
        this.$toast.clear();
        if (this.payRadio === 'Balances') { // 余额支付，直接跳转到支付订单结果页
          this.$router.push({ // 校验之后成功跳转到订单支付结果页面
            name: 'cart-order-confirm',
            query: {
              orderId: JSON.stringify({orderId: res.data.orderIds}),
              isSuccess: 1
            }
          })
          this.payPwd = '';
          return false;
        }
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
          if (this.payRadio === 'Balances') { // 余额支付，直接跳转到支付订单结果页
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
    onTinggPay(paramsData) { // tingg支付
      console.log(paramsData)
      let params = {
        ...paramsData,
        ivKey: 'wJf8Vjch2rbGmy47',
        secretKey: 'FtWH6ZGc2qQTMbvw',
        accessKey: '$2a$08$wvWtdcwhPCEK1lhWXuP8lO6qnx5Pw5XpxcwtAV0aGn9tXLcLMAxoi',
        serviceCode: 'TOSDEV2425',
        accountNumber: 'TOSDEV2425'
      }
      const algorithm = "aes-256-cbc";

      const encryption = new Encryption(params.ivKey, params.secretKey, algorithm);

      const payload = {
        merchantTransactionID: params.merchantTransactionID, // 最长是15位，无规则限制
        requestAmount: params.requestAmount,
        currencyCode: this.$store.state.rate.payParamObj.currencyCode || "GHS",
        accountNumber: params.accountNumber,
        serviceCode: params.serviceCode,
        // dueDate: "2019-06-01 23:59:59", //Must be a future date
        // requestDescription: "Dummy merchant transaction",
        countryCode: this.$store.state.rate.payParamObj.countryCode || "GH",
        languageCode: this.$store.state.rate.payParamObj.languageCode || "en",
        payerClientCode: "",
        MSISDN: params.phonePrefix + '' + params.phone, //Must be a valid number
        // customerFirstName: "John",
        // customerLastName: "Smith",
        // customerEmail: "john.smith@example.com",
        successRedirectUrl: location.href + `&refNo=${params.merchantTransactionID}&orderId=${params.orderId}&tingg=success`,
        failRedirectUrl: location.href + `&refNo=${params.merchantTransactionID}&orderId=${params.orderId}&tingg=failed`,
        pendingRedirectUrl: location.href + `&tingg=pending`,
        paymentWebhookUrl: params.webhookUrl
      }
      
      // 如果用户有绑定邮箱，则在参数中添加邮箱
      if (this.$store.state.user.userInfo.email && this.$store.state.user.userInfo.email != '') {
        payload.customerEmail = this.$store.state.user.userInfo.email;
      }

      let payloadString = JSON.stringify(payload).replace(/\//g, '\\/');
      // location.href = `https://developer.tingg.africa/checkout/v2/express/?accessKey=${params.accessKey}&params=${encryption.encrypt(payloadString)}&countryCode=${payload.countryCode}`;

      // 发起结账请求
      Tingg.renderCheckout({
        checkoutType: 'redirect', // or 'modal'
        merchantProperties: {
          params: encryption.encrypt(payloadString),
          accessKey: params.accessKey,
          countryCode: payload.countryCode
        }
      })
    },
    onPayswitch() { // Payswitch支付
      // let paySwitch = document.createElement('form');
      // let paySwitch_a = document.createElement('a');
      // paySwitch_a.className = 'ttlr_inline';
      // const attr = {
      //   'data-APIKey': 'MjM0Mjk3YzRkOWU2YThjNDI4YmEyOWRlZDY0YjllZWU=',
      //   'data-transid': "000000000003",
      //   'data-amount': "0.1",
      //   'data-customer_email': '152@qq.com',
      //   'data-currency': "GHS",
      //   'data-redirect_url': "http://192.168.2.45:8000/me/pay/payment",
      //   'data-pay_button_text': "Pay Now",
      //   'data-custom_description': "Payment Using InlineJS",
      //   'data-payment_method': "both"
      // };
      // for (let i in attr) {
      //   paySwitch_a.setAttribute(i, attr[i]);
      // }
      // paySwitch.appendChild(paySwitch_a);
      // document.getElementById('__layout').appendChild(paySwitch);
      // // document.body.appendChild(paySwitch);
      // setTimeout(() => {
      //   console.log('----')
      //   paySwitch.click();
      // }, 300);
      
      // return;
      // 标准初始化集合
      // fetch('/payswitch/checkout/initiate', {
      //   method: 'post',
      //   headers: {
      //     Authorization: `Basic dG9zcGlubzYxN2Y5NTAzODQ5Y2Y6TWpNME1qazNZelJrT1dVMllUaGpOREk0WW1FeU9XUmxaRFkwWWpsbFpXVT0=`, // Basic base64_encode('your API username:your API Key')
      //     'Cache-Control': 'no-cache',
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     merchant_id: 'TTM-00006229',
      //     transaction_id: '000000000002',
      //     desc: 'Payswitch支付',
      //     amount: '000000000001',
      //     redirect_url: location.href + `&payswitch=1`,
      //     email: '1509567392@qq.com',
      //     API_Key: 'MjM0Mjk3YzRkOWU2YThjNDI4YmEyOWRlZDY0YjllZWU=',
      //     apiuser: 'tospino617f9503849cf'
      //   })
      // }).then(res => {
      //   return res.json();
      // }).then(response => {
      //   console.log(response)
      //   if (response.code == 200) { // 重定向到结账页面
      //     location.href = response.checkout_url;
      //     // http://192.168.2.45:8000/me/pay/paymentTwo?tingg=1%3Fcode%3D600&status=error&reason=Can%20not%20process%20request&transaction_id=000000000000
      //   }
      // })
      
      // 钱包支付
      fetch('/payswitch/v1.1/transaction/process', {
        method: 'post',
        headers: {
          Authorization: `Basic dG9zcGlubzYxN2Y5NTAzODQ5Y2Y6TWpNME1qazNZelJrT1dVMllUaGpOREk0WW1FeU9XUmxaRFkwWWpsbFpXVT0=`, // Basic base64_encode('your API username:your API Key')
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json'
        },
        // body: JSON.stringify({
        //   merchant_id: 'TTM-00006229',
        //   transaction_id: '000000000002',
        //   processing_code : "000200",
        //   desc: 'Payswitch支付',
        //   amount: '000000000010',
        //   // redirect_url: location.href + `&payswitch=1`,
        //   // email: '1509567392@qq.com',
        //   subscriber_number: "233243124824",
        //   // API_Key: 'MjM0Mjk3YzRkOWU2YThjNDI4YmEyOWRlZDY0YjllZWU=',
        //   // apiuser: 'tospino617f9503849cf',
        //   "r-switch" : "MTN"
        // }),
        body: JSON.stringify({
            "amount" : "000000000200",
            "processing_code" : "000200",
            "transaction_id" : "000000000008",
            "desc" : "Mobile Money Payment Test",
            "merchant_id" : "TTM-00006229",
            "subscriber_number" : "233500124824",
            "voucher_code" : "0215",
            "r-switch" : "MTN" // MTN成功 VDF成功 ATL成功 TGO成功
        })
      }).then(res => {
        return res.json();
      }).then(response => {
        console.log(response)
        if (response.code == 200) { // 重定向到结账页面
          location.href = response.checkout_url;
          // http://192.168.2.45:8000/me/pay/paymentTwo?tingg=1%3Fcode%3D600&status=error&reason=Can%20not%20process%20request&transaction_id=000000000000
        }
      })
      // 卡支付 600
      // fetch('/payswitch/v1.1/transaction/process', {
      //   method: 'post',
      //   headers: {
      //     Authorization: `Basic dG9zcGlubzYxN2Y5NTAzODQ5Y2Y6TWpNME1qazNZelJrT1dVMllUaGpOREk0WW1FeU9XUmxaRFkwWWpsbFpXVT0=`,
      //     'Cache-Control': 'no-cache',
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     "processing_code":"000000",
      //     "r-switch":"VIS",
      //     "transaction_id":"000000000001",
      //     "merchant_id":"TTM-00006229",
      //     "pan":"4448366600675430",
      //     "3d_url_response":location.href + `&payswitch=1`,
      //     "exp_month":"02", // 信用卡到期月
      //     "exp_year":"21", // 信用卡的有效期
      //     "cvv":"330",
      //     "desc":"Card Payment Test",
      //     "amount":"000000000100",
      //     "currency":"GHS",
      //     "card_holder":"Card Holder Name",
      //     "customer_email":"152@qq.com"
      //   })
      // }).then(res => {
      //   return res.json();
      // }).then(response => {
      //   console.log(response)
      // })
      // 卡片逆转 600
      // fetch('/theteller/rest/resources/card/reversal', {
      //   method: 'post',
      //   headers: {
      //     Authorization: `Basic dG9zcGlubzYxN2Y5NTAzODQ5Y2Y6TWpNME1qazNZelJrT1dVMllUaGpOREk0WW1FeU9XUmxaRFkwWWpsbFpXVT0=`,
      //     'Cache-Control': 'no-cache',
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     "merchant_id": "0000000000",
      //     "transaction_id": "000000000002",
      //     "amount": "000000000001"
      //   })
      // }).then(res => {
      //   return res.json();
      // }).then(response => {
      //   console.log(response)
      // })
    },
    onChangePayment(item) {
      // brij支付
      if (item.label == 'Brij') {
        this.$router.push({
          name: 'me-pay-paymentWay',
          query: {
            ...this.$route.query,
            payWay: 'Brij',
          }
        })
        return false;
      }
      // Paystack支付
      if (item.label == 'Paystack') {
        const paystack = new PaystackPop();
        paystack.newTransaction({
          key: 'pk_test_e9a02bcd6cf719716299b9d4c9a0d405c07974d7', // pbulic key
          email: '150@email.com', // 邮箱
          amount: 10000, // 实际金额 * 100
          onSuccess: (transaction) => {
            console.log('成功')
            console.log(transaction) 
            // transaction = { message: "Approved"
                // reference: "T976710416254897"
                // status: "success"
                // trans: "1506044009"
                // transaction: "1506044009"
                // trxref: "T976710416254897"}
            // Payment complete! Reference: transaction.reference 
          },
          onCancel: () => {
            console.log('取消')
            // user closed popup
          }
        });
        return false;
      }
      this.payRadio = item.label;
    },
    async checkPayOrder(num) {
      try {
        let checkData;
        if (this.$route.query.type == 'order') { // 确认订单是否支付
          checkData = await this.$api.checkPayOrder(this.$route.query.refNo);
        } else {
          checkData = await checkBuyerRecharge(this.$route.query.refNo); // 判断买家充值是否成功
        }
        
        num += 1;
        if (checkData.data != 1 && num <= 3) {
          let timer = setTimeout(() => {
            this.checkPayOrder(num);
            clearTimeout(timer);
          }, 1000);
          return false;
        }
        if (this.$route.query.type == 'order') {
          this.$router.push({ // 校验之后成功跳转到订单支付结果页面
            name: 'cart-order-confirm',
            query: {
              orderId: this.$route.query.orderId,
              isSuccess: checkData.data == 1 ? 0 : 2
            }
          })
        } else { // 帐单列表
          this.$router.push({
            name: 'me-wallet-bill'
          })
        }
        this.isWaittingPay = false;
      } catch (error) {
        console.log(error);
      }
    }
  },
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
.pl-6{
  padding-left: 6px;
}
</style>

<style lang="less">
#tingg-express-checkout-iframe{
  z-index: 100000!important;
}
</style>

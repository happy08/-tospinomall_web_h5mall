<template>
  <!-- 我的-订单-待付款-支付方式选择页面 -->
  <div class="bg-grey vh-100">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('payment')" />
    <!-- brij钱包支付 -->
    <van-radio-group v-model="payRadio" v-if="brijData.length > 0">
      <van-cell-group v-for="(item, index) in brijData" :key="index" class="bg-white">
        <van-cell class="ptb-10 mt-12 vcenter pl-6 pr-12" clickable @click="onChangePayment(item)" :border="false">
          <!-- 左侧图标 -->
          <template #icon>
            <BmImage
              :url="item.iconUrl"
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
            <span @click="$router.push({ name: 'me-address-areacode', query: { ...$route.query, paymentWay: item.id } })" class="iblock fs-14 black lh-20 pl-4">
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
import { RadioGroup, Radio, Cell, CellGroup, Field } from 'vant';
import { buyerRecharge, payOrder, getBrijPayments, payBrij } from '@/api/pay';

export default {
  middleware: 'authenticated',
  components: {
    vanRadioGroup: RadioGroup,
    vanRadio: Radio,
    vanCell: Cell,
    vanCellGroup: CellGroup,
    vanField: Field,
  },
  data() {
    return {
      brijData: [],
      payRadio: 100
    }
  },
  activated() {
    this.brijData = [];
    this.payRadio = this.$route.query.paymentWay || 100;
    
    // brij支付 获取所有支付方式
    if (this.$route.query.payWay && this.$route.query.payWay == 'Brij') {
      this.getBrijPayments();
    }
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
        let payType = this.$route.query.payWay == 'Brij' ? 4 : 2;

        this.payOrder({ payType: payType, network: this.payRadio, phone: phone, phonePrefix: phonePrefix, sourceType: 4, orderIds: JSON.parse(this.$route.query.orderIds).orderIds });
        return false;
      }

      // 买家充值
      buyerRecharge({ amount: parseFloat(this.$route.query.amount), msisdn: phone, network: this.payRadio, type: this.$route.query.type }).then(res => {
        if (res.code != 0) return false;
        if (this.$route.query.payWay == 'Brij') {
          // refNo = res.data.brijPayInfo.transactionId;
          // this.onBrijPay({ ...res.data.brijPayInfo, phone: params.phone, phonePrefix: params.phonePrefix, orderId: JSON.stringify({orderId: res.data.orderIds}), iconUrl: JSON.stringify({ iconUrl: iconUrl })});
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
      }).catch(error => {
        console.log(error);
      })
    },
    onChangePayment(item) { // 选择支付方式
      this.payRadio = item.id;
    },
    payOrder(params) { // 订单支付 payType: 1余额支付 2UniwalletPay 0系统支付 3tingg支付 4brij支付, sourceType订单来源4->h5
      // 加载图标
      this.$toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      });

      payOrder(params).then(res => {
        if (res.code != 0) return false;

        // 获取当前支付方式名字
        let iconUrl = this.brijData.filter(item => {
          return item.id === this.payRadio;
        })[0].iconUrl;

        let refNo = res.data.refNo;
        if (this.$route.query.payWay == 'Brij') {
          refNo = res.data.brijPayInfo.transactionId;
          this.onBrijPay({ ...res.data.brijPayInfo, phone: params.phone, phonePrefix: params.phonePrefix, orderId: JSON.stringify({orderId: res.data.orderIds}), iconUrl: JSON.stringify({ iconUrl: iconUrl })});
          return false;
        }
        
        // 第三方支付 需要先跳转到收银台
        this.$router.push({
          name: 'me-pay-wait',
          query: {
            network: 'payWay',
            phone: params.phonePrefix + '' + params.phone,
            amount: this.$route.query.amount,
            refNo: refNo,
            orderId: JSON.stringify({ orderId: res.data.orderIds }),
            iconUrl: JSON.stringify({ iconUrl: iconUrl })
          }
        })
        this.$toast.clear();
      }).catch(() => {
        this.$toast.clear();
      })
    },
    onBrijPay(params) { // brij支付
      payBrij({
        amount: params.amount,
        currency: this.$store.state.rate.payParamObj.currencyCode || 'GHS',
        paymentDetails: { momo_number: params.phonePrefix.split('+')[1] + '' + params.phone },
        paymentMethodId: this.payRadio,
        transactionId: params.transactionId
      }).then(res => {
        if (res.code != 0) {
          // 支付失败
          this.$dialog.confirm({
            title: this.$t('payment_failed'),
            message: this.$t('order_payment_failed_tips'),
            confirmButtonText: this.$t('pay_again')
          }).then(() => { // 失败，重试
            this.onPay();
          })
          return false;
        }

        this.$router.push({
          name: 'me-pay-wait',
          query: {
            network: 'payWay',
            phone: params.phonePrefix + '' + params.phone,
            amount: res.data.amount,
            refNo: res.data.transactionId,
            orderId: params.orderId,
            iconUrl: params.iconUrl
          }
        })
        this.$toast.clear();
      })
    },
    getBrijPayments() { // 获取brij所有支付方式
      this.$toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      });
      const currencyCode = this.$store.state.rate.payParamObj.currencyCode || 'GHS';
      getBrijPayments(currencyCode).then(res => {
        this.brijData = res.data.map(item => {
          return {
            ...item,
            phone: '',
            prefixCode: this.$route.query.phonePrefix && item.id == this.$route.query.paymentWay ? this.$route.query.phonePrefix : this.$t('prefix_tip')
          }
        });
        this.$toast.clear();
      }).catch(error => {
        console.log(error);
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
<template>
  <!-- 我的-订单-待付款-支付页面 -->
  <div class="bg-grey vh-100">
    <BmHeaderNav :left="{ isShow: true, isEmit: true }" :title="$t('payment')" @leftClick="leftClick" />

    <!-- 选择-单选 -->
    <van-radio-group v-model="payRadio" v-if="list.length > 0">
      <van-cell-group v-for="(item, index) in list" :key="index" class="bg-white">
        <van-cell :title="item.label" title-class="ml-12" class="ptb-20" clickable @click="payRadio = item.label" :border="false">
          <!-- 左侧图标 -->
          <template #icon>
            <BmImage
              :url="require('@/assets/images/icon/'+ (item.label) +'.png')"
              :width="'0.48rem'" 
              :height="'0.48rem'"
              :isLazy="false"
              :isShow="false"
              :alt="'TospinoMall ' + item.label + ' icon'"
            />
          </template>
          <!-- 右侧图标-单选图标 -->
          <template #right-icon>
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
          v-if="item.label != 'balance'"
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
      payRadio: 100,
      list: [],
      phonePrefixs: [],
      isBackDialog: false,
      balanceShow: false,
      payPwd: ''
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
  activated() {
    // if (this.$route.query.phonePrefix && this.list.length > 0) { // 从选择电话的页面回跳回来的
    //   this.list = this.list.map(item => {
    //     return {
    //       ...item,
    //       prefixCode: this.$route.query.phonePrefix && item.label == this.$route.query.paymentWay ? this.$route.query.phonePrefix : item.prefixCode
    //     }
    //   });
    //   return false;
    // }
    // this.$toast.loading({
    //   forbidClick: true,
    //   loadingType: 'spinner',
    //   duration: 0
    // });
    this.list = [];
    if (this.payRadio == 100) {
      this.balanceShow = false;
    }
    // getAvailable().then(res => {
    //   this.$toast.clear();
    //   if (!res.data) return false;

    //   this.list = res.data.map(item => {
    //     return {
    //       label: item,
    //       phone: '',
    //       prefixCode: this.$route.query.phonePrefix && item == this.$route.query.paymentWay ? this.$route.query.phonePrefix : this.$t('prefix_tip')
    //     }
    //   });

      if (this.$route.query.type == 'order') { // 说明是从订单结算页面跳转过来的，支付方式就有余额
        this.list.push({
          label: 'balance',
          phone: ''
        });
      }
    // }).catch(() => { // 接口报错，又是订单结算页面跳过来的话，要先展示余额
    //   if (this.$route.query.type == 'order') { // 说明是从订单结算页面跳转过来的，支付方式就有余额
    //     this.list = [{
    //       label: 'balance',
    //       phone: ''
    //     }];
    //   }
    // })
  },
  methods: {
    onPay() { // 提交支付,成功跳转到确认订单页面
      if (this.payRadio == 100) {
        return false;
      }
      if (this.payRadio == 'balance') { // 余额支付
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
        this.$toast.clear();

        if (this.payRadio === 'balance') { // 余额支付，直接跳转到支付订单结果页
          this.$router.push({ // 校验之后成功跳转到订单支付结果页面
            name: 'cart-order-confirm',
            query: {
              orderId: JSON.stringify({orderId: res.data.orderIds}),
              isSuccess: 1
            }
          })
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
</style>
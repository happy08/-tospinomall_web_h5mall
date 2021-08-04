<template>
  <!-- 我的-订单-待付款-支付页面 -->
  <div class="bg-grey vh-100">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.pay.payment')" @leftClick="leftClick" />

    <!-- 选择-单选 -->
    <van-radio-group v-model="payRadio" v-if="list.length > 0">
      <van-cell-group v-for="(item, index) in list" :key="index" class="bg-white">
        <van-cell :title="item" title-class="ml-12" class="ptb-20" clickable @click="payRadio = item" :border="false">
          <!-- 左侧图标 -->
          <template #icon>
            <BmImage
              :url="require('@/assets/images/icon/'+ item +'.png')"
              :width="'0.48rem'" 
              :height="'0.48rem'"
              :isLazy="false"
              :isShow="false"
            />
          </template>
          <!-- 右侧图标-单选图标 -->
          <template #right-icon>
            <van-radio :name="item" icon-size="0.48rem">
              <template #icon="props">
                <BmImage
                  :url="props.checked ? require('@/assets/images/icon/choose-icon.png') : require('@/assets/images/icon/choose-default-icon.png')"
                  :width="'0.32rem'" 
                  :height="'0.32rem'"
                  :isLazy="false"
                  :isShow="false"
                />
              </template>
            </van-radio>
          </template>
        </van-cell>
        <!-- 支持输入手机号 -->
        <van-field
          v-model="account"
          :placeholder="$t('me.pay.prefPlaceholder')"
          :class="{'field-container phone-code-field pt-0 pb-20': true, 'is-active': payRadio == item}"
          type="tel"
          v-if="item != 'balance'"
        >
          <template #label>
            <span @click="showPicker = true" class="iblock fs-14 black lh-20 pl-4">
              {{ prefixCode }}
              <img class="prefix-container--icon" src="@/assets/images/triangle-icon.png">
            </span>
          </template>
        </van-field>
        <!-- 手机前缀选择 -->
        <van-popup v-model="showPicker" round position="bottom">
          <van-picker
            show-toolbar
            :columns="phonePrefixs"
            value-key="phonePrefix"
            @cancel="showPicker = false"
            @confirm="onConfirm"
          />
        </van-popup>
      </van-cell-group>
    </van-radio-group>

    <!-- 底部金额以及支付按钮 -->
    <div class="w-100 bg-white flex between pl-20 vcenter pay-content__btn">
      <div class="red fs-18 fw">{{ $store.state.rate.currency }}{{ $route.query.amount }}</div>
      <BmButton class="fs-16 round-0 pay-content__btn--pay" :disabled="account.length === 0 && payRadio !== 'balance'" @click="onPay">Pay</BmButton>
    </div>

    <!-- 余额支付点击支付按钮，需要输入支付密码 -->
    <van-popup v-model="balanceShow" position="bottom" class="w-100 pb-244" closeable close-icon-position="top-left" close-icon="arrow-left">
      <h3 class="black fs-16 tc mt-16">输入支付密码</h3>
      <!-- 密码输入框 -->
      <div class="plr-10 mt-20">
        <van-password-input
          :value="payPwd"
        />
      </div>
      
      <nuxt-link :to="{}" class="tc grey fs-12 block mtb-10">忘记密码</nuxt-link>
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
import { getPhonePrefix } from '@/api/login';
import { getAvailable, buyerRecharge, checkPayPwd } from '@/api/pay';

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
      showPicker: false,
      prefixCode: '',
      account: '',
      phonePrefixs: [],
      isBackDialog: false,
      balanceShow: false,
      payPwd: ''
    }
  },
  beforeRouteEnter(to, from, next) { // 从初始页面进入重置值为空
    next(vm => {
      if (from.name === 'me-wallet') {
        vm.payRadio = 100;
        vm.account = '';
        vm.isBackDialog = false;
      } else if (from.name === 'me-pay-wait') { // 从等待支付页面回来
        vm.isBackDialog = true;
      }
    });
  },
  activated() {
    this.getPhonePrefix();
    getAvailable().then(res => {
      if (res.code != 0) return false;

      this.list = res.data;

      if (this.$route.query.type == 'order') { // 说明是从订单结算页面跳转过来的，支付方式就有余额
        this.list.push('balance');
      }
    })
  },
  methods: {
    getPhonePrefix() {
      getPhonePrefix().then(res => {
        this.phonePrefixs = res.data;
        this.prefixCode = res.data[0].phonePrefix;
      })
    },
    onPay() { // 提交支付,成功跳转到确认订单页面
      if (this.payRadio == 'balance') { // 余额支付
        this.balanceShow = true;
        return false;
      }
      buyerRecharge({ amount: parseFloat(this.$route.query.amount), msisdn: this.account, network: this.payRadio, type: this.$route.query.type }).then(res => {
        if (res.code != 0) return false;
        this.$router.push({
          name: 'me-pay-wait',
          query: {
            network: this.payRadio,
            phone: this.account,
            amount: this.$route.query.amount
          }
        })
      })
    },
    onConfirm(event) { // 选择手机号前缀
      this.prefixCode = event.phonePrefix;
      this.showPicker = false;
    },
    leftClick() {
      if (!this.isBackDialog) {
        history.back();
        return false;
      }

      this.$dialog({
        title: 'Are you sure want to leave',
        message: 'This order will automatically be can-celed if not paid within 30 mins.',
        confirmButtonText: 'Reconsider',
        confirmButtonColor: '#42B7AE',
        showCancelButton: true,
        cancelButtonText: 'Leave',
        cancelButtonColor: '#383838'
      }).then(res => { // on confirm

      }).catch(() => { // on leave
        this.$router.go(-1);
      })
    },
    onInput() { // 密码按键时触发
      if (this.payPwd.length >= 5) {
        setTimeout(() => {
          // 加载图标
          this.$toast.loading({
            forbidClick: true,
            loadingType: 'spinner',
            duration: 0
          });
          checkPayPwd(this.payPwd).then(res => { // 余额支付判断支付密码是否正确
            if (res.code != 0) return false;

            if (!res.data) {
              this.$toast.fail('支付密码错误');
              return false;
            }

            this.$router.push({ // 校验之后成功跳转到订单支付结果页面
              name: 'cart-order-confirm',
              query: {
                orderId: this.$route.query.orderId
              }
            })
          })
        }, 100);
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
</style>
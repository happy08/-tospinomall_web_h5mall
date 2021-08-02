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
      <BmButton class="fs-16 round-0 pay-content__btn--pay" :disabled="account.length === 0" @click="onPay">Pay</BmButton>
    </div>
     
  </div>
</template>

<script>
import { RadioGroup, Radio, Cell, CellGroup, Field, Popup, Picker } from 'vant';
import { getPhonePrefix } from '@/api/login';
import { getAvailable, buyerRecharge } from '@/api/pay';

export default {
  middleware: 'authenticated',
  components: {
    vanRadioGroup: RadioGroup,
    vanRadio: Radio,
    vanCell: Cell,
    vanCellGroup: CellGroup,
    vanField: Field,
    vanPopup: Popup,
    vanPicker: Picker
  },
  data() {
    return {
      payRadio: 100,
      list: [],
      showPicker: false,
      prefixCode: '',
      account: '',
      phonePrefixs: [],
      isBackDialog: false
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
</style>
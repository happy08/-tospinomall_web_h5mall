<template>
  <!-- 我的-订单-待付款-支付页面 -->
  <div class="bg-grey vh-100">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.order.checkoutCounter')" />

    <!-- 选择-单选 -->
    <van-radio-group v-model="payRadio">
      <van-cell-group v-for="(item, index) in list" :key="index" class="bg-white">
        <van-cell title="Slydepay" title-class="ml-12" class="ptb-20" clickable @click="payRadio = index" :border="false">
          <!-- 左侧图标 -->
          <template #icon>
            <BmImage
              :url="require('@/assets/images/icon/choose-icon.svg')"
              :width="'0.48rem'" 
              :height="'0.48rem'"
              :isLazy="false"
              :isShow="false"
            ></BmImage>
          </template>
          <!-- 右侧图标-单选图标 -->
          <template #right-icon>
            <van-radio :name="index" icon-size="0.48rem">
              <template #icon="props">
                <BmImage
                  :url="props.checked ? require('@/assets/images/icon/choose-icon.svg') : require('@/assets/images/icon/choose-default-icon.svg')"
                  :width="'0.48rem'" 
                  :height="'0.48rem'"
                  :isLazy="false"
                  :isShow="false"
                ></BmImage>
              </template>
            </van-radio>
          </template>
        </van-cell>
        <!-- 支持输入手机号 -->
        <van-field
          v-if="item.isMobile"
          v-model="account"
          :placeholder="$t('login.phoneNumber')"
          class="phone-code-field pt-0 pb-20 plr-20"
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
      <div class="red fs-18 fw">{{ $store.state.rate.currency }}1172.00</div>
      <BmButton class="fs-16 round-0 pay-content__btn--pay" @click="onPay">Pay</BmButton>
    </div>
     
  </div>
</template>

<script>
import { RadioGroup, Radio, Cell, CellGroup, Field, Popup, Picker } from 'vant';
import { getPhonePrefix } from '@/api/login';

export default {
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
      payRadio: 0,
      list: [
        {
        },
        {
        },
        {
          isMobile: true
        },
        {}
      ],
      showPicker: false,
      prefixCode: '',
      account: '',
      phonePrefixs: []
    }
  },
  created() {
    this.getPhonePrefix();
  },
  methods: {
    getPhonePrefix() {
      getPhonePrefix().then(res => {
        this.phonePrefixs = res.data;
        this.prefixCode = res.data[0].phonePrefix;
      })
    },
    onPay() { // 提交支付,成功跳转到确认订单页面
      this.$router.push({
        name: 'me-pay-wait' // name: 'cart-order-confirm'
      })
    },
    onConfirm(event) { // 选择手机号前缀
      this.prefixCode = event.phonePrefix;
      this.showPicker = false;
    },
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
</style>
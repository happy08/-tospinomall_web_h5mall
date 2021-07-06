<template>
  <!-- 我的-订单-待付款-支付页面 -->
  <div class="bg-grey vh-100">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.order.checkoutCounter')" />

    <!-- 选择-单选 -->
    <van-radio-group v-model="payRadio">
      <van-cell-group>
        <van-cell title="Slydepay" title-class="ml-12" class="ptb-20" clickable @click="payRadio = index" v-for="(item, index) in 7" :key="index">
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
      </van-cell-group>
    </van-radio-group>

    <!-- 底部金额以及支付按钮 -->
    <div class="w-100 bg-white flex between pl-20 vcenter pay-content__btn">
      <div class="red fs-18 fw">{{ $store.state.rate.currency }}1172.00</div>
      <BmButton class="fs-16 round-0 pay-content__btn--pay" @click="onConfirm">Pay</BmButton>
    </div>
     
  </div>
</template>

<script>
import { RadioGroup, Radio, Cell, CellGroup, Popup } from 'vant';

export default {
  components: {
    vanRadioGroup: RadioGroup,
    vanRadio: Radio,
    vanCell: Cell,
    vanCellGroup: CellGroup,
    vanPopup: Popup
  },
  data() {
    return {
      payRadio: 0
    }
  },
  methods: {
    onConfirm() { // 提交支付

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
</style>
<template>
  <!-- 购物车-确认订单 -->
  <div class="vh-100 bg-grey pb-68 pb-46">
    <BmHeaderNav :left="{ isShow: true }" :fixed="true" title="Confirm the Order" />

    <!-- 个人信息 -->
    <div class="bg-white">
      <van-cell :label="address.completeAddress" is-link :to="{ name: 'me-address' }" title-class="fs-14 black" label-class="fs-14 light-grey" class="pt-20 pl-20 pr-14 pb-30" :border="false" >
        <template #title>
          {{ address.name }} {{ address.phonePrefix }}-{{ address.phone }}
        </template>
      </van-cell>
      <BmImage
        :url="require('@/assets/images/line-icon.svg')"
        :height="'0.1rem'"
        :isLazy="false"
        :isShow="false"
        class="block"
      />
    </div>

    <!-- 订单商品列表 -->
    <div class="mt-12 bg-white plr-20 pb">
      <div v-for="(item, index) in detail.storeSaleInfoList" :key="'store-' + index">
        <OrderStoreSingle class="pt-20" :name="item.storeName" :showArrow="false" />
        <div v-for="(productItem, productIndex) in item.deliveryTypeSkuItemMap.skuItemVoList" :key="'product-item-' + productIndex">
          <van-card
            :title="productItem.goodTitle"
            class="bg-white pt-24 plr-0 pb-0 custom-card lh-20 width-313"
            :thumb="productItem.image"
            @click="goProductDetail(singleItem.id)"
            
            :num="productItem.step"
          >
            <!-- 自定义描述区域，改为展示商品型号 -->
            <template #desc>
              <div class="bg-f8 pl-10 mt-8 round-4 flex vcenter pr-10 fit-width">
                <span class="grey pr-24">{{ productItem.skuAttr.join(' ') }}</span>
                <!-- <van-icon name="arrow-down" color="#B6B6B6" size="0.16rem" /> -->
              </div>
            </template>
            <!-- 自定义数量 -->
            <!-- <template #num>
              <van-stepper v-model="productItem.step" input-width="0.796rem" button-size="0.42rem" :integer="true" class="mt-6 custom-stepper" />
            </template> -->
            <!-- 自定义价格 -->
            <template #price>
              <div>
                <span class="red fs-16 fw">{{ $store.state.rate.currency }}{{ productItem.price }}</span>
                <!-- <span class="grey fs-12 ml-10 line-through">{{ $store.state.rate.currency }}{{ productItem.cost }}</span> -->
              </div>
            </template>
          </van-card>

          <!-- 配送 -->
          <van-cell-group>
            <van-cell title="Distribution" class="plr-0" title-class="color-black-85" value-class="flex-2" is-link center @click="onChangeDelivery(item.deliveryTypeSkuItemMap.sendTypeEstimateVoList, item.deliveryTypeSkuItemMap.choiceSendType, item.storeId)">
              <template #default>
                <div class="fs-14 light-grey lh-12">
                  {{ item.deliveryTypeSkuItemMap.sendTypeEstimateVoList[item.deliveryTypeSkuItemMap.choiceSendType - 1].sendType | deliveryFormat }}<br />
                  <p class="hidden-1">{{ item.deliveryTypeSkuItemMap.sendTypeEstimateVoList[item.deliveryTypeSkuItemMap.choiceSendType - 1].estimeate }}</p>
                </div>
              </template>
            </van-cell>
            <!-- 留言 -->
            <van-field class="plr-0" v-model="productItem.message" label="Leave message" input-align="right" label-class="fs-14 color-black-85" label-width="2rem" />
          </van-cell-group>
        </div>
        
      </div>
    </div>

    
    <!-- 合计 -->
    <van-cell-group>
      <!-- 小计 -->
      <van-cell title="Subtotal" :value="$store.state.rate.currency + detail.totalProductAmount" title-class="color-black-85" value-class="color-black-85" />
      <!-- 运费 -->
      <van-cell title="Total Freight" :value="$store.state.rate.currency + detail.totalBuyerFreightAmount" title-class="color-black-85" value-class="color-black-85" />
      <!-- 总计 -->
      <van-cell >
        <template #default>
          <div class="color-black-85 tr">
            Total: <span class="red">{{ $store.state.rate.currency }}{{ detail.totalPayAmount }}</span>
          </div>
        </template>
      </van-cell>
      <!-- 支付方式 -->
      <van-cell title="Pay(by)" value="Online" title-class="color-black-85" value-class="color-black-85" is-link @click="onChangePayment" />
    </van-cell-group>

    <!-- 提交 -->
    <div class="flex between vcenter pl-20 w-100 bg-white submit-container">
      <span class="fs-18 red fw">{{ $store.state.rate.currency }}{{ detail.totalPayAmount }}</span>
      <BmButton class="round-0 w-120 h-56" @click="goPay">{{ $t('common.submit') }}</BmButton>
    </div>

    <!-- 配送方式 -->
    <van-popup v-model="distributionShow" position="bottom" closeable class="pb-20">
      <h4 class="fs-18 black fw p-20 border-b">Method of distribution</h4>
      <!-- 选择方式 -->
      <van-radio-group v-model="distributionRadio">
        <van-radio :name="deliveryItem.sendType" shape="square" class="iblock lh-12 plr-24 mt-30" v-for="(deliveryItem, deliveyIndex) in deliveryList" :key="'delivery-item-' + deliveyIndex">
          <template #icon="props">
            <BmButton :type="'info'" :class="{ 'round-8 h-30': true, 'unchecked-radio': !props.checked ? true: false }">{{ deliveryItem.sendType | deliveryFormat }}</BmButton>
          </template>
          <p class="light-grey fs-14 mt-10">{{ deliveryItem.estimeate }}</p>
        </van-radio>
      </van-radio-group>

      <div class="mt-30 plr-20">
        <BmButton class="round-8 w-100 h-48" @click="onChangeDistribution">{{ $t('common.confirm') }}</BmButton>
      </div>
    </van-popup>

    <!-- 支付方式 -->
    <van-popup v-model="paymentShow" position="bottom" closeable class="pb-20">
      <h4 class="fs-18 black fw p-20 border-b">Method of payment</h4>
      <!-- 选择方式 -->
      <van-radio-group v-model="paymentRadio">
        <van-radio name="0" shape="square" class="iblock lh-12 plr-24 mt-30" >
          <template #icon="props">
            <BmButton :type="'info'" :class="{ 'round-8 h-30': true, 'unchecked-radio': !props.checked ? true: false }">Normal distribution</BmButton>
          </template>
          <p class="light-grey fs-14 mt-10">Estimated time of delivery: 9:00-21:00 on The 21st[Monday]</p>
        </van-radio>
        <van-radio name="1" shape="square" class="iblock lh-12 plr-24 mt-30" >
          <template #icon="props">
            <BmButton :type="'info'" :class="{ 'round-8 h-30': true, 'unchecked-radio': !props.checked ? true: false }">international direct mail</BmButton>
          </template>
          <p class="light-grey fs-14 mt-10">Estimated time of delivery: 9:00-21:00 on The 21st[Monday]</p>
        </van-radio>
      </van-radio-group>

      <div class="mt-30 plr-20">
        <BmButton class="round-8 w-100 h-48" @click="onChangePayment">{{ $t('common.confirm') }}</BmButton>
      </div>
    </van-popup>

    <!-- 合并付款 -->
    <!-- <van-popup v-model="consolidatedShow" position="bottom" closeable class="pb-20">
      <h4 class="fs-18 black fw p-20 border-b">Consolidated payment</h4>
      <van-cell title="COMELY SHOP" center :border="false" :value="$store.state.rate.currency + '49.00'" label="（ 1 item ）" title-class="color-black-85 fs-14" value-class="red fw fs-16" />
      <van-cell title="COMELY SHOP" center :border="false" :value="$store.state.rate.currency + '49.00'" label="（ 1 item ）" title-class="color-black-85 fs-14" value-class="red fw fs-16" />

      <div class="plr-12 flex between mt-40">
        <BmButton :type="'info'" class="fs-16 round-8 w-169 h-48 add-cart-btn" @click="onCancel">Cancel</BmButton>
        <BmButton class="fs-16 round-8 w-169 h-48" @click="goPay">Pay Now</BmButton>
      </div>
    </van-popup> -->
  </div>
</template>

<script>
import { Cell, CellGroup, Card, Stepper, Popup, RadioGroup, Radio, Field } from 'vant';
import OrderStoreSingle from '@/components/OrderStoreSingle';
import { getSaleInfo } from '@/api/cart';
import { getCurrentDefaultAddress } from '@/api/address';
import { submitOrder } from '@/api/order';

export default {
  components: {
    vanCell: Cell,
    vanCellGroup: CellGroup,
    vanCard: Card,
    vanStepper: Stepper,
    vanPopup: Popup,
    vanRadioGroup: RadioGroup,
    vanRadio: Radio,
    vanField: Field,
    OrderStoreSingle
  },
  data() {
    return {
      distributionShow: false,
      distributionRadio: '0',
      consolidatedShow: false,
      consolidatedRadio: '1',
      detail: {},
      address: {},
      deliveryList: [],
      paymentShow: false,
      paymentRadio: '0',
      confirmTransportModes: [], // 配送方式
      currentChangeModeStoreId: ''
    }
  },
  async activated() {
    // 获取默认地址
    const addressData = await getCurrentDefaultAddress();
    if (addressData.code != 0) return false;
    this.address = addressData.data;

    // 获取销售信息
    this.getSaleInfo();
  },
  filters: {
    deliveryFormat(type) {
      return type == 1 ? '空运' : type == 2 ? '海运' : type == 3 ? '陆运' : '';
    }
  },
  methods: {
    onPay() { // 去支付前要先进行二次确认
      this.consolidatedShow = true;
    },
    goPay() { // 去支付 sourceType 4-> H5
      let skuItems = []; // 商品信息
      let leaveMessages = []; // 留言信息
      this.detail.storeSaleInfoList.forEach(item => {
        item.deliveryTypeSkuItemMap.skuItemVoList.forEach(skuItem => {
          skuItems.push({
            count: skuItem.count,
            skuId: skuItem.sellerId
          })

          leaveMessages.push({
            leaveMessage: skuItem.message,
            storeId: item.storeId
          })
        })
      })
      console.log(skuItems)

      submitOrder({ addressId: this.address.id, sourceType: 4, skuItems: skuItems, isCart: this.$route.params.isCart ? 1 : 0, leaveMessages: leaveMessages }).then(res => {
        if (res.code != 0) return false;

        this.$router.push({
          name: 'me-pay-payment'
        })
      })
    },
    onChangeDistribution() { // 修改配送方式
      this.confirmTransportModes = this.confirmTransportModes.map(item => {
        return {
          ...item,
          sendType: this.currentChangeModeStoreId == item.storeId ? this.distributionRadio : item.sendType
        }
      })

      let modes = this.confirmTransportModes.map(item => {
        return item.sendType;
      })
      // 确认修改配送方式之后重新获取信息
      this.getSaleInfo(modes);
      this.distributionShow = false;
    },
    onCancel() { // 取消支付

    },
    onChangeDelivery(deliveryArray, chooseType, storeId) { // 打开配送方式列表
      this.distributionShow = true;
      this.deliveryList = deliveryArray;
      this.distributionRadio = chooseType;
      this.currentChangeModeStoreId = storeId;
    },
    getSaleInfo(confirmTransportModes) { // 获取销售信息
      let skuItems = JSON.parse(this.$route.params.id).skuItems.map(item => { // 数据格式化
        return {
          ...item,
          count: item.quantity
        }
      });
      getSaleInfo({ skuItems: skuItems, addressId: this.address.id, confirmTransportModes: confirmTransportModes ? confirmTransportModes : [] }).then(res => {
        if (res.code != 0) return false;
        
        this.detail = {
          ...res.data,
          storeSaleInfoList: res.data.storeSaleInfoList.map(item => {
            return {
              ...item,
              deliveryTypeSkuItemMap: {
                ...Object.values(item.deliveryTypeSkuItemMap)[0],
                skuItemVoList: Object.values(item.deliveryTypeSkuItemMap)[0].skuItemVoList.map(skuItem => {
                  return {
                    ...skuItem,
                    message: ''
                  }
                })
              }
            }
          })
        };

        this.confirmTransportModes = res.data.storeSaleInfoList.map(item => {
          return {
            storeId: item.storeId,
            sendType: Object.values(item.deliveryTypeSkuItemMap)[0].sendTypeEstimateVoList[Object.values(item.deliveryTypeSkuItemMap)[0].choiceSendType - 1].sendType
          }
        })
      })
    },
    onChangePayment() { // 选择支付方式
      if (this.detail.isCashDelivery == 1) { // 支持货到付款，才可以选择付款方式
        this.paymentShow = true
      }
    },
    onConfirmPayment() { // 确认修改支付方式
      this.paymentShow = false;
    }
  },
}
</script>

<style lang="less" scoped>
.pb-68{
  padding-bottom: 68px;
}
.submit-container{
  position: fixed;
  bottom: 0;
  left: 0;
  height: 56px;
}
.h-56{
  height: 56px!important;
}
.w-120{
  width: 120px;
}
.pb-46{
  padding-top: 46px;
}
.h-30{
  height: 30px!important;
}
.plr-24{
  padding-left: 24px;
}
.unchecked-radio{
  border-color: #BFBFBF!important;
  background: #fff!important;
  color: #383838!important;
}
.add-cart-btn{
  border-color: #E5E5E5!important;
  background-color: rgba(255, 118, 18, 0.05)!important;
  color: #EC500D!important;
}
.h-48{
  height: 48px!important;
}
.w-169{
  width: 169px!important;
}
.mt-40{
  margin-top: 40px;
}
</style>

<style lang="less">
.color-black-85{
  color: rgba(0, 0, 0, .85)!important;
}
.flex-2{
  flex: 2!important;
}
</style>
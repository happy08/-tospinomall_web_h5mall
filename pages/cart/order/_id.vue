<template>
  <!-- 购物车-确认订单 -->
  <div class="v-percent-100 bg-grey pb-68 pb-46" v-if="detail.storeSaleInfoList">
    <BmHeaderNav :left="{ isShow: true, isEmit: true }" :fixed="true" :title="$t('confirm_the_order')" @leftClick="leftClick" />
    
    <div v-if="codeData.code == 0">
      <!-- 个人信息 -->
      <div class="bg-white">
        <van-cell :label="address.completeAddress" is-link :to="{ name: 'me-address', query: { back: 'car-order-id', cartOrderId: this.$route.params.id, otherQuery: $route.query } }" title-class="fs-14 black word-break" label-class="fs-14 light-grey" class="pt-20 pl-20 pr-14 pb-30" :border="false" >
          <template #title>
            {{ address.name }} {{ address.phonePrefix }}-{{ address.phone }}
          </template>
        </van-cell>
        <BmImage
          :url="require('@/assets/images/line-icon.png')"
          :height="'0.1rem'"
          :isLazy="false"
          :isShow="false"
          class="block"
          :alt="'TospinoMall line icon'"
        />
      </div>

      <!-- 订单商品列表 -->
      <div class="mt-12">
        <div v-for="(item, index) in detail.storeSaleInfoList" :key="'store-' + index">
          <div class="plr-20 bg-white">
            <OrderStoreSingle class="pt-20" :name="item.storeName" :showArrow="false" />
            <div v-for="(productMapItem, productMapIndex) in item.deliveryTypeSkuItemMap" :key="'product-map-item-' + productMapIndex">
              <van-card
                :title="productItem.goodTitle"
                class="bg-white pt-24 plr-0 pb-0 custom-card lh-20 width-313"
                :thumb="productItem.image | imageFormat"
                @click="goProductDetail(singleItem.id)"
                v-for="(productItem, productIndex) in productMapItem.skuItemVoList" :key="'product-item-' + productIndex"
                :num="productItem.count"
              >
                <!-- 自定义描述区域，改为展示商品型号 -->
                <template #desc>
                  <div class="bg-f8 mt-8 round-4 flex vcenter pr-10 fit-width">
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

              <div class="border-b mt-20 w-80 fr"></div>
              <!-- 配送 -->
              <van-cell :title="$t('distribution')" class="plr-0 ptb-12" title-class="color-black-85" value-class="flex-2" is-link center @click="onChangeDelivery(productMapItem.sendTypeEstimateVoList, productMapItem.choiceSendType, item.storeId)">
                <template #default>
                  <div class="fs-14 light-grey lh-12" v-if="productMapItem.sendTypeEstimateVoList.length">
                    {{ deliveryFormat(productMapItem, 'list') }}<br />
                    <p class="hidden-1">{{ deliveryFormat(productMapItem, 'estimeate') }}</p>
                  </div>
                </template>
              </van-cell>
            </div>
            
          </div>
          <!-- 留言 -->
          <van-field class="plr-20 mt-12 mb-12" v-model="item.message" :label="$t('leave_message')" input-align="right" label-class="fs-14 w-auto  color-black-85" maxlength="255" />
        </div>
      </div>

      
      <!-- 合计 -->
      <van-cell-group>
        <!-- 小计 -->
        <van-cell :title="$t('subtotal')" :value="$store.state.rate.currency + detail.totalProductAmount" title-class="color-black-85" value-class="color-black-85" />
        <!-- 运费 -->
        <van-cell :title="$t('total_freight')" :value="$store.state.rate.currency + detail.totalBuyerFreightAmount" title-class="color-black-85" value-class="color-black-85" :border="false" />
        <!-- 总计 -->
        <van-cell :border="false">
          <template #default>
            <div class="color-black-85 tr">
              {{ $t('total') }}<span class="red">{{ $store.state.rate.currency }}{{ detail.totalPayAmount }}</span>
            </div>
          </template>
        </van-cell>
        <!-- 支付方式 -->
        <van-cell :title="$t('pay_by')" :value="paymentRadio == 2 ? $t('cash_on_delivery') : $t('online')" title-class="color-black-85" value-class="color-black-85" is-link @click="onChangePayment" />
      </van-cell-group>

      <!-- 提交 -->
      <div class="flex between vcenter pl-20 w-100 bg-white submit-container">
        <span class="fs-18 red fw">{{ $store.state.rate.currency }}{{ detail.totalPayAmount }}</span>
        <BmButton class="round-0 w-120 h-56" @click="goPay">{{ $t('submit') }}</BmButton>
      </div>
    </div>

    <div v-else>
      <empty-status :image="require('@/assets/images/empty/network-error.png')" />
      <p class="fs-12 green tc">{{ codeData.msg }}</p>
    </div>

    <!-- 配送方式 -->
    <van-popup v-model="distributionShow" position="bottom" closeable class="pb-20">
      <h4 class="fs-18 black fw p-20 border-b">{{ $t('distribution') }}</h4>
      <!-- 选择方式 -->
      <van-radio-group v-model="distributionRadio">
        <van-radio :name="deliveryItem.sendType" shape="square" class="iblock lh-12 plr-24 mt-30" v-for="(deliveryItem, deliveyIndex) in deliveryList" :key="'delivery-item-' + deliveyIndex">
          <template #icon="props">
            <BmButton :type="'info'" :class="{ 'round-8 h-30': true, 'unchecked-radio': !props.checked ? true: false }">{{ deliveryFormat(deliveryItem.sendType, 'type') }}</BmButton>
          </template>
          <p class="light-grey fs-14 mt-10">{{ deliveryItem.estimeate }}</p>
        </van-radio>
      </van-radio-group>

      <div class="mt-30 plr-20">
        <BmButton class="round-8 w-100 h-48" @click="onChangeDistribution">{{ $t('confirm') }}</BmButton>
      </div>
    </van-popup>

    <!-- 支付方式 -->
    <van-popup v-model="paymentShow" position="bottom" closeable class="pb-20">
      <h4 class="fs-18 black fw p-20 border-b">{{ $t('method_of_payment') }}</h4>
      <!-- 选择方式 -->
      <van-radio-group v-model="paymentRadio" class="mt-30 plr-24">
        <van-radio name="1" shape="square" class="iblock lh-12 h-48" >
          <template #icon="props">
            <BmButton :type="'info'" :class="{ 'round-8 h-30': true, 'unchecked-radio': !props.checked ? true: false }">{{ $t('online') }}</BmButton>
          </template>
          <!-- <p class="light-grey fs-14 mt-10">Estimated time of delivery: 9:00-21:00 on The 21st[Monday]</p> -->
        </van-radio>
        <van-radio name="2" shape="square" class="iblock lh-12 pl-12 h-48" >
          <template #icon="props">
            <BmButton :type="'info'" :class="{ 'round-8 h-30': true, 'unchecked-radio': !props.checked ? true: false }">{{ $t('cash_on_delivery') }}</BmButton>
          </template>
          <!-- <p class="light-grey fs-14 mt-10">Estimated time of delivery: 9:00-21:00 on The 21st[Monday]</p> -->
        </van-radio>
      </van-radio-group>

      <div class="plr-20 mt-30">
        <BmButton class="round-8 w-100 h-48" @click="onConfirmPayment">{{ $t('confirm') }}</BmButton>
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
import EmptyStatus from '@/components/EmptyStatus';
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
    OrderStoreSingle,
    EmptyStatus
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
      paymentRadio: '1',
      confirmTransportModes: [], // 配送方式
      currentChangeModeStoreId: '',
      codeData: {
        code: 0
      },
      messageList: []
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.name == 'cart' || from.name == 'product-id' || from.name == 'me-order' || from.name == 'me-order-rate-detail-id') {
        vm.paymentRadio = '1';
      }
    })
  },
  async activated() {
    // 获取默认地址
    if (this.$route.query.address) { // 如果是从地址管理页面回跳回来的
      this.address = JSON.parse(this.$route.query.address);
    } else {
      const addressData = await getCurrentDefaultAddress();
      if (addressData.code != 0) return false;

      if (!addressData.data) { // 还没有设置地址
        this.$dialog.confirm({
          message: this.$t('go_set_address'),
          confirmButtonText: this.$t('go_seeting'),
          confirmButtonColor: '#42B7AE',
          cancelButtonText: this.$t('cancel'),
          cancelButtonColor: '#383838'
        }).then(() => {
          this.$router.push({
            name: 'me-address'
          })
        }).catch(() => {
          this.$router.go(-1);
        })
        return false;
      }
      this.address = {
        ...addressData.data,
        completeAddress: addressData.data.completeAddressDetail
      };
    }

    // 获取销售信息
    this.getSaleInfo();
  },
  filters: {
    imageFormat(image) {
      return image == '' ? require('@/assets/images/product-bgd-90.png') : image;
    }
  },
  methods: {
    deliveryFormat(item, type) {
      if (type == 'estimeate') {
        return item.sendTypeEstimateVoList.filter(sendItem => sendItem.sendType == item.choiceSendType).length > 0 ? item.sendTypeEstimateVoList.filter(sendItem => sendItem.sendType == item.choiceSendType)[0].estimeate : '';
      }
      let _type = '';
      if (type == 'list') {
        _type = item.sendTypeEstimateVoList.filter(sendItem => sendItem.sendType == item.choiceSendType).length > 0 ? item.sendTypeEstimateVoList.filter(sendItem => sendItem.sendType == item.choiceSendType)[0].sendType : '';
      } else {
        _type = item;
      }
      return _type == 1 ? this.$t('air_freight') : _type == 2 ? this.$t('sea_transportation') : _type == 3 ? this.$t('land_transportation') : '';
    },
    onPay() { // 去支付前要先进行二次确认
      this.consolidatedShow = true;
    },
    goPay() { // 去支付 sourceType 4-> H5
      let skuItems = []; // 商品信息
      let leaveMessages = []; // 留言信息
      this.detail.storeSaleInfoList.forEach(item => {
        leaveMessages.push({
          leaveMessage: item.message,
          storeId: item.storeId
        })
        item.deliveryTypeSkuItemMap.forEach(productMap => {
          productMap.skuItemVoList.forEach(skuItem => {
            skuItems.push({
              count: skuItem.count,
              skuId: skuItem.skuId
            })
          })
        })
      })

      // 运输方式
      let confirmTransportModes = this.confirmTransportModes.map(item => {
        return item.sendType;
      })

      this.$toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      });

      submitOrder({ addressId: this.address.id, sourceType: 4, skuItems: skuItems, isCart: this.$route.query.isCart ? 1 : 0, leaveMessages: leaveMessages, confirmTransportModes: confirmTransportModes, orderToken: this.detail.orderToken, paymentType: this.paymentRadio }).then(res => {
        this.$toast.clear();
        if (this.paymentRadio == 2) { // 货到付款
          this.$router.push({ // 校验之后成功跳转到订单支付结果页面
            name: 'cart-order-confirm',
            query: {
              orderId: JSON.stringify({orderId: res.data.orderIds}),
              isSuccess: 3
            }
          })
          return false;
        }
        this.$router.push({
          name: 'me-pay-payment',
          query: {
            type: 'order',
            amount: this.detail.totalPayAmount,
            orderIds: JSON.stringify({orderIds: res.data.orderIds}),
            comfirmOrder: 1
          }
        })
      }).catch(error => {
        this.$toast.fail(error.msg);
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
      // 修改之前先记录当前的留言信息
      this.messageList = this.detail.storeSaleInfoList.map(item => {
        return {
          storeId: item.storeId,
          message: item.message
        }
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
      // 加载图标
      this.$toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      });
      let skuItems = JSON.parse(this.$route.params.id).skuItems.map(item => { // 数据格式化
        return {
          skuId: item.skuId,
          count: item.quantity
        }
      });
      getSaleInfo({ skuItems: skuItems, addressId: this.address.id, confirmTransportModes: confirmTransportModes ? confirmTransportModes : [] }).then(res => {
        this.codeData = {
          code: res.code,
          msg: res.msg
        }
        
        this.$toast.clear();
        this.detail = {
          ...res.data,
          storeSaleInfoList: res.data.storeSaleInfoList.map(item => {
            return {
              ...item,
              deliveryTypeSkuItemMap: Object.values(item.deliveryTypeSkuItemMap),
              message: ''
              // deliveryTypeSkuItemMap: {
              //   ...Object.values(item.deliveryTypeSkuItemMap)[0],
              //   skuItemVoList: Object.values(item.deliveryTypeSkuItemMap)[0].skuItemVoList.map(skuItem => {
              //     return {
              //       ...skuItem,
              //       message: ''
              //     }
              //   })
              // }
            }
          })
        };
        this.messageList.forEach(item => {
          this.detail.storeSaleInfoList.forEach(storeItem => {
            if (item.storeId == storeItem.storeId) {
              storeItem.message = item.message;
            }
          })
        })
        
        this.confirmTransportModes = res.data.storeSaleInfoList.map(item => {
          let sendType = Object.values(item.deliveryTypeSkuItemMap)[0].sendTypeEstimateVoList.length > 0 ? Object.values(item.deliveryTypeSkuItemMap)[0].sendTypeEstimateVoList.filter(sendItem => sendItem.sendType === Object.values(item.deliveryTypeSkuItemMap)[0].choiceSendType) : [];
          return {
            storeId: item.storeId,
            sendType: sendType.length > 0 ? sendType[0].sendType : 0
          }
        })
        // 支付方式处理
        this.paymentRadio = '1';
      }).catch(error => {
        console.log(error)
        this.codeData = {
          code: error.code,
          msg: error.msg
        }
      })
    },
    onChangePayment() { // 选择支付方式
      if (this.detail.isCashDelivery == 1) { // 支持货到付款，才可以选择付款方式
        this.paymentShow = true;
      }
    },
    onConfirmPayment() { // 确认修改支付方式
      this.paymentShow = false;
    },
    leftClick() { // 回退页面
      if (this.$route.query.address) { // 说明是从地址管理页面回退回来的
        this.$router.go(-2);
        return false;
      }
      
      if(window.history.length < 2){ //解决部分机型拿不到history
        this.$router.replace('/');
      }else{
        history.back();
      }
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
.w-80{
  width: 80%;
}
</style>

<style lang="less">
.color-black-85{
  color: rgba(0, 0, 0, .85)!important;
}
.flex-2{
  flex: 2!important;
}
.w-auto{
  width: auto!important;
}
</style>
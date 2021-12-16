<template>
  <!-- 购物车-确认订单 -->
  <div class="v-percent-100 bg-grey pb-68 pb-46">
    <BmHeaderNav :left="{ isShow: true, isEmit: true }" :fixed="true" :title="$t('confirm_the_order')" @leftClick="leftClick" />

    <!-- 发生错误 -->
    <div v-if="codeData.code != 0" class="pt-60">
      <empty-status :image="require('@/assets/images/empty/network-error.png')" />
      <p class="fs-12 green tc">{{ codeData.msg }}</p>
    </div>
    <!-- 正常展示 -->
    <div v-else>
      <!-- 个人信息 -->
      <div class="bg-white">
        <van-cell is-link :to="{ name: 'me-address', query: { back: 'car-order-id', cartOrderId: this.$route.params.id, otherQuery: $route.query } }" title-class="fs-14 black word-break" label-class="fs-14 light-grey" class="pt-20 pl-20 pr-14 pb-30" :border="false" >
          <template #title>
            {{ detail.address.name }} {{ detail.address.phonePrefix }}-{{ detail.address.phone }}
          </template>
          <template #label>
            <div>{{ detail.address.completeAddress }}</div>
            <div v-if="detail.type == 3" class="red mt-10">{{ $t('no_support_send') }}</div>
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

      <!-- 支付方式 -->
      <van-cell-group class="mt-12">
        <van-cell :title="$t('payment_method')" title-class="color-black-85" />
        <van-radio-group v-model="paymentRadio">
          <van-cell-group>
            <!-- 货到付款 -->
            <van-cell :title="$t('cash_on_delivery')" :title-class="{'color-black-85': paymentRadio == '1', 'green': paymentRadio == '2'}" @click="onChangePayWay('2')">
              <!-- 右侧图标-单选图标 -->
              <template #right-icon>
                <van-radio name="2" icon-size="0.48rem" :disabled="detail.isCashDelivery != 1">
                  <template #icon="props">
                    <BmImage
                      :url="detail.isCashDelivery != 1 ? require('@/assets/images/icon/unchoose-icon.png') : props.checked ? require('@/assets/images/icon/choose-icon.png') : require('@/assets/images/icon/choose-default-icon.png')"
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
            <!-- 在线支付 -->
            <van-cell :title="$t('online')" :title-class="{'color-black-85': paymentRadio == '2', 'green': paymentRadio == '1'}"  clickable @click="onChangePayWay('1')" :border="false">
              <!-- 右侧图标-单选图标 -->
              <template #right-icon>
                <van-radio name="1" icon-size="0.48rem">
                  <template #icon="props">
                    <BmImage
                      :url="props.checked ? require('@/assets/images/icon/choose-icon.png') : require('@/assets/images/icon/choose-default-icon.png')"
                      :width="'0.32rem'" 
                      :height="'0.32rem'"
                      :isLazy="false"
                      :isShow="false"
                      :alt="'TospinoMall choose icon'"
                    ></BmImage>
                  </template>
                </van-radio>
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </van-cell-group>

      <!-- 订单商品列表 -->
      <div class="mt-12" v-for="(item, index) in detail.storeSaleInfoList" :key="'store-' + index">
        <div>
          
          <div v-for="(productMapItem, productMapIndex) in item.deliveryTypeSkuItemMap" :key="'product-map-item-' + productMapIndex" class="mt-12 bg-white">
            <OrderStoreSingle class="plr-20 pt-20" :name="item.storeName" :showArrow="false" />
            <van-card
              :title="productItem.goodTitle"
              class="bg-white pt-24 plr-20 pb-0 custom-card lh-20 width-313"
              :thumb="productItem.image | imageFormat"
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
            <van-cell :title="$t('distribution')" class="plr-20 ptb-12" title-class="color-black-85" value-class="flex-2" is-link center @click="onChangeDelivery(index, productMapIndex)">
              <template #default>
                <div class="fs-14 light-grey lh-12" v-if="productMapItem.sendTypeEstimateVoList.length">
                  {{ deliveryFormat(productMapItem, 'list') }}<br />
                  <p class="hidden-1">{{ deliveryFormat(productMapItem, 'estimeate') }}</p>
                </div>
              </template>
            </van-cell>

            <!-- 留言：按订单划分 -->
            <van-field class="plr-20 ptb-12" v-model="productMapItem.leaveMessage" :label="$t('leave_message')" input-align="right" label-class="fs-14 w-auto  color-black-85" maxlength="255" />
            <!-- 订单合计 -->
            <van-cell-group class="plr-0" :border="false">
              <!-- 小计 -->
              <van-cell :title="$t('subtotal')" :value="$store.state.rate.currency + productMapItem.productAmount" title-class="color-black-85" class="plr-20 ptb-12" value-class="color-black-85" />
              <!-- 运费 -->
              <van-cell :title="$t('total_freight')" :value="$store.state.rate.currency + productMapItem.sellerFreightAmount" title-class="color-black-85" class="plr-20 ptb-12" value-class="color-black-85" />
              <!-- 优惠券 -->
              <van-cell :title="$t('coupon')" class="plr-20 ptb-12" is-link title-class="color-black-85" value-class="color-black-85" :border="false" v-if="productMapItem.orderCouponsList && productMapItem.orderCouponsList.length > 0" @click="onChooseOrderCoupon(index, productMapIndex, productMapItem, item)">
                <template #default>
                  <!-- 优惠金额 -->
                  <span class="red" v-html="onDiscountPrice(productMapItem)"></span>
                </template>
              </van-cell>
              <!-- 总计 -->
              <van-cell :border="false" class="plr-20 ptb-12">
                <template #default>
                  <div class="color-black-85 tr">
                    {{ $t('total') }}<span class="red">{{ $store.state.rate.currency }}{{ productMapItem.payAmount }}</span>
                  </div>
                </template>
              </van-cell>
              <!-- 支付方式 -->
              <!-- <van-cell :title="$t('pay_by')" :value="paymentRadio == 2 ? $t('cash_on_delivery') : $t('online')" title-class="color-black-85" value-class="color-black-85" is-link @click="onChangePayment" /> -->
            </van-cell-group>
            
          </div>
        </div>

      </div>

      <!-- 提交 -->
      <div class="flex between vcenter pl-20 w-100 bg-white submit-container">
        <span class="fs-18 red fw">{{ $store.state.rate.currency }}{{ detail.totalPayAmount }}</span>
        <BmButton class="round-0 w-120 h-56" @click="goPay" :disabled="detail.type == 3">{{ $t('submit') }}</BmButton>
      </div>
    </div>

    <!-- 商品优惠券 -->
    <van-popup v-model="isCouponShow" v-if="isCouponShow" style="height: 80%" position="bottom" class="round-tlr-12 bg-white coupon-popup pt-20" :close-on-click-overlay="false" @click-overlay="onClickOverlay">
      <h3 class="black fs-18 pb-10 tc lh-20">{{ $t('coupon') }}</h3>
      <div class="container-absolute-height">
        <empty-status v-if="couponList.length === 0" :image="require('@/assets/images/empty/order.png')" :description="$t('empty')" />
        <coupon-order-single v-else v-for="(item, index) in couponList" :key="'good-coupon-' + index"  class="mb-10 mlr-10"  :item="item" @onReceive="item.isReceive = $event" :pageType="3" @onChoose="onChooseCoupon($event, index, item, 'store')"></coupon-order-single>
        <!-- 确认 -->
        <div class="plr-20 ptb-10 bg-white w-100 container-absolute-btn">
          <BmButton class="fs-16 round-8 w-100 h-48" @btnClick="onConfirmCoupon">{{ $t('confirm') }}</BmButton>
        </div>
      </div>
    </van-popup>

    <!-- 配送方式 -->
    <van-popup v-model="distributionShow" position="bottom" closeable class="pb-20" v-if="distributionShow">
      <h4 class="fs-18 black fw p-20 border-b">{{ $t('distribution') }}</h4>
      <!-- 选择方式 -->
      <van-radio-group v-model="distributionRadio">
        <van-radio :name="deliveryItem.sendType" shape="square" class="iblock lh-12 plr-24 mt-30" v-for="(deliveryItem, deliveyIndex) in detail.storeSaleInfoList[deliveryStoreIndex].deliveryTypeSkuItemMap[deliverySkuMapIndex].sendTypeEstimateVoList" :key="'delivery-item-' + deliveyIndex">
          <template #icon="props">
            <BmButton :type="'info'" :class="{ 'round-8 h-30': true, 'unchecked-radio': !props.checked ? true: false }">{{ deliveryFormat(deliveryItem.sendType, 'type') }}</BmButton>
          </template>
          <p class="light-grey fs-14 mt-10">{{ deliveryItem.estimeate }}</p>
        </van-radio>
      </van-radio-group>

      <div class="mt-30 plr-20">
        <BmButton class="round-8 w-100 h-48" @btnClick="onChangeDistribution">{{ $t('confirm') }}</BmButton>
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
import { Cell, CellGroup, Card, Stepper, Popup, RadioGroup, Radio, Field, Checkbox, CheckboxGroup } from 'vant';
import EmptyStatus from '@/components/EmptyStatus';
import { getSaleInfo } from '@/api/cart';
import { getCurrentDefaultAddress } from '@/api/address';
import OrderStoreSingle from '@/components/OrderStoreSingle';
import CouponScroll from '@/components/CouponScroll';
import { orderCalculation, submitOrder } from '@/api/order';

export default {
  middleware: 'authenticated',
  components: {
    vanCell: Cell,
    vanCellGroup: CellGroup,
    vanCard: Card,
    vanStepper: Stepper,
    vanPopup: Popup,
    vanRadioGroup: RadioGroup,
    vanRadio: Radio,
    vanField: Field,
    vanCheckbox: Checkbox,
    vanCheckboxGroup: CheckboxGroup,
    EmptyStatus,
    OrderStoreSingle,
    CouponScroll
  },
  data() {
    return {
      codeData: {},
      detail: {},
      address: {},
      paymentRadio: '1',
      couponList: [],
      isCouponShow: false,
      distributionShow: false,
      distributionRadio: 0,
      deliveryStoreIndex: 0,
      deliverySkuMapIndex: 0,
      couponPopupList: []

    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.name == 'cart' || from.name == 'product-id' || from.name == 'me-order' || from.name == 'me-order-rate-detail-id') {
        vm.paymentRadio = '1';
      }
    })
  },
  filters: {
    imageFormat(image) {
      return image == '' ? require('@/assets/images/product-bgd-90.png') : image;
    }
  },
  activated() {
    // 获取收货地址
    this.getCurrentDefaultAddress();
  },
  methods: {
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

      if (!this.detail.address) {
        return false;
      }

      getSaleInfo({ skuItems: skuItems, addressId: this.detail.address.id, confirmTransportModes: confirmTransportModes ? confirmTransportModes : [] }).then(res => {
        this.codeData = {
          code: res.code,
          msg: res.msg
        }
        
        this.detail = res.data;
        this.$toast.clear();
      }).catch(error => {
        console.log(error)
        this.codeData = {
          code: error.code,
          msg: error.msg
        }
      })
    },
    async getCurrentDefaultAddress() { // 获取收货地址
      // 获取默认地址
      if (this.$route.query.address) { // 如果是从地址管理页面回跳回来的
        this.detail.address = JSON.parse(this.$route.query.address);
      } else {
        const addressData = await getCurrentDefaultAddress();
        if (!addressData.data) { // 还没有设置地址
          this.$toast.clear();
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
        this.detail.address = {
          ...addressData.data,
          completeAddress: addressData.data.completeAddressDetail
        };
      }
      
      // 已经获取过数据就直接进行订单计算，否则获取销售信息
      if (this.detail.storeSaleInfoList) {
        this.orderCalculation();
      } else {
        // 获取销售信息
        this.getSaleInfo();
      }
    },
    leftClick() { // 页面回退
      if (this.$route.query.address) { // 说明是从地址管理页面回退回来的
        this.$router.go(-2);
        return false;
      }
      
      if(window.history.length < 2){ //解决部分机型拿不到history
        this.$router.replace('/');
      }else{
        history.back();
      }
    },
    deliveryFormat(item, type) { // 配送方式
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
    goPay() { // 提交订单
      // 加载图标
      this.$toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      });

      let params = {
        ...this.detail, 
        isCart: this.$route.query.isCart ? 1 : 0, // 是否购物车购买：0->不是 1->是；
        addressId: this.detail.address.id, 
        paymentType: this.paymentRadio, // 选择的支付类型：1->在线支付；2->货到付款；默认是在线支付
        sourceType: 3, // 订单来源：1->android，2->ios，3->h5 ,4->web商城,
      }
      submitOrder(params).then(res => {
        if (this.paymentRadio == 2) { // 货到付款
          this.$router.push({ // 校验之后成功跳转到订单支付结果页面
            name: 'cart-order-confirm',
            query: {
              orderId: JSON.stringify({orderId: res.data.orderIds}),
              isSuccess: 3
            }
          })
          this.$toast.clear();
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
        this.$toast.clear();
      }).catch(error => {
        console.log(error);
        this.$toast.fail(error.msg);
      })
    },
    onChooseOrderCoupon(index, productMapIndex, orderItem, storeItem) { // 打开优惠券选择弹窗
      let list = orderItem.orderCouponsList.map(couponItem => {
        return {
          ...couponItem,
          storeId: storeItem.storeId
        }
      })
      this.couponList = JSON.parse(JSON.stringify(list)); // 优惠券弹窗数据
      this.deliveryStoreIndex = index; // 店铺索引
      this.deliverySkuMapIndex = productMapIndex; // 店铺下订单索引
      this.isCouponShow = true;
    },
    onChooseCoupon(isSelected, couponIndex, item, type) { // 选择优惠券
      // 该订单内优惠券的选择
      if (type == 'store') {
        // 当前优惠券反选
        if (item.isSelected) {
          item.isSelected = 0;
        } else {
          item.isSelected = 1;
        }
        // 取消选中当前优惠券，其他优惠券的状态不变
        if (item.isSelected == 0) {
          return false;
        }
        // 当前订单下所有的优惠券
        // 平台券-取消其他[平台券,店铺券,商品券]选中
        if (["1", "2", "3", "4"].includes(item.discountType)) {
          this.couponList.forEach(cItem => {
            // 其他优惠券都要取消选中
            if (cItem.couponsId !== item.couponsId) {
              cItem.isSelected = 0;
            }
          })
        } else if (["5", "6", "7"].includes(item.discountType)) {
          // 店铺券-取消所有平台券/当前店铺相同券
          this.couponList.forEach(cItem => {
            // 取消平台券
            if (["1", "2", "3", "4"].includes(cItem.discountType)) {
              cItem.isSelected = 0;
            }
            // 同一个店铺只可选择一张店铺券
            if (cItem.couponsId !== item.couponsId && ["5", "6", "7"].includes(cItem.discountType)) {
              cItem.isSelected = 0;
            }
          })
        } else if (["8", "9"].includes(item.discountType)) {
          // 商品券-取消其他[平台券,商品券,店铺券]选中
          this.couponList.forEach(cItem => {
            // 取消平台券
            if (["1", "2", "3", "4"].includes(cItem.discountType)) {
              cItem.isSelected = 0;
            }
            // 同一个店铺只可选择一张商品券
            if (cItem.couponsId !== item.couponsId && ["8", "9"].includes(cItem.discountType)) {
              cItem.isSelected = 0;
            }
          })
          
        }
        return false;
      }
      console.log(isSelected, couponIndex, item)
      
      // 活动类型：1.平台新人满减券，2.平台新人立减券，3.平台客服满减券，4.平台客服立减券，5.店铺新人满减券，6.店铺新人立减券，7.店铺满减券，8.商品满减券，9.商品立减券
      if (["1", "2", "3", "4"].includes(item.discountType)) {
        // 平台券-取消其他[平台券,店铺券,商品券]选中
        this.detail.storeSaleInfoList.forEach((sItem) => {
          for (let i in sItem.deliveryTypeSkuItemMap) {
            sItem.deliveryTypeSkuItemMap[i].orderCouponsList.forEach((cItem) => {
              if (["1", "2", "3", "4"].includes(cItem.discountType)) {
                // 相同券&当前店铺&非当前订单（取消当前店铺非当前订单的相同券）
                if (cItem.couponsId === item.couponsId && sItem.storeId === item.storeId && this.deliverySkuMapIndex !== i) {
                  cItem.isSelected = 0;
                }
                // 相同券&非当前店铺（取消其他店铺的相同券）
                if (cItem.couponsId === item.couponsId && sItem.storeId !== item.storeId) {
                  cItem.isSelected = 0;
                }
                // 当前店铺&非当前券&当前订单（一个订单只能用一张平台券）
                if (sItem.storeId === item.storeId && cItem.couponsId !== item.couponsId && this.deliverySkuMapIndex === i) {
                  cItem.isSelected = 0;
                }
                // 
                // if (sItem.storeId !== item.storeId && cItem.couponsId === item.couponsId && this.deliverySkuMapIndex === i) {
                //   cItem.isSelected = 0;
                // }
              } else {
                // //相同券&非当前店铺（取消其他店铺的相同券）
                // if (cItem.couponsId === item.couponsId && sItem.storeId !== item.storeId && this.deliverySkuMapIndex !== i) {
                //   cItem.isSelected = 0;
                // }
                //当前店铺&非当前券&当前订单（一个订单只能用一张平台券）
                if (sItem.storeId === item.storeId && cItem.couponsId !== item.couponsId && this.deliverySkuMapIndex === i) {
                  cItem.isSelected = 0;
                }
                // 其他非平台券
                // cItem.isSelected = 0;
              }
            });
          }
        });
      } else if (["5", "6", "7"].includes(item.discountType)) {
        // 店铺券-取消所有平台券/当前店铺相同券
        this.detail.storeSaleInfoList.forEach((sItem) => {
          for (let i in sItem.deliveryTypeSkuItemMap) {
            sItem.deliveryTypeSkuItemMap[i].orderCouponsList.forEach((cItem) => {
              // 取消同订单下所有平台券
              if (["1", "2", "3", "4"].includes(cItem.discountType) && this.deliverySkuMapIndex === i) {
                cItem.isSelected = 0;
              }
              //当前店铺&相同券&非当前订单（同一张券只能用于一个订单）
              if (sItem.storeId === item.storeId && cItem.couponsId === item.couponsId && this.deliverySkuMapIndex !== i) {
                cItem.isSelected = 0;
              }
              //当前店铺$非当前券&当前订单&订单券（一个订单只能用一张店铺券）
              if (sItem.storeId === item.storeId && cItem.couponsId !== item.couponsId && this.deliverySkuMapIndex === i && ["5", "6", "7"].includes(item.discountType)) {
                cItem.isSelected = 0;
              }
            });
          }
        });
      } else if (["8", "9"].includes(item.discountType)) {
        // 商品券-取消其他[平台券,商品券,店铺券]选中
        this.detail.storeSaleInfoList.forEach((sItem) => {
          for (let i in sItem.deliveryTypeSkuItemMap) {
            sItem.deliveryTypeSkuItemMap[i].orderCouponsList.forEach((cItem) => {
              // 取消所有平台券
              if (["1", "2", "3", "4"].includes(cItem.discountType) && this.deliverySkuMapIndex === i) {
                cItem.isSelected = 0;
              }
              // 取消所有当前商品券
              if (sItem.storeId === item.storeId && cItem.couponsId === item.couponsId && this.deliverySkuMapIndex !== i) {
                cItem.isSelected = 0;
              }
              // 同一个店铺只可选择一张商品券
              if (sItem.storeId === item.storeId && cItem.couponsId !== item.couponsId && this.deliverySkuMapIndex === i && ["8", "9"].includes(cItem.discountType)) {
                cItem.isSelected = 0;
              }
            });
          }
        });
      }
    },
    onChangeDelivery(index, productMapIndex) { // 配送方式
      this.distributionShow = true;
      this.deliveryStoreIndex = index; // 店铺索引
      this.deliverySkuMapIndex = productMapIndex; // 店铺下订单索引
      this.distributionRadio = this.detail.storeSaleInfoList[this.deliveryStoreIndex].deliveryTypeSkuItemMap[this.deliverySkuMapIndex].choiceSendType;
      console.log(this.detail.storeSaleInfoList[index].deliveryTypeSkuItemMap[productMapIndex])
    },
    onChangeDistribution() { // 确认修改配送方式
      this.detail.storeSaleInfoList[this.deliveryStoreIndex].deliveryTypeSkuItemMap[this.deliverySkuMapIndex].choiceSendType = this.distributionRadio;
      this.distributionShow = false;
      this.orderCalculation();
    },
    orderCalculation() { // 订单计算
      this.$toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      });
      let params = {
        ...this.detail, 
        isCart: this.$route.query.isCart ? 1 : 0, // 是否购物车购买：0->不是 1->是；
        addressId: this.detail.address.id, 
        paymentType: this.paymentRadio, // 选择的支付类型：1->在线支付；2->货到付款；默认是在线支付
        sourceType: 3, // 订单来源：1->android，2->ios，3->h5 ,4->web商城,
      }
      orderCalculation(params).then(res => {
        this.$toast.clear();
        this.detail = res.data;
      }).catch(error => {
        console.log(error);
        this.$toast.clear();
      })
    },
    onDiscountPrice(productMapItem) {
      let total = parseFloat(productMapItem.goodsDisAmount) + parseFloat(productMapItem.storeDisAmount) + parseFloat(productMapItem.platformDisAmount);
      if (total > 0) return '-' + this.$store.state.rate.currency + total;
      return this.$store.state.rate.currency + total;
    },
    onConfirmCoupon() { // 确认选择优惠券
      this.detail.storeSaleInfoList[this.deliveryStoreIndex].deliveryTypeSkuItemMap[this.deliverySkuMapIndex].orderCouponsList = this.couponList;
      this.detail.storeSaleInfoList[this.deliveryStoreIndex].deliveryTypeSkuItemMap[this.deliverySkuMapIndex].orderCouponsList.forEach((newItem, newIndex) => {
        if (newItem.isSelected == 1) { // 选中状态
          this.onChooseCoupon(newItem.isSelected, newIndex, newItem);
          console.log(newItem)
          console.log('===')
        }
      })
      this.isCouponShow = false;
      this.orderCalculation(); // 重新计算订单
    },
    onClickOverlay() { // 点击优惠券遮罩层,说明当前优惠券的选中没有变
      this.isCouponShow = false;
    },
    onChangePayWay(paymentRadio) { // 修改支付方式
      if (this.detail.isCashDelivery != 1 && paymentRadio == '2') {
        return false;
      }
      this.paymentRadio = paymentRadio;
    }
  }
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
.container-absolute-height{
  height: calc(100% - 30px);
  overflow: scroll;
  padding-bottom: 68px;
  .container-absolute-btn{
    position: absolute;
    bottom: 0;
    left: 0;
  }
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
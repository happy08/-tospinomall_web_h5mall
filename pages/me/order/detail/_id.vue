<template>
  <!-- 我的-订单-订单详情  -->
  <div class="vh-100 bg-grey pb-56">
    <!-- 头部 -->
    <div class="bg-green-linear">
      <BmHeaderNav :left="{ isShow: true, isEmit: true }" :border="false" :title="$t(title)" :color="'white'" :bg_color="'bg-green-linear'" @leftClick="leftClick" />
      <!-- 待付款倒计时，在线支付 -->
      <div class="mt-10 tc white fs-14 pb-40 flex center plr-20" v-if="detail.status == 0 && detail.paymentType == 1">
        {{ $t('me.order.remaining') }}:
        <van-count-down :time="detail.remainCloseMills" format=" mm : ss " class="white" /> 
        {{ $t('me.order.orderClosed') }}
      </div>
      <!-- 待发货 -->
      <div class="fs-14 white mt-10 pb-40 plr-30 tc lh-20" v-else-if="detail.status == 1">
        待发货
      </div>
      <!-- 待收货 -->
      <div class="fs-14 white mt-10 pb-40 plr-30 tc lh-20" v-else-if="detail.status == 2">
        {{ $t('me.order.sending') }}
      </div>
      <!-- 待评价 -->
      <div class="fs-14 white mt-10 pb-40 plr-30 tc lh-20" v-else-if="detail.status == 3">
        待评价
      </div>
      <!-- 已完成 -->
      <div class="fs-14 white mt-10 pb-40 plr-30 tc lh-20" v-else-if="detail.status == 4">
        {{ $t('me.order.doneTip') }}
      </div>
      <!-- 已取消 -->
      <div class="fs-14 white mt-10 pb-40 plr-30 tc lh-20" v-else-if="detail.status == 5">
        {{ $t('me.order.cancelTip') }}
      </div>
      <!-- 超时取消 -->
      <div class="fs-14 white mt-10 pb-40 plr-30 tc lh-20" v-else-if="detail.status == 6">
        {{ $t('me.order.timeoutClosure') }}
      </div>
      <!-- 已拒收 -->
      <div class="fs-14 white mt-10 pb-40 plr-30 tc lh-20" v-else-if="detail.status == 7">
        已拒收
      </div>
    </div>

    <!-- 运输方式，待收货时展示 -->
    <van-cell class="p-20" :title="'Fulfillment by Tospino'" is-link title-class="fw black ml-12" :to="{ name: 'me-order-detail-logistics' }" v-if="detail.status == 2">
      <!-- 左侧图标 -->
      <template #icon>
        <van-icon :name="require('@/assets/images/icon/car-icon.png')" size="0.48rem" />
      </template>
    </van-cell>
    
    <!-- 定位地址 -->
    <van-cell class="p-20" :title="'Fulfillment by Tospino'" title-class="black ml-12">
      <!-- 左侧图标 -->
      <template #icon>
        <van-icon :name="require('@/assets/images/icon/address-icon.png')" size="0.48rem" />
      </template>
      <!-- 左侧内容 -->
      <template #title>
        <div>
          <p class="fs-14 fw lh-20">
            <span>{{ detail.receiverName }}</span>
            <span class="ml-10">{{ detail.receiverPhone }}</span>
          </p>
          <p class="mt-8 lh-20">{{ detail.receiverCompleteAddress }}</p>
        </div>
      </template>
    </van-cell>

    <!-- 订单详情 -->
    <div class="bg-white p-20 tr mt-12">
      <OrderStoreSingle :name="detail.storeName" @goStoreDetail="goStoreDetail" />
      <div v-for="(item, index) in detail.items" :key="'order-product-' + index">
        <OrderSingle class="mt-20 w-100" :product_num="item.goodQuantity" :product_desc="item.goodName" :product_size="item.goodAttr" :price="item.goodPrice" :image="item.goodImg" @onClick="onClick(item.goodId)" />

        <!-- 待付款状态/待发货/已取消/超时关闭/已拒收 -->
        <BmButton v-if="detail.status == 0 || detail.status == 1 || detail.status == 5 || detail.status == 6 || detail.status == 7" type="info" plain class="plr-12 round-8 h-30 mt-24" @click="addCart(item)">{{ $t('me.order.addShopCart') }}</BmButton>

        <!-- 待收货状态 / 已完成状态 -->
        <div v-else-if="detail.status == 2 || detail.status == 4">
          <BmButton type="default" plain class="plr-12 round-8 h-30 mt-24">{{ $t('me.order.afterSales') }}</BmButton>
          <BmButton :type="'info'" class="h-30 ml-10" @click="addCart(item)">{{ $t('me.order.addShopCart') }}</BmButton>
        </div>
      </div>
    </div>

    <!-- 订单信息 -->
    <div class="plr-20 pb-20 pt-10 bg-white mt-12 lh-36">
      <p class="fs-14 black flex vcenter">
        <span>{{ $t('me.order.orderNo') }}: {{ detail.orderSn }}</span>
        <van-icon :name="require('@/assets/images/icon/copy-icon.png')" size="0.48rem" class="ml-24 copy-order" @click="copy" />
      </p>
      <p class="fs-14 black flex vcenter">{{ $t('me.order.startFrom') }}: {{ detail.createTime }}</p>
      <p class="fs-14 black flex vcenter">{{ $t('me.orer.payBy') }}: {{ detail.paymentType | paymentTypeFormat}}</p>
      <p class="fs-14 black flex vcenter" v-if="detail.paymentTime">{{ $t('me.order.time') }}: {{ detail.paymentTime }}</p>
      <p class="fs-14 black flex vcenter" v-if="detail.deliveryCompany">{{ $t('me.order.delivery') }}: {{ detail.deliveryCompany }}</p>
    </div>

    <!-- 订单价格 -->
    <div class="plr-20 mt-12 bg-white order-price">
      <p class="flex between black fs-14 lh-36">
        <span>{{ $t('me.order.subtotal') }}:</span>
        <span class="fw">{{ $store.state.rate.currency }}{{ detail.productAmount }}</span>
      </p>
      <p class="flex between black fs-14 lh-36">
        <span>{{ $t('me.order.freight') }}:</span>
        <span class="fw">{{ $store.state.rate.currency }}{{ detail.buyerFreightAmount }}</span>
      </p>
      <p class="flex between black fs-14 lh-36">
        <span>{{ $t('me.order.sum') }}:</span>
        <span class="red fw">{{ $store.state.rate.currency }}{{ detail.payAmount }}</span>
      </p>
    </div>

    <!-- 可能喜欢的推荐列表展示 -->
    <van-divider class="plr-30 mt-24 fw fs-14 clr-black-85">
      <i class="iconfont icon-xinaixin linear-color mr-8"></i>
      {{ $t('common.mayLike') }}
    </van-divider>
    <div class="mlr-12 flex between flex-wrap">
      <ProductTopBtmSingle
        :img="{ url: '', width: '3.4rem', height: '3.4rem', loadImage: require('@/assets/images/product-bgd-170.png') }" 
        :detail="{ desc: 'categoryItem.name', price: 49.92, rate: 2.5, volumn: 50, ellipsis: 2, country: 'Ghana' }"
        v-for="(searchItem, searchIndex) in 6" 
        :key="'search-list-' + searchIndex"
      ></ProductTopBtmSingle>
    </div>

    <!-- 待付款 -->
    <div class="w-100 bg-white btn-content flex hend vcenter" v-if="detail.status == 0">
      <!-- 取消订单，点击出现弹窗 -->
      <BmButton :type="'info'" class="black btn-content__evaluation" @click="onCancel">{{ $t('me.order.cancelOrder') }}</BmButton>
      <!-- 去付款，跳转到付款页面 -->
      <BmButton class="fs-16 ml-10 rount-0 plr-30 btn-content__buy" @click="goPay">{{ $t('me.order.buyNow') }}</BmButton>
    </div>

    <!-- 待发货 -->
    <div class="w-100 bg-white btn-content flex hend vcenter" v-if="detail.status == 1">
      <!-- 取消订单，点击出现弹窗 -->
      <BmButton :type="'info'" class="black btn-content__evaluation">申请退款</BmButton>
      <!-- 去付款，跳转到付款页面 -->
      <BmButton class="fs-16 ml-10 rount-0 plr-30 btn-content__buy" @click="goPay">{{ $t('me.order.buyNow') }}</BmButton>
    </div>

    <!-- 待收货 -->
    <div class="w-100 bg-white btn-content flex hend vcenter" v-else-if="detail.status == 2">
      <!-- 确认收货，点击出现确认弹窗 -->
      <BmButton :type="'info'" class="black btn-content__evaluation" @click="onReceipt">{{ $t('me.order.confirmReceipt') }}</BmButton>
      <!-- Buy Now -->
      <BmButton class="fs-16 ml-10 rount-0 plr-30 btn-content__buy" @click="goPay">{{ $t('me.order.buyAgain') }}</BmButton>
    </div>

    <!-- 已收货 -->
    <div class="w-100 bg-white btn-content flex hend vcenter" v-else-if="detail.status == 3">
      <!-- 评价 -->
      <BmButton :type="'info'" class="black btn-content__evaluation" @click="onReceipt">{{ $t('me.order.evaluation') }}</BmButton>
      <!-- Buy Again -->
      <BmButton class="fs-16 ml-10 rount-0 plr-30 btn-content__buy" @click="goPay">{{ $t('me.order.buyAgain') }}</BmButton>
    </div>

    <!-- 已取消 / 超时取消 -->
    <div class="w-100 bg-white btn-content flex hend vcenter" v-else-if="detail.status == 5|| detail.status == 6">
      <!-- Buy Again -->
      <BmButton class="fs-16 ml-10 rount-0 plr-30 btn-content__buy" @click="goPay">{{ $t('me.order.buyAgain') }}</BmButton>
    </div>


    <!-- 待付款-取消订单弹窗 -->
    <van-popup v-model="isCancelShow" position="bottom" closeable style="height: 80%">
      <van-cell-group>
        <!-- 取消原因 -->
        <van-cell class="plr-20" title="Reason for Cancel Order">
          <template #label>
            <ul class="fs-14 light-grey">
              <li>1. Order offer may be cancelled altogether</li>
              <li>2. Once the order is cancelled, it cannot be reco-vered</li>
            </ul>
          </template>
        </van-cell>
      </van-cell-group>
      <div style="overflow-y: auto; height: 68%;">
        <!-- 取消原因单选 -->
        <van-radio-group v-model="cancelRadio">
          <van-cell-group>
            <van-cell class="plr-20 ptb-20 lh-12" :title="reasonItem.applyReason" clickable v-for="(reasonItem, index) in cancelReasonList" :key="index" @click="cancelRadio = reasonItem.id">
              <template #right-icon>
                <van-radio :name="reasonItem.id" icon-size="0.32rem">
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
          </van-cell-group>
        </van-radio-group>

        <!-- 取消之后将订单放入购物车 -->
        <van-cell class="p-20" title-class="light-grey" title="After submission, put this item back into the shopping cart" />
      </div>
      
      <div class="w-100 plr-12 flex between mt-12 pb-10">
        <BmButton :type="'info'" class="black round-8 w-168 h-48 cancel-btn" @click="onCancel">Cancel</BmButton>
        <BmButton class="fs-16 round-8 w-168 h-48" @click="cancelConfirm">Confirm</BmButton>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Cell, CellGroup, Divider, Popup, RadioGroup, Radio, CountDown } from 'vant';
import OrderSingle from '@/components/OrderSingle';
import OrderStoreSingle from '@/components/OrderStoreSingle';
import ClipboardJS from 'clipboard';
import ProductTopBtmSingle from '@/components/ProductTopBtmSingle';
import { getOrderDetail, cancelOrder, getOrderReasonList } from '@/api/order';
import { addCart } from '@/api/cart';

export default {
  middleware: 'authenticated',
  components: {
    vanCell: Cell,
    vanCellGroup: CellGroup,
    vanDivider: Divider,
    vanPopup: Popup,
    vanRadioGroup: RadioGroup,
    vanRadio: Radio,
    vanCountDown: CountDown,
    OrderSingle,
    OrderStoreSingle,
    ProductTopBtmSingle
  },
  data() {
    return {
      title: '',
      isCancelShow: false,
      cancelRadio: 0,
      detail: {},
      cancelReasonList: []
    }
  },
  activated() {
    this.getOrderDetail();
  },
  filters: {
    paymentTypeFormat(val) { // 支付方式
      return val == 1 ? '在线支付' : val == 2 ? '货到付款' : '';
    }
  },
  methods: {
    addCart() { // 添加购物车

    },
    cancelConfirm() { // 提交取消订单
      const reason = this.cancelReasonList.filter(item => {
        return item.id === this.cancelRadio;
      })[0].applyReason;
      cancelOrder({ orderId: this.detail.id, reason: reason }).then(res => {
        if (res.code != 0) return false;

        this.isCancelShow = false;
      })
    },
    goPay() { // 跳转去待付款-支付页面
      this.$router.push({
        name: 'me-pay-payment'
      })
    },
    copy() { // 复制
      let clipboard = new ClipboardJS('.copy-order', {
        text: () => {
          return this.detail.orderSn;
        }
      })
      clipboard.on('success', () => {
        let msg = this.$t('common.copySuccess');
        this.$toast({
          message: msg
        })
        clipboard.destroy()
      })
      clipboard.on('error', () => {
        let msg = this.$t('common.copyError');
        this.$toast({
          message: msg,
          type: 'fail'
        })
        clipboard.destroy()
      })
    },
    onReceipt() { // 确认收货弹窗
      this.$dialog.confirm({
        message: this.$t('me.order.receiptConfirmTip'),
        onfirmButtonText: this.$t('common.confirm'),
        confirmButtonColor: '#42B7AE',
        cancelButtonText: this.$t('common.cancel'),
        cancelButtonColor: '#383838'
      }).then(() => {

      }).catch(() => {

      })
    },
    leftClick() {
      if (this.$route.query.back) {
        this.$router.push({
          name: 'me-order'
        })
        return false;
      }

      if(window.history.length < 2){ //解决部分机型拿不到history
        this.$router.replace('/');
      }else{
        history.back();
      }
    },
    goStoreDetail() { // 跳转到店铺首页
      this.$router.push({
        name: 'cart-store-id',
        params: {
          id: this.detail.storeId
        }
      })
    },
    onClick(goodId) { // 跳转到商品详情页
      this.$router.push({
        name: 'cart-product-id',
        params: {
          id: goodId
        }
      })
    },
    addCart(item) {
      addCart({ quantity: item.goodQuantity, skuId: item.skuId }).then(res => {
        if (res.code != 0) return false;

        this.$toast('success');
      })
    },
    onCancel() { // 获取取消订单原因
      getOrderReasonList({ orderType: 1, applyType: 0, goodsStatus: 0 }).then(res => {
        if (res.code != 0) return false;

        this.cancelReasonList = res.data;
        this.isCancelShow = true;
      })
    },
    getOrderDetail() { // 获取订单详情
      // 加载图标
      this.$toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      });

      getOrderDetail(this.$route.params.id).then(res => {
        let title = '';
        if (res.data.status == 0) title = 'me.order.pendingDelivery'; // 0  待付款
        if (res.data.status == 1) title = 'me.order.shipments'; // 2  待发货
        if (res.data.status == 2) title = 'me.order.undelivered'; // 2  待收货
        if (res.data.status == 3) title = 'me.order.done'; // 3  已收货
        if (res.data.status == 4) title = 'me.order.cancelTitle'; // 4  已取消
        if (res.data.status == 5) title = 'me.order.tradingClosed'; // 5  交易关闭,超时取消
        if (res.data.status == 6) title = 'me.order.tradingClosed'; // 6  交易关闭,超时取消
        this.title = title;
        this.detail = res.data;
        this.$toast.clear();
      })
    }
  },
}
</script>

<style lang="less" scoped>
.pb-56{
  padding-bottom: 56px;
}
.pb-40{
  padding-bottom: 40px;
}
.grey-97{
  color: #979797;
}
.trans-rotate{
  transform: rotate(360deg);
}
.h-30{
  height: 30px!important;
}
.ml-24{
  margin-left: 24px;
}
.lh-36{
  line-height: 36px;
}
.order-price{
  padding-top: 15px;
  padding-bottom: 19px;
}
.btn-content{
  position: fixed;
  bottom: 0;
  height: 56px;
  .btn-content__buy{
    height: 100%;
  }
  .btn-content__evaluation{
    height: 36px!important;
    border-color: #eee!important;
    background-color: transparent!important;
  }
}
.cancel-btn{
  border-color: #eee!important;
  background-color: transparent!important;
}
.h-48{
  height: 48px!important;
}
.w-168{
  width: 168px;
}
.gery-border{
  border-color: #eee!important;
  color: #383838!important;
  background-color: transparent!important;
}
</style>
<template>
  <!-- 我的-订单-订单详情  -->
  <div class="v-percent-100 bg-grey pb-56">
    <!-- 头部 -->
    <div class="bg-green-linear">
      <van-sticky @scroll="stickyScroll" ref="headerStickyContainer">
        <BmHeaderNav :left="{ isShow: true, isEmit: true }" :border="false" :title="$t(title)" :color="isScrollShow ? 'white' : 'black'" :bg_color="isScrollShow ? 'bg-green-linear' : 'white'" @leftClick="leftClick" />
      </van-sticky>

      <div class="min-h-95">
        <!-- 待付款0倒计时，在线支付 -->
        <div class="mt-14 tc white fs-14 pb-40 flex center plr-20" v-if="detail.status == 0 && detail.paymentType == 1 && detail.remainCloseMills > 0">
          {{ $t('refund_countdown') }}
          <van-count-down :time="detail.remainCloseMills" format="HH:mm:ss" class="white" /> 
          {{ $t('automatically_closed') }}
        </div>
        <!-- 待发货 -->
        <!-- <div class="fs-14 white mt-14 pb-40 plr-30 tc lh-20" v-else-if="detail.status == 1">
          {{ $t('to_be_delivered') }}
        </div> -->
        <!-- 待收货 -->
        <!-- <div class="fs-14 white mt-14 pb-40 plr-30 tc lh-20" v-else-if="detail.status == 2">
          {{ $t('me.order.sending') }}
        </div> -->
        <!-- 待评价 -->
        <div class="fs-14 white mt-14 pb-40 plr-30 tc lh-20" v-else-if="detail.status == 3">
          {{ $t('to_be_evaluated') }}
        </div>
        <!-- 已完成 -->
        <!-- <div class="fs-14 white mt-14 pb-40 plr-30 tc lh-20" v-else-if="detail.status == 4">
          {{ $t('completed') }}
        </div> -->
        <!-- 已取消 -->
        <div class="fs-14 white mt-14 pb-40 plr-30 tc lh-20" v-else-if="detail.status == 5">
          {{ $t('cancelled') }}
        </div>
        <!-- 超时取消 -->
        <div class="fs-14 white mt-14 pb-40 plr-30 tc lh-20" v-else-if="detail.status == 6">
          {{ $t('time_out_cancel') }}
        </div>
        <!-- 已拒收 -->
        <div class="fs-14 white mt-14 pb-40 plr-30 tc lh-20" v-else-if="detail.status == 7">
          {{ $t('un_rejected') }}
        </div>
      </div>
    </div>
    
    <!-- 运输方式，待收货时展示 -->
    <van-cell class="p-20" :title="detail.latestLogistics" is-link title-class="fw black ml-12 hidden-1" :to="{ name: 'me-order-detail-logistics', query: { deliverySn: detail.deliverySn } }" v-if="detail.status == 2 && detail.latestLogistics != ''">
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
      <OrderStoreSingle :name="detail.storeName" :showArrow="false" />
      <div v-for="(item, index) in detail.items" :key="'order-product-' + index">
        <OrderSingle class="mt-20 w-100" :product_num="item.goodQuantity" :product_desc="item.goodName" :product_size="item.goodAttr" :price="item.goodPrice" :image="item.goodImg" @onClick="onClick(item.goodId)" />

        <!-- 待付款状态/待发货/已取消/超时关闭/已拒收 -->
        <BmButton v-if="detail.status == 0 || detail.status == 1 || detail.status == 5 || detail.status == 6 || detail.status == 7" type="info" plain class="plr-12 round-8 h-30 mt-24" @click="addCart(item)">{{ $t('add_shopping_cart') }}</BmButton>

        
        <!-- 待收货状态 / 已完成状态 -->
        <!-- 退款/售后：在线支付[待发货1且已支付1且可售后1,待收货2且已支付1且可售后1,已完成4且可售后1]；货到付款[待发货1且已支付1且可售后1,待收货2且可售后1,已完成4且可售后1] -->
        
        <div v-else-if="detail.status == 2 || detail.status == 4" class="mt-24">
          <BmButton class="fs-14 ml-10 round-8 plr-12 h-30 gery-border" :type="'info'" v-if="(detail.paymentType == 1 && (((detail.status == 1 || detail.status == 2) && detail.payState == 1) || detail.status == 4)  && detail.showAfterSale == 1) || (detail.paymentType == 0 && ((detail.status == 1 && detail.payState == 1) || detail.status == 2 || detail.status == 4) && detail.showAfterSale == 1)" @btnClick="onApplyAfterSale(item)">{{ $t('apply_for_after_sales') }}</BmButton>
          <BmButton :type="'info'" class="h-30 ml-10" @click="addCart(item)">{{ $t('add_shopping_cart') }}</BmButton>
        </div>
      </div>
    </div>

    <!-- 订单信息 -->
    <div class="plr-20 pb-20 pt-10 bg-white mt-12 lh-36">
      <p class="fs-14 black flex vcenter">
        <span>{{ $t('order_no') }}{{ detail.orderSn }}</span>
        <van-icon :name="require('@/assets/images/icon/copy-icon.png')" size="0.48rem" class="ml-24 copy-order" @click="copy" />
      </p>
      <p class="fs-14 black flex vcenter">{{ $t('start_from') }}{{ detail.createTime }}</p>
      <p class="fs-14 black flex vcenter">{{ $t('pay_by') }}{{ detail.paymentType | paymentTypeFormat}}</p>
      <p class="fs-14 black flex vcenter" v-if="detail.paymentTime">{{ $t('time_of_payment') }}{{ detail.paymentTime }}</p>
      <p class="fs-14 black flex vcenter" v-if="detail.deliveryCompany">{{ $t('delivery_method') }}{{ detail.deliveryCompany }}</p>
    </div>

    <!-- 订单价格 -->
    <div class="plr-20 mt-12 bg-white order-price">
      <p class="flex between black fs-14 lh-36">
        <span>{{ $t('subtotal') }}:</span>
        <span class="fw">{{ $store.state.rate.currency }}{{ detail.productAmount }}</span>
      </p>
      <p class="flex between black fs-14 lh-36">
        <span>{{ $t('total_freight') }}:</span>
        <span class="fw">{{ $store.state.rate.currency }}{{ detail.buyerFreightAmount }}</span>
      </p>
      <p class="flex between black fs-14 lh-36">
        <span>{{ $t('total') }}:</span>
        <span class="red fw">{{ $store.state.rate.currency }}{{ detail.payAmount }}</span>
      </p>
    </div>

    <!-- 可能喜欢的推荐列表展示 -->
    <template v-if="recommendList.length > 0">
      <van-divider class="plr-30 mt-24 fw fs-14 clr-black-85">
        <BmIcon :name="'xinaixin'" :width="'0.26rem'" :height="'0.22rem'" :color="'#FA2022'" class="mr-8" />
        {{ $t('you_may_also_like') }}
      </van-divider>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text=""
        @load="onLoad"
      >
        <div 
          class="mx-auto my-2 plr-12"
          v-masonry
          item-selector=".custom-grid-item"
          fit-width="true"
          transition-duration="0s"
          stagger="0.03s"
          gutter="10"
        >
          <nuxt-link :to="{ name: 'cart-product-id', params: { id: searchItem.productId } }" v-for="(searchItem, searchIndex) in recommendList" :key="'search-list-' + searchIndex" class="mb-12 bg-white custom-grid-item" v-masonry-tile>
            <ProductTopBtmSingle
              :img="{ url: searchItem.mainPictureUrl, width: '3.4rem', height: '3.4rem', loadImage: require('@/assets/images/product-bgd-170.png') }" 
              :detail="{ desc: searchItem.productTitle, price: searchItem.productPrice, rate: parseFloat(searchItem.starLevel), volumn: searchItem.saleCount, ellipsis: 2, country: searchItem.supplyCountryName, country_url: searchItem.supplyCountryIcon }"
            />
          </nuxt-link>
        </div>
      </van-list>
    </template>

    <div class="w-100 bg-white btn-content flex hend vcenter">
      <!-- 订单状态status：0->待付款；1->待发货；2->待收货；3->待评价（可能废弃）；4->已完成 5->已取消；6->超时未付款（订单关闭）；7->已拒收；8->其他 -->
      <!-- 支付状态payState：0->未支付 1已支付 -->
      <!-- 付款方式paymentType：1->在线支付；2->货到付款 -->
      <!-- 评论状态hasComment：0->未评论 1->已评论 -->
      <!-- 售后状态showAfterSale：0->不可售后 1->可以售后 -->

      <!-- 取消订单：在线支付[待付款0]；货到付款[待发货1且未支付0] -->
      <BmButton class="fs-14 ml-10 round-8 plr-12 h-32 gery-border" :type="'info'" v-if="(detail.paymentType == 1 && detail.status == 0) || (detail.paymentType == 0 && detail.status == 1 && detail.payState == 0)" @btnClick="onCancel(detail)">{{ $t('cancel_order') }}</BmButton>
      <!-- 去支付：在线支付[待付款0] -->
      <BmButton class="fs-14 ml-10 round-0 plr-30 v-100" v-if="detail.paymentType == 1 && detail.status == 0" @btnClick="onPay(detail)">{{ $t('pay_now')}}</BmButton>
      <!-- 去评价：在线支付[已完成4且未评价0]；货到付款[已完成4且未评价0] -->
      <BmButton class="fs-14 ml-10 round-8 plr-12 h-32 gery-border" :type="'info'" v-if="detail.hasComment == 0 && detail.status == 4" @btnClick="onRate(detail)">{{ $t('evaluation') }}</BmButton>
      <!-- 退款/售后：在线支付[待发货1且已支付1且可售后1, 该处2/4不展示[待收货2且已支付1且可售后1,已完成4且可售后1]]；货到付款[待发货1且已支付1且可售后1,该地方不展示[待收货2且可售后1,已完成4且可售后1]] -->
      <BmButton class="fs-14 ml-10 round-8 plr-12 h-32 gery-border" :type="'info'" v-if="(detail.paymentType == 1 && (((detail.status == 1) && detail.payState == 1))  && detail.showAfterSale == 1) || (detail.paymentType == 0 && ((detail.status == 1 && detail.payState == 1)) && detail.showAfterSale == 1)" @btnClick="onAfterSale(detail)">{{ $t('refund_after_sale') }}</BmButton>
      <!-- 确认收货：在线支付[待收货2且已支付1]；货到付款[待收货2] -->
      <BmButton class="fs-14 ml-10 round-8 plr-12 h-32 gery-border" :type="'info'" v-if="(detail.paymentType == 1 && detail.status == 2 && detail.payState == 1) || (detail.paymentType == 0 && detail.status == 2)" @btnClick="onReceipt(detail)">{{ $t('confirm_receipt') }}</BmButton>
      <!-- 去购买：待发货1,待收货2,待评价3,已完成4,已取消5,超时未付款6,已拒收7,其他8 -->
      <BmButton class="fs-14 ml-10 round-0 plr-30 v-100" v-if="detail.status != 0" @btnClick="onBuy(detail)">{{ $t('buy_again') }}</BmButton>
    </div>

    <!-- 待付款-取消订单弹窗 -->
    <van-popup v-model="isCancelShow" position="bottom" closeable style="height: 80%">
      <van-cell-group>
        <!-- 取消原因 -->
        <van-cell class="plr-20" :title="$t('reason_for_cancel_order')">
          <template #label>
            <div class="fs-14 light-grey pre-wrap" v-html="$t('cancel_order_tip_header')"></div>
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
                      :alt="'Tospino choose icon'"
                    />
                  </template>
                </van-radio>
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>

        <!-- 取消之后将订单放入购物车 -->
        <van-cell class="p-20" title-class="light-grey" :title="$t('cancel_order_tip_footer')" />
      </div>
      
      <div class="w-100 plr-12 flex between mt-12 pb-10">
        <BmButton :type="'info'" class="black round-8 w-168 h-48 cancel-btn" @click="isCancelShow = false">{{ $t('cancel') }}</BmButton>
        <BmButton class="fs-16 round-8 w-168 h-48" @click="cancelConfirm">{{ $t('confirm') }}</BmButton>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Cell, CellGroup, Divider, Popup, RadioGroup, Radio, CountDown, Sticky, List } from 'vant';
import OrderSingle from '@/components/OrderSingle';
import OrderStoreSingle from '@/components/OrderStoreSingle';
import ClipboardJS from 'clipboard';
import ProductTopBtmSingle from '@/components/ProductTopBtmSingle';
import { getOrderDetail, cancelOrder, getOrderReasonList, confirmReceiptOrder } from '@/api/order';
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
    vanSticky: Sticky,
    vanList: List,
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
      cancelReasonList: [],
      isScrollShow: true,
      recommendList: [],
      pageNum: 1,
      pageSize: 10,
      finished: false,
      loading: false,
      total: 0,
      orderId: ''
    }
  },
  async fetch() {
    const recommendData = await this.$api.getRecommend({type: 2, pageNum: this.pageNum, pageSize: this.pageSize});
    if (recommendData.code != 0) return false;
    this.recommendList = this.pageNum == 1 ? recommendData.data.items : this.recommendList.concat(recommendData.data.items);
    this.total = recommendData.data.total;
    this.loading = false;
    this.orderId = this.$route.params.id;
  },
  activated() {
    this.getOrderDetail();
    if (this.orderId != this.$route.params.id) {
      this.pageNum = 1;
      this.finished = false;
      this.$fetch();
    }
  },
  filters: {
    paymentTypeFormat(val) { // 支付方式
      return val == 1 ? '在线支付' : val == 2 ? '货到付款' : '';
    }
  },
  methods: {
    cancelConfirm() { // 提交取消订单
      const reason = this.cancelReasonList.filter(item => {
        return item.id === this.cancelRadio;
      })[0].applyReason;
      cancelOrder({ orderId: this.detail.id, reason: reason }).then(res => {
        if (res.code != 0) return false;

        this.getOrderDetail();
        this.isCancelShow = false;
      })
    },
    goPay() { // 跳转去待付款-支付页面
      this.$router.push({
        name: 'me-pay-payment',
        query: {
          type: 'order'
        }
      })
    },
    copy() { // 复制
      let clipboard = new ClipboardJS('.copy-order', {
        text: () => {
          return this.detail.orderSn;
        }
      })
      clipboard.on('success', () => {
        let msg = this.$t('t_copied_to_clipboard');
        this.$toast({
          message: msg
        })
        clipboard.destroy()
      })
      clipboard.on('error', () => {
        let msg = this.$t('fail_copied_to_clipboard');
        this.$toast({
          message: msg,
          type: 'fail'
        })
        clipboard.destroy()
      })
    },
    onReceipt(orderItem) { // 确认收货
      this.$dialog.confirm({
        message: this.$t('confirm_receipt_tips'),
        onfirmButtonText: this.$t('confirm_receipt'),
        confirmButtonColor: '#42B7AE',
        cancelButtonText: this.$t('cancel'),
        cancelButtonColor: '#383838'
      }).then(() => {
        confirmReceiptOrder(orderItem.id).then(res => {
          if (res.code != 0) return false;

          this.getOrderDetail();
        })
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
    // goStoreDetail() { // 跳转到店铺首页
    //   this.$router.push({
    //     name: 'cart-store-id',
    //     params: {
    //       id: this.detail.storeId
    //     },
    //     query: {
    //       tabbarActive: 0
    //     }
    //   })
    // },
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

        this.$toast(this.$t('t_add_shopping_cart_successfully'));
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
        if (res.data.status == 0) title = 'unpaid'; // 0  待付款
        if (res.data.status == 1) title = 'to_be_delivered'; // 2  待发货
        if (res.data.status == 2) title = 'unreceived'; // 2  待收货
        if (res.data.status == 3) title = 'me.order.done'; // 3  已收货
        if (res.data.status == 4) title = 'completed'; // 4  已完成
        if (res.data.status == 5) title = 'cancelled'; // 5  已取消
        if (res.data.status == 6) title = 'trading_close'; // 6  交易关闭,超时取消
        if (res.data.status == 7) title = 'un_rejected'; // 7 已拒收
        this.title = title;
        this.detail = {
          ...res.data,
          remainCloseMills: parseFloat(res.data.remainCloseMills)
        };
        this.$toast.clear();
      })
    },
    stickyScroll(scrollObj) { // 吸顶滚动事件
      if (scrollObj.isFixed) {
        // 滚动时格式化样式 head-sticky-scroll
        if (scrollObj.scrollTop > 2) {
          this.$refs.headerStickyContainer.$el.classList.add('head-sticky-scroll');
          this.isScrollShow = false;
        }
        if (scrollObj.scrollTop < 90) {
          this.$refs.headerStickyContainer.$el.classList.remove('head-sticky-scroll');
          this.isScrollShow = true;
        }
      }
    },
    onBuy(orderItem) { // 再次购买,跳转到确认订单页面
      let skuItems = orderItem.items.map(item => {
        return {
          quantity: item.goodQuantity,
          skuId: item.skuId
        }
      })
      this.$router.push({
        name: 'cart-order-id',
        params: {
          id: JSON.stringify({skuItems: skuItems})
        }
      })
    },
    onPay(orderItem) { // 去支付
      this.$router.push({
        name: 'me-pay-payment',
        query: {
          type: 'order',
          amount: orderItem.productAmount,
          orderIds: JSON.stringify({orderIds: [orderItem.id]}),
          comfirmOrder: 1
        }
      })
    },
    onAfterSale(orderItem) { // 退款售后
      this.$router.push({
        name: 'me-aftersale',
        query: {
          orderId: orderItem.id
        }
      })
    },
    onRate(orderItem) { // 去评价
      this.$router.push({
        name: 'me-order-rate',
        query: {
          orderId: orderItem.id
        }
      })
    },
    onApplyAfterSale(orderItem) { // 申请售后
      this.$router.push({
        name: 'me-aftersale-apply',
        query: {
          itemId: orderItem.id
        }
      })
    },
    onLoad() { // 加载更多推荐商品
      if (this.total == this.recommendList.length) { // 没有下一页了
        this.finished = true;
        this.loading = false;
        return false;
      }
      this.pageNum += 1;
      this.$fetch();
    }
  },
  deactivated(){
    window.removeEventListener('scroll', this.stickyScroll); // 离开页面清除滚动事件
  }
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
  .v-100{
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
.min-h-95{
  min-height: 95px;
  display: block;
}
</style>

<style lang="less">
.head-sticky-scroll{
  .min-h-95{
    min-height: 0;
    display: none;
    animation: all 1s;
  }
}
</style>
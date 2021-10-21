<template>
  <!-- 首页-头部-搜索页面 -->
  <div :class="{'v-percent-100': true, 'bg-grey': !isShowTip}">
    <van-sticky class="border-b order-search-sticky">
      <BmHeaderNav :left="{ isShow: true, isEmit: true }" :title="title" :border="false" @leftClick="leftClick" />

      <!-- 搜索 -->
      <div class="plr-20 bg-white ptb-12">
        <van-search
          v-model="orderVal"
          shape="round"
          :placeholder="$t('enter_key_words')"
          class="search-container"
          @search="onOrderSearch"
          @focus="onFocus"
          @input="inputChange"
          @clear="onClear"
          ref="searchContainer"
        >
          <template #left-icon>
            <BmImage 
              :url="require('@/assets/images/icon/search-icon.png')"
              :width="'0.4rem'" 
              :height="'0.4rem'"
              :isShow="false"
              :alt="'Tospino search logo'"
            />
          </template>
        </van-search>
      </div>
    </van-sticky>
    
    <template v-if="isShowTip != -1">
      <div class="mlr-20 mt-12" v-show="isShowTip">
        <!-- 搜索历史 -->
        <h2 class="fs-14 black flex between vcenter" v-if="searchHistoryList.length > 0">
          <span>{{ $t('search_for_history') }}</span>
          <BmIcon :name="'shanchu'" :width="'0.32rem'" :height="'0.32rem'" @iconClick="deleteFn" />
        </h2>
        <div class="mt-12 flex flex-wrap">
          <span class="plr-10 round-8 mr-10 iblock mb-10 lh-20 tag-name" v-for="(tagItem, tagIndex) in searchHistoryList" :key="tagIndex" @click="onOrderSearch(tagItem)">{{ tagItem }}</span>
          <BmIcon :name="'down-icon'" :width="'0.64rem'" :height="'0.64rem'" v-if="historyNum" @iconClick="showMoreHistory" />
        </div>
      </div>
      <PullRefresh :refreshing="refreshing" @refresh="onRefresh" :class="{ 'custom-min-height-128': true }" v-show="!isShowTip">
        <!-- 空状态  -->
        <empty-status v-if="lists.length === 0" :image="require('@/assets/images/empty/order.png')" />
        <van-list
           v-else
          v-model="loading"
          :finished="finished"
          @load="onLoad"
          :finished-text="lists.length == 0 ? '' : ''"
        >
          <!-- 订单列表 -->
          <div v-for="(item,index) in lists" :key="'order-' + index" class="w-100 plr-12 mb-12 bg-white pb-20 pt-24">
            <!-- 订单店铺 -->
            <OrderStoreSingle :name="item.storeName" :status="statusFormat(item.status)" @goStoreDetail="goOrderDetail(item.items[0].orderId)">
              <!-- 如果是取消状态，则该订单可删除，添加操作展示  -->
              <div slot="other-deal" class="flex vcenter" v-if="item.status == 5 || item.status == 6">
                <span class="block line-style"></span>
                <BmImage 
                  :url="require('@/assets/images/icon/delete-icon.svg')"
                  :width="'0.48rem'" 
                  :height="'0.48rem'"
                  :isLazy="false"
                  @onClick="onDeleteFn(item.id)"
                  :alt="'Tospino delete icon'"
                />
              </div>
            </OrderStoreSingle>
            <!-- 订单列表详情 -->
            <template v-if="item.items.length == 1">
              <OrderSingle
                class="mt-20"
                :image="productItem.goodImg" 
                :product_desc="productItem.goodName"
                :product_size="productItem.goodAttr"
                :price="productItem.goodPrice"
                :product_num="item.totalQuantity"
                @onClick="goOrderDetail(productItem.orderId)"
                v-for="(productItem,productIndex) in item.items"
                :key="productIndex"
              />
            </template>
            <!-- 多个商品 -->
            <div v-else class="more-order-content">
              <swiper
                ref="swiperComponentRef"
                :class="{ 'swiper mt-20 order-page__global-swiper': true, 'swiper-no-swiping' : item.totalQuantity <= 4 }"
                :options="{
                  ...swiperComponentOption
                }"
              >
                <swiper-slide v-for="(productItem,productIndex) in item.items" :key="'swiper-' + productIndex">
                  <BmImage 
                    :url="productItem.goodImg"
                    :width="'1.68rem'" 
                    :height="'1.68rem'"
                    :isLazy="false"
                    class="flex-shrink border round-4 hidden"
                    :alt="productItem.goodName"
                  />
                </swiper-slide>
              </swiper>
              <div class="tr more-order-content__info">
                <p class="fs-18 fw black lh-20">{{ $store.state.rate.currency }}{{ item.productAmount }}</p>
                <p class="light-grey fs-14 lh-20 mt-8">X{{ item.totalQuantity }}</p>
              </div>
            </div>
            <!-- 订单不同状态对应的按钮展示 -->
            <div class="w-100 bg-white btn-content flex hend vcenter mt-22">
              <!-- 订单状态status：0->待付款；1->待发货；2->待收货；3->待评价（可能废弃）；4->已完成 5->已取消；6->超时未付款（订单关闭）；7->已拒收；8->其他 -->
              <!-- 支付状态payState：0->未支付 1已支付 -->
              <!-- 付款方式paymentType：1->在线支付；2->货到付款 -->
              <!-- 评论状态hasComment：0->未评论 1->已评论 -->
              <!-- 售后状态showAfterSale：0->不可售后 1->可以售后 -->

              <!-- 取消订单：在线支付[待付款0]；货到付款[待发货1且未支付0] -->
              <BmButton class="fs-14 ml-10 round-8 plr-12 h-32 gery-border" :type="'info'" v-if="(item.paymentType == 1 && item.status == 0) || (item.paymentType == 2 && item.status == 1 && item.payState == 0)" @btnClick="onCancel(item)">{{ $t('cancel_order') }}</BmButton>
              <!-- 去支付：在线支付[待付款0] -->
              <BmButton class="fs-14 ml-10 round-8 plr-12 h-32" :type="'info'" v-if="item.paymentType == 1 && item.status == 0" @btnClick="onPay(item)">{{ $t('payment') }}</BmButton>
              <!-- 去评价：在线支付[已完成4且未评价0]；货到付款[已完成4且未评价0] -->
              <BmButton class="fs-14 ml-10 round-8 plr-12 h-32 gery-border" :type="'info'" v-if="item.hasComment == 0 && item.status == 4" @btnClick="onEvaluate(item)">{{ $t('evaluation') }}</BmButton>
              <!-- 退款/售后：在线支付[待发货1且已支付1且可售后1,待收货2且已支付1且可售后1,已完成4且可售后1]；货到付款[待发货1且已支付1且可售后1,待收货2且可售后1,已完成4且可售后1] -->
              <BmButton class="fs-14 ml-10 round-8 plr-12 h-32 gery-border" :type="'info'" v-if="(item.paymentType == 1 && (((item.status == 1 || item.status == 2) && item.payState == 1) || item.status == 4)  && item.showAfterSale == 1) || (item.paymentType == 2 && ((item.status == 1 && item.payState == 1) || item.status == 2 || item.status == 4) && item.showAfterSale == 1)" @btnClick="onAfterSale(item)">{{ $t('refund_after_sale') }}</BmButton>
              <!-- 确认收货：在线支付[待收货2且已支付1]；货到付款[待收货2] -->
              <BmButton class="fs-14 ml-10 round-8 plr-12 h-32 gery-border" :type="'info'" v-if="(item.paymentType == 1 && item.status == 2 && item.payState == 1) || (item.paymentType == 2 && item.status == 2)" @btnClick="onReceipt(item)">{{ $t('confirm_receipt') }}</BmButton>
              <!-- 去购买：待发货1,待收货2,待评价3,已完成4,已取消5,超时未付款6,已拒收7,其他8 -->
              <BmButton class="fs-14 ml-10 round-8 plr-12 h-32" :type="'info'" v-if="item.status != 0" @btnClick="onBuy(item)">{{ $t('buy_again') }}</BmButton>
            </div>
          </div>
        </van-list>
      </PullRefresh>
    </template>
    
    <!-- 取消订单原因选择弹窗 -->
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
        <van-cell class="p-20" title-class="light-grey" title="After submission, put this item back into the shopping cart" />
      </div>
      
      <div class="w-100 plr-12 flex between mt-12 pb-10">
        <BmButton :type="'info'" class="black round-8 w-168 h-48 cancel-btn" @click="isCancelShow = false">{{ $t('cancel') }}</BmButton>
        <BmButton class="fs-16 round-8 w-168 h-48" @click="cancelConfirm">{{ $t('confirm') }}</BmButton>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Search, List, Popup, Cell, CellGroup, RadioGroup, Radio, Sticky } from 'vant';
import OrderSingle from '@/components/OrderSingle';
import OrderStoreSingle from '@/components/OrderStoreSingle';
import { cancelOrder, getOrderReasonList, deleteOrder, confirmReceiptOrder } from '@/api/order';
import PullRefresh from '@/components/PullRefresh';
import 'swiper/css/swiper.css';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';

export default {
  name: 'meOrderSearch',
  middleware: 'authenticated',
  components: {
    vanSearch: Search,
    vanList: List,
    vanPopup: Popup,
    vanCell: Cell,
    vanCellGroup: CellGroup,
    vanRadioGroup: RadioGroup,
    vanRadio: Radio,
    vanSticky: Sticky,
    OrderSingle,
    OrderStoreSingle,
    PullRefresh,
    swiper: Swiper,
    swiperSlide: SwiperSlide
  },
  data() {
    return {
      orderVal: '',
      isShowTip: true,
      lists: [],
      searchHistoryList: [],
      historyNum: false,
      inputChange: null,
      pageNum: 1,
      pageSize: 10,
      cancelReasonList: [],
      cancelRadio: 0,
      isCancelShow: false,
      title: '',
      swiperComponentOption: { // 一排四列 滚动
        slidesPerView: 4,
        slidesPerGroup: 4,
        spaceBetween: 0,
        // loop: true,
        // loopFillGroupWithBlank: true,
        pagination: {
          el: '.swiper-group-pagination',
          clickable: true,
        },
      },
      loading: false,
      finished: false,
      refreshing: {
        isFresh: false
      },
      isRouteBack: 0,
      total: 0,
      backName: ''
    }
  },
  async fetch() {
    try {
      this.orderVal = this.$route.query.orderVal || ''; // 搜索value
      this.isShowTip = this.orderVal.length > 0 ? false : true;
      if (this.$route.query.back) {
        this.backName = this.$route.query.back;
      }

      // 如果带着搜索的参数跳转过来的需要先获取相对应的搜索数据
      if (this.orderVal != '') {
        this.$store.commit('user/SET_SEARCHORDERLIST', this.orderVal); // 搜索历史存储
        this.pageNum = 1;
        this.isRouteBack = 1;
        this.lists = [];
        const orderData = await this.$api.getOrderList({ pageNum: this.pageNum, pageSize: this.pageSize, keyword: this.orderVal });
        this.total = orderData.data.total;
        this.lists = orderData.data.records;
        this.isShowTip = false;
        this.loading = false;
        this.refreshing.isFresh = false;
        this.finished = parseFloat(orderData.data.total) == this.lists.length;
        // 更新页面展示
        this.searchHistoryList = this.$store.state.user.searchOrderList.filter((item, index) => {
          return index < 6;
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  watch: {
    '$route'() {
      this.$fetch();
    }
  },
  activated() {
    this.$fetch();
    // 取消订单原因，因为整个列表都是同一种类型，所以就只在全局引入一次就好了
    getOrderReasonList({ orderType: 1, applyType: 0, goodsStatus: 0 }).then(res => {
      if (res.code != 0) return false;

      this.cancelReasonList = res.data;
    }).catch(error => {
      console.log(error);
    })
    if (this.orderVal == '') { // 没有带参数进来的时候，搜索输入框需要自动聚焦
      this.isRouteBack = 0;
      this.title = this.$t('search');
      this.$nextTick(() => {
        this.$refs.searchContainer.querySelector('input').focus();
      })
    } else {
      this.isRouteBack = 1;
      this.title = this.$t('my_order');
    }
    this.searchHistoryList = this.$store.state.user.searchOrderList.filter((item, index) => {
      return index < 6;
    });
    this.historyNum = this.$store.state.user.searchOrderList.length > 6 ? true: false;
    // 搜索防抖
    this.inputChange = this.$utils.debounce((e) => {
      this.isShowTip = true;
      // this.getSearchList();
    }, 300);
  },
  deactivated() {
    this.backName = '';
  },
  methods: {
    deleteFn() { // 删除历史记录
      this.$dialog.confirm({
        message: this.$t('delete_all_search_history_tips'),
        confirmButtonText: this.$t('confirm'),
        confirmButtonColor: '#42B7AE',
        cancelButtonText: this.$t('cancel'),
        cancelButtonColor: '#383838'
      }).then(() => { // 确认删除历史记录
        this.$store.commit('user/SET_SEARCHORDERLIST', null);
        this.searchHistoryList = [];
        this.historyNum = false;
      })
    },
    onOrderSearch(val) { // 获取搜索结果
      if (val == '') return false;
      // let value = val;
      if (!val && this.hintName) value = this.hintName;
      if (this.isRouteBack != 0) {
        this.$router.replace({
          name: 'me-order-search',
          query: {
            orderVal: val,
            // searchKeyword: val
          }
        })
      } else {
        this.$router.push({
          name: 'me-order-search',
          query: {
            orderVal: val,
            // searchKeyword: val
          }
        })
      }
      // this.$store.commit('user/SET_SEARCHORDERLIST', value); // 搜索历史存储
      // // 更新页面展示
      // this.searchHistoryList = this.$store.state.user.searchOrderList.filter((item, index) => {
      //   return index < 6;
      // });
      // this.orderVal = value;
      // this.pageNum = 1;
      // // this.title = this.$t('bill');
      // this.isShowTip = false;
      // this.lists = [];
      // // 获取搜索列表
      // this.getSearchList();
    },
    showMoreHistory() { // 展示更多的搜索历史
      this.historyNum = false;
      this.searchHistoryList = this.$store.state.user.searchOrderList;
    },
    onFocus() { // 获取焦点之后，不展示数据列表和历史数据
      this.isShowTip = this.orderVal.length > 0 ? false : this.orderVal.length === 0;
    },
    onDeleteFn(orderId) { // 删除订单
      // 加载图标
      this.$toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      });

      deleteOrder(orderId).then(() => {
        this.$toast.clear();
        this.$fetch();
      }).catch(error => {
        console.log(error);
      })
    },
    goOrderDetail(orderId) { // 跳转到订单详情
      this.$router.push({
        name: 'me-order-detail-id',
        params: {
          id: orderId
        }
      })
    },
    goOrderDetail(orderId) { // 跳转到订单详情
      this.$router.push({
        name: 'me-order-detail-id',
        params: {
          id: orderId
        }
      })
    },
    onRefresh() { // 下拉刷新
      this.pageNum = 1;
      this.finished = false;
      this.getSearchList();
    },
    onLoad() {
      this.finished = false;
      if (parseFloat(this.total) == this.lists.length) {
        this.loading = false;
        this.finished = true;
        return false;
      }
      this.pageNum += 1;
      this.getSearchList();
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
    onCancel(orderItem) { // 选择取消订单原因
      this.isCancelShow = true;
      this.currentOrder = orderItem;
    },
    cancelConfirm() { // 提交取消订单
      const reason = this.cancelReasonList.filter(item => {
        return item.id === this.cancelRadio;
      })[0].applyReason;
      cancelOrder({ orderId: this.currentOrder.id, reason: reason }).then(res => {
        if (res.code != 0) return false;

        this.isCancelShow = false;
        this.getSearchList();
      }).catch(error => {
        console.log(error);
      })
    },
    onPay(orderItem) { // 去支付
      this.$router.push({
        name: 'me-pay-payment',
        query: {
          type: 'order',
          amount: orderItem.productAmount,
          orderIds: JSON.stringify({orderIds: [orderItem.id]})
        }
      })
    },
    getSearchList() {
      if (this.pageNum == 1) {
        this.$toast.loading({
          forbidClick: true,
          loadingType: 'spinner',
          duration: 0
        });
      }
      
      if (this.orderVal == '') {
        this.isShowTip = true;
        return false;
      }
      this.$api.getOrderList({ pageNum: this.pageNum, pageSize: this.pageSize, keyword: this.orderVal }).then(res => {
        this.$toast.clear();
        this.total = res.data.total;
        this.lists = this.pageNum == 1 ? res.data.records : this.lists.concat(res.data.records);
        this.isShowTip = false;
        this.loading = false;
        this.refreshing.isFresh = false;
      }).catch(error => {
        console.log(error);
      })
    },
    statusFormat(val) {
      return val == 0 ? this.$t('to_pay') : val == 1 ? this.$t('to_be_delivered') : val == 2 ? this.$t('unreceived') : val == 3 ? this.$t('to_be_evaluated') : val == 4 ? this.$t('completed') : val == 5 ? this.$t('cancelled') : val == 6 ? this.$t('trading_close') : val == 7 ? this.$t('un_rejected') : '';
    },
    onEvaluate(orderItem) { // 去评价
      this.$router.push({
        name: 'me-order-rate',
        query: {
          orderId: orderItem.id
        }
      })
    },
    onClear() { // 点击清除按钮
      this.$router.replace({
        name: 'me-order-search'
      })
    },
    leftClick() { // 页面回退
      if (!this.$route.query.orderVal && this.backName != '') {
        this.$router.replace({
          name: this.backName
        });
        return false;
      }
      if (window.history.length < 2) { //解决部分机型拿不到history
        console.log('go home');
        this.$router.replace('/');
      } else {
        console.log('back');
        history.back();
      }
    },
    onReceipt(orderItem) { // 确认收货
      this.$dialog.confirm({
        message: this.$t('confirm_receipt_tips'),
        onfirmButtonText: this.$t('confirm_receipt'),
        confirmButtonColor: '#42B7AE',
        cancelButtonText: this.$t('cancel'),
        cancelButtonColor: '#383838'
      }).then(() => {
        // 加载图标
        this.$toast.loading({
          forbidClick: true,
          loadingType: 'spinner',
          duration: 0
        });

        confirmReceiptOrder(orderItem.id).then(res => {
          this.$toast.clear();
          this.lists.forEach((item, index) => {
            if (item.id == orderItem.id) {
              this.lists.splice(index, 1);
            }
          })
        }).catch(error => {
          console.log(error);
        })
      }).catch(() => {

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
  },
}
</script>

<style lang="less" scoped>
.tag-name{
  line-height: 17px;
  padding-top: 6px;
  padding-bottom: 6px;
  background-color: #F8F8F8;
}
.delete-style{
  color: rgba(0, 0, 0, .45);
  font-size: 14px;
}
.gery-border{
  border-color: #eee!important;
  color: #383838!important;
  background-color: transparent!important;
}
.more-order-content{
  position: relative;
  .more-order-content__info{
    position: absolute;
    right: 0;
    top: 0;
    z-index: 1000;
    height: 84px;
    padding-left: 10px;
    background-color: rgba(255, 255, 255, .8);
  }
}
</style>

<style lang="less">
.order-search-sticky .van-sticky{
  background-color: #fff;
  .search-container{
    .van-search__content{
      height: 34px!important;
      padding-left: 10px!important;
    }
    .van-field__left-icon{
      height: 20px!important;
    }
    .van-cell {
      // padding: 0 !important;
      align-items: center;
      height: 100%!important;
    }
  }
}
</style>
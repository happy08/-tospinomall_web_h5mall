<template>
  <!-- 我的-订单 -->
  <div :class="{'v-percent-100 order-page': true, 'bg-white': lists.length == 0, 'bg-grey': lists.length > 0}">
    
    <van-sticky :offset-top="0">
      <BmHeaderNav :left="{ isShow: true, url: '/me' }" :title="$t('my_order')" :border="false" />
      <!-- 搜索 -->
      <div class="flex vcenter pl-20 pr-12 bg-white">
        <van-search
          v-model="searchVal"
          shape="round"
          :placeholder="$t('enter_key_words')"
          class="w-100 search-container"
          @click="goSearch"
        > 
          <!-- 右侧图标-点击拍照 -->
          <!-- <template #right-icon>
            <div>
              <van-icon :name="require('@/assets/images/icon/camera-icon.png')" size="0.46rem" />
            </div>
          </template> -->
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
        <!-- 筛选 -->
        <van-icon :name="require('@/assets/images/icon/filter-icon.png')" class="ml-12" @click="filterPopup = true" size="0.48rem" />
      </div>
    </van-sticky>

    <!-- 分类 -->
    <van-tabs sticky swipeable animated color="#42B7AE" offset-top="1.59rem"  @change="getSearchList" class="customs-van-tabs" v-model="typeActive" :ellipsis="false" >
      <van-tab v-for="(tabItem, tabIndex) in tabs" :title="$t(tabItem.name)" :key="'scroll-tab-' + tabIndex" title-class="border-b" :name="tabItem.type">
        <PullRefresh :refreshing="refreshing" @refresh="onRefresh" :class="{ 'custom-min-height-128': true }">
          <van-list
            v-model="loading"
            :finished="finished"
            @load="onLoad"
            :finished-text="lists.length == 0 ? '' : ''"
          >
            <template #loading>
              <van-loading color="#42b7ae" />
            </template>
            <div class="flex between flex-wrap">
              <!-- 空状态  -->
              <empty-status v-if="lists.length === 0" :image="require('@/assets/images/empty/order.png')" :description="$t('empty')" />
              <!-- 订单列表 -->
              <div v-else v-for="(item,index) in lists" :key="index" class="w-100 plr-20 mb-12  pb-20 pt-24 bg-white">
                <van-checkbox-group v-model="togetherResult">
                  <div class="flex vcenter">
                    <!-- 选中与否 -->
                    <van-checkbox :name="item.id" class="flex-shrink mr-20" v-if="typeActive == 0">
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
                    </van-checkbox>
                    <!-- 订单店铺 -->
                    <OrderStoreSingle :name="item.storeName" :status="statusFormat(item.status, item)" @goStoreDetail="goStoreDetail(item)">
                      <!-- 如果是取消状态，则该订单可删除，添加操作展示  -->
                      <div slot="other-deal" class="flex vcenter" v-if="item.status == 5 || item.status == 6 || item.status == 4 || item.status == 7">
                        <span class="block line-style"></span>
                        <BmImage 
                          :url="require('@/assets/images/icon/delete-icon.svg')"
                          :width="'0.48rem'" 
                          :height="'0.48rem'"
                          :isLazy="false"
                          @onClick="deleteFn(item.id)"
                          :alt="'Tospino delete icon'"
                        />
                      </div>
                    </OrderStoreSingle>
                  </div>
                  <!-- 订单列表详情 -->
                  <template v-if="item.items.length == 1">
                    <OrderSingle
                      class="mt-20"
                      :image="productItem.goodImg" 
                      :product_desc="productItem.goodName"
                      :product_size="productItem.goodAttr"
                      :price="productItem.productAmount"
                      :product_num="0"
                      @onClick="goOrderDetail(item.id)"
                      v-for="(productItem,productIndex) in item.items"
                      :key="productIndex"
                    >
                      <p class="light-grey fs-14 lh-20 mt-8" slot="product-num">{{ $t('total_piece', { replace_tip: productItem.goodQuantity }) }}</p>
                    </OrderSingle>
                  </template>
                  <!-- 多个商品 -->
                  <div v-else class="more-order-content" @click="goOrderDetail(item.id)">
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
                          :isShow="true"
                          class="flex-shrink border round-4 hidden"
                          :alt="productItem.goodName"
                        />
                      </swiper-slide>
                    </swiper>
                    <div class="tr more-order-content__info">
                      <p class="fs-18 fw black lh-20">{{ $store.state.rate.currency }}{{ item.productAmount }}</p>
                      <p class="light-grey fs-14 lh-20 mt-8">{{ $t('total_piece', { replace_tip: item.totalQuantity }) }}</p>
                    </div>
                  </div>
                  <!-- 订单不同状态对应的按钮展示 -->
                  <div class="w-100 bg-white flex hend vcenter mt-12 flex-wrap">
                    <!-- 订单状态status：0->待付款；1->待发货；2->待收货；3->待评价（可能废弃）；4->已完成 5->已取消；6->超时未付款（订单关闭）；7->已拒收；8->其他 -->
                    <!-- 支付状态payState：0->未支付 1已支付 -->
                    <!-- 付款方式paymentType：1->在线支付；2->货到付款 -->
                    <!-- 评论状态hasComment：0->未评论 1->已评论 -->
                    <!-- 售后状态showAfterSale：0->不可售后 1->可以售后 -->

                    <!-- 取消订单：在线支付[待付款0]；货到付款[待发货1且未支付0] -->
                    <BmButton class="fs-14 ml-10 round-8 plr-12 h-32 gery-border mt-10" :type="'info'" v-if="(item.paymentType == 1 && item.status == 0) || (item.paymentType == 2 && item.status == 1 && item.payState == 0)" @btnClick="onCancel(item)">{{ $t('cancel_order') }}</BmButton>
                    <!-- 去支付：在线支付[待付款0] -->
                    <BmButton class="fs-14 ml-10 round-8 plr-12 h-32 mt-10" :type="'info'" v-if="item.paymentType == 1 && item.status == 0" @btnClick="onPay(item)">{{ $t('pay_now') }}</BmButton>
                    <!-- 退款/售后：在线支付[待发货1且已支付1且可售后1,待收货2且已支付1且可售后1,已完成4且可售后1]；货到付款[待发货1且已支付1且可售后1,待收货2且可售后1,已完成4且可售后1] -->
                    <BmButton class="fs-14 ml-10 round-8 plr-12 h-32 gery-border mt-10" :type="'info'" v-if="(item.paymentType == 1 && (((item.status == 1 || item.status == 2) && item.payState == 1) || item.status == 4)  && item.showAfterSale == 1) || (item.paymentType == 2 && ((item.status == 1 && item.payState == 1) || item.status == 2 || item.status == 4) && item.showAfterSale == 1)" @btnClick="onAfterSale(item)">{{ $t('refund_after_sale') }}</BmButton>
                    <!-- 去评价：在线支付[已完成4且未评价0]；货到付款[已完成4且未评价0] -->
                    <BmButton class="fs-14 ml-10 round-8 plr-12 h-32 gery-border mt-10" :type="'info'" v-if="item.hasComment == 0 && item.status == 4" @btnClick="onEvaluate(item)">{{ $t('evaluation') }}</BmButton>
                    <!-- 确认收货：在线支付[待收货2且已支付1]；货到付款[待收货2] -->
                    <BmButton class="fs-14 ml-10 round-8 plr-12 h-32 gery-border mt-10" :type="'info'" v-if="(item.paymentType == 1 && item.status == 2 && item.payState == 1) || (item.paymentType == 2 && item.status == 2)" @btnClick="onReceipt(item)">{{ $t('confirm_receipt') }}</BmButton>
                    <!-- 去购买：待发货1,待收货2,待评价3,已完成4,已取消5,超时未付款6,已拒收7,其他8 -->
                    <BmButton class="fs-14 ml-10 round-8 plr-12 h-32 mt-10" :type="'info'" v-if="item.status != 0" @btnClick="onBuy(item)">{{ $t('buy_again') }}</BmButton>
                  </div>
                </van-checkbox-group>
              </div>
            </div>
          </van-list>
        </PullRefresh>
      </van-tab>
    </van-tabs>

    <!-- 弹窗筛选 -->
    <van-popup
      v-model="filterPopup"
      position="right"
      class="order-search"
    >
      <div class="order-search-filter">
        <h3 class="fs-16 black fw order-search-filter__title">{{ $t('according_to_the_time') }}</h3>
        <div class="mt-10 black flex between flex-wrap order-search-filter__tags">
          <span :class="{'fs-14 round-8 tc': true, 'is-active': filterTimeType == 1}" @click="filterTimeType = 1">{{ $t('within_a_week') }}</span>
          <span :class="{'fs-14 round-8 tc': true, 'is-active': filterTimeType == 2}" @click="filterTimeType = 2">{{ $t('within_a_month') }}</span>
          <span :class="{'fs-14 round-8 tc': true, 'is-active': filterTimeType == 3}" @click="filterTimeType = 3">{{ $t('within_3_month') }}</span>
          <span :class="{'fs-14 round-8 tc': true, 'is-active': filterTimeType == 4}" @click="filterTimeType = 4">{{ $t('within_this_year') }}</span>
          <span :class="{'fs-14 round-8 tc': true, 'is-active': filterTimeType == 5}" @click="filterTimeType = 5">{{ beforeOneYear }}</span>
          <span :class="{'fs-14 round-8 tc': true, 'is-active': filterTimeType == 6}" @click="filterTimeType = 6">{{ beforeTwoYear }}</span>
        </div>
      </div>

      <div class="order-search__btn flex">
        <button class="red fw order-search__btn--reset" @click="filterTimeType = 0">{{ $t('reset') }}</button>
        <button class="white fw bg-green-linear" @click="onConfirmFilter">{{ $t('determine') }}</button>
      </div>
    </van-popup>

    <!-- 取消订单原因选择弹窗 -->
    <van-popup v-model="isCancelShow" position="bottom" closeable style="height: 80%">
      <van-cell-group>
        <!-- 取消原因 -->
        <van-cell class="plr-20" :title="$t('reason_for_cancel_order')">
          <template #label>
            <div v-html="$t('cancel_order_tip_header')"  class="fs-14 light-grey pre-wrap"></div>
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
        <van-cell class="p-20" title-class="light-grey" :title="$t('cancel_order_tip_footer')" v-if="currentOrder.status != 0" />
      </div>
      
      <div class="w-100 plr-12 flex between mt-12 pb-10">
        <BmButton :type="'info'" class="black round-8 w-168 h-48 cancel-btn" @click="isCancelShow = false">{{ $t('cancel') }}</BmButton>
        <BmButton class="fs-16 round-8 w-168 h-48" @click="cancelConfirm">{{ $t('confirm') }}</BmButton>
      </div>
    </van-popup>

    <div class="w-100 bg-white btn-content flex hend vcenter z-100" v-if="togetherResult.length > 0 && typeActive == 0">
      <BmButton class="fs-14 mr-10 round-8 plr-10 h-40" @btnClick="onToggerPay">{{ $t('merge_to_pay') }}</BmButton>
    </div>
  </div>
</template>

<script>
import { Search, Tab, Tabs, Popup, List, Sticky, Cell, CellGroup, RadioGroup, Radio, Checkbox, CheckboxGroup } from 'vant';
import OrderSingle from '@/components/OrderSingle';
import OrderStoreSingle from '@/components/OrderStoreSingle';
import PullRefresh from '@/components/PullRefresh';
import { cancelOrder, getOrderReasonList, deleteOrder, confirmReceiptOrder } from '@/api/order';
import Moment from 'moment';
import 'swiper/css/swiper.css';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';

export default {
  middleware: 'authenticated',
  components: {
    vanSearch: Search,
    vanTab: Tab,
    vanTabs: Tabs,
    vanPopup: Popup,
    vanList: List,
    vanSticky: Sticky,
    vanCell: Cell,
    vanCellGroup: CellGroup,
    vanRadioGroup: RadioGroup,
    vanRadio: Radio,
    vanCheckbox: Checkbox,
    vanCheckboxGroup: CheckboxGroup,
    OrderSingle: OrderSingle,
    OrderStoreSingle: OrderStoreSingle,
    PullRefresh,
    swiper: Swiper,
    swiperSlide: SwiperSlide
  },
  data() {
    return {
      searchVal: '',
      tabs: [
        {
          name: 'all',
          type: 100
        },
        {
          name: 'unpaid',
          type: 0
        },
        {
          name: 'unreceived',
          type: 2
        },
        {
          name: 'completed',
          type: 4
        },
        {
          name: 'cancelled',
          type: 5
        }
      ],
      lists: [],
      filterPopup: false,
      typeActive: 100,
      loading: false,
      finished: false,
      refreshing: {
        isFresh: false
      },
      params: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      isFirst: true, // 是否是首次进入
      cancelRadio: 0,
      cancelReasonList: [],
      currentOrder: {},
      isCancelShow: false,
      swiperComponentOption: { // 一排四列 滚动
        slidesPerView: 'auto',
        // slidesPerGroup: 3,
        spaceBetween: 0,
        centeredSlides: false,
        // loop: true,
        // loopFillGroupWithBlank: true,
        pagination: {
          el: '.swiper-group-pagination',
          clickable: true,
        },
      },
      filterTimeType: 0,
      beforeOneYear: '',
      beforeTwoYear: '',
      togetherResult: [],
      isTab: false
    }
  },
  beforeRouteEnter(to, from, next) { // 从绑定或修改页面进入重置值为空
    next(vm => {
      if (from.name == 'me' || from.name == null || from.name == 'cart-order-confirm') {
        vm.typeActive = vm.$route.query.type ? parseFloat(vm.tabs[vm.$route.query.type].type) : 100;
      }
      if (from.name == 'me' || from.name == null || from.name == 'cart-order-confirm' || from.name == 'me-order-detail-id' || from.name == 'me-aftersale') {
        vm.isFirst = true;
        vm.pageNum = 1;
        vm.filterTimeType = 0;
        vm.params = {
          pageNum: 1,
          pageSize: 10
        }
        vm.$fetch();
      }
    });
  },
  async fetch() {
    if (!this.isTab) {
      this.typeActive = this.$route.query.type ? parseFloat(this.tabs[this.$route.query.type].type) : 100;
    }

    if (this.typeActive != 100) { // 全部
      this.params.status = this.typeActive;
    } else {
      this.params = {
        pageNum: this.params.pageNum,
        pageSize: this.params.pageSize
      }
    }

    if (this.params.pageNum == 1 && this.refreshing.isFresh == false) { // 只有请求第一页数据的时候进行loading处理
      // 加载图标
      this.$toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      });
    }
    const listData = await this.$api.getOrderList(this.params);
    this.$toast.clear();
    if (listData.data) {
      this.lists = this.params.pageNum == 1 ? listData.data.records : this.lists.concat(listData.data.records);
      this.togetherResult = this.lists.length == 0 ? [] : this.togetherResult;
      this.total = parseFloat(listData.data.total);
    }
    this.loading = false;
    this.refreshing.isFresh = false;
    this.isFirst = false;
    this.finished = this.total == this.lists.length ? true: false;
  },
  activated() {
    this.beforeOneYear = Moment(parseFloat(this.$store.state.user.nowTime)).subtract(1,'years').format('YYYY');
    this.beforeTwoYear = Moment(parseFloat(this.$store.state.user.nowTime)).subtract(2,'years').format('YYYY');
    // 取消订单原因，因为整个列表都是同一种类型，所以就只在全局引入一次就好了
    getOrderReasonList({ orderType: 1, applyType: 0, goodsStatus: 0 }).then(res => {
      if (res.code != 0) return false;

      this.cancelReasonList = res.data;
    })
  },
  deactivated() {
    this.isTab = false;
  },
  methods: {
    async getSearchList() { // 获取分类列表
      this.params.pageNum = 1;
      this.finished = false;
      this.isTab = true;
      this.$fetch();
    },
    onConfirmFilter() { // 过滤
      let _params = {
        pageNum: 1,
        pageSize: 10
      };
      if (this.typeActive != 100) { // 订单状态
        _params.status = this.typeActive;
      }
      if (this.filterTimeType == 1) _params.beforeDay = 7; // 一周之内
      let datetime = parseInt(this.$store.state.user.nowTime);
      if (this.filterTimeType == 2) { // 一个月内
        _params = {
          ..._params,
          beginTime: Moment(datetime).subtract(1,'months').format('YYYY-MM-DD HH:mm:ss'),
          endTime: Moment(datetime).format('YYYY-MM-DD HH:mm:ss')
        }
      } else if (this.filterTimeType == 3) { // 3个月内
        _params = {
          ..._params,
          beginTime: Moment(datetime).subtract(3,'months').format('YYYY-MM-DD HH:mm:ss'),
          endTime: Moment(datetime).format('YYYY-MM-DD HH:mm:ss')
        }
      } else if (this.filterTimeType == 4) { // 今年
        _params = {
          ..._params,
          beginTime: Moment(Moment(datetime).format('YYYY') + '-01-01').format('YYYY-MM-DD HH:mm:ss'),
          endTime: Moment(datetime).format('YYYY-MM-DD HH:mm:ss')
        }
      } else if (this.filterTimeType == 5) { // 去年
        _params = {
          ..._params,
          beginTime: Moment( Moment(datetime).subtract(1,'years').format('YYYY') + '-01-01' ).format('YYYY-MM-DD HH:mm:ss'),
          endTime: Moment(Moment(datetime).format('YYYY') + '-01-01').format('YYYY-MM-DD HH:mm:ss')
        }
      } else if (this.filterTimeType == 6) { // 前年
        _params = {
          ..._params,
          beginTime: Moment( Moment(datetime).subtract(2,'years').format('YYYY') + '-01-01' ).format('YYYY-MM-DD HH:mm:ss'),
          endTime: Moment(Moment(datetime).subtract(1,'years').format('YYYY') + '-01-01').format('YYYY-MM-DD HH:mm:ss')
        }
      }
      this.params = _params;
      // 加载图标
      this.$toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      });
      // 筛选列表
      this.$api.getOrderList({ pageNum: 1, pageSize: 10, ..._params }).then(res => {
        this.filterPopup = false; // 弹窗隐藏
        this.lists = res.data.records;
        this.total = parseFloat(res.data.total);
        this.$toast.clear();
      })
    },
    goSearch() { // 跳转到搜索页面
      this.$router.push({
        name: 'me-order-search',
        query: {
          back: 'me-order'
        }
      })
    },
    deleteFn(orderId) { // 删除订单
      // 加载图标
      this.$toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      });

      deleteOrder(orderId).then(() => {
        this.$toast.clear();
        this.lists.forEach((item, index) => {
          if (item.id == orderId) {
            this.lists.splice(index, 1);
          }
        })
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
      this.params.pageNum = 1;
      this.$fetch();
    },
    onLoad() { // 加载更多
      if (this.total == this.lists.length) {
        this.loading = false;
        this.finished = true;
        return false;
      }
      this.params.pageNum += 1;
      this.$fetch();
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
        this.lists.forEach((item, index) => {
          if (item.id == this.currentOrder.id) {
            this.lists.splice(index, 1);
          }
        })
      })
    },
    onPay(orderItem) { // 去支付
      this.$router.push({
        name: 'me-pay-payment',
        query: {
          type: 'order',
          amount: orderItem.payAmount,
          orderIds: JSON.stringify({orderIds: [orderItem.id]})
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

          this.lists.forEach((item, index) => {
            if (item.id == orderItem.id) {
              this.lists.splice(index, 1);
            }
          })
        })
      }).catch(() => {

      })
    },
    onEvaluate(orderItem) { // 去评价
      this.$router.push({
        name: 'me-order-rate',
        query: {
          orderId: orderItem.id
        }
      })
    },
    onToggerPay() { // 合并支付
      let productAmount = 0;
      this.lists.forEach(item => {
        this.togetherResult.forEach(resultItem => {
          if (resultItem == item.id) {
            productAmount += parseFloat(item.payAmount);
          }
        })
      })
      this.$router.push({
        name: 'me-pay-payment',
        query: {
          type: 'order',
          amount: productAmount,
          orderIds: JSON.stringify({orderIds: this.togetherResult}),
          // comfirmOrder: 1
        }
      })
    },
    statusFormat(val, item) {
      return val == 0 ? this.$t('unpaid') : val == 1 ? this.$t('to_be_delivered') : val == 2 ? this.$t('unreceived') : val == 3 || val == 4 ? this.$t('completed') : val == 5 ? this.$t('cancelled') : val == 6 ? this.$t('trading_close') : val == 7 ? this.$t('trading_close') : this.$t('other');
    },
    goStoreDetail(storeItem) { // 跳转到店铺首页
      this.$router.push({
        name: 'cart-store-id',
        params: {
          id: storeItem.storeId
        },
        query: {
          tabbarActive: 0,
          sellerId: storeItem.sellerId
        }
      })
    }
  },
} 
</script>

<style lang="less" scoped>
.btn-content{
  position: fixed;
  bottom: 0;
  height: 56px;
}
.h-40{
  height: 40px;
}
.z-100{
  z-index: 100;
}
</style>

<style lang="less">
.order-page{
  padding-bottom: 56px;
  .search-container{
    height: 34px!important;
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
.order-search{
  width: 79%;
  height: 100%;
}
.order-search-filter{
  padding: 40px 12px;
  position: relative;
  .order-search-filter__title{
    padding-left: 8px;
    line-height: 24px;
  }
  .order-search-filter__tags span{
    width: 132px;
    padding: 6px 0;
    background-color: #F5F5F5;
    line-height: 20px;
    margin-top: 14px;
    border: 1px solid transparent;
    &.is-active{
      color: #42B7AE;
      background-color: rgba(66, 183, 174, 0.05);
      border-color: #42B7AE;
    }
  }
}
.order-search__btn{
  position: absolute;
  bottom: 0;
  width: 100%;
  button{
    width: 50%;
    height: 48px;
    outline: none;
    border: none;
  }
  .order-search__btn--reset{
    background-color: rgba(255, 102, 102, 0.05);
  }
}
.h-32{
  height: 32px!important;
}
.gery-border{
  border-color: #eee!important;
  color: #383838!important;
  background-color: transparent!important;
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
.order-page__global-swiper{
  height: 84px;
  .swiper-slide{
    width: 100%;
    position: relative;
  }
}
.more-order-content{
  position: relative;
  .swiper-slide{
    width: 84px!important;
    margin-left: 6px;
    &:first-child{
      margin-left: 0;
    }
  }
  .more-order-content__info{
    position: absolute;
    right: 0;
    top: 0;
    z-index: 1000;
    height: 84px;
    padding-left: 10px;
    max-width: 100px;
    background-color: rgba(255, 255, 255, .8);
  }
}
</style>
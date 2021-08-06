<template>
  <!-- 我的-订单 -->
  <div class="vh-100 bg-grey">
    <van-sticky class="bg-white">
      <BmHeaderNav :left="{ isShow: true, url: '/me' }" :title="$t('me.order.myOrderTitle')" :border="false" />
      <!-- 搜索 -->
      <div class="flex vcenter pl-20 pr-12 bg-white">
        <van-search
          v-model="searchVal"
          shape="round"
          placeholder="请输入搜索关键词"
          class="w-100"
          @click="goSearch"
        > 
          <!-- 右侧图标-点击拍照 -->
          <!-- <template #right-icon>
            <div>
              <van-icon :name="require('@/assets/images/icon/camera-icon.png')" size="0.46rem" />
            </div>
          </template> -->
        </van-search>
        <!-- 筛选 -->
        <van-icon :name="require('@/assets/images/icon/filter-icon.png')" class="ml-12" @click="filterPopup = true" size="0.48rem" />
      </div>

      <!-- 分类 -->
      <van-tabs sticky swipeable animated color="#42B7AE"  @change="getSearchList" class="pt-12 bg-white customs-van-tabs" v-model="typeActive" :ellipsis="false" >
        <van-tab v-for="(productItem, tabIndex) in tabs" :title="productItem.name" :key="'scroll-tab-' + tabIndex" title-class="border-b" :name="productItem.type" />
      </van-tabs>
    </van-sticky>
    
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" class="vh-100">
      <van-list
        v-model="loading"
        :finished="finished"
        @load="onLoad"
        :finished-text="lists.length == 0 ? '' : '没有更多了'"
      >
        <div class="flex between flex-wrap">
          <!-- 空状态  -->
          <empty-status v-if="lists.length === 0" :image="require('@/assets/images/empty/order.png')" :description="$t('common.noRecord')"/>
          <!-- 订单列表 -->
          <div v-else v-for="(item,index) in lists" :key="index" class="w-100 plr-12 mb-12 bg-white pb-20 pt-24">
            <!-- 订单店铺 -->
            <OrderStoreSingle :name="item.storeName" :status="item.status | statusFormat" @goStoreDetail="goOrderDetail(item.items[0].orderId)">
              <!-- 如果是取消状态，则该订单可删除，添加操作展示  -->
              <div slot="other-deal" class="flex vcenter" v-if="item.status == 5 || item.status == 6">
                <span class="block line-style"></span>
                <BmImage 
                  :url="require('@/assets/images/icon/delete-icon.svg')"
                  :width="'0.48rem'" 
                  :height="'0.48rem'"
                  :isLazy="false"
                  @onClick="deleteFn(item.id)"
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
                  ...swiperComponentOption,
                  loop: item.totalQuantity > 4,
                  loopFillGroupWithBlank: item.totalQuantity > 4
                }"
              >
                <swiper-slide v-for="(productItem,productIndex) in item.items" :key="'swiper-' + productIndex">
                  <BmImage 
                    :url="productItem.goodImg"
                    :width="'1.68rem'" 
                    :height="'1.68rem'"
                    :isLazy="false"
                    class="flex-shrink border round-4 hidden"
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
              <BmButton class="fs-14 ml-10 round-8 plr-12 h-32 gery-border" :type="'info'" v-if="(item.paymentType == 1 && item.status == 0) || (item.paymentType == 0 && item.status == 1 && item.payState == 0)" @btnClick="onCancel(item)">取消订单</BmButton>
              <!-- 去支付：在线支付[待付款0] -->
              <BmButton class="fs-14 ml-10 round-8 plr-12 h-32" :type="'info'" v-if="item.paymentType == 1 && item.status == 0" @btnClick="onPay(item)">去支付</BmButton>
              <!-- 去评价：在线支付[已完成4且未评价0]；货到付款[已完成4且未评价0] -->
              <BmButton class="fs-14 ml-10 round-8 plr-12 h-32 gery-border" :type="'info'" v-if="item.hasComment == 0 && item.status == 4">去评价</BmButton>
              <!-- 退款/售后：在线支付[待发货1且已支付1且可售后1,待收货2且已支付1且可售后1,已完成4且可售后1]；货到付款[待发货1且已支付1且可售后1,待收货2且可售后1,已完成4且可售后1] -->
              <BmButton class="fs-14 ml-10 round-8 plr-12 h-32 gery-border" :type="'info'" v-if="(item.paymentType == 1 && (((item.status == 1 || item.status == 2) && item.payState == 1) || item.status == 4)  && item.showAfterSale == 1) || (item.paymentType == 0 && ((item.status == 1 && item.payState == 1) || item.status == 2 || item.status == 4) && item.showAfterSale == 1)">退款/售后</BmButton>
              <!-- 确认收货：在线支付[待收货2且已支付1]；货到付款[待收货2] -->
              <BmButton class="fs-14 ml-10 round-8 plr-12 h-32 gery-border" :type="'info'" v-if="(item.paymentType == 1 && item.status == 2 && item.payState == 1) || (item.paymentType == 0 && item.status == 2)">确认收货</BmButton>
              <!-- 去购买：待发货1,待收货2,待评价3,已完成4,已取消5,超时未付款6,已拒收7,其他8 -->
              <BmButton class="fs-14 ml-10 round-8 plr-12 h-32" :type="'info'" v-if="item.status != 0" @btnClick="onBuy(item)">{{ $t('me.order.buyAgain') }}</BmButton>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>

    <!-- 弹窗筛选 -->
    <van-popup
      v-model="filterPopup"
      position="right"
      class="order-search"
    >
      <div class="order-search-filter">
        <h3 class="fs-16 black fw order-search-filter__title">According to the time</h3>
        <div class="mt-10 black flex between flex-wrap order-search-filter__tags">
          <span :class="{'fs-14 round-8 tc': true, 'is-active': filterTimeType == 1}" @click="filterTimeType = 1">一周之内</span>
          <span :class="{'fs-14 round-8 tc': true, 'is-active': filterTimeType == 2}" @click="filterTimeType = 2">一月之内</span>
          <span :class="{'fs-14 round-8 tc': true, 'is-active': filterTimeType == 3}" @click="filterTimeType = 3">3个月内</span>
          <span :class="{'fs-14 round-8 tc': true, 'is-active': filterTimeType == 4}" @click="filterTimeType = 4">今年</span>
          <span :class="{'fs-14 round-8 tc': true, 'is-active': filterTimeType == 5}" @click="filterTimeType = 5">In {{ beforeOneYear }}</span>
          <span :class="{'fs-14 round-8 tc': true, 'is-active': filterTimeType == 6}" @click="filterTimeType = 6">In {{ beforeTwoYear }}</span>
        </div>
      </div>

      <div class="order-search__btn flex">
        <button class="red fw order-search__btn--reset" @click="filterTimeType = 0">Reset</button>
        <button class="white fw bg-green-linear" @click="onConfirmFilter">Determine</button>
      </div>
    </van-popup>

    <!-- 取消订单原因选择弹窗 -->
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
        <BmButton :type="'info'" class="black round-8 w-168 h-48 cancel-btn" @click="isCancelShow = false">Cancel</BmButton>
        <BmButton class="fs-16 round-8 w-168 h-48" @click="cancelConfirm">Confirm</BmButton>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Search, Tab, Tabs, Popup, List, PullRefresh, Sticky, Cell, CellGroup, RadioGroup, Radio } from 'vant';
import OrderSingle from '@/components/OrderSingle';
import OrderStoreSingle from '@/components/OrderStoreSingle';
import { cancelOrder, getOrderReasonList, deleteOrder } from '@/api/order';
import Moment from 'moment';

export default {
  middleware: 'authenticated',
  components: {
    vanSearch: Search,
    vanTab: Tab,
    vanTabs: Tabs,
    vanPopup: Popup,
    vanList: List,
    vanPullRefresh: PullRefresh,
    vanSticky: Sticky,
    vanCell: Cell,
    vanCellGroup: CellGroup,
    vanRadioGroup: RadioGroup,
    vanRadio: Radio,
    OrderSingle: OrderSingle,
    OrderStoreSingle: OrderStoreSingle
  },
  data() {
    return {
      searchVal: '',
      tabs: [
        {
          name: 'All',
          type: 100
        },
        {
          name: 'Unpaid',
          type: 0
        },
        {
          name: 'unreceived',
          type: 2
        },
        {
          name: 'Done',
          type: 4
        },
        {
          name: 'Cancelled',
          type: 5
        }
      ],
      lists: [],
      filterPopup: false,
      typeActive: this.$route.query.type ? this.$route.query.type : 100,
      loading: false,
      finished: false,
      refreshing: false,
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
      filterTimeType: 0,
      beforeOneYear: '',
      beforeTwoYear: ''
    }
  },
  async fetch() {
    if (this.$route.query.type && this.isFirst) this.typeActive = this.tabs[this.$route.query.type].type;

    if (this.typeActive == 100) { // 全部
      this.params = {
        pageNum: this.params.pageNum,
        pageSize: this.params.pageSize
      }
    } else if (this.filterTimeType == 0) {
      this.params = {
        pageNum: this.params.pageNum,
        pageSize: this.params.pageSize,
        status: this.typeActive
      }
    }
    
    const listData = await this.$api.getOrderList(this.params);
    if (listData.code != 0) return false;
    if (this.isFirst) {
      this.$toast.clear();
    }
    this.lists = this.params.pageNum == 1 ? listData.data.records : this.lists.concat(listData.data.records);
    this.total = listData.data.total;
    this.loading = false;
    this.refreshing = false;
    this.isFirst = false;
  },
  filters: {
    statusFormat(val) {
      return val == 0 ? '待付款' : val == 1 ? '待发货' : val == 2 ? '待收货' : val == 3 ? '待评价' : val == 4 ? '已完成' : val == 5 ? '已取消' : val == 6 ? '交易关闭' : val == 7 ? '已拒收' : '其他';
    }
  },
  activated() {
    // 加载图标
    this.$toast.loading({
      forbidClick: true,
      loadingType: 'spinner',
      duration: 0
    });
    this.isFirst = true;
    this.$fetch();
    this.beforeOneYear = Moment(parseInt(this.$store.state.nowTime)).subtract(1,'years').format('YYYY');
    this.beforeTwoYear = Moment(parseInt(this.$store.state.nowTime)).subtract(2,'years').format('YYYY');
    // 取消订单原因，因为整个列表都是同一种类型，所以就只在全局引入一次就好了
    getOrderReasonList({ orderType: 1, applyType: 0, goodsStatus: 0 }).then(res => {
      if (res.code != 0) return false;

      this.cancelReasonList = res.data;
    })
  },
  methods: {
    async getSearchList() { // 获取分类列表
      this.params.pageNum = 1;
      this.$fetch();
    },
    onConfirmFilter() { // 过滤
      let _params = {
        pageNum: 1,
        pageSize: 10
      };
      if (this.filterTimeType == 1) _params.beforeDay = 7; // 一周之内
      let datetime = parseInt(this.$store.state.nowTime);
      if (this.filterTimeType == 2) { // 一个月内
        _params = {
          beginTime: Moment(datetime).subtract(1,'months').format('YYYY-MM-DD HH:mm:ss'),
          endTime: Moment(datetime).format('YYYY-MM-DD HH:mm:ss')
        }
      } else if (this.filterTimeType == 3) { // 3个月内
        _params = {
          beginTime: Moment(datetime).subtract(3,'months').format('YYYY-MM-DD HH:mm:ss'),
          endTime: Moment(datetime).format('YYYY-MM-DD HH:mm:ss')
        }
      } else if (this.filterTimeType == 4) { // 今年
        _params = {
          beginTime: Moment(Moment(datetime).format('YYYY') + '-01-01').format('YYYY-MM-DD HH:mm:ss'),
          endTime: Moment(datetime).format('YYYY-MM-DD HH:mm:ss')
        }
      } else if (this.filterTimeType == 5) { // 去年
        _params = {
          beginTime: Moment( Moment(datetime).subtract(1,'years').format('YYYY') + '-01-01' ).format('YYYY-MM-DD HH:mm:ss'),
          endTime: Moment(Moment(datetime).format('YYYY') + '-01-01').format('YYYY-MM-DD HH:mm:ss')
        }
      } else if (this.filterTimeType == 6) { // 前年
        _params = {
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
        this.total = res.data.total;
      })
    },
    goSearch() { // 跳转到搜索页面
      this.$router.push({
        name: 'me-order-search'
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
        this.$fetch();
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
    onLoad() {
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
        this.$fetch();
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
    }
  },
} 
</script>

<style lang="less">
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
.mt-22{
  margin-top: 22px;
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
  .more-order-content__info{
    position: absolute;
    right: 0;
    top: 0;
  }
}
</style>
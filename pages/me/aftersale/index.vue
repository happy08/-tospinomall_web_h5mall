<template>
  <!-- 我的-售后列表 -->
  <div class="v-percent-100 bg-grey pt-46">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('refund_after_sale')" :fixed="true" />
    <!-- 售后列表 -->
    <van-tabs sticky swipeable animated :offset-top="46" color="#42B7AE" class="customs-van-tabs" :ellipsis="false" @change="getSearchList" v-model="tabActive">
      <van-tab v-for="(categoryItem, tabIndex) in $t('after_sale_status')" :title="titleFormat(categoryItem, tabIndex)" :key="'scroll-tab-' + tabIndex" title-class="border-b pb-0" :name="tabIndex">
        <PullRefresh :refreshing="refreshing" @refresh="onRefresh" class="custom-min-height-94">
          <div class="pb-20 bg-grey">
            <!-- 空列表 -->
            <empty-status v-if="lists.length === 0" :image="require('@/assets/images/empty/order.png')" />
            <van-list
              v-else
              v-model="loading"
              :finished="finished"
              finished-text=""
              @load="onLoad"
              class="bg-grey"
            >
              <!-- 列表展示 -->
              <div v-for="(orderitem, index) in lists" :key="index" :class="{'w-100 plr-20 pb-20 pt-24 bg-white': true, 'mt-12': index != 0}">
                <!-- 售后订单列表1 -->
                <template v-if="tabActive == 0">
                  <OrderStoreSingle :name="orderitem.storeName" :showArrow="false" />
                  <div v-for="(productItem, productIndex) in orderitem.items" :key="'product-' + productIndex">
                    <OrderSingle class="mt-20" 
                      :product_num="0" 
                      :product_desc="productItem.goodName" 
                      :product_size="productItem.goodAttr" 
                      :price="productItem.realAmount"
                      :image="productItem.goodImg"
                      @onClick="goProduct(productItem.goodId)"
                    >
                      <p class="light-grey fs-14 lh-20 mt-8 ws-nowrap" slot="product-num">{{ $t('total_piece', { replace_tip: productItem.goodQuantity }) }}</p>
                    </OrderSingle>
                    
                    <!-- 售后申请 -->
                    <div :class="{'mt-24 flex vcenter': true, 'hend': productItem.showAfterSale != 0, 'between': productItem.showAfterSale == 0}" v-if="tabActive === 0">
                      <!-- 订单售后状态showAfterSale：-1->数量达到不可售后 0->时间达到不可售后 1->可以售后 -->
                      <div v-if="productItem.showAfterSale == 0" class="tl">{{ $t('the_goods_have_timed_out') }}</div>
                      <BmButton :type="'info'" class="h-32" v-if="productItem.showAfterSale == 1" @click="afterSales(productItem)">{{ $t('apply_for_after_sales') }}</BmButton>
                      <BmButton :type="'info'" class="h-32 time-out" v-else>{{ $t('apply_for_after_sales') }}</BmButton>
                    </div>
                  </div>
                </template>

                <!-- 售后申请列表2/3 -->
                <div v-else class="w-100">
                  <OrderStoreSingle :name="orderitem.storeName" :status="orderitem.returnType == 0 ? $t('refund_no_return') : $t('return_refund')" :showArrow="false" />
                  <template v-if="orderitem.orderReturnItems.length == 1">
                    <OrderSingle class="mt-20" 
                      :product_num="0" 
                      :product_desc="orderReturnItem.productName" 
                      :product_size="orderReturnItem.productAttr" 
                      :price="orderitem.returnAmount"
                      :image="orderReturnItem.productImage"
                      @onClick="goReturnDetail(orderitem.id)"
                      v-for="orderReturnItem, orderReturnIndex in orderitem.orderReturnItems"
                      :key="'order-return-item-' + orderReturnIndex"
                    > 
                      <p class="light-grey fs-14 lh-20 mt-8 ws-nowrap" slot="product-num">{{ $t('total_piece', { replace_tip: orderReturnItem.returnQuantity }) }}</p>
                    </OrderSingle>
                  </template>
                  <div v-else class="more-order-content" @click="goReturnDetail(orderitem.id)">
                    <swiper
                      ref="swiperComponentRef"
                      :class="{ 'swiper mt-12 order-page__global-swiper': true, 'swiper-no-swiping' : orderitem.orderReturnItems.length <= 4 }"
                      :options="{
                        ...swiperComponentOption
                      }"
                    >
                      <swiper-slide v-for="(productItem,productIndex) in orderitem.orderReturnItems" :key="'swiper-' + productIndex" class="round-4 hidden">
                        <BmImage 
                          :url="productItem.productImage"
                          :width="'1.68rem'" 
                          :height="'1.68rem'"
                          :isLazy="false"
                          :isShow="true"
                          class="flex-shrink border"
                          :alt="productItem.productName"
                        />
                        <!-- <div class="product-price">{{ $store.state.rate.currency }}{{ productItem.productRealAmount }}</div> -->
                      </swiper-slide>
                    </swiper>
                    <div class="tr more-order-content__info">
                      <p class="fs-18 fw black lh-20">{{ $store.state.rate.currency }}{{ orderitem.returnAmount }}</p>
                      <p class="light-grey fs-14 lh-20 mt-8">{{ $t('total_piece', { replace_tip: orderitem.returnQuantity }) }}</p>
                    </div>
                  </div>

                  <div class="flex between mt-18">
                    <div class="fs-14 light-grey w-auto">
                      <p>{{ statusFormat(orderitem.status, orderitem.deliveryType, orderitem.orderType) }}</p>
                      <!-- 退款成功 -->
                      <p v-if="orderitem.status == 5">{{ $t('refund') }}{{ $store.state.rate.currency }}{{ orderitem.returnAmount }}</p>
                    </div>
                    <!-- 处理中 -->
                    <!-- 工单状态involvedStatus： 0未开始 1->待举证 2->平台处理中 3->工单关闭 4->工单已完结 -->
                    <!-- status: 1->商家/运营待处理 2->待自行寄回/待上门取件 3商家/运营待收货 4->待退款 5->退款成功 6->关闭售后单 7->商家/运营驳回申请 8->商家/运营拒收退货商品 -->
                    <!-- 订单类型orderType：1->FBM订单 2->FBT订单 -->
                    <div class="flex hend">
                      <!-- 客服介入 -->
                      <BmButton :type="'info'" class="h-32 mr-12 time-out" v-if="(orderitem.status == 7 || orderitem.status == 8) && orderitem.involvedStatus == 0 && orderitem.orderType == 1 && orderitem.surplusTime > 0" @btnClick="$router.push({ name: 'me-aftersale-proof-id', params: { id: orderitem.id } })">{{ $t('customer_service_intervention') }}</BmButton>
                      <!-- 追加举证 -->
                      <!-- <BmButton :type="'info'" class="h-32 time-out" v-if="(orderitem.status == 7 || orderitem.status == 8) && orderitem.involvedStatus == 1 && orderitem.orderType == 1 && orderitem.surplusTime > 0">追加举证</BmButton> -->
                      <!-- 撤销申请 -->
                      <BmButton :type="'info'" class="h-32" v-if="orderitem.status == 1 || orderitem.status == 2 || (orderitem.status == 7 && orderitem.involvedStatus == 0) || (orderitem.status == 8 && orderitem.involvedStatus == 0)" @btnClick="onRevokeApply(orderitem.id)">{{ $t('cancel_the_application') }}</BmButton>
                      <!-- 撤销工单 -->
                      <BmButton :type="'info'" class="h-32" v-if="(orderitem.status == 7 || orderitem.status == 8) && (orderitem.involvedStatus == 1 || orderitem.involvedStatus == 2)" @btnClick="onCancelApply(orderitem.workId)">{{ $t('cancel_the_application') }}</BmButton>
                      <!-- 删除 -->
                      <BmButton :type="'info'" class="h-32 time-out" v-if="orderitem.status == 5 || orderitem.status == 6" @btnClick="onRemoveOrder(orderitem.id)">{{ $t('delete') }}</BmButton>
                      <!-- 查看详情 -->
                      <BmButton :type="'info'" class="h-32 ml-12" v-if="orderitem.status == 5 || orderitem.status == 6" @btnClick="$router.push({ name: 'me-aftersale-detail-id', params: { id: orderitem.id } })">{{ $t('watch_detail') }}</BmButton>
                      <!-- 修改申请 -->
                      <!-- <BmButton :type="'info'" class="h-32 time-out" v-if="orderitem.status == 1 || orderitem.status == 7">修改申请</BmButton> -->
                      <!-- 填写运单号 -->
                      <!-- <BmButton :type="'info'" class="h-32 time-out" v-if="orderitem.status == 2 && orderitem.deliveryType == 1">填写运单号</BmButton> -->
                      <!-- 修改物流单号 -->
                      <!-- <BmButton :type="'info'" class="h-32 time-out" v-if="orderitem.status == 3 && orderitem.deliveryType == 1">修改物流单号</BmButton> -->
                    </div>
                  </div>
                </div>
              </div>
            </van-list>
            
          </div>
        </PullRefresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { Tab, Tabs, List } from 'vant';
import OrderSingle from '@/components/OrderSingle';
import OrderStoreSingle from '@/components/OrderStoreSingle';
import { getOrderAfterSalesCount, removeOrder, revokeApply, cancelApply } from '@/api/order';
import PullRefresh from '@/components/PullRefresh';
import 'swiper/css/swiper.css';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';

export default {
  middleware: 'authenticated',
  components: {
    vanTab: Tab,
    vanTabs: Tabs,
    vanList: List,
    OrderStoreSingle,
    OrderSingle,
    PullRefresh,
    swiper: Swiper,
    swiperSlide: SwiperSlide
  },
  data() {
    return {
      lists: [],
      tabActive: 0,
      afterSalesCount: 0,
      recordCount: 0,
      untreatedCount: 0,
      pageNum: 1,
      pageSize: 10,
      refreshing: {
        isFresh: false
      },
      loading: false,
      finished: false,
      total: 0,
      swiperComponentOption: { // 一排四列 滚动
        slidesPerView: 'auto',
        // slidesPerGroup: 4,
        spaceBetween: 0,
        // loop: true,
        // loopFillGroupWithBlank: true,
        pagination: {
          el: '.swiper-group-pagination',
          clickable: true,
        },
      },
      isTab: false
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.name === 'me') {
        vm.tabActive = 0;
        vm.isTab = false;
      }
      if (from.name === 'me' || from.name === 'me-order' || from.name === 'me-order-detail-id' || from.name == null) {
        vm.$fetch();
      }
    })
  },
  async fetch() {
    let _params = {};
    let listData;
    this.tabActive = this.$route.query.orderId && this.isTab == false ? 0 : this.tabActive;
    if (this.tabActive > 0) {
      _params.status = this.tabActive + 1;
      listData = await this.$api.getAfterSaleStatusList({ pageNum: this.pageNum, pageSize: this.pageSize, ..._params }); // 申请原因/处理中列表
    } else {
      if (this.$route.query.orderId) {
        this.afterSalesCount = 1;
        listData = await this.$api.getAfterSaleList({ pageNum: this.pageNum, pageSize: this.pageSize, status: 1, orderId: this.$route.query.orderId}); // 某一个订单售后申请列表
      } else {
        listData = await this.$api.getAfterSaleList({ pageNum: this.pageNum, pageSize: this.pageSize, status: 1}); // 售后申请列表
      }
    }

    if (listData.code != 0) return false;
    this.lists = this.pageNum == 1 ? listData.data.records : this.lists.concat(listData.data.records);
    this.loading = false;
    this.refreshing.isFresh = false;
    this.total = listData.data.total;
    getOrderAfterSalesCount().then(res => {
      if (!res.data) return false;
      
      this.afterSalesCount = this.$route.query.orderId ? 1 : parseFloat(res.data.afterSalesCount); // 申请售后总数
      this.recordCount = parseFloat(res.data.recordCount); // 申请记录总数
      this.untreatedCount = parseFloat(res.data.untreatedCount); // 未处理总数
    })
  },
  activated() {
  },
  deactivated() {
    this.isTab = false;
  },
  methods: {
    titleFormat(val, titleIndex) {
      return `${val} (${titleIndex == 0 ? this.afterSalesCount : titleIndex == 1 ? this.untreatedCount : this.recordCount})`;
    },
    getSearchList() { // 获取列表数据
      this.lists = [];
      this.pageNum = 1;
      this.finished = false;
      this.isTab = true;
      this.$fetch();
    },
    goProduct(productId) { // 跳转到商品详情页
      this.$router.push({
        name: 'cart-product-id',
        params:{
          id: productId
        }
      })
    },
    afterSales(orderItem) { // 跳转到售后申请页面
      this.$router.push({
        name: 'me-aftersale-apply',
        query: {
          itemId: orderItem.id,
          status: this.tabActive + 1
        }
      })
    },
    goReturnDetail(returnId) { // 跳转到退款详情页面
      this.$router.push({
        name: 'me-aftersale-detail-id',
        params: {
          id: returnId
        }
      })
    },
    onRefresh() { // 下拉刷新
      this.pageNum = 1;
      if (this.$route.query.orderId && this.tabActive == 0) { // 从我的订单页面跳转过来查看售后订单，刷新之后展示全部售后订单
        this.$router.replace({
          name: 'me-aftersale'
        })
        setTimeout(() => {
          this.$fetch();
        }, 100);
        return false;
      }
      this.$fetch();
    },
    onLoad() {
      if (this.total == this.lists.length) {
        this.loading = false;
        this.finished = true;
        return false;
      }
      this.pageNum += 1;
      this.$fetch();
    },
    onRemoveOrder(id) { // 删除订单
      removeOrder(id).then(() => {
        this.lists.forEach((item, index) => {
          if (item.id == id) {
            this.lists.splice(index, 1);
          }
        })
      })
    },
    onRevokeApply(id) { // 撤销申请
      revokeApply(id).then(() => {
        this.lists.forEach((item, index) => {
          if (item.id == id) {
            this.lists.splice(index, 1);
            this.untreatedCount -= 1;
            this.recordCount += 1;
          }
        })
      })
    },
    onCancelApply(id) { // 撤销工单的申请
      cancelApply(id).then(() => {
        this.lists.forEach((item, index) => {
          if (item.workId == id) {
            this.lists.splice(index, 1);
            this.untreatedCount -= 1;
            this.recordCount += 1;
          }
        })
      })
    },
    statusFormat(val, deliveryType, orderType) { // 格式化状态文案
      return val == 1 ? this.$t('wait_process', { replace_tip: orderType == 1 ? this.$t('merchant'): this.$t('platform') }) : val == 2 ? (deliveryType == 1 ? this.$t('wait_return_self') : this.$t('wait_pick_up')) : val == 3 ? this.$t('wait_receive', { replace_tip: orderType == 1 ? this.$t('merchant'): this.$t('platform') }) : val == 4 ? this.$t('wait_refund') : val == 5 ? this.$t('refund_successfully') : val == 6 ? this.$t('close_after_sale_order') : val == 7 ? this.$t('reject_apply', { replace_tip: orderType == 1 ? this.$t('merchant'): this.$t('platform') }) : val == 8 ? this.$t('rejection_goods', { replace_tip: orderType == 1 ? this.$t('merchant'): this.$t('platform') }) : '';
    }
  },
}
</script>

<style lang="less" scoped>
.time-out{
  border-color: #eee!important;
  color: #383838!important;
  background-color: transparent!important;
}
.mt-18{
  margin-top: 18px;
}
.w-auto{
  width: fit-content;
  max-width: 60%;
}
.order-page__global-swiper{
  height: 84px;
  .swiper-slide{
    width: 84px;
    position: relative;
    margin-left: 6px;
    &:first-child{
      margin-left: 0;
    }
    .product-price{
      position: absolute;
      bottom: 0;
      width: 82px;
      left: 1px;
      color: #fff;
      background-color: rgba(0, 0, 0, .65);
      text-align: center;
      padding-top: 2px;
      padding-bottom: 2px;
    }
  }
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
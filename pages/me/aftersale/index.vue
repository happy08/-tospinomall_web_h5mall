<template>
  <!-- 我的-售后列表 -->
  <div class="v-percent-100 bg-grey pt-46">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('refund_after_sale')" :fixed="true" />
    <!-- 售后列表 -->
    <van-tabs sticky swipeable animated :offset-top="46" color="#42B7AE" class="customs-van-tabs" :ellipsis="false" @change="getSearchList" v-model="tabActive">
      <van-tab v-for="(categoryItem, tabIndex) in $t('after_sale_status')" :title="titleFormat(categoryItem, tabIndex)" :key="'scroll-tab-' + tabIndex" title-class="border-b pb-0" :name="tabIndex">
        <PullRefresh :refreshing="refreshing" @refresh="onRefresh">
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
                  <OrderStoreSingle :name="orderitem.storeName" />
                  <div v-for="(productItem, productIndex) in (orderitem.items)" :key="'product-' + productIndex">
                    <OrderSingle class="mt-20" 
                      :product_num="productItem.goodQuantity" 
                      :product_desc="productItem.goodName" 
                      :product_size="productItem.goodAttr" 
                      :price="productItem.goodPrice"
                      :image="productItem.goodImg"
                      @onClick="goProduct(productItem.goodId)" />
                    
                    <!-- 售后申请 -->
                    <div :class="{'mt-24 flex vcenter': true, 'hend': productItem.showAfterSale != 0, 'between': productItem.showAfterSale == 0}" v-if="tabActive === 0">
                      <!-- 订单售后状态showAfterSale：-1->数量达到不可售后 0->时间达到不可售后 1->可以售后 -->
                      <div v-if="productItem.showAfterSale == 0" class="tl">The goods have timed out</div>
                      <BmButton :type="'info'" class="h-32" v-if="productItem.showAfterSale == 1" @click="afterSales(productItem)">{{ $t('apply_for_after_sales') }}</BmButton>
                      <BmButton :type="'info'" class="h-32 time-out" v-else>{{ $t('apply_for_after_sales') }}</BmButton>
                    </div>
                  </div>
                </template>

                <!-- 售后申请列表2/3 -->
                <div v-else class="w-100">
                  <OrderStoreSingle :name="orderitem.storeName" :status="orderitem.returnType == 0 ? $t('refund_no_return') : $t('return_refund')" />
                  <OrderSingle class="mt-20" 
                    :product_num="orderitem.returnQuantity" 
                    :product_desc="orderitem.productName" 
                    :product_size="orderitem.productAttr" 
                    :price="orderitem.productPrice"
                    :image="orderitem.productImage"
                    @onClick="goReturnDetail(orderitem.id)" 
                  />
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

export default {
  middleware: 'authenticated',
  components: {
    vanTab: Tab,
    vanTabs: Tabs,
    vanList: List,
    OrderStoreSingle,
    OrderSingle,
    PullRefresh
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
      total: 0
    }
  },
  async fetch() {
    let _params = {};
    let listData;
    if (this.tabActive > 0) {
      _params.status = this.tabActive + 1;
      listData = await this.$api.getAfterSaleStatusList({ pageNum: this.pageNum, pageSize: this.pageSize, ..._params }); // 申请原因/处理中列表
    } else {
      if (this.$route.query.orderId) {
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
  },
  activated() {
    getOrderAfterSalesCount().then(res => {
      if (res.code != 0) return false;
      
      this.afterSalesCount = res.data.afterSalesCount; // 申请售后总数
      this.recordCount = res.data.recordCount; // 申请记录总数
      this.untreatedCount = res.data.untreatedCount; // 未处理总数
    })
    this.$fetch();
  },
  methods: {
    titleFormat(val, titleIndex) {
      return `${val} (${titleIndex == 0 ? this.afterSalesCount : titleIndex == 1 ? this.untreatedCount : this.recordCount})`;
    },
    getSearchList() { // 获取列表数据
      this.lists = [];
      this.pageNum = 1;
      this.finished = false;
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
      if (this.$route.query.orderId) { // 从我的订单页面跳转过来查看售后订单，刷新之后展示全部售后订单
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
</style>
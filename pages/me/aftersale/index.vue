<template>
  <!-- 我的-售后列表 -->
  <div class="vh-100 bg-grey pt-46">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.afterSale.title')" :fixed="true" />
    <!-- 售后列表 -->
    <van-tabs sticky swipeable animated :offset-top="46" color="#42B7AE" class="bg-white customs-van-tabs" :ellipsis="false" @change="getSearchList" v-model="tabActive">
      <van-tab v-for="(categoryItem, tabIndex) in categoryList" :title="titleFormat(categoryItem, tabIndex)" :key="'scroll-tab-' + tabIndex" title-class="border-b pb-0" :name="tabIndex">
        <div class="pb-20 flex between flex-wrap bg-grey">
          <!-- 空列表 -->
          <empty-status v-if="lists.length === 0" :image="require('@/assets/images/empty/order.png')" />
          <!-- 列表展示 -->
          <div v-else v-for="(orderitem, index) in lists" :key="index" :class="{'w-100 plr-20 pb-20 pt-24 bg-white': true, 'mt-12': index != 0}">
            <OrderStoreSingle :name="orderitem.storeName" />
            <!-- 售后订单列表1 -->
            <template v-if="tabActive == 0">
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
                  <BmButton :type="'info'" class="h-32" v-if="productItem.showAfterSale == 1" @click="afterSales(productItem)">{{ $t('me.afterSale.applySales') }}</BmButton>
                  <BmButton :type="'info'" class="h-32 time-out" v-else>{{ $t('me.afterSale.applySales') }}</BmButton>
                </div>

                <!-- 处理中 -->
                <div class="mt-24 flex hend" v-show="tabActive === 1">
                  <!-- 未超时 -->
                  <BmButton :type="'info'" class="h-32">{{ $t('me.afterSale.cancelApplication') }}</BmButton>
                  <!-- 已超时 -->
                  <BmButton :type="'info'" class="h-32 time-out">{{ $t('me.afterSale.details') }}</BmButton>
                </div>

                <!-- 申请记录 -->
                <div class="mt-24 flex hend" v-show="tabActive === 2">
                  <!-- 未超时 -->
                  <BmButton :type="'info'" class="h-32">{{ $t('me.afterSale.details') }}</BmButton>
                  <!-- 已超时 -->
                  <BmButton :type="'info'" class="h-32 time-out">{{ $t('common.delete') }}</BmButton>
                  <!-- 没有批准 -->
                  <BmButton :type="'info'" class="h-32">{{ $t('me.afterSale.customerService') }}</BmButton>
                </div>
              </div>
            </template>

            <!-- 售后申请列表2/3 -->
            <template v-else>
              <OrderSingle class="mt-20" 
                :product_num="orderitem.returnQuantity" 
                :product_desc="orderitem.productName" 
                :product_size="orderitem.productAttr" 
                :price="orderitem.productPrice"
                :image="orderitem.productImage" 
                
                @onClick="goProduct(orderitem.productId)" />
            </template>
            
            <!-- <div class="driver-line fr"></div> -->
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { Tab, Tabs } from 'vant';
import OrderSingle from '@/components/OrderSingle';
import OrderStoreSingle from '@/components/OrderStoreSingle';
import { getOrderAfterSalesCount } from '@/api/order';

export default {
  middleware: 'authenticated',
  components: {
    vanTab: Tab,
    vanTabs: Tabs,
    OrderStoreSingle,
    OrderSingle
  },
  data() {
    return {
      lists: [],
      categoryList: ['After-sale application', 'Processing', 'Application record'],
      tabActive: 0,
      afterSalesCount: 0,
      recordCount: 0,
      untreatedCount: 0,
      pageNum: 1,
      pageSize: 10
    }
  },
  async fetch() {
    let _params = {};
    let listData;
    if (this.tabActive > 0) {
      _params.status = this.tabActive + 1;
      listData = await this.$api.getAfterSaleStatusList({ pageNum: this.pageNum, pageSize: this.pageSize, ..._params }); // 申请原因/处理中列表
    } else {
      listData = await this.$api.getAfterSaleList({ pageNum: this.pageNum, pageSize: this.pageSize, status: 1}); // 售后申请列表
    }

    if (listData.code != 0) return false;
    this.lists = listData.data.records;
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
      return `${val} ${titleIndex == 0 ? this.afterSalesCount : titleIndex == 1 ? this.untreatedCount : this.recordCount}`;
    },
    getSearchList() { // 获取列表数据
      this.pageNum = 1;
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
    }
  },
}
</script>

<style lang="less" scoped>
.driver-line{
  width: 209px;
  height: 1px;
  background-color: #eee;
  margin-top: 25px;
}
.time-out{
  border-color: #eee!important;
  color: #BFBFBF!important;
  background-color: transparent!important;
}
</style>
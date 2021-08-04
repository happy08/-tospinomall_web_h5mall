<template>
  <!-- 我的-订单 -->
  <div class="vh-100 bg-grey">
    <van-sticky class="bg-white">
      <BmHeaderNav :left="{ isShow: true }" :title="$t('me.order.myOrderTitle')" :border="false" />
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
          <div v-else v-for="(item,index) in lists" :key="index" class="w-100 plr-12 mb-12 bg-white pb-20 pt-24">
            <!-- 订单店铺 -->
            <OrderStoreSingle :name="item.storeName" :status="item.status | statusFormat" @goStoreDetail="goStoreDetail(item.storeId)">
              <!-- 如果是取消状态，则该订单可删除，添加操作展示  -->
              <div slot="other-deal" class="flex vcenter" v-if="item.status == 5 || item.status == 6">
                <span class="block line-style"></span>
                <BmImage 
                  :url="require('@/assets/images/icon/delete-icon.svg')"
                  :width="'0.48rem'" 
                  :height="'0.48rem'"
                  :isLazy="false"
                  @click="deleteFn"
                />
              </div>
            </OrderStoreSingle>
            <!-- 订单列表详情 -->
            <div v-for="(productItem,productIndex) in item.items" :key="productIndex">
              <OrderSingle
                class="mt-20"
                :image="productItem.goodImg" 
                :product_desc="productItem.goodName"
                :product_size="productItem.goodAttr"
                :price="productItem.goodPrice"
                :product_num="productItem.goodQuantity"
                @onClick="goOrderDetail(productItem.orderId)"
              />
              <div class="w-100 bg-white btn-content flex hend vcenter" v-if="productItem.status == 4 || productItem.status == 5 || productItem.status == 6">
                <!-- Buy Again -->
                <BmButton class="fs-16 ml-10 rount-0 plr-30 btn-content__buy" @click="goPay">{{ $t('me.order.buyAgain') }}</BmButton>
              </div>
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
          <span class="fs-14 round-8 tc">within a week</span>
          <span class="fs-14 round-8 tc">within a mouth</span>
          <span class="fs-14 round-8 tc">within 3 mouths</span>
          <span class="fs-14 round-8 tc">This year</span>
          <span class="fs-14 round-8 tc">In 2020</span>
          <span class="fs-14 round-8 tc">In 2019</span>
        </div>
      </div>

      <div class="order-search__btn flex">
        <button class="red fw order-search__btn--reset">Reset</button>
        <button class="white fw bg-green-linear" @click="onFilter">Determine</button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Search, Tab, Tabs, Popup, List, PullRefresh, Sticky } from 'vant';
import OrderSingle from '@/components/OrderSingle';
import OrderStoreSingle from '@/components/OrderStoreSingle';

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
      isFirst: true // 是否是首次进入
    }
  },
  async fetch() {
    if (this.$route.query.type && this.isFirst) this.typeActive = this.tabs[this.$route.query.type].type;

    if (this.typeActive == 100) { // 全部
      this.params = {
        pageNum: this.params.pageNum,
        pageSize: this.params.pageSize
      }
    } else {
      this.params = {
        pageNum: this.params.pageNum,
        pageSize: this.params.pageSize,
        status: this.typeActive
      }
    }
    const listData = await this.$api.getOrderList(this.params);
    if (listData.code != 0) return false;

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
    this.isFirst = true;
    this.$fetch();
  },
  methods: {
    async getSearchList() { // 获取分类列表
      this.params.pageNum = 1;
      this.$fetch();
    },
    onFilter() { // 过滤
      this.filterPopup = false; // 弹窗隐藏
    },
    goSearch() { // 跳转到搜索页面
      this.$router.push({
        name: 'me-order-search'
      })
    },
    deleteFn() { // 删除订单

    },
    goStoreDetail(id) { // 跳转到店铺详情
      this.$router.push({
        name: 'cart-store-id',
        params: {
          id: id
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
      this.params.pageNum = 1;
      this.$fetch();
    },
    onLoad() {
      console.log('--------')
      if (this.total == this.lists.length) {
        this.loading = false;
        this.finished = true;
        return false;
      }
      this.params.pageNum += 1;
      this.$fetch();
    },
    goPay() { // 再次购买

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
</style>
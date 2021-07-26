<template>
  <!-- 我的-订单 -->
  <div>
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.order.myOrderTitle')" :border="false" />
    
    <!-- 搜索 -->
    <div class="flex vcenter ml-20 mr-12">
      <van-search
        v-model="searchVal"
        shape="round"
        placeholder="请输入搜索关键词"
        class="bg-white w-100"
        @click="goSearch"
      > 
        <!-- 右侧图标-点击拍照 -->
        <template #right-icon>
          <div>
            <van-icon :name="require('@/assets/images/icon/camera-icon.png')" size="0.46rem" />
            <!-- <input type="file" capture="camera" /> -->
          </div>
        </template>
      </van-search>
      <!-- 筛选 -->
      <van-icon :name="require('@/assets/images/icon/filter-icon.png')" class="ml-12" @click="filterPopup = true" size="0.48rem" />
    </div>

    <!-- 分类 -->
    <van-tabs sticky swipeable animated :offset-top="44" color="#42B7AE"  @change="getSearchList" class="mt-12" v-model="typeActive">
      <van-tab v-for="(productItem, tabIndex) in tabs" :title="productItem.name" :key="'scroll-tab-' + tabIndex" title-class="pb-0 border-b" :name="productItem.type">
        <div class="mlr-12 mt-20 flex between flex-wrap">
          <!-- 空状态  -->
          <empty-status v-if="lists.length === 0" :image="require('@/assets/images/empty/order.png')" :description="$t('common.noRecord')"/>
          <div v-else>
            <!-- 订单店铺 -->
            <OrderStoreSingle>
              <!-- 如果是取消状态，则该订单可删除，添加操作展示  -->
              <div slot="other-deal" class="flex vcenter">
                <span class="block line-style"></span>
                <BmImage 
                  :url="require('@/assets/images/icon/delete-icon.svg')"
                  :width="'0.48rem'" 
                  :height="'0.48rem'"
                  :isLazy="false"
                  @click="deleteFn"
                ></BmImage>
              </div>
            </OrderStoreSingle>
            <!-- 订单列表详情 -->
            <OrderSingle class="mt-20" />
          </div>
        </div>
      </van-tab>
    </van-tabs>


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
import { Search, Tab, Tabs, Popup } from 'vant';
import OrderSingle from '@/components/OrderSingle';
import OrderStoreSingle from '@/components/OrderStoreSingle';

export default {
  middleware: 'authenticated',
  components: {
    vanSearch: Search,
    vanTab: Tab,
    vanTabs: Tabs,
    vanPopup: Popup,
    OrderSingle: OrderSingle,
    OrderStoreSingle: OrderStoreSingle
  },
  asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    return {
      searchVal: '',
      tabs: [
        {
          name: 'All',
          type: 0
        },
        {
          name: 'Unpaid',
          type: 1
        },
        {
          name: 'unreceived',
          type: 2
        },
        {
          name: 'Done',
          type: 3
        },
        {
          name: 'Cancelled',
          type: 4
        }
      ],
      lists: [],
      filterPopup: false,
      typeActive: route.query.type ? route.query.type : 0
    }
  },
  methods: {
    getSearchList() { // 获取分类列表

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
</style>
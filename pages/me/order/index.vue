<template>
  <!-- 我的-订单 -->
  <div>
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.order.myOrderTitle')"></BmHeaderNav>
    <!-- 搜索 -->
    <div class="flex vcenter ml-20 mr-12 mtb-8">
      <van-search
        v-model="searchVal"
        shape="round"
        placeholder="请输入搜索关键词"
        class="bg-white w-100"
      />
      <van-icon name="filter-o" size="0.48rem" />
    </div>

    <!-- 分类 -->
    <van-tabs sticky swipeable animated :offset-top="44" color="#42B7AE"  @change="getSearchList" class="mt-12">
      <van-tab v-for="(productItem, tabIndex) in tabs" :title="productItem.name" :key="'scroll-tab-' + tabIndex" title-class="pb-0" :name="productItem.name">
        <div class="mlr-12 mt-20 flex between flex-wrap">
          <!-- 空状态  -->
          <empty-status v-if="lists.length === 0" :status="'order'"></empty-status>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { Search, Tab, Tabs } from 'vant';

export default {
  components: {
    vanSearch: Search,
    vanTab: Tab,
    vanTabs: Tabs
  },
  asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    return {
      searchVal: '',
      tabs: [
        {
          name: 'All'
        },
        {
          name: 'Unpaid'
        },
        {
          name: 'unreceived'
        },
        {
          name: 'Done'
        },
        {
          name: 'Cancelled'
        }
      ],
      lists: []
    }
  },
  methods: {
    getSearchList() { // 获取分类列表

    }
  },
} 
</script>
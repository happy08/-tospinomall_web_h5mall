<template>
  <!-- 店铺-搜索 -->
  <div class="vh-100 bg-grey">
    <BmHeaderNav :left="{ isShow: true }" title="Store information" :border="false" />
    
    <!-- 搜索 -->
    <div class="flex vcenter ml-20 mr-12 mtb-8">
      <van-search
        v-model="searchVal"
        shape="round"
        placeholder="请输入搜索关键词"
        class="bg-white w-100"
        @click="goSearch"
      />
      <i class="iconfont icon-guolv fs-24 ml-12 filter-icon" @click="filterPopup = true"></i>
    </div>

    <!-- 分类 -->
    <div class="flex between vcenter mt-12 plr-20 bg-white">
      <van-tabs sticky swipeable animated :offset-top="44" color="#42B7AE"  @change="getSearchList" class="customs-van-tabs w-317" v-model="typeActive">
        <van-tab v-for="(productItem, tabIndex) in tabs" :title="productItem.name" :key="'scroll-tab-' + tabIndex" title-class="pb-0" :name="productItem.type" />
      </van-tabs>
      <van-icon :name="require('@/assets/images/icon/arrange-'+arrangeType+'.svg')" size="0.38rem" @click="changeArrange" />
    </div>

    <div class="plr-12 w-100">
      <!-- 空状态  -->
      <empty-status v-if="list.length === 0" :image="require('@/assets/images/empty/order.png')" :description="$t('common.noRecord')"/>
      <div 
        :class="{'flex between flex-wrap': arrangeType === 2}"
        v-else>
          <div 
            v-for="(searchItem, searchIndex) in list" 
            :key="'search-list-' + searchIndex"
            >
            <!-- 商品展示两列 -->
            <ProductTopBtmSingle
              :img="{ url: '', width: '3.4rem', height: '3.4rem', loadImage: require('@/assets/images/product-bgd-170.png') }" 
              :detail="{ desc: 'mlr-12mt-12flexbetweenflex-wrap', price: 49.92, rate: 2.5, volumn: 50, ellipsis: 2 }"
              class="bg-white round-4 hidden mt-12"
              v-if="arrangeType === 2"
            ></ProductTopBtmSingle>
            <!-- 商品展示一列 -->
            <div v-if="arrangeType === 1" :class="{'flex vcenter pt-20 pb-30 hidden bg-white': true, 'border-229': searchIndex !== list.length - 1} ">
              <div>
                <BmImage 
                  :url="require('@/assets/images/product-bgd-90.png')"
                  :width="'1.8rem'" 
                  :height="'1.8rem'"
                />
              </div>
              <div class="ml-14 w-230">
                <p class="fs-14 black hidden-1">A portable coffee  cup, a tiny peo…A portable coffee  cup, a tiny peo…</p>
                <p class="mt-8 fs-14 light-grey">Ships from China </p>
                <div class="mt-16 flex vcenter between">
                  <div>
                    <span class="red fs-18">{{ $store.state.rate.currency }}1192.00</span>
                    <span class="fs-10 line-through bg-grey ml-8">{{ $store.state.rate.currency }}450</span>
                  </div>
                  <div class="fs-14 black">35+Sold</div>
                </div>
              </div>
            </div>
          </div>
      </div>
      
      
    </div>


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
        <button class="red fw fs-16 order-search__btn--reset">Reset</button>
        <button class="white fw fs-16 bg-green-linear" @click="onFilter">Determine</button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Search, Tab, Tabs, Popup } from 'vant';
import ProductTopBtmSingle from '@/components/ProductTopBtmSingle';
import EmptyStatus from '@/components/EmptyStatus';

export default {
  components: {
    vanSearch: Search,
    vanTab: Tab,
    vanTabs: Tabs,
    vanPopup: Popup,
    ProductTopBtmSingle,
    EmptyStatus
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
          name: 'Sale',
          type: 1
        },
        {
          name: 'Store',
          type: 2
        },
        {
          name: 'Filtrate',
          type: 3
        }
      ],
      list: [
        {},
        {}
      ],
      filterPopup: false,
      typeActive: route.query.type ? route.query.type : 0,
      arrangeType: 1
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

    },
    changeArrange() { // 切换展示样式 1列 2列
      this.arrangeType = this.arrangeType === 1 ? 2 : 1;
    }
  },
} 
</script>

<style lang="less" scoped>
.filter-icon{
  color: rgba(0, 0, 0, .65);
}
.w-317{
  width: 280px;
}
.w-230{
  width: 230px;
}
.border-229{
  position: relative;
  &::after{
    content: '';
    display: block;
    width: 229px;
    height: 1px;
    background-color: #F3F3F3;
    right: 14px;
    bottom: 0;
    position: absolute;
  }
}
</style>

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
<template>
  <div>
    <!-- <ais-instant-search-ssr :class-names="{'ais-InstantSearch': 'myAisInstantSearch'}"> -->
      <van-sticky :offset-top="0">
        <BmHeaderNav :left="{ isShow: true, isEmit: true }" :title="$t('search')" :border="false" @leftClick="leftClick" />
        <!-- 搜索 -->
        <van-search
          v-model="searchVal"
          shape="round"
          :placeholder="hintName"
          :class="{'plr-20 bg-white ptb-12': true, 'border-b': isShowTip != -1}"
          @input="inputChange"
          @search="onSearch"
          @focus="onFocus"
          @clear="onClear"
          ref="searchContainer"
          maxlength="200"
        />
        <!-- <div class="plr-20 ptb-12 border-b bg-white">
          <ais-search-box :class-names="{'ais-SearchBox-form': 'myAisSearchBoxForm', 'ais-SearchBox-input': 'myAisSearchBoxInput'}" placeholder="">
            <template v-slot="{ currentRefinement, isSearchStalled, refine }">
              <input
                type="search"
                :value="currentRefinement"
                @search="refine($event.currentTarget.value)"
              />
              <span :hidden="!isSearchStalled">Loading...</span>
            </template>
          </ais-search-box>
        </div> -->
        
        <!-- 分类 -->
        <div class="flex between vcenter plr-20 bg-white">
          <van-tabs swipeable animated color="#42B7AE"  @change="getSearchList" @disabled="filterPopup = true" class="customs-van-tabs underline w-100" v-model="typeActive" line-height="0" line-width="0" :ellipsis="false">
            <van-tab v-for="(productItem, tabIndex) in tabs" :title="$t(productItem.name)" :key="'scroll-tab-' + tabIndex" title-class="p-0 between" :name="productItem.type" :disabled="productItem.type == 2">
              <template #title="props" v-if="productItem.type === 0">
                {{ props }}
                <van-dropdown-menu active-color="#42B7AE" class="custom-dropdown-menu">
                  <van-dropdown-item v-model="dropdownVal" @change="getDropSearchList" :options="$t('search_filter_price')">
                    <template #title v-if="dropdownVal == 0">
                      {{ $t('all') }}
                    </template>
                  </van-dropdown-item>
                </van-dropdown-menu>
              </template>
            </van-tab>
          </van-tabs>

          <!-- 展示一列或者两列 -->
          <van-icon :name="require('@/assets/images/icon/arrange-'+arrangeType+'.svg')" size="0.38rem" @click="changeArrange" />
        </div>
      </van-sticky>
      
      <!-- <ais-stats /> -->
      <!-- <ais-refinement-list attribute="brand" /> -->
      <!-- <ais-hits>
        <template v-slot="{ items }"> -->
          <div 
            class="mx-auto my-2 plr-12 bg-grey"
            v-masonry
            item-selector=".custom-grid-item"
            fit-width="true"
            transition-duration="0s"
            stagger="0.03s"
            gutter="10"
            v-if="arrangeType == 2"
          >
            <nuxt-link 
              v-for="(searchItem, searchIndex) in list" 
              :key="'search-list-' + searchIndex"
              :to="{ name: 'cart-product-id', params: { id: 0 } }"
              class="mt-12 custom-grid-item"
            >
              <ProductTopBtmSingle
                :img="{ url: searchItem.image, width: '3.4rem', height: '3.4rem', loadImage: require('@/assets/images/product-bgd-170.png') }" 
                :detail="{ desc: searchItem.name, price: searchItem.price, rate: 0, volumn: 20, ellipsis: 2, country: '', country_url: '' }"
                class="round-4 bg-white hidden v-100"
              ></ProductTopBtmSingle>
            </nuxt-link>
          </div>
          <nuxt-link 
            v-else
            v-for="(searchItem, searchIndex) in list" 
            :key="'search-list-' + searchIndex"
            :to="{ name: 'cart-product-id', params: { id: 0 } }"
          >
            <div :class="{'flex vcenter pt-20 pb-30 hidden bg-white plr-20': true, 'border-229': searchIndex !== list.length - 1} ">
              <div>
                <BmImage 
                  :url="searchItem.image"
                  :width="'1.8rem'" 
                  :height="'1.8rem'"
                  :fit="'cover'"
                  :isShow="true"
                  class="border round-4"
                  :alt="searchItem.name"
                />
              </div>
              <div class="ml-14 w-230 hidden-1">
                <p class="fs-14 black hidden-1" v-html="searchItem.name"></p>
                <p class="mt-8 fs-14 light-grey">{{ $t('ship_from_', { replace_tip: '北京' }) }}</p>
                <div class="mt-16 flex vcenter between">
                  <div>
                    <span class="red fs-18">{{ $store.state.rate.currency }}{{ searchItem.price }}</span>
                    <!-- <span class="fs-10 line-through bg-grey ml-8">{{ $store.state.rate.currency }}{{ searchItem.promotionPrice }}</span> -->
                  </div>
                  <div class="fs-14 black">{{ 23 }}{{ $t('add_sold') }}</div>
                </div>
              </div>
            </div>
          </nuxt-link>
        <!-- </template>
      </ais-hits> -->
      <!-- <ais-pagination /> -->
    <!-- </ais-instant-search-ssr> -->

    <!-- 弹窗筛选 -->
    <van-popup
      v-model="filterPopup"
      position="right"
      class="product-search"
    >
      <div class="v-100">
        <div class="plr-12 product-search-filter">
          <h3 class="fs-16 black fw">{{ $t('price_range') }}</h3>
          <!-- 价格区间 -->
          <div class="mt-20 flex between vcenter">
            <van-field v-model="minPrice" type="number" size="small" class="bg-grey-f5 round-8 mr-8 lh-1 ptb-6" :placeholder="$t('minimum_price')" />
            -
            <van-field v-model="maxPrice" type="number" size="small" class="bg-grey-f5 round-8 ml-8 lh-1 ptb-6" :placeholder="$t('maximum_price')" />
          </div>
          <!-- 服务/折扣 -->
          <div class="mt-32">
            <h3 class="fs-16 black fw">{{ $t('service_discount') }}</h3>
            <div class="mt-6 flex flex-wrap">
              <span :class="{'ptb-6 black fs-14 lh-20 tc w-130 mt-14 ml-10 odd-0 plr-4 hidden-1 bg-grey-f5 round-8 border-transparent': true, 'is-active': deliveryType == true}" @click="deliveryType = !deliveryType">{{ $t('tospino_logistics') }}</span>
              <span :class="{'ptb-6 black fs-14 lh-20 tc w-130 mt-14 ml-10 odd-0 plr-4 hidden-1 bg-grey-f5 round-8 border-transparent': true, 'is-active': available == true}" @click="available = !available">{{ $t('only_see_stock') }}</span>
              <span :class="{'ptb-6 black fs-14 lh-20 tc w-130 mt-14 ml-10 odd-0 plr-4 hidden-1 bg-grey-f5 round-8 border-transparent': true, 'is-active': overseas == true}" @click="overseas = !overseas">{{ $t('overseas_purchase') }}</span>
            </div>
          </div>
          <!-- 品牌 -->
          <div class="mt-32" v-if="brandList.length > 0">
            <h3 class="fs-16 black fw">{{ $t('brand') }}</h3>
            <div class="mt-6 flex flex-wrap">
              <span :class="{'ptb-6 black fs-14 lh-20 tc w-84 mt-14 ml-10 odd-3 plr-4 hidden-1 bg-grey-f5 round-8 border-transparent': true, 'is-active': brandName == brandItem.value}" v-for="(brandItem, brandIndex) in brandList" :key="'brand-item-' + brandIndex" @click="brandName = brandItem.value">{{ brandItem.value }}</span>
            </div>
          </div>
          <!-- 所有类别 -->
          <div class="mt-32" v-if="categoryList.length > 0">
            <h3 class="fs-16 black fw">{{ $t('all_categories') }}</h3>
            <div class="mt-6 flex flex-wrap">
              <span :class="{'ptb-6 black fs-14 lh-20 tc w-84 mt-14 ml-10 odd-3 plr-4 hidden-1 bg-grey-f5 round-8 border-transparent': true, 'is-active': categoryName == categoryItem.value}" v-for="(categoryItem, categoryIndex) in categoryList" :key="'category-index-' + categoryIndex" @click="categoryName = categoryItem.value">{{ categoryItem.value }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="product-search__btn flex">
        <button class="red fw fs-16 product-search__btn--reset" @click="onReset">{{ $t('reset') }}</button>
        <button class="white fw fs-16 bg-green-linear" @click="onFilter">{{ $t('determine') }}</button>
      </div>
    </van-popup>
    
  </div>
</template>

<script>
import { Search, Tab, Tabs, DropdownItem, DropdownMenu, Popup, Field, Cell, Sticky, List } from 'vant';
import ProductTopBtmSingle from '@/components/ProductTopBtmSingle';
import EmptyStatus from '@/components/EmptyStatus';
// import { getSearchPull } from '@/api/search';
import PullRefresh from '@/components/PullRefresh';

import {
//   AisInstantSearchSsr,
//   AisRefinementList,
//   AisHits,
//   AisHighlight,
//   AisSearchBox,
//   AisStats,
//   AisPagination,
  createServerRootMixin,
} from 'vue-instantsearch';
import algoliasearch from 'algoliasearch/lite';
import _renderToString from 'vue-server-renderer/basic';

function renderToString(app) {
  return new Promise((resolve, reject) => {
    _renderToString(app, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
}

const searchClient = algoliasearch(
  '62MLEBY33X',
  'b8f81ef6a145b0e57dd10b020d1c0c54'
);

export default {
  data() {
    return {
      arrangeType: 1,
      tabs: [
        {
          name: 'all',
          type: 0,
          key: ''
        },
        {
          name: 'sale',
          type: 1,
          key: 'sale_count'
        },
        {
          name: 'filtrate',
          type: 2
        }
      ],
      typeActive: 0,
      dropdownVal: 0,
      sortMap: {},
      filterPopup: false,
      minPrice: '',
      maxPrice: '',
      searchVal: '',
      isShowTip: true,
      list: [],
      historyNum: false,
      searchHistoryList: [],
      searchPullList: [],
      inputChange: null,
      searchFindList: [],
      hintName: '',
      brandList: [],
      categoryList: [],
      categoryName: '',
      brandName: '',
      overseas: false,
      deliveryType: false,
      available: false,
      pageIndex: 1,
      pageSize: 10,
      params: {},
      refreshing: {
        isFresh: false
      },
      loading: false,
      finished: false,
      total: 0,
      isRouteBack: 0,
      shopId: '',
      backName: '',
      backNameId: '',
      backQuery: null
    }
  },
  mixins: [
    // 创建可重用的搜索实例 考虑SEO所以我们需要替换ais-instant-search为ais-instant-search-ssr,移除props, 传值使用函数createServerRootMixin
    createServerRootMixin({ 
      searchClient,
      indexName: 'tospinoMall',
    }),
  ],
  serverPrefetch() { // 后端执行搜索查询
    return this.instantsearch
      .findResultsState({
        component: this,
        renderToString,
      }).then(algoliaState => {
        this.$ssrContext.nuxt.algoliaState = algoliaState;
      });
  },
  beforeMount() {
    const results =
      (this.$nuxt.context && this.$nuxt.context.nuxtState.algoliaState) ||
      window.__NUXT__.algoliaState;

    this.instantsearch.hydrate(results);

    // Remove the SSR state so it can't be applied again by mistake
    delete this.$nuxt.context.nuxtState.algoliaState;
    delete window.__NUXT__.algoliaState;
  },
  components: {
    // AisInstantSearchSsr,
    // AisRefinementList,
    // AisHits,
    // AisHighlight,
    // AisSearchBox,
    // AisStats,
    // AisPagination,
    vanSearch: Search,
    vanTab: Tab,
    vanTabs: Tabs,
    vanDropdownItem: DropdownItem,
    vanDropdownMenu: DropdownMenu,
    vanPopup: Popup,
    vanField: Field,
    vanCell: Cell,
    vanSticky: Sticky,
    vanList: List,
    EmptyStatus,
    ProductTopBtmSingle,
    PullRefresh
  },
  head() {
    return {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/instantsearch.css@7.3.1/themes/reset-min.css',
        },
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/instantsearch.css@7.4.5/themes/satellite-min.css',
        }
      ],
      script: [
        {
          type: 'text/javascript',
          charset: 'utf-8',
          src: 'https://cdn.jsdelivr.net/npm/algoliasearch@4.5.1/dist/algoliasearch-lite.umd.js'
        },
        {
          type: 'text/javascript',
          charset: 'utf-8',
          src: 'https://cdn.jsdelivr.net/npm/instantsearch.js@4.8.3/dist/instantsearch.production.min.js'
        },
        {
          src: 'https://polyfill.io/v3/polyfill.min.js?features=default%2CArray.prototype.find%2CArray.prototype.includes%2CPromise%2CObject.assign%2CObject.entries'
        }
      ]
    };
  },
  deactivated() {
    this.shopId = '';
    this.backName = '';
    this.backNameId = '';
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
        this.$store.commit('SET_SEARCHPRODUCTLIST', null);
        this.searchHistoryList = [];
        this.historyNum = false;
      })
    },
    changeArrange() { // 切换展示样式 1列 2列
      this.arrangeType = this.arrangeType === 1 ? 2 : 1;
      if (this.arrangeType == 2) {
        this.$redrawVueMasonry();
      }
    },
    getSearchList(index, title) { // 获取分类列表
      this.pageIndex = 1;
      this.finished = false;
      this.params = { pageIndex: this.pageIndex, pageSize: this.pageSize, searchKeyword: this.searchVal };
      if (index == 1) { // 销量
        this.params = {
          ...this.params,
          sortMap: {
            key: 'sale_count',
            value: 0
          }
        }
      } else if (index == 0) { 
        if (this.dropdownVal == 0) { // 综合排序
          // this.typeActive = this.$t('search_filter_overall');
        } else if (this.dropdownVal == 1) { // 价格升序
          this.params = {
            ...this.params,
            sortMap: {
              key: 'promotion_price',
              value: 1
            }
          }
        } else if (this.dropdownVal == 2) { // 价格降序
          this.params = {
            ...this.params,
            sortMap: {
              key: 'promotion_price',
              value: 0
            }
          }
        }
      }
      this.getProductList();
    },
    getDropSearchList(value) {
      // if (value == 0) { // 综合排序
      //   this.typeActive = this.$t('search_filter_overall');
      // }
      this.pageIndex = 1;
      this.params = { pageIndex: this.pageIndex, pageSize: this.pageSize, searchKeyword: this.searchVal };
      if (value == 1) { // 价格升序
        this.params = {
          ...this.params,
          sortMap: {
            key: 'promotion_price',
            value: 1
          }
        }
      } else if (value == 2) { // 价格降序
        this.params = {
          ...this.params,
          sortMap: {
            key: 'promotion_price',
            value: 0
          }
        }
      }
      this.getProductList();
    },
    onSearch(val) { // 搜索
      // let value = val;
      // if (!val && this.hintName) value = this.hintName;
      // if (this.isRouteBack != 0) {
      //   this.$router.replace({
      //     name: 'search',
      //     query: {
      //       val: val,
      //       searchKeyword: val
      //     }
      //   })
      // } else {
      //   this.$router.push({
      //     name: 'search',
      //     query: {
      //       val: val,
      //       searchKeyword: val
      //     }
      //   })
      // }
      searchClient.search(this.searchVal, {
        page: this.pageIndex,
        hitsPerPage: this.pageSize
      }).then(({hits}) => {
        this.list = hits;
      })
      // this.$store.commit('SET_SEARCHPRODUCTLIST', value); // 搜索历史存储
      // // 更新页面展示
      // this.searchHistoryList = this.$store.state.searchProductList.filter((item, index) => {
      //   return index < 6;
      // });
      // this.searchVal = value;
      // this.pageIndex = 1;
      // // 获取搜索列表
      // this.params = { searchKeyword: value, pageIndex: this.pageIndex, pageSize: this.pageSize };
      // this.getProductList();
    },
    onFocus() { // 获取焦点之后，不展示数据列表和历史数据
      this.isShowTip = this.searchVal.length > 0 ? -1 : this.searchVal.length === 0;
      // this.getSearchPull();
    },
    onFilter() { // 筛选
      let _data = {
        searchKeyword: this.searchVal,
        brandName: this.brandName,
        categoryName: this.categoryName
      }
      if (this.available == true) { // 是否有货
        _data.available = 1;
      }
      if (this.overseas == true) { // 是否海外购
        _data.overseas = 1;
      }
      if (this.deliveryType == true) { // tospino物流
        _data.deliveryType = 2;
      }
      if (this.minPrice != '') { // 最低价格
        _data.queryMinPrice = this.minPrice;
      }
      if (this.maxPrice != '') { // 最高价格
        _data.queryMaxPrice = this.maxPrice;
      }
      this.pageIndex = 1;
      this.params = {
        ..._data,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      };
      this.getProductList();
    },
    onReset() { // 筛选重置
      this.brandName = this.minPrice = this.maxPrice = this.categoryName = '';
      this.available = this.overseas = this.deliveryType = false;
      this.pageIndex = 1;
      this.params = {
        searchKeyword: this.searchVal,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex
      }
      this.getProductList();
    },
    showMoreHistory() { // 展示更多的搜索历史
      this.historyNum = false;
      this.searchHistoryList = this.$store.state.searchProductList;
    },
    toSearch(item) {
      // this.$store.commit('SET_SEARCHPRODUCTLIST', item.suggestion); // 搜索历史存储
      // 更新页面展示
      if (this.searchHistoryList.length > 6) {
        this.searchHistoryList = this.$store.state.searchProductList;
      } else {
        this.searchHistoryList = this.$store.state.searchProductList.filter((item, index) => {
          return index < 6;
        });
      }
      
      if (this.isRouteBack != 0) {
        this.$router.replace({
          name: 'search',
          query: {
            val: item.suggestion,
            searchKeyword: item.suggestion
          } 
        })
      } else {
        this.$router.push({
          name: 'search',
          query: {
            val: item.suggestion,
            searchKeyword: item.suggestion
          } 
        })
      }
    },
    getSearchPull() {
      // getSearchPull({ queryName: this.searchVal, hits: 10 }).then(res => {
      //   this.searchPullList = res.data.suggestions;
      //   this.list = [];
      // })
    },
    getProductList() { // 获取商品列表
      this.params = {
        ...this.params,
        pageIndex: this.pageIndex
      }
      if (this.shopId != '') {
        this.params = {
          ...this.params,
          shopId: this.shopId
        }
      }
      this.$api.getProductSearch(this.params).then(res => {
        let list = res.data.items.map(item => {
          return {
            ...item,
            starLevel: parseFloat(item.starLevel)
          }
        });
        this.list = this.pageIndex == 1 ? list : this.list.concat(list);
        // 品牌列表
        this.brandList = res.data.brandList;
        // 所有分类
        this.categoryList = res.data.categoryList;
        this.total = res.data.total;
        this.isShowTip = false;
        this.filterPopup = false; // 筛选窗口隐藏
        this.refreshing.isFresh = false;
        this.loading = false;
        this.finished = false;
        setTimeout(() => {
          if (typeof this.$redrawVueMasonry === 'function') {
            this.$redrawVueMasonry();
          }
        }, 50)
      })
    },
    onRefresh() { // 刷新
      this.pageIndex = 1;
      this.getProductList();
    },
    onLoad() { // 加载更多
      this.finished = false;
      if (this.total == this.list.length) { // 没有下一页了
        this.finished = true;
        this.loading = false;
        return false;
      }
      this.pageIndex += 1;
      this.getProductList();
    },
    onClear() { // 点击清除按钮
      this.$router.replace({
        name: 'search'
      })
    },
    leftClick() {
      if (!this.$route.query.searchKeyword && this.backName != '') {
        if (this.backNameId != '') { // 商品详情
          this.$router.replace({
            name: this.backName,
            params: {
              id: this.backNameId
            },
            query: this.backQuery
          });
        } else {
          this.$router.replace({
            name: this.backName
          });
        }
        return false;
      } else if (this.backNameId != '') {
        this.$router.replace({
          name: 'search',
          query: this.backQuery
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
    }
  },
};
</script>

<style lang="less">
.myAisInstantSearch{
  [class^=ais-]{
    font-size: 12px!important;
  }
}
.myAisSearchBoxForm{
  height: 34px;
  line-height: 34px;
  &::before{
    width: 20px;
    height: 20px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    left: 10px;
    margin-top: -10px;
  }
}
.myAisSearchBoxInput{
  padding-left: 46px;
  border-radius: 20px;
}
</style>
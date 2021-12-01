<template>
  <!-- 首页-头部-搜索页面 -->
  <div :class="{'bg-grey': !isShowTip, 'v-percent-100': true}">
    <van-sticky :offset-top="0" class="home-search-sticky">
      <BmHeaderNav :left="{ isShow: true, isEmit: true }" :title="$t('search')" :border="false" @leftClick="leftClick" />
      <!-- 搜索 -->
      <div :class="{'plr-20 bg-white ptb-12': true, 'border-b': isShowTip != -1}">
        <van-search
          v-model="searchVal"
          shape="round"
          :placeholder="hintName"
          :class="{'search-container': true}"
          @input="inputChange"
          @search="onSearch"
          @focus="onFocus"
          @clear="onClear"
          ref="searchContainer"
        >
          <template #left-icon>
            <BmImage 
              :url="require('@/assets/images/icon/search-icon.png')"
              :width="'0.4rem'" 
              :height="'0.4rem'"
              :isShow="false"
              :alt="'TospinoMall search logo'"
            />
          </template>
        </van-search>
      </div>
      <!-- 分类 -->
      <div class="flex between vcenter plr-20 bg-white" v-show="!isShowTip">
        <van-tabs swipeable animated color="#42B7AE"  @change="getSearchList" @disabled="filterPopup = true" class="customs-van-tabs underline w-100" v-model="typeActive" line-height="0" line-width="0" :ellipsis="false">
          <van-tab v-for="(productItem, tabIndex) in tabs" :title="$t(productItem.name)" :key="'scroll-tab-' + tabIndex" title-class="p-0 between" :name="productItem.type" :disabled="productItem.type == 2">
            <template #title="props" v-if="productItem.type === 0">
              {{ props }}
              <van-dropdown-menu active-color="#42B7AE" class="custom-dropdown-menu">
                <van-dropdown-item v-model="dropdownVal" @change="getDropSearchList" :options="$t('search_filter_price')" ref="customDropdownMenu" :disabled="isDisabledDropdownMenu">
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
    <!-- 搜索列表展示 -->
    <template v-if="isShowTip === -1">
      <div class="bg-white">
        <van-cell class="ptb-20 plr-20" v-for="(pullItem, pullIndex) in searchPullList" :key="pullIndex" :title="pullItem.suggestion" :value="''" value-class="light-grey lh-1" title-class="black lh-1" @click="toSearch(pullItem)" />
      </div>
    </template>

    <template v-if="isShowTip != -1">
      <div class="mlr-20 mt-12" v-show="isShowTip">
        <!-- 搜索历史 -->
        <h2 class="fs-14 black flex between vcenter" v-if="searchHistoryList.length > 0">
          <span>{{ $t('search_for_history') }}</span>
          <BmIcon :name="'shanchu'" :width="'0.32rem'" :height="'0.32rem'" @iconClick="deleteFn" />
        </h2>
        <div class="mt-12 flex flex-wrap">
          <span class="plr-10 round-8 mr-10 iblock mb-10 lh-20 tag-name" v-for="(tagItem, tagIndex) in searchHistoryList" :key="tagIndex" @click="onSearch(tagItem)">{{ tagItem }}</span>
          <BmIcon :name="'down-icon'" :width="'0.64rem'" :height="'0.64rem'" v-if="historyNum" @iconClick="showMoreHistory" />
        </div>
        <!-- 搜索发现 -->
        <h2 class="fs-14 black mt-30" v-if="searchFindList.length > 0">{{ $t('search_found') }}</h2>
        <div class="mt-12" v-if="searchFindList.length > 0">
          <span class="plr-10 round-8 mr-12 iblock mb-10 tag-name" v-for="(tag, index) in searchFindList" :key="index" @click="onSearch(tag.name)">{{ tag.name }}</span>
        </div>
      </div>

      <PullRefresh v-show="!isShowTip" :refreshing="refreshing" @refresh="onRefresh" :class="{'pb-20 custom-min-height-154 bg-white': true, 'bg-grey': arrangeType == 2, 'bg-white': arrangeType == 1}">
        <div :class="{'w-100': true, 'plr-20 bg-white': arrangeType == 1, 'plr-12': arrangeType == 2} ">
          <!-- 空状态  -->
          <empty-status v-if="list.length === 0" :image="require('@/assets/images/empty/order.png')" />
          <van-list
            v-else
            v-model="loading"
            :finished="finished"
            finished-text=""
            @load="onLoad"
            :immediate-check="false"
          >
            <!-- 商品展示两列 -->
            <template v-if="arrangeType == 2">
              <div 
                class="mx-auto my-2"
                v-masonry="searchMasonryContainer"
                item-selector=".custom-grid-item"
                fit-width="true"
                transition-duration="0s"
                stagger="0.03s"
                :gutter="gutter"
              >
                <nuxt-link 
                  v-for="(searchItem, searchIndex) in list" 
                  :key="'search-list-' + searchIndex"
                  :to="'/product/' + searchItem.productId + '.html'"
                  class="mt-12 custom-grid-item"
                  v-masonry-tile="searchMasonryContainer"
                >
                  <ProductTopBtmSingle
                    :img="{ url: searchItem.mainPictureUrl, width: '3.4rem', height: '3.4rem', loadImage: require('@/assets/images/product-bgd-170.png') }" 
                    :detail="{ desc: searchItem.productTitle, price: searchItem.minPrice, rate: searchItem.starLevel, volumn: searchItem.saleCount, ellipsis: 2, country: searchItem.supplyCountry && $store.state.supplyCountry && $store.state.supplyCountry[searchItem.supplyCountry] ? $store.state.supplyCountry[searchItem.supplyCountry].label : '', country_url: searchItem.supplyCountry && $store.state.supplyCountry && $store.state.supplyCountry[searchItem.supplyCountry] ? $store.state.supplyCountry[searchItem.supplyCountry].description : '', stock: searchItem.stock }"
                    class="round-4 bg-white hidden v-100"
                  ></ProductTopBtmSingle>
                </nuxt-link>
              </div>
            </template>
            <!-- 商品展示一列 -->
            <div v-else>
              <nuxt-link 
                v-for="(searchItem, searchIndex) in list" 
                :key="'search-list-' + searchIndex"
                :to="'/product/' + searchItem.productId + '.html'"
              >
                <div :class="{'flex vcenter pt-20 pb-30 hidden bg-white': true, 'border-229 border-b': searchIndex !== list.length - 1} ">
                  <div class="soldout-container">
                    <!-- 无货 -->
                    <div class="white fs-12 lh-1 flex center soldout-container__tip" v-if="searchItem.stock == 0">{{ $t('out_of_stock') }}</div>
                    <BmImage 
                      :url="searchItem.mainPictureUrl"
                      :width="'1.8rem'" 
                      :height="'1.8rem'"
                      :fit="'cover'"
                      :isShow="true"
                      class="border round-4 flex-shrink"
                      :alt="searchItem.productTitle"
                    />
                  </div>
                  <div class="ml-14 w-230 hidden-1">
                    <p class="fs-14 black hidden-1" v-html="searchItem.productTitle"></p>
                    <p class="mt-8 fs-14 light-grey">{{ $t('ship_from_', { replace_tip: searchItem.supplyCountry && $store.state.supplyCountry && $store.state.supplyCountry[searchItem.supplyCountry] ? $store.state.supplyCountry[searchItem.supplyCountry].label : '' }) }}</p>
                    <div class="mt-16 flex vcenter between">
                      <div>
                        <span class="red fs-18">{{ $store.state.rate.currency }}{{ searchItem.minPrice }}</span>
                        <!-- <span class="fs-10 line-through bg-grey ml-8">{{ $store.state.rate.currency }}{{ searchItem.promotionPrice }}</span> -->
                      </div>
                      <!-- <div class="fs-14 black">{{ searchItem.saleCount }}{{ $t('add_sold') }}</div> -->
                    </div>
                  </div>
                </div>
              </nuxt-link>
            </div>
          </van-list>
        </div>
      </PullRefresh>
    </template>

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
            <!-- 阿里搜索只支持单选 -->
            <!-- <div class="mt-6 flex flex-wrap" v-if="filterCheckType == 1">
              <span :class="{'ptb-6 black fs-14 lh-20 tc w-84 mt-14 ml-10 odd-3 plr-4 hidden-1 bg-grey-f5 round-8 border-transparent': true, 'is-active': brandName == brandItem}" v-for="(brandItem, brandIndex) in brandList" :key="'brand-item-' + brandIndex" @click="brandName = brandItem">{{ brandItem }}</span>
            </div> -->
            <!-- algolia搜索支持多选 -->
            <van-checkbox-group v-model="brandResult" class="mt-6 flex flex-wrap" ref="brandCheckboxGroup">
              <van-checkbox :name="brandItem" icon-size="0" v-for="(brandItem, brandIndex) in brandList" :key="'brand-item-' + brandIndex" :class="{'custom-checkbox-single': true, 'ml-10': brandIndex % 3 != 0}">
                <template #icon="props">
                  <span :class="{'ptb-6 black fs-14 lh-20 tc w-84 mt-14 iblock odd-3 plr-4 hidden-1 bg-grey-f5 round-8 border-transparent': true, 'is-active': props.checked}">{{ brandItem }}</span>
                </template>
              </van-checkbox>
            </van-checkbox-group>
          </div>
          <!-- 所有类别 -->
          <div class="mt-32" v-if="categoryList.length > 0">
            <h3 class="fs-16 black fw">{{ $t('all_categories') }}</h3>
            <!-- <div class="mt-6 flex flex-wrap" v-if="filterCheckType == 1">
              <span :class="{'ptb-6 black fs-14 lh-20 tc w-84 mt-14 ml-10 odd-3 plr-4 hidden-1 bg-grey-f5 round-8 border-transparent': true, 'is-active': categoryName == categoryItem}" v-for="(categoryItem, categoryIndex) in categoryList" :key="'category-index-' + categoryIndex" @click="categoryName = categoryItem">{{ categoryItem }}</span>
            </div> -->
            <van-checkbox-group v-model="categoryResult" class="mt-6 flex flex-wrap" ref="categoryCheckboxGroup">
              <van-checkbox :name="categoryItem" icon-size="0" v-for="(categoryItem, categoryIndex) in categoryList" :key="'brand-item-' + categoryIndex" :class="{'custom-checkbox-single': true, 'ml-10': categoryIndex % 3 != 0}">
                <template #icon="props">
                  <span :class="{'ptb-6 black fs-14 lh-20 tc w-84 mt-14 iblock odd-3 plr-4 hidden-1 bg-grey-f5 round-8 border-transparent': true, 'is-active': props.checked}">{{ categoryItem }}</span>
                </template>
              </van-checkbox>
            </van-checkbox-group>
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
import { Search, Tab, Tabs, DropdownItem, DropdownMenu, Popup, Field, Cell, Sticky, List, Checkbox, CheckboxGroup } from 'vant';
import ProductTopBtmSingle from '@/components/ProductTopBtmSingle';
import EmptyStatus from '@/components/EmptyStatus';
import { getSearchPull } from '@/api/search';
import PullRefresh from '@/components/PullRefresh';

// let searchClient;
// let currencyType;
// let client;
// // 测试环境和正式环境搜索分开
// let currenOTO = process.env.APP_ENV == 'production' ? 'tospinoMall' : 'test';
// 目前搜索商品统一使用后台接口获取

export default {
  name: 'search',
  components: {
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
    vanCheckbox: Checkbox,
    vanCheckboxGroup: CheckboxGroup,
    EmptyStatus,
    ProductTopBtmSingle,
    PullRefresh
  },
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
      pageIndex: 0,
      pageSize: 20,
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
      backQuery: null,
      meta: {},
      searchMasonryContainer: 'searchMasonryContainer',
      brandResult: [],
      categoryResult: [],
      filterCheckType: 0,
      isFirst: true,
      isDisabledDropdownMenu: false // tab栏全部下面的排序条件菜单是否禁用, 主要是为了解决从销量的tab切换到下拉框条件的tab时第一次不展示下拉框
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.name == 'home' || from.name == 'home-old' || from.name == 'categories' || from.name == 'categories-old') {
        vm.params = {};
        vm.shopId = vm.backNameId = vm.backName = '';
        vm.brandResult = [];
        vm.categoryResult = [];
        vm.list = [];
        vm.available = false;
        vm.overseas = false;
        vm.deliveryType = false;
        vm.typeActive = 0;
        vm.dropdownVal = 0;
        vm.pageIndex = 0;
      }
    })
  },
  async fetch() {
    try {
      // currencyType = this.$store.state.searchType; // 0 阿里搜索 2 algolia搜索
      // this.filterCheckType = currencyType;
      if (this.$route.query.val != this.searchVal) { // 一个新的搜索
        this.params = {};
        // this.shopId = '';
        this.brandResult = [];
        this.categoryResult = [];
      }
      this.isFirst = false; // 是否首次进入
      this.searchVal = this.$route.query.val || ''; // 搜索value
      this.isShowTip = this.searchVal.length > 0 ? false : true;

      if (this.$route.query.navCategoryIds) {
        this.params.navCategoryIds = !Array.isArray(this.$route.query.navCategoryIds) ? [this.$route.query.navCategoryIds] : this.$route.query.navCategoryIds;
        this.isShowTip = false;
      }

      if (this.$route.query.back) { // 从哪个页面进来的
        this.backName = this.$route.query.back;
      }
      if (this.$route.query.backId) {
        this.backNameId = this.$route.query.backId;
        this.isRouteBack = 1;
      }
      if (this.$route.query.backQuery) {
        this.backQuery = this.$route.query.backQuery;
      }
      if (this.$route.query.categoryId) { // 后端分类id
        // 阿里搜索
        this.params.categoryIds = Array.isArray(this.$route.query.categoryId) ? this.$route.query.categoryId : [this.$route.query.categoryId];
        // if (currencyType == 2) {
        //   // algolia搜索
        //   this.params.productIds = Array.isArray(this.$route.query.categoryId) ? this.$route.query.categoryId.map(item => {
        //     return `categoryIds:${item}`;
        //   }) : [`categoryIds:${this.$route.query.categoryId}`];
        // }
        this.isShowTip = false;
      }
      if (this.$route.query.brandId) { // 品牌id
        this.params.brandIds = Array.isArray(this.$route.query.brandId) ? this.$route.query.brandId : [this.$route.query.brandId];
        // if (currencyType == 2) { // algolia搜索
        //   this.params.brandIds = Array.isArray(this.$route.query.brandId) ? this.$route.query.brandId.map(item => {
        //     return `brandId:${item}`;
        //   }): [`brandId:${this.$route.query.brandId}`];
        // }
        this.isShowTip = false;
      }
      if (this.$route.query.countryCodes) { // 国家编码
        this.params.countryCodes = Array.isArray(this.$route.query.countryCodes) ? this.$route.query.countryCodes : [this.$route.query.countryCodes];
        // if (currencyType == 2) { // algolia搜索
        //   this.params.countryCodes = Array.isArray(this.$route.query.countryCodes) ? this.$route.query.countryCodes.map(item => {
        //     return `countryCodes:${item}`;
        //   }): [`countryCodes:${this.$route.query.countryCodes}`];
        // }
        
        this.params.deliveryType = this.$route.query.deliveryType ? this.$route.query.deliveryType : '';
        this.isShowTip = false;
      }

      // if (currencyType == 2) {
      //   const algoliasearch = require('algoliasearch');
      //   client = algoliasearch('62MLEBY33X','7a8da9a5fd3f8137ea8cb70b60806e8d');
      //   searchClient = client.initIndex(currenOTO);
      // }
      this.params = {...this.params, pageIndex: this.pageIndex, pageSize: this.pageSize, searchKeyword: this.searchVal};
      // 如果带着搜索的参数跳转过来的需要先获取相对应的搜索数据
      if (this.searchVal != '' || (Object.keys(this.$route.query).length > 0 && !this.$route.query.back)) {
        // 加载图标
        this.$toast.loading({
          forbidClick: true,
          loadingType: 'spinner',
          duration: 0
        });
        this.$store.commit('SET_SEARCHPRODUCTLIST', this.searchVal); // 搜索历史存储
        this.arrangeType = 2;
        // if (currencyType == 2) { // algolia搜索
        //   let facetFilters = this.params.facetFilters ? this.params.facetFilters : [];
        //   let productIdsFscet = this.params.productIds ? this.params.productIds : [];
        //   let brandIds = this.params.brandIds ? this.params.brandIds : [];
        //   let countryCodes = this.params.countryCodes ? this.params.countryCodes : [];
        //   if (this.$route.query.navCategoryIds) {
        //     const getCategoryLinkMap = await this.$api.getCategoryLinkMap(this.params.navCategoryIds);
        //     if (getCategoryLinkMap.data['productIds']) { // 商品id
        //       productIdsFscet.push((getCategoryLinkMap.data['productIds'].map(item => {
        //         return `productId:${item}`;
        //       })));
        //     }
        //     if (getCategoryLinkMap.data['categoryIds']) { // 分类id
        //       productIdsFscet.push((getCategoryLinkMap.data['categoryIds'].map(item => {
        //         return `categoryIds:${item}`;
        //       })));
        //     }
        //     this.params.productIds = productIdsFscet;
        //   }
        //   this.pageIndex = 0;
        //   let _filter = [];
        //   if (this.shopId != '') {
        //     _filter.push(`shopId:${this.shopId}`);
        //   }
        //   if (this.params.deliveryType) {
        //     _filter.push(`deliveryType:${this.params.deliveryType}`);
        //   }
        //   searchClient.search(this.params.productIds ? '' : this.searchVal, {
        //     page: this.pageIndex, // 从0开始算起
        //     hitsPerPage: this.pageSize,
        //     facets: ['brandName', 'categoryName'],
        //     filters: this.params.filters ? this.params.filters + (_filter.length > 0 ? ' AND ' + _filter.join(' AND ') : '') : (_filter.length > 0 ? _filter.join(' AND ') : ''),
        //     facetFilters: [...facetFilters, ...productIdsFscet, ...brandIds, ...countryCodes]
        //   }).then(({hits, nbHits, facets}) => {
        //     this.total = nbHits;
        //     this.list = hits;
        //     if (facetFilters.length == 0) {
        //       this.brandList = facets.brandName ? Object.keys(facets.brandName) : [];
        //       this.categoryList = facets.categoryName ? Object.keys(facets.categoryName) : [];
        //     }
        //     this.isShowTip = false;
        //     this.loading = false;
        //     this.finished = this.total == this.list.length ? true : false;
        //     this.$toast.clear();
        //     setTimeout(() => {
        //       if (typeof this.$redrawVueMasonry === 'function') {
        //         this.$redrawVueMasonry('searchMasonryContainer');
        //       }
        //     }, 50)
        //   }).catch(error => {
        //     console.log(error);
        //   })
        // } else { // 阿里搜索
          this.pageIndex = 0;
          // 获取搜索列表数据
          if (this.shopId != '') {
            this.params = {
              ...this.params,
              shopId: this.shopId
            }
          }
          this.params.pageIndex = this.pageIndex;
          const listData = await this.$api.getProductSearch({ ...this.params });
          this.isRouteBack = 1;
          
          // 数据列表需要格式化
          this.list = listData.data.items.map(item => {
            return {
              ...item,
              starLevel: parseFloat(item.starLevel),
              saleCount: parseFloat(item.saleCount)
            }
          });
          this.isShowTip = false;
          this.loading = false;
          this.finished = false;

          // 品牌列表
          this.brandList = listData.data.brandList.map(item => {
            return item.value;
          });
          // 所有分类
          this.categoryList = listData.data.categoryList.map(item => {
            return item.value;
          });
          this.total = listData.data.total;
          this.$toast.clear();
          setTimeout(() => {
            if (typeof this.$redrawVueMasonry === 'function') {
              this.$redrawVueMasonry('searchMasonryContainer');
            }
          }, 50)
        // }
      }
      // 搜索历史
      this.searchHistoryList = this.$store.state.searchProductList.filter((item, index) => {
        return index < 6;
      });
      this.historyNum = this.$store.state.searchProductList.length > 6 ? true: false;
    } catch (error) {
      this.$toast.clear();
      console.log(error);
    }
  },
  head() {
    return {
      title: this.meta.title + 'TospinoMall Ghana online shopping',
      meta: [
        { hid: 'description', name: 'description', content: this.meta.description || 'TospinoMall Ghana online shopping' },
        { hid: 'keywords', name: 'keywords', content: this.meta.keyword || 'TospinoMall Ghana online shopping' },
        { hid: 'og:title', property: 'og:title', content: this.meta.title || 'TospinoMall Ghana online shopping' },
        { hid: 'og:description', property: 'og:description', content: this.meta.description || 'TospinoMall Ghana online shopping' }
      ]
    }
  },
  watch: {
    '$route'(newRoute, oldRoute) {
      if (oldRoute.name == 'search' && newRoute.name == 'search') {
        this.$fetch();
      }
    }
  },
  computed: {
    gutter() {
      return process.client ? parseInt(10 * document.body.clientWidth / 375) : 10;
    }
  },
  activated() {
    if (this.$route.query.shopId) { // 从店铺搜索跳转过来的
      this.shopId = this.$route.query.shopId;
    }
    // 没有带参数进来的时候，搜索输入框需要自动聚焦
    if (this.searchVal == '' && (Object.keys(this.$route.query).length == 0 || (Object.keys(this.$route.query).length == 1 && this.$route.query.back))) {
      this.$nextTick(() => {
        this.$refs.searchContainer.querySelector('input').focus();
      })
      this.isRouteBack = this.$route.query.backId ? 1 : 0;
    } else {
      this.isRouteBack = 1;
    }

    // if (currencyType == 0) { // 阿里搜索
      // 搜索防抖
      this.inputChange = this.$utils.debounce((e) => {
        // this.isShowTip = e[0].length > 0 && this.list.length === 0 ? -1 : e[0].length === 0;
        if (this.searchVal.trim().length == 0) {
          return false;
        }
        this.getSearchPull();
      }, 300);

      // 首次进来不需要重新调用fetch
      if (!this.isFirst) {
        this.$fetch();
      }

      this.$nextTick(async () => {
        // if (currencyType == 0) { // 阿里搜索
          // 搜索发现数据
          const findList = await this.$api.getSearchHot();
          this.searchFindList = findList.data ? findList.data.result : [];
          
          // 获得底纹词
          const hintList = await this.$api.getHintResult();
          this.hintName = hintList.data ? hintList.data.result[0].name : '';
        // }

        // 获取seo信息
        const metaData = await this.$api.getSearchListSEO();
        this.meta = {
          title: metaData.data.title.replace('{userKeywords}', this.searchVal),
          description: metaData.data.description.replace('{userKeywords}', this.searchVal),
          keyword: metaData.data.keyword.replace('{userKeywords}', this.searchVal)
        }
      })
    // }
  },
  deactivated() {
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
        this.$redrawVueMasonry('searchMasonryContainer');
      }
    },
    getSearchList(index, title) { // 获取分类列表
      this.finished = false;
      this.$toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      });
      // if (currencyType == 2) { // algolia搜索
      //   this.pageIndex = 0;
      //   if (index == 1) { // 销量
      //     searchClient = client.initIndex(currenOTO + '_sales_des');
      //   } else if (index == 0) { 
      //     if (this.dropdownVal == 0) { // 综合排序
      //       searchClient = client.initIndex(currenOTO);
      //     } else if (this.dropdownVal == 1) { // 价格升序
      //       searchClient = client.initIndex(currenOTO + '_price_asc');
      //     } else if (this.dropdownVal == 2) { // 价格降序
      //       searchClient = client.initIndex(currenOTO + '_price_des');
      //     }
      //   }
      //   this.getProductList();
      //   return false;
      // }
      this.pageIndex = 0;
      this.params = { ...this.params, searchKeyword: this.searchVal };
      if (index == 1) { // 销量
        this.isDisabledDropdownMenu = true;
        this.params = {
          ...this.params,
          sortMap: {
            key: 'sale_count',
            value: 0
          }
        }
      } else if (index == 0) {
        this.isDisabledDropdownMenu = false;
        if (this.dropdownVal == 0) { // 综合排序
          this.params = {
            ...this.params,
            sortMap: {}
          }
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
      // if (currencyType == 2) { // algolia搜索
      //   if (value == 0) { // 综合排序
      //     searchClient = client.initIndex(currenOTO);
      //   }
      //   this.pageIndex = 0;
      //   if (value == 1) { // 价格升序
      //     searchClient = client.initIndex(currenOTO + '_price_asc');
      //   } else if (value == 2) { // 价格降序
      //     searchClient = client.initIndex(currenOTO + '_price_des');
      //   }
      //   this.getProductList();
      //   return false;
      // }
      // if (value == 0) { // 综合排序
      //   this.typeActive = this.$t('search_filter_overall');
      // }
      this.$toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      });
      this.pageIndex = 0;
      this.params = { ...this.params, searchKeyword: this.searchVal, sortMap: {} };
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
      let value = val.trim().length > 0 ? val.trim() : this.hintName.length > 0 ? this.hintName : '';
      if (value.length == 0) return false;
      // 数据初始化
      this.list = [];
      this.pageIndex = 0;
      this.minPrice = this.maxPrice = '';
      this.available = this.overseas = this.deliveryType = false;
      this.params = {};
      this.brandResult = this.categoryResult = [];

      if (value == this.$route.query.val) {
        this.$fetch();
        return false;
      }

      if (this.isRouteBack != 0) {
        this.$router.replace({
          name: 'search',
          query: {
            val: value,
            searchKeyword: value
          }
        })
      } else {
        this.$router.push({
          name: 'search',
          query: {
            val: value,
            searchKeyword: value
          }
        })
      }
    },
    onFocus() { // 获取焦点之后，不展示数据列表和历史数据
      if (this.searchVal.trim().length == 0) return false;
      this.isShowTip = this.searchVal.length > 0 ? -1 : this.searchVal.length === 0;
      // if (currencyType == 0) { // 阿里搜索才有
        this.getSearchPull();
      // }
    },
    onFilter() { // 筛选
      // if (currencyType == 2) { // algolia 搜索
      //   let filterArr = [];
      //   let facetFilters = [];
      //   if (this.brandResult.length > 0) {
      //     facetFilters.push(this.brandResult.map(brandItem => {
      //       return `brandName: ${brandItem}`
      //     }));
      //   }
      //   if (this.categoryResult.length > 0) {
      //     facetFilters.push(this.categoryResult.map(categoryItem => {
      //       return `categoryName: ${categoryItem}`
      //     }));
      //   }
      //   if (this.available == true) { // 是否有货
      //     filterArr.push('available=1');
      //   }
      //   if (this.overseas == true) { // 是否海外购
      //     filterArr.push('overseas=1');
      //   }
      //   if (this.deliveryType == true) { // tospino物流
      //     filterArr.push('deliveryType=2');
      //   }
      //   if (this.maxPrice != '' && this.minPrice != '') {
      //     filterArr.push(`minPrice: ${this.minPrice} TO ${this.maxPrice}`);
      //   } else if (this.minPrice != '') { // 最低价格
      //     filterArr.push(`minPrice >= ${this.minPrice}`);
      //   } else if (this.maxPrice != '') { // 最高价格
      //     filterArr.push(`minPrice <= ${this.maxPrice}`);
      //   }
        
      //   this.pageIndex = 0;
      //   this.params.filters = filterArr.join(' AND ');
      //   this.params.facetFilters = facetFilters;
      //   this.getProductList();
      //   return false;
      // }
      let _data = {
        searchKeyword: this.searchVal,
        // brandName: this.brandName,
        categoryNameList: this.categoryResult,
        brandNameList: this.brandResult
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
      this.pageIndex = 0;
      this.params = {
        // ...this.params,
        ..._data,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      };
      this.filterPopup = false; // 筛选窗口隐藏
      this.$toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      });
      this.getProductList();
    },
    onReset() { // 筛选重置
      this.brandName = this.minPrice = this.maxPrice = this.categoryName = '';
      this.available = this.overseas = this.deliveryType = false;
      // if (currencyType == 2) { // algolia 搜索
        if (this.$refs.brandCheckboxGroup) {
          this.$refs.brandCheckboxGroup.toggleAll(false);
        }
        if (this.$refs.categoryCheckboxGroup) {
          this.$refs.categoryCheckboxGroup.toggleAll(false);
        }
        
        this.pageIndex = 0;
        // this.params = {
        //   filters: ''
        // }
      // } else {
      //   this.pageIndex = 1;
      // }
    },
    showMoreHistory() { // 展示更多的搜索历史
      this.historyNum = false;
      this.searchHistoryList = this.$store.state.searchProductList;
    },
    toSearch(item) {
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
    getSearchPull() { // 获取搜索下拉列表 仅阿里搜索有
      getSearchPull({ queryName: this.searchVal, hits: 10 }).then(res => {
        this.searchPullList = res.data ? res.data.suggestions : [];
        // this.list = [];
      }).catch(error => {
        console.log(error);
      })
    },
    getProductList() { // 获取商品列表 flag 是否取消loading
      // if (currencyType == 2) { // algolia搜索
      //   let _filter = [];
      //   if (this.shopId != '') {
      //     _filter.push(`shopId:${this.shopId}`);
      //   }
      //   if (this.params.deliveryType) {
      //     _filter.push(`deliveryType:${this.params.deliveryType}`);
      //   }
      //   let facetFilters = this.params.facetFilters ? this.params.facetFilters : [];
      //   let facetProducts = this.params.productIds ? this.params.productIds : [];
      //   let brandIds = this.params.brandIds ? this.params.brandIds : [];
      //   let countryCodes = this.params.countryCodes ? this.params.countryCodes : [];

      //   searchClient.search(this.params.productIds || this.params.categoryIds ? '' : this.searchVal, {
      //     page: this.pageIndex, // 从0开始算起
      //     hitsPerPage: this.pageSize,
      //     filters: this.params.filters ? this.params.filters + (_filter.length > 0 ? ' AND ' + _filter.join(' AND ') : '') : (_filter.length > 0 ? _filter.join(' AND ') : ''),
      //     facetFilters: [...facetFilters, ...facetProducts, ...brandIds, ...countryCodes]
      //   }).then(({hits, nbHits}) => {
      //     this.total = nbHits;
      //     this.list = this.pageIndex == 0 ? hits : this.list.concat(hits);
      //     this.isShowTip = false;
      //     this.filterPopup = false; // 筛选窗口隐藏
      //     this.refreshing.isFresh = false;
      //     this.loading = false;
      //     this.finished = this.total == this.list.length ? true : false;
      //     setTimeout(() => {
      //       if (typeof this.$redrawVueMasonry === 'function') {
      //         this.$redrawVueMasonry();
      //       }
      //     }, 50)
      //   }).catch(error => {
      //     console.log(error);
      //   })
      //   return false;
      // }
      // 阿里搜索
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
      // if (this.$route.query.navCategoryIds) {
      //   this.params.navCategoryIds = !Array.isArray(this.$route.query.navCategoryIds) ? [this.$route.query.navCategoryIds] : this.$route.query.navCategoryIds;
      //   delete this.params.searchKeyword;
      // }
      this.$api.getProductSearch(this.params).then(res => {
        let list = res.data.items.map(item => {
          return {
            ...item,
            starLevel: parseFloat(item.starLevel)
          }
        });
        this.list = this.pageIndex == 0 ? list : this.list.concat(list);
        this.total = res.data.total;
        this.isShowTip = false;
        this.refreshing.isFresh = false;
        this.loading = false;
        this.finished = this.total == this.list.length ? true : false;
        this.$toast.clear();
        setTimeout(() => {
          if (typeof this.$redrawVueMasonry === 'function') {
            this.$redrawVueMasonry('searchMasonryContainer');
          }
        }, 50)
      }).catch(error => {
        console.log(error);
      })
    },
    onRefresh() { // 刷新
      this.pageIndex = 0;
      this.getProductList();
    },
    onLoad() { // 加载更多
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
          if (this.backName == 'product-id') {
            this.$router.replace({
              path: '/product/' + this.backNameId,
              query: this.backQuery
            })
          } else {
            this.$router.replace({
              name: this.backName,
              params: {
                id: this.backNameId
              },
              query: this.backQuery
            });
          }
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
}
</script>

<style lang="less" scoped>
.tag-name{
  padding-top: 6px;
  padding-bottom: 6px;
  background-color: #F8F8F8;
  word-break: break-all;
}
.delete-style{
  color: rgba(0, 0, 0, .45);
  font-size: 14px;
}
.w-230{
  width: 230px;
}
.product-search{
  width: 79%;
  height: 100%;
  .product-search-filter{
    padding-top: 60px;
    padding-bottom: 60px;
  }
  .product-search__btn{
    position: absolute;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    button{
      width: 50%;
      height: 48px;
      outline: none;
      border: none;
    }
    .product-search__btn--reset{
      background-color: rgba(255, 102, 102, 0.05);
    }
  }
}
.ptb-6{
  padding-top: 6px!important;
  padding-bottom: 6px!important;
}
.mt-32{
  margin-top: 32px;
}
.w-130{
  width: 130px;
}
.mt-6{
  margin-top: 6px;
}
.w-84{
  width: 84px;
}
.odd-0{
  &:nth-child(odd) {
    margin-left: 0!important;
  }
}
.odd-3{
  &:nth-child(3n+1) {
    margin-left: 0!important;
  }
}
.v-100{
  height: 100%;
  overflow: scroll;
}
.border-transparent{
  border: 1px solid transparent;
}
.is-active{
  color: #42B7AE!important;
  background-color: rgba(66, 183, 174, 0.05)!important;
  border: 1px solid #42B7AE!important;
}
.border-229::after{
  width: 229px;
  left: auto;
  right: 0;
}
::v-deep .van-dropdown-menu__item--disabled .van-dropdown-menu__title{
  color: #383838;
  &::after{
    border-color: transparent transparent #383838 #383838;
  }
}
.soldout-container{
  position: relative;
  // width: 100%;
  // height: 100%;
  .soldout-container__tip{
    position: absolute;
    width: 70px;
    height: 70px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.65);
    z-index: 1;
  }
}
</style>
<style lang="less">
.pr-60{
  padding-right: 60px!important;
}
.home-search-sticky .van-sticky{
  background-color: #fff;
  .search-container{
    // height: 34px!important;
    .van-search__content{
      height: 34px!important;
      padding-left: 10px!important;
    }
    .van-field__left-icon{
      height: 20px!important;
    }
    .van-cell {
      // padding: 0!important;
      align-items: center;
      height: 100%!important;
    }
  }
}
.custom-checkbox-single{
  .van-checkbox__icon{
    height: auto;
    line-height: 0;
  }
}
</style>
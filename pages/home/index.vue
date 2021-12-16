<template>
  <!-- 首页 -->
  <div class="bg-grey home-page">
    <!-- 一级导航栏 -->
    <van-sticky ref="headerStickyContainer" class="w-100 home-page-nav" @scroll="stickyScroll">
      <!-- logo -->
      <BmImage 
        :url="require('@/assets/images/logo.png')"
        :width="'.54rem'" 
        :height="'.6rem'"
        :isShow="false"
        :alt="'TospinoMall logo'"
        class="home-page-nav-logo"
        :isClip="0"
      />
      <!-- 搜索框 -->
      <div class="home-page-nav__search" ref="homeSearch" @click="$router.push({ name: 'search', query: { back: 'home' } })">
        <van-search
          v-model="searchVal"
          :placeholder="$t('search_product_of_interest')"
          shape="round"
          class="search-container-home"
          disabled
        >
          <template #left-icon>
            <BmImage 
              :url="require('@/assets/images/icon/search-icon.png')"
              :width="'0.4rem'" 
              :height="'0.4rem'"
              :isShow="false"
              :alt="'TospinoMall search logo'"
              :isClip="0"
            />
          </template>
          <template #right-icon>
            <van-button
              round
              type="info"
              size="small"
              color="linear-gradient(270deg, #3EB5AE 0%, #70CEB6 100%)"
              class="button-container small"
            >
              {{ $t('search') }}
            </van-button>
          </template>
        </van-search>
      </div>
      <!-- 信息入口 -->
      <nuxt-link :to="{ path: $store.state.user.authToken ? '/me/message' : '/login.html' }">
        <van-badge :dot="$store.state.user.isNewMessage" class="home-page-nav__message">
          <BmImage
            :url="require('@/assets/images/message-icon.png')"
            :width="'.64rem'" 
            :height="'.64rem'"
            :isLazy="false"
            :isShow="false"
            :alt="'TospinoMall message icon'"
            :isClip="0"
          />
        </van-badge>
      </nuxt-link>
    </van-sticky>

    <!-- 下拉刷新 -->
    <PullRefresh :refreshing="refreshing" @refresh="onRefresh">
      <!-- 热门搜索种类列表 -->
      <div class="flex bg-white popular-search-list">
        <nuxt-link class="black round-10 fm-pf-r small-single-tag" v-for="(hotItem, index) in hotSearch" :key="'hot-search-' + index" :to="{ name: 'search', query: { val: hotItem.name, searchKeyword: hotItem.name } }">
          {{ hotItem.name }}
        </nuxt-link>
      </div>
      <!-- 
        下面部分全部根据接口下发的进行视图展示 
        effect：0无轮播 1有轮播
        moduleTitle： 模块标题
        moduleTitleDisplay: 是否显示组件标题 0不显示 1显示
        type： 展示格式 1 首页banner 2热区图片 3一行三列 4一行两列
        imageLinkType: 图片链接类型（0:商品链接，1:前端分类id，2:后端分类id，3:品牌，4:FBT，5:FBM，6:外部链接）
      -->
      <div v-for="(moduleItem, moduleIndex) in moduleData" :key="'module-data-' + moduleIndex">
        <h2 class="fs-18 mlr-12 fw black pb-12 lh-20 fm-din-alternate" v-if="moduleItem.moduleTitleDisplay">{{ moduleItem.moduleTitle }}</h2>
        <!-- 整屏轮播图 -->
        <div v-if="moduleItem.type === 1" class="mt-12 mb-12">
          <swiper
            :ref="'swiperFullScreenRef' + moduleIndex"
            class="swiper home-banner-swiper"
            :options="swiperFullScreenOption"
            v-if="moduleItem.componentDetails.length > 0"
          >
            <swiper-slide 
              class="plr-12 hot-container" 
              v-for="(slideItem, slideIndex) in moduleItem.componentDetails"
              :key="'swiper-slide-image-' + slideIndex"
              :ref="'swiperFullScreenRef' + moduleIndex + slideIndex"
            >
              <BmImage
                :url="slideItem.imageUrl"
                :loadUrl="require('@/assets/images/product-bgd-375.png')"
                :errorUrl="require('@/assets/images/product-bgd-375.png')"
                :fit="'cover'"
                :height="'3.72rem'"
                class="round-8 hidden"
                :alt="slideItem.goodTitle"
                :isClip="0"
              />
              <!-- 图片坐标 -->
              <div class="bg-white hot-container__position" :style="hotStyle(slideItem, 'swiperFullScreenRef' + moduleIndex + slideIndex, 'swiperFullScreenRef' + moduleIndex)" @click="onHotDetail(slideItem)"></div>
            </swiper-slide>
            <div class="swiper-pagination swiper-full-pagination" slot="pagination"></div>
          </swiper>
        </div>

        <!-- 热区图片 -->
        <template v-if="moduleItem.type === 2">
          <div class="fs-0 hot-container" :ref="'hotContainer' + moduleIndex">
            <BmImage
              :url="moduleItem.imageUrl"
              :loadUrl="require('@/assets/images/product-bgd-375.png')"
              :errorUrl="require('@/assets/images/product-bgd-375.png')"
              :alt="'TospinoMall hot moduleItem'"
              :isClip="0"
            />
            <!-- 图片坐标 -->
            <div v-for="hotItem, hotIndex in moduleItem.componentDetails" :key="'hot-picture-' + hotIndex" class="hot-container__position" :ref="'hotPosition' + moduleIndex + hotIndex" :style="hotStyle(hotItem, 'hotPosition' + moduleIndex + hotIndex, 'hotContainer' + moduleIndex)" @click="onHotDetail(hotItem)"></div>
          </div>
        </template>
        

        <!-- 一行三列 -->
        <div class="mlr-12 mb-12 home-page__global" v-if="moduleItem.type === 3">
          <!-- 轮播展示 -->
          <swiper
            ref="swiperComponentRef"
            :class="{ 'swiper home-page__global-swiper': true, 'swiper-no-swiping' : moduleItem.componentDetails.length <= 3, 'pb-34': moduleItem.effect == 1 && moduleItem.componentDetails.length > 3 }"
            :options="{
              ...swiperComponentOption,
              loop: moduleItem.componentDetails.length > 3,
              loopFillGroupWithBlank: moduleItem.componentDetails.length > 3
            }"
          >
            <swiper-slide v-for="(productItem, productIndex) in moduleItem.componentDetails" :key="productIndex">
              <!-- 图片、标题、价格 id goodsId productItem.mainPictureUrl -->
              <nuxt-link :to="'/product/' + productItem.goodsId + '.html'" class="block">
                <ProductTopBtmSingle
                  class="m-auto"
                  :img="{ url: productItem.mainPictureUrl, width: '2.24rem', height: '2.24rem', loadImage: require('@/assets/images/product-bgd-90.png') }" 
                  :detail="{ desc: productItem.goodTitle, price: productItem.price, ellipsis: 2 }"
                  :isHeight="true"
                />
              </nuxt-link>
            </swiper-slide>
            <template v-if="moduleItem.componentDetails.length < 3">
              <swiper-slide v-for="addItem in (3 - parseFloat(moduleItem.componentDetails.length))" :key="'self-add-' + addItem"></swiper-slide>
            </template>
            
            <div class="swiper-pagination swiper-group-pagination" v-show="moduleItem.effect == 1 && moduleItem.componentDetails.length > 3" slot="pagination"></div>
          </swiper>
        </div>

        <!-- 一行两列 -->
        <template v-if="moduleItem.type === 4">
          <div class="mlr-12 mb-12">
            <swiper
              ref="swiperComponentRef"
              :class="{ 'swiper home-page__global-swiper': true, 'swiper-no-swiping' : moduleItem.componentDetails.length <= 2, 'pb-34': moduleItem.effect == 1 && moduleItem.componentDetails.length > 2 }"
              :options="{
                ...swiperComponent2Option,
                loop: moduleItem.componentDetails.length > 2,
                loopFillGroupWithBlank: moduleItem.componentDetails.length > 2
              }"
            >
              <swiper-slide v-for="(productType4Item, productIndex) in moduleItem.componentDetails" :key="productIndex">
                <nuxt-link 
                  :to="'/product/' + productType4Item.goodsId + '.html'"
                  class="iblock"
                >
                  <ProductTopBtmSingle
                    :img="{ url: productType4Item.mainPictureUrl, width: '3.4rem', height: '3.4rem', loadImage: require('@/assets/images/product-bgd-170.png') }" 
                    :detail="{ desc: productType4Item.goodTitle, price: parseFloat(productType4Item.price), rate: 0, volumn: parseFloat(productType4Item.salesVolume), ellipsis: 2 }"
                    :isHeight="true"
                  />
                </nuxt-link>
              </swiper-slide>

              <template v-if="moduleItem.componentDetails.length < 2">
                <swiper-slide v-for="addItem in (2 - parseFloat(moduleItem.componentDetails.length))" :key="'self-add-' + addItem"></swiper-slide>
              </template>
              
              <div class="swiper-pagination swiper-group2-pagination" v-show="moduleItem.effect == 1 && moduleItem.componentDetails.length > 2" slot="pagination"></div>
            </swiper>
            
          </div>
        </template>
      </div>
      
      <!-- 商品种类栏 -->
      <!-- <div class="plr-12 flex hstart mt-20 home-product">
        <dl v-for="(product, index) in 5" :key="'product-'+index" class="tc product-single__dl">
          <dt class="product-single__dl--dt">
            <img src="https://img01.yzcdn.cn/vant/apple-1.jpg" alt="">
          </dt>
          <dd v-html="Welfare" class="fs-12 black product-single__dl--dd"></dd>
        </dl>
      </div> -->
      <!-- 一行三列 -->
      <!-- <div class="mlr-12 home-page__global">
        <h2 class="fs-18 fw black mt-20 lh-20 home-page__global--title">一行三列 轮播</h2>
        <swiper
          ref="swiperComponentRef"
          class="swiper home-page__global-swiper"
          :options="swiperComponentOption"
        >
          <swiper-slide v-for="index in 4" :key="index"> -->
            <!-- 图片、标题、价格 -->
            <!-- <div class="pic-title-price">
              <img class="pic-title-price__icon" src="https://img01.yzcdn.cn/vant/apple-1.jpg" alt="" />
              <h4 class="hidden-2 pic-title-price__title">Apple Iphone Max Pro 12，八核</h4>
              <div class="fw fs-16 pic-title-price__price">49.92</div>
            </div>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper> -->
        <!-- 图片、标题、价格 -->
        <!-- <h2 class="fs-18 fw black mt-20 lh-20 home-page__global--title">一行三列 固定</h2>
        <div class="flex between home-page__global--3column">
          <div class="pic-title-price" v-for="index in 3" :key="index">
            <img class="pic-title-price__icon" src="https://img01.yzcdn.cn/vant/apple-1.jpg" alt="" />
            <h4 class="hidden-2 pic-title-price__title">Apple Iphone Max Pro 12，八核</h4>
            <div class="fw fs-16 pic-title-price__price">49.92</div>
          </div>
        </div>
        <h2 class="fs-18 fw black mt-20 lh-20 home-page__global--title">一行两列</h2> -->
        <!-- 一行两列 -->
        <!-- <div class="flex between flex--2column">
          <div class="pic-title-price" v-for="index in 2" :key="index">
            <img class="pic-title-price__icon" src="https://img01.yzcdn.cn/vant/apple-1.jpg" alt="" />
            <h4 class="hidden-2 pic-title-price__title">Apple Iphone Max Pro 12，八核</h4>
            <div class="fw fs-16 pic-title-price__price">49.92</div>
          </div>
        </div>
      </div> -->
      <!-- 清仓大甩卖 -->
      <!-- <div class="mlr-12 mt-20 round-8 clearance-sale">
        <div class="flex between vcenter clearance-sale__top">
          <h2 class="fs-18 fw black lh-20 clearance-sale__top--title">Clearance Sale</h2> -->
          <!-- 倒计时 -->
          <!-- <van-count-down :time="clearanceTime">
            <template #default="timeData">
              <span class="fs-12 iblock fw tc lh-20 round-4 vant-time-block">{{ timeData.hours }}</span>
              <span class="iblock vant-time-colon">:</span>
              <span class="fs-12 iblock fw tc lh-20 round-4 vant-time-block">{{ timeData.minutes }}</span>
              <span class="iblock vant-time-colon">:</span>
              <span class="fs-12 iblock fw tc lh-20 round-4 vant-time-block">{{ timeData.seconds }}</span>
            </template>
          </van-count-down>
        </div> -->
        <!-- 商品列表 -->
        <!-- <div class="flex clearance-sale__bottom">
          <div class="round-4 clearance-product__list" v-for="(clearance, index) in 4" :key="'clearance-' + index">
            <span class="fw fs-10 clearance-product__list--tag">Sale</span>
            <img class="clearance-product__list--img" src="https://img01.yzcdn.cn/vant/apple-1.jpg" alt="">
            <h4 class="fs-14 black clearance-product__list--title" v-html="'Welfare'"></h4>
            <p class="fs-14 fw clearance-product__list--price">{{ 2 }}</p>
          </div>
        </div>
      </div> -->
      <!-- 滚动标签栏部分 -->
      <van-tabs sticky swipeable animated :offset-top="'0.88rem'" color="#42B7AE" v-model="tabCategoryActive" @change="getSearchList" class="mh-60 custom-home-tab" :ellipsis="false" :lazy-render="false" v-if="categoryList.length > 0">
        <van-tab v-for="(categoryItem, tabIndex) in categoryList" :title="categoryItem.name" :key="'scroll-tab-' + tabIndex" :name="categoryItem.id">
          <empty-status v-if="categoryItem.items.length === 0" :image="require('@/assets/images/empty/order.png')" class="mh-60" />
          <van-list
            v-else
            v-model="loading"
            :finished="finished"
            @load="onLoad"
            class="plr-12 pb-10"
            :immediate-check="false"
          >
            <!-- 加载中提示 -->
            <!-- <template #loading>
              <div class="hcenter">
                <van-loading color="#42B7AE" />loading...
              </div>
            </template> -->
            <!-- <template #finished>
              <div class="hcenter">没有多余数据了</div>
            </template> -->
            <!-- <template #error>
              <div class="hcenter">加载失败</div>
            </template> -->

            <!-- 瀑布流 -->
            <div 
              class="mx-auto my-2"
              v-masonry="homeMasonryContainer"
              item-selector=".custom-grid-item"
              fit-width="true"
              transition-duration="0s"
              :gutter="gutter"
              stagger="0s"
            >
              <nuxt-link
                v-for="(searchItem, searchIndex) in categoryItem.items"
                :key="'search-list-' + searchIndex"
                :to="'/product/' + searchItem.productId + '.html'"
                class="iblock mt-10 custom-grid-item"
                v-masonry-tile="homeMasonryContainer">
                <client-only placeholder="">
                  <ProductTopBtmSingle
                    :img="{ url: searchItem.mainPictureUrl, width: '3.4rem', height: '3.4rem', loadImage: require('@/assets/images/product-bgd-170.png') }" 
                    :detail="{ desc: searchItem.productTitle, price: searchItem.minPrice, rate: searchItem.starLevel, volumn: searchItem.saleCount, ellipsis: 2, stock: searchItem.stock, supplyCountryName: searchItem.supplyCountryName, transportMode: searchItem.transportMode, deliveryType: searchItem.deliveryType }"
                  />
                </client-only>
              </nuxt-link>
            </div>
          </van-list>
        </van-tab>
      </van-tabs>

    </PullRefresh>

    <!-- 平台新人红包 -->
    <dialog-gift-coupon :lists="platformCoupons" :isGiftShow="isPlatformCouponShow" @onBeforeClose="isPlatformCouponShow = $event"></dialog-gift-coupon>

    <!-- 底部 -->
    <BmTabbar />
  </div>
</template>

<script>
import { Search, CountDown, Sticky, Tab, Tabs, Loading, List, Badge } from 'vant';
import ProductTopBtmSingle from '@/components/ProductTopBtmSingle';
import EmptyStatus from '@/components/EmptyStatus';
import PullRefresh from '@/components/PullRefresh';
import 'swiper/css/swiper.css';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import DialogGiftCoupon from '@/components/DialogGiftCoupon';

let searchClient;
let currencyType;

export default {
  // middleware: 'sockjs',
  components: {
    vanSearch: Search,
    vanSticky: Sticky,
    vanTab: Tab,
    vanTabs: Tabs,
    vanCountDown: CountDown,
    vanLoading: Loading,
    vanList: List,
    vanBadge: Badge,
    ProductTopBtmSingle,
    EmptyStatus,
    PullRefresh,
    swiper: Swiper,
    swiperSlide: SwiperSlide,
    DialogGiftCoupon
  },
  data() {
    return {
      searchVal: '',
      // clearanceTime: 30*60*60*1000,
      swiperComponentOption: { // 一行三列 滚动
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 0,
        // loop: true,
        // loopFillGroupWithBlank: true,
        pagination: {
          el: '.swiper-group-pagination',
          clickable: true,
        },
        observer: true,
        observeParents: true
      },
      swiperComponent2Option: { // 一行两列 滚动
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 0,
        // loop: true,
        // loopFillGroupWithBlank: true,
        pagination: {
          el: '.swiper-group2-pagination',
          clickable: true,
        },
        observer: true,
        observeParents: true
      },
      swiperFullScreenOption: { // 一屏一个 整屏展示
        pagination: {
          el: '.swiper-full-pagination',
          clickable: true
        },
        loop: true,
        centeredSlides: true,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false,
        },
      },
      tabCategoryActive: 0,
      refreshing: {
        isFresh: false
      },
      hotSearch: [],
      moduleData: [],
      categoryList: {},
      searchList: [],
      meta: {},
      loading: false,
      finished: false,
      // pageIndex: 0,
      // pageSize: 10,
      tabTotal: 0,
      homeMasonryContainer: 'homeMasonryContainer',
      filterCategoryIds: [],
      platformCoupons: [],
      isFromLogin: false,
      isPlatformCouponShow: false
    }
  },
  async fetch() {
    try {
      // currencyType = this.$store.state.searchType; // 0 阿里搜索 2 algolia搜索
      const metaData = await this.$api.getHomeSeo(); // 获取SEO信息
      this.meta = metaData.data;

      const hotData = await this.$api.getHomeRecommendWord(); // 首页推荐词
      this.hotSearch = hotData.data; // 热门搜索

      const homeData = await this.$api.getHomeData(); // 组件数据
      this.moduleData = homeData.data.components; // 需要展示的模块数据

      // 已登录自动领取平台新人红包
      let isAutoReceive = 0; // 0没
      if (this.$store.state.user.authToken) {
        await this.$api.autoGetPlatformCoupon();
        isAutoReceive = 1;
      }

      if (isAutoReceive == 0) {
        // 获取新人优惠券
        const platformCoupons = await this.$api.getPlatformCouponList();
        this.platformCoupons = platformCoupons.data;
        this.isPlatformCouponShow = this.platformCoupons.length > 0 ? true : false;
      }

      // 分类列表
      this.tabCategoryActive = '0';
      const categoryList = await this.$api.getCategoryList(); 
      if (categoryList.data && categoryList.data.length > 0) {
        this.categoryList = [
          {
            name: this.$t('all'),
            items: [],
            total: 0,
            id: 0,
            pageIndex: 0
          },
          ...categoryList.data.map(item => {
            return {
              ...item,
              items: [],
              total: 0,
              pageIndex: 0
            }
          })
        ];
      }
      
      // 搜索商品列表如果已经达到最大查询再次进来页面时不调用接口
      // if (parseFloat(this.tabTotal) == this.searchList.length && this.pageIndex > 0) { // 没有下一页了
      //   this.finished = true;
      //   this.loading = false;
      //   return false;
      // }

      // if (currencyType == 2) {
      //   const algoliasearch = require('algoliasearch');
      //   let client = algoliasearch('62MLEBY33X','7a8da9a5fd3f8137ea8cb70b60806e8d');
      //   searchClient = client.initIndex('tospinoMall');
      //   this.pageIndex = 0;
      //   searchClient.search('', {
      //     page: this.pageIndex, // 从0开始算起
      //     hitsPerPage: this.pageSize
      //   }).then(({hits, nbHits}) => {
      //     this.tabTotal = nbHits;
      //     this.searchList = hits;
      //     this.loading = false;
      //     this.finished = this.tabTotal == this.searchList.length ? true : false;
      //     this.$toast.clear();
      //     setTimeout(() => {
      //       if (typeof this.$redrawVueMasonry === 'function') {
      //         this.$redrawVueMasonry('homeMasonryContainer');
      //       }
      //     }, 50)
      //   })
      // } else {
        const searchList = await this.$api.getProductSearch({ /*pageSize: this.pageSize,*/ pageIndex: 0 }); // 搜索商品列表
        
        this.refreshing.isFresh = false;
        if (!searchList.data) return false;
        
        let list = searchList.data.items.map(item => { // 搜索商品列表
          return {
            ...item,
            starLevel: parseFloat(item.starLevel),
            saleCount: parseFloat(item.saleCount),
            minPrice: parseFloat(item.minPrice)
          }
        })
        
        this.categoryList[0].items = list;
        this.categoryList[0].total = searchList.data.total;
        this.finished = list.length == searchList.data.total ? true : false;
        setTimeout(() => {
          if (typeof this.$redrawVueMasonry === 'function') {
            this.$redrawVueMasonry('homeMasonryContainer');
          }
        }, 50)
      // }
    } catch (error) {
      console.log(error);
    }
  },
  head() { // 头部设置，方便seo
    return {
      title: this.meta.title || 'Tospino Ghana online shopping',
      meta: [
        { hid: 'description', name: 'description', content: this.meta.description || 'Tospino Ghana online shopping' },
        { hid: 'keywords', name: 'keywords', content: this.meta.keywords || 'Tospino Ghana online shopping' }
      ]
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.name == 'login' || from.name == 'login-old') { // 从登录页返回要更新数据
        vm.isFromLogin = true;
      }
    });
  },
  activated() {
    if (this.isFromLogin) {
      this.$fetch();
    }
    // if (this.searchList.length == 0) {
    //   this.$fetch();
    // } else {
      setTimeout(() => {
        if (typeof this.$redrawVueMasonry === 'function') {
          this.$redrawVueMasonry('homeMasonryContainer');
        }
      }, 50)
    // }
  },
  computed: {
    gutter() {
      return process.client ? parseInt(10 * document.body.clientWidth / 375) : 10;
    }
  },
  methods: {
    stickyScroll(scrollObj) { // 吸顶滚动事件
      // 滚动时格式化样式 sticky-scroll
      if (scrollObj.scrollTop > 2) {
        this.$refs.headerStickyContainer.$el.classList.add('sticky-scroll')
      }
      if (scrollObj.scrollTop < 50) {
        this.$refs.headerStickyContainer.$el.classList.remove('sticky-scroll');
      }
    },
    getSearchList(id, title) { // 获取搜索商品列表
      let categoryIds = {};
      // let facetFilters = [];
      if (id > 0) { // 非首页
        categoryIds.navCategoryIds = [id];
        // const getCategoryLinkMap = await this.$api.getCategoryLinkMap([this.tabCategoryActive]);
        // if (getCategoryLinkMap.data['productIds']) { // 商品id
        //   facetFilters.push((getCategoryLinkMap.data['productIds'].map(item => {
        //     return `productId:${item}`;
        //   })));
        // }
        // if (getCategoryLinkMap.data['categoryIds']) { // 分类id
        //   facetFilters.push((getCategoryLinkMap.data['categoryIds'].map(item => {
        //     return `categoryIds:${item}`;
        //   })));
        // }
        // this.filterCategoryIds = facetFilters;
      }
      // this.finished = false;
      // this.pageIndex = currencyType == 2 ? 0 : 1;
      
      // if (currencyType == 2) { // algolia 搜索
      //   searchClient.search('', {
      //     page: this.pageIndex, // 从0开始算起
      //     hitsPerPage: this.pageSize,
      //     facetFilters: facetFilters
      //   }).then(({hits, nbHits}) => {
      //     this.tabTotal = nbHits;
      //     this.searchList = hits;
      //     this.loading = false;
      //     this.finished = this.tabTotal == this.searchList.length ? true : false;
      //     this.$toast.clear();
      //     setTimeout(() => {
      //       if (typeof this.$redrawVueMasonry === 'function') {
      //         this.$redrawVueMasonry('homeMasonryContainer');
      //       }
      //     }, 50)
      //   })
      //   return false;
      // }
      // 过滤 当前tab对应的id
      let currentCategoryList = this.categoryList.filter(item => {
        return item.id == id;
      })

      // 如果长度为0需要重新获取第一页的数据
      if (currentCategoryList[0].items.length == 0) {
        this.$toast.loading({
          forbidClick: true,
          loadingType: 'spinner',
          duration: 0
        });
        this.getProductSearchList(currentCategoryList, categoryIds);
      } else {
        this.finished = currentCategoryList[0].total == currentCategoryList[0].items.length ? true : false;
      }
    },
    onHotDetail(hotDetail) { // 点击热区图进行跳转 imageLinkType: 0:商品链接(商品详情页)，跳转到搜索页(1:前端分类id，2:后端分类id，3:品牌，4:FBT，5:FBM，) 6:外部链接(直接打开)
      if (hotDetail.imageLinkType == 6) { // 打开外部链接
        location.href = hotDetail.outerLink;
        return false;
      }
      
      if (hotDetail.imageLinkType == 0) { // 商品详情页
        this.$router.push({
          path: '/product/' + hotDetail.goodsId + '.html'
        })
        return false;
      }
      // 下面全是跳转到搜索页面
      let _query = null;
      if (hotDetail.imageLinkType == 3) { // 搜索品牌
        _query = {
          brandId: hotDetail.brandIds,
          // val: hotDetail.brandIds
        }
      }
      if (hotDetail.imageLinkType == 4) { // 搜索fbt
        _query = {
          deliveryType: 2,
          countryCodes: hotDetail.fbtCountrys,
          // val: 2
        }
      }
      if (hotDetail.imageLinkType == 5) { // 搜索fbm
        _query = {
          deliveryType: 1,
          // val: 1,
          countryCodes: hotDetail.fbmCountrys
        }
      }
      if (hotDetail.imageLinkType == 2) { // 搜索 2后端分类id
        _query = {
          categoryId: hotDetail.serverMenuIds
        }
      }

      // 搜索 1前端分类id
      if (hotDetail.imageLinkType == 1) {
        _query = {
          navCategoryIds: hotDetail.frontMenuIds
        }
      }

      this.$router.push({
        name: 'search',
        query: _query
      })
    },
    hotStyle(hotItem, ele, container) { // 热区图位置计算 todo
      if (process.client) {
        this.$nextTick(() => {
          let _w = 0;
          let _h = 0;
          
          let timer = setInterval(() => { // 防止元素container的宽高获取不到，添加定时器，获取到定时器取消
            if (!this.$refs[container][0]) {
              return false;
            }
            _w = this.$refs[container][0].clientWidth;
            _h = this.$refs[container][0].clientHeight;
            if (_w > 0 && _h > 0) {
              clearInterval(timer);
              this.$refs[ele][0].style.width = hotItem.areaWidth + '%';
              this.$refs[ele][0].style.left = hotItem.positionX + '%';
              this.$refs[ele][0].style.height = hotItem.areaHeight + '%';
              this.$refs[ele][0].style.top = hotItem.positionY + '%';
            }
          }, 300);
        })
      }
    },
    onRefresh() { // 下拉刷新
      this.$fetch();
    },
    async onLoad() { // 滚动加载
      let currentCategoryList = this.categoryList.filter(item => {
        return item.id == this.tabCategoryActive;
      })

      if (currentCategoryList.length == 0) {
        return false;
      }

      // 没有下一页了
      if (parseFloat(currentCategoryList[0].total) <= currentCategoryList[0].items.length || this.finished == true) {
        this.finished = true;
        this.loading = false;
        return false;
      }

      currentCategoryList[0].pageIndex += 1;
      let categoryIds = {};
      if (parseFloat(this.tabCategoryActive) > 0) {
        categoryIds.navCategoryIds = [this.tabCategoryActive];
      }

      this.getProductSearchList(currentCategoryList, categoryIds);

      // if (currencyType == 2) { // algolia 搜索
      //   searchClient.search('', {
      //     page: this.pageIndex, // 从0开始算起
      //     hitsPerPage: this.pageSize,
      //     facetFilters: this.filterCategoryIds
      //   }).then(({hits, nbHits}) => {
      //     this.tabTotal = nbHits;
      //     this.searchList = this.searchList.concat(hits);
      //     this.loading = false;
      //     this.finished = this.tabTotal == this.searchList.length ? true : false;
      //     this.$toast.clear();
      //     setTimeout(() => {
      //       if (typeof this.$redrawVueMasonry === 'function') {
      //         this.$redrawVueMasonry('homeMasonryContainer');
      //       }
      //     }, 50)
      //   })
      //   return false;
      // }
    },
    getProductSearchList(currentCategoryList, categoryIds) {
      this.$api.getProductSearch({ ...categoryIds, pageIndex: currentCategoryList[0].pageIndex/*, pageSize: this.pageSize */}).then(res => {
        this.$toast.clear();
        if (currentCategoryList.length > 0) {
          currentCategoryList[0].items = currentCategoryList[0].items.concat(res.data.items.map(item => {
            return {
              ...item,
              starLevel: parseFloat(item.starLevel),
              saleCount: parseFloat(item.saleCount),
              minPrice: parseFloat(item.minPrice)
            }
          }))
          currentCategoryList[0].total = res.data.total;
        }
        setTimeout(() => {
          if (typeof this.$redrawVueMasonry === 'function') {
            this.$redrawVueMasonry('homeMasonryContainer');
          }
        }, 50)
        this.loading = false;
        this.finished = currentCategoryList[0].total == currentCategoryList[0].items.length ? true : false;
        // this.tabTotal = res.data.total;
      }).catch(error => {
        this.$toast.clear();
        console.log(error);
      })
    }
  },
  deactivated() {
    window.removeEventListener('scroll', this.stickyScroll); // 离开页面清除滚动事件
  }
};
</script>

<style lang="less" scoped>
.hot-container{
  position: relative;
  .hot-container__position{
    position: absolute;
  }
}
.mh-60{
  min-height: 60vh;
}
</style>

<style lang="less">
@import url('../../assets/css/home.less');
</style>
<template>
  <!-- 首页 -->
  <div class="home-page">
    <!-- 一级导航栏 -->
    <van-sticky ref="headerStickyContainer" class="w-100 home-page-nav" @scroll="stickyScroll">
      <!-- logo -->
      <BmImage 
        :url="require('@/assets/images/logo.png')"
        :width="'.54rem'" 
        :height="'.6rem'"
        :isLazy="false"
        :isShow="false"
      ></BmImage>
      <!-- 搜索框 -->
      <div class="mlr-12 home-page-nav__search" ref="homeSearch" @click="$router.push({ name: 'home-search' })">
        <van-search
          v-model="searchVal"
          :placeholder="$t('common.searchPlaceholder')"
          @search="onSearch"
          shape="round"
          class="search-container"
        >
          <template #right-icon>
            <van-button
              round
              type="info"
              size="small"
              @click="onSearch"
              color="linear-gradient(270deg, #3EB5AE 0%, #70CEB6 100%)"
              class="button-container small"
            >
              {{ $t('common.search') }}
            </van-button>
          </template>
        </van-search>
      </div>
      <!-- 信息入口 -->
      <BmImage 
        class="home-page-nav__message"
        :url="require('@/assets/images/message-icon.png')"
        :width="'.64rem'" 
        :height="'.64rem'"
        :isLazy="false"
        :isShow="false"
      ></BmImage>
    </van-sticky>
    <!-- 热门搜索种类列表 -->
    <div class="flex popular-search-list">
      <div class="black round-10 small-single-tag" v-for="(hotItem, index) in hotSearch" :key="'hot-search-' + index">
        {{ hotItem.name }}
      </div>
    </div>
    <!-- 
      下面部分全部根据接口下发的进行视图展示 
      effect：0无轮播 1有轮播
      moduleTitle： 模块标题
      moduleTitleDisplay: 是否显示组件标题 0不显示 1显示
      type： 展示格式 1 首页banner 2热区图片 3一行三列 4一行两列
    -->
    <div v-for="(moduleItem, moduleIndex) in moduleData" :key="'module-data-'+moduleIndex">
      <!-- 整屏轮播图 -->
      <div class="plr-12 home-swiper-container" v-if="moduleItem.type === 1">
        <swiper
          ref="swiperFullScreenRef"
          class="mt-20 swiper"
          :options="swiperFullScreenOption"
          v-if="moduleItem.componentDetails.length > 0"
        >
          <swiper-slide 
            class="round-8 hidden" 
            v-for="(slideItem, slideIndex) in moduleItem.componentDetails"
            :key="'swiper-slide-image-' + slideIndex"
          >
            <BmImage
              :url="slideItem.imageUrl"
              :loadUrl="require('@/assets/images/product-bgd-375.png')"
              :errorUrl="require('@/assets/images/product-bgd-375.png')"
            ></BmImage>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>

      <!-- 热区图片 -->
      <BmImage
        v-if="moduleItem.type === 2"
        :url="moduleItem.imageUrl"
        :loadUrl="require('@/assets/images/product-bgd-375.png')"
        :errorUrl="require('@/assets/images/product-bgd-375.png')"
        :isLazy="false"
      ></BmImage>

      <!-- 一行三列 -->
      <div class="mlr-12 home-page__global" v-if="moduleItem.type === 3">
        <!-- <h2 class="fs-18 fw black mt-20 lh-20" v-if="moduleItem.moduleTitleDisplay" v-html="moduleItem.moduleTitle"></h2> -->
        <h2 class="fs-18 fw black mt-20 lh-20">一行三列</h2>
        <!-- 轮播展示 -->
        <swiper
          ref="swiperComponentRef"
          :class="{ 'swiper home-page__global-swiper': true, 'swiper-no-swiping' : moduleItem.componentDetails.length <= 3 }"
          :options="{
            ...swiperComponentOption,
            loop: moduleItem.componentDetails.length > 3,
            loopFillGroupWithBlank: moduleItem.componentDetails.length > 3
          }"
        >
          <swiper-slide v-for="(productItem, productIndex) in moduleItem.componentDetails" :key="productIndex">
            <!-- 图片、标题、价格 id goodsId productItem.mainPictureUrl -->
            <ProductTopBtmSingle
              class="m-auto"
              :img="{ url: productItem.imageUrl, width: '2.24rem', height: '2.4rem', loadImage: require('@/assets/images/product-bgd-90.png') }" 
              :detail="{ desc: productItem.goodTitle, price: productItem.price, ellipsis: 2 }"
            ></ProductTopBtmSingle>
          </swiper-slide>
          <div class="swiper-pagination" v-if="moduleItem.effect" slot="pagination"></div>
        </swiper>
      </div>

      <!-- 一行两列 -->
      <template v-if="moduleItem.type === 4">
        <h2 class="fs-18 mlr-12 fw black mt-20 lh-20">一行两列</h2>
        <div class="mlr-12 mt-20 flex between">
          <ProductTopBtmSingle
            :img="{ url: productType4Item.imageUrl, width: '3.4rem', height: '3.4rem', loadImage: require('@/assets/images/product-bgd-170.png') }" 
            :detail="{ desc: productType4Item.goodTitle, price: productType4Item.price, rate: 2.5, volumn: productType4Item.salesVolume, ellipsis: 2 }"
            v-for="(productType4Item, productIndex) in moduleItem.componentDetails" 
            :key="productIndex"
          ></ProductTopBtmSingle>
        </div>
      </template>

      
    </div>
    
    <!-- 商品种类栏 -->
    <!-- <div class="plr-12 flex hstart mt-20 home-product">
      <dl v-for="(product, index) in productArr" :key="'product-'+index" class="tc product-single__dl">
        <dt class="product-single__dl--dt">
          <img :src="product.src" alt="">
        </dt>
        <dd v-html="product.title" class="fs-12 black product-single__dl--dd"></dd>
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
        <div class="round-4 clearance-product__list" v-for="(clearance, index) in clearanceLists" :key="'clearance-' + index">
          <span class="fw fs-10 clearance-product__list--tag">Sale</span>
          <img class="clearance-product__list--img" :src="clearance.src" alt="">
          <h4 class="fs-14 black clearance-product__list--title" v-html="clearance.title"></h4>
          <p class="fs-14 fw clearance-product__list--price">{{ 2 }}</p>
        </div>
      </div>
    </div> -->
    <!-- 滚动标签栏部分 -->
    <van-tabs sticky swipeable animated :offset-top="44" color="#42B7AE"  @change="getSearchList">
      <van-tab v-for="(categoryItem, tabIndex) in categoryList" :title="categoryItem.name" :key="'scroll-tab-' + tabIndex" title-class="pb-0" :name="categoryItem.name">
        <div class="mlr-12 mt-20 flex between flex-wrap">
          <empty-status v-if="searchList.length === 0" :status="'order'"></empty-status>
          <ProductTopBtmSingle
            v-else
            :img="{ url: '', width: '3.4rem', height: '3.4rem', loadImage: require('@/assets/images/product-bgd-170.png') }" 
            :detail="{ desc: categoryItem.name, price: 49.92, rate: 2.5, volumn: 50, ellipsis: 2 }"
            v-for="(searchItem, searchIndex) in searchList" 
            :key="'search-list-' + searchIndex"
          ></ProductTopBtmSingle>
        </div>
      </van-tab>
    </van-tabs>

    <!-- 底部 -->
    <BmTabbar />
  </div>
</template>

<script>
import { Search, CountDown, Sticky, Tab, Tabs } from 'vant';
import ProductTopBtmSingle from '@/components/ProductTopBtmSingle';
import EmptyStatus from '@/components/EmptyStatus';

export default {
  components: {
    vanSearch: Search,
    vanSticky: Sticky,
    vanTab: Tab,
    vanTabs: Tabs,
    vanCountDown: CountDown,
    ProductTopBtmSingle,
    EmptyStatus
  },
  async asyncData({ app }) {
    const [ homeData, categoryList, searchList ] = await Promise.all([
      app.$api.getHomeData(), // 组件数据
      app.$api.getCategoryList(), // 分类列表
      app.$api.getProductSearch({ categoryName: '' }), // 搜索商品列表
    ]);

    return {
      hotSearch: homeData.data.hotSearch, // 热门搜索
      moduleData: homeData.data.components, // 需要展示的模块数据
      categoryList: [
        {
          name: '全部'
        },
        ...categoryList.data
      ], // 分类列表
      searchList: searchList.data.items
    }
  },
  data() {
    return {
      searchVal: '',
      // swiperArr: ['https://img01.yzcdn.cn/vant/apple-1.jpg', 'https://img01.yzcdn.cn/vant/apple-2.jpg', 'https://img01.yzcdn.cn/vant/apple-3.jpg'],
      productArr: [
        {
          src: 'https://img01.yzcdn.cn/vant/apple-1.jpg',
          title: 'Welfare'
        },
        {
          src: 'https://img01.yzcdn.cn/vant/apple-1.jpg',
          title: 'New'
        }
      ],
      clearanceTime: 30*60*60*1000,
      clearanceLists: [
        {
          src: 'https://img01.yzcdn.cn/vant/apple-1.jpg',
          title: 'Welfare',
          price: 49.956
        },
        {
          src: 'https://img01.yzcdn.cn/vant/apple-1.jpg',
          title: 'Welfare',
          price: 45629.9
        }
      ],
      swiperComponentOption: { // 一排三列 滚动
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 0,
        // loop: true,
        // loopFillGroupWithBlank: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      },
      swiperFullScreenOption: { // 一屏一个 整屏展示
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      },
      searchParams: { // 搜索商品列表参数
        categoryName: '' // 分类名称
      }
    }
  },
  created() {
  },
  methods: {
    onSearch(val) {
      console.log(val);
    },
    stickyScroll(scrollObj) { // 吸顶滚动事件
      if (scrollObj.isFixed) {
        // 滚动时格式化样式 sticky-scroll
        if (scrollObj.scrollTop > 2) {
          // this.$refs.headerStickyContainer.$el.setAttribute('class', this.$refs.headerStickyContainer.$el.className + ' sticky-scroll');
          this.$refs.headerStickyContainer.$el.classList.add('sticky-scroll')
        }
        if (scrollObj.scrollTop < 50) {
          this.$refs.headerStickyContainer.$el.classList.remove('sticky-scroll');
        }
      }
    },
    onSwiper(swiper) {
      console.log(swiper);
    },
    onSlideChange() {
      console.log('slide change');
    },
    getSearchList(searchVal) { // 获取搜索商品列表
      this.searchParams.categoryName = searchVal;
      this.$api.getProductSearch(this.searchParams).then(res => {
        console.log(res)
      })
    }
  },
};
</script>

<style lang="less">
@import url('../../assets/css/home.less');
</style>
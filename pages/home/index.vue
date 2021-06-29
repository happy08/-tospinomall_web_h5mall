<template>
  <div class="home-page">
    <!-- 一级导航栏 -->
    <van-sticky ref="headerStickyContainer" class="w-100 home-page-nav" @scroll="stickyScroll">
      <img class="home-page-nav__logo" src="@/assets/images/logo.png" alt="">
      <!-- 搜索框 -->
      <div class="mlr-12 home-page-nav__search" ref="homeSearch">
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
      <img class="home-page-nav__message" src="@/assets/images/message-icon.png" alt="">
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
      <h2 class="fs-18 fw black mt-20 lh-20 mlr-12" v-if="moduleItem.moduleTitleDisplay" v-html="moduleItem.moduleTitle"></h2>
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
            <img class="home-swiper-container__img" :loading="loadImage" :error="loadImage"  v-lazy="slideItem.imageUrl" />
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>

      <!-- 热区图片 -->
      <div v-if="moduleItem.type === 2">
        <img width="100%" :src="moduleItem.imageUrl" alt="">
      </div>

      <!-- 一行三列 -->
      <div class="mlr-12 home-page__global" v-if="moduleItem.type === 3">
        <!-- 轮播展示 -->
        <swiper
          ref="swiperComponentRef"
          class="swiper home-page__global-swiper"
          :options="swiperComponentOption"
        >
          <swiper-slide v-for="(productItem, productIndex) in moduleItem.componentDetails" :key="productIndex">
            <!-- 图片、标题、价格 -->
            <ProductTopBtmSingle :img="{ url: 'https://img01.yzcdn.cn/vant/apple-1.jpg', width: '90px', height: '90px' }" :detail="{ desc: 'Apple Iphone Max Pro 12，八核', price: 49.92 }"></ProductTopBtmSingle>
          </swiper-slide>
          <div class="swiper-pagination" v-if="moduleItem.effect" slot="pagination"></div>
        </swiper>
        <!-- 固定展示3个 -->
        <!-- 图片、标题、价格 -->
        <!-- <div class="flex between home-page__global--3column">
          <div class="pic-title-price" v-for="(productItem, productIndex) in moduleItem.componentDetails" :key="productIndex">
            <img class="pic-title-price__icon" src="https://img01.yzcdn.cn/vant/apple-1.jpg" alt="" />
            <h4 class="hidden-2 pic-title-price__title">Apple Iphone Max Pro 12，八核</h4>
            <div class="fw fs-16 pic-title-price__price">49.92</div>
          </div>
        </div> -->
      </div>


    </div>
    <!-- 一行两列 -->
    <div class="flex between flex--2column">
      <div class="pic-title-price" v-for="index in 2" :key="index">
        <img class="pic-title-price__icon" src="https://img01.yzcdn.cn/vant/apple-1.jpg" alt="" />
        <h4 class="hidden-2 pic-title-price__title">Apple Iphone Max Pro 12，八核</h4>
        <div class="fw fs-16 pic-title-price__price">49.92</div>
      </div>
    </div>
    <!-- 商品种类栏 -->
    <div class="plr-12 flex hstart mt-20 home-product">
      <dl v-for="(product, index) in productArr" :key="'product-'+index" class="tc product-single__dl">
        <dt class="product-single__dl--dt">
          <img :src="product.src" alt="">
        </dt>
        <dd v-html="product.title" class="fs-12 black product-single__dl--dd"></dd>
      </dl>
    </div>
    <!-- 一行三列 -->
    <div class="mlr-12 home-page__global">
      <h2 class="fs-18 fw black mt-20 lh-20 home-page__global--title">一行三列 轮播</h2>
      <swiper
        ref="swiperComponentRef"
        class="swiper home-page__global-swiper"
        :options="swiperComponentOption"
      >
        <swiper-slide v-for="index in 4" :key="index">
          <!-- 图片、标题、价格 -->
          <div class="pic-title-price">
            <img class="pic-title-price__icon" src="https://img01.yzcdn.cn/vant/apple-1.jpg" alt="" />
            <h4 class="hidden-2 pic-title-price__title">Apple Iphone Max Pro 12，八核</h4>
            <div class="fw fs-16 pic-title-price__price">49.92</div>
          </div>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
      <!-- 图片、标题、价格 -->
      <h2 class="fs-18 fw black mt-20 lh-20 home-page__global--title">一行三列 固定</h2>
      <div class="flex between home-page__global--3column">
        <div class="pic-title-price" v-for="index in 3" :key="index">
          <img class="pic-title-price__icon" src="https://img01.yzcdn.cn/vant/apple-1.jpg" alt="" />
          <h4 class="hidden-2 pic-title-price__title">Apple Iphone Max Pro 12，八核</h4>
          <div class="fw fs-16 pic-title-price__price">49.92</div>
        </div>
      </div>
      <h2 class="fs-18 fw black mt-20 lh-20 home-page__global--title">一行两列</h2>
      <!-- 一行两列 -->
      <div class="flex between flex--2column">
        <div class="pic-title-price" v-for="index in 2" :key="index">
          <img class="pic-title-price__icon" src="https://img01.yzcdn.cn/vant/apple-1.jpg" alt="" />
          <h4 class="hidden-2 pic-title-price__title">Apple Iphone Max Pro 12，八核</h4>
          <div class="fw fs-16 pic-title-price__price">49.92</div>
        </div>
      </div>
    </div>
    <!-- 清仓大甩卖 -->
    <div class="mlr-12 mt-20 round-8 clearance-sale">
      <div class="flex between vcenter clearance-sale__top">
        <h2 class="fs-18 fw black lh-20 clearance-sale__top--title">Clearance Sale</h2>
        <!-- 倒计时 -->
        <van-count-down :time="clearanceTime">
          <template #default="timeData">
            <span class="fs-12 iblock fw tc lh-20 round-4 vant-time-block">{{ timeData.hours }}</span>
            <span class="iblock vant-time-colon">:</span>
            <span class="fs-12 iblock fw tc lh-20 round-4 vant-time-block">{{ timeData.minutes }}</span>
            <span class="iblock vant-time-colon">:</span>
            <span class="fs-12 iblock fw tc lh-20 round-4 vant-time-block">{{ timeData.seconds }}</span>
          </template>
        </van-count-down>
      </div>
      <!-- 商品列表 -->
      <div class="flex clearance-sale__bottom">
        <div class="round-4 clearance-product__list" v-for="(clearance, index) in clearanceLists" :key="'clearance-' + index">
          <span class="fw fs-10 clearance-product__list--tag">Sale</span>
          <img class="clearance-product__list--img" :src="clearance.src" alt="">
          <h4 class="fs-14 black clearance-product__list--title" v-html="clearance.title"></h4>
          <p class="fs-14 fw clearance-product__list--price">{{ 2 }}</p>
        </div>
      </div>
    </div>
    <!-- 滚动标签栏部分 -->
    <van-tabs sticky swipeable animated>
      <van-tab v-for="tabIndex in 8" :title="'标签 ' + tabIndex" :key="'scroll-tab-' + tabIndex">
        <div class="mlr-12 flex--2column">
          <div class="pic-title-price" v-for="index in 2" :key="index">
            <img class="pic-title-price__icon" src="https://img01.yzcdn.cn/vant/apple-1.jpg" alt="" />
            <h4 class="hidden-2 pic-title-price__title">Apple Iphone Max Pro 12，八核</h4>
            <div class="fw fs-16 pic-title-price__price">标签 {{tabIndex}}</div>
          </div>
        </div>
      </van-tab>
    </van-tabs>
    <!-- 底部 -->
    <BmTabbar />
  </div>
</template>

<script>
import { Search, CountDown, Sticky, Tab, Tabs } from 'vant';
const loadImage = require('@/assets/images/product-bgd-375.png');
import ProductTopBtmSingle from '@/components/ProductTopBtmSingle';

export default {
  components: {
    vanSearch: Search,
    vanSticky: Sticky,
    vanTab: Tab,
    vanTabs: Tabs,
    vanCountDown: CountDown,
    ProductTopBtmSingle
  },
  async asyncData({ app }) {
    const { data } = await app.$api.getHomeData();
    return {
      hotSearch: data.hotSearch, // 热门搜索
      moduleData: data.components // 需要展示的模块数据
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
        spaceBetween: 7,
        slidesPerGroup: 3,
        loop: true,
        loopFillGroupWithBlank: true,
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
      loadImage: loadImage
    }
  },
  created() {
    console.log(this.$utils);
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
  },
};
</script>

<style lang="less">
@import url('../../assets/css/home.less');
</style>
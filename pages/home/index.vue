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
        :isShow="false"
      />
      <!-- 搜索框 -->
      <div class="mlr-12 home-page-nav__search" ref="homeSearch" @click="$router.push({ name: 'search' })">
        <van-search
          v-model="searchVal"
          :placeholder="$t('common.searchPlaceholder')"
          shape="round"
          class="search-container"
          disabled
        >
          <template #right-icon>
            <van-button
              round
              type="info"
              size="small"
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
        :isShow="false"
      />
    </van-sticky>

    <!-- 下拉刷新 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <!-- 加载提示 -->
      <template #loading>
        <van-loading color="#42B7AE" />
      </template>
      <!-- 下拉提示 -->
      <template #pulling>
        <van-loading color="#42B7AE" />
      </template>
      <!-- 释放提示 -->
      <template #loosing>
        <van-loading color="#42B7AE" />
      </template>

      <!-- 热门搜索种类列表 -->
      <div class="flex popular-search-list">
        <nuxt-link class="black round-10 fm-pf-r small-single-tag" v-for="(hotItem, index) in hotSearch" :key="'hot-search-' + index" :to="{ name: 'search', query: { val: hotItem.name, searchKeyword: hotItem.name } }" v-slot="{ navigate }">
          <div @click="navigate" role="link">{{ hotItem.name }}</div>
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
        <h2 class="fs-18 mlr-12 fw black pt-20 lh-20 fm-din-alternate" v-if="moduleItem.moduleTitleDisplay">{{ moduleItem.moduleTitle }}</h2>
        <!-- 整屏轮播图 -->
        <template v-if="moduleItem.type === 1">
          <swiper
            ref="swiperFullScreenRef"
            class="mt-12 swiper home-banner-swiper"
            :options="swiperFullScreenOption"
            v-if="moduleItem.componentDetails.length > 0"
          >
            <swiper-slide 
              class="plr-12" 
              v-for="(slideItem, slideIndex) in moduleItem.componentDetails"
              :key="'swiper-slide-image-' + slideIndex"
            >
              <BmImage
                :url="slideItem.imageUrl"
                :loadUrl="require('@/assets/images/product-bgd-375.png')"
                :errorUrl="require('@/assets/images/product-bgd-375.png')"
                :fit="'cover'"
                :height="'3.72rem'"
                class="round-8 hidden"
              />
            </swiper-slide>
            <div class="swiper-pagination swiper-full-pagination" slot="pagination"></div>
          </swiper>
        </template>

        <!-- 热区图片 -->
        <template v-if="moduleItem.type === 2">
          <div class="fs-0 hot-container" :ref="'hotContainer' + moduleIndex">
            <BmImage
              :url="moduleItem.imageUrl"
              :loadUrl="require('@/assets/images/product-bgd-375.png')"
              :errorUrl="require('@/assets/images/product-bgd-375.png')"
            />
            <!-- 图片坐标 -->
            <div v-for="hotItem, hotIndex in moduleItem.componentDetails" :key="'hot-picture-' + hotIndex" class="bg-white hot-container__position" :ref="'hotPosition' + moduleIndex + hotIndex" :style="hotStyle(hotItem, 'hotPosition' + moduleIndex + hotIndex, 'hotContainer' + moduleIndex)" @click="onHotDetail(hotItem)"></div>
          </div>
        </template>
        

        <!-- 一行三列 -->
        <div class="mlr-12 home-page__global" v-if="moduleItem.type === 3">
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
              <nuxt-link :to="{ name: 'cart-product-id', params: { id: productItem.goodsId } }" class="block">
                <ProductTopBtmSingle
                  class="m-auto"
                  :img="{ url: productItem.mainPictureUrl, width: '2.24rem', height: '1.9rem', loadImage: require('@/assets/images/product-bgd-90.png') }" 
                  :detail="{ desc: productItem.goodTitle, price: productItem.price, ellipsis: 2 }"
                />
              </nuxt-link>
            </swiper-slide>
            <div class="swiper-pagination swiper-group-pagination" v-if="moduleItem.effect" slot="pagination"></div>
          </swiper>
        </div>

        <!-- 一行两列 -->
        <template v-if="moduleItem.type === 4">
          <div class="mlr-12 mt-20 flex between">
            <nuxt-link 
              :to="{ name: 'cart-product-id', params: { id: productType4Item.goodsId } }"
              class="iblock" 
              v-for="(productType4Item, productIndex) in moduleItem.componentDetails" 
              :key="productIndex"
            >
              <ProductTopBtmSingle
                :img="{ url: productType4Item.mainPictureUrl, width: '3.4rem', height: '3.4rem', loadImage: require('@/assets/images/product-bgd-170.png') }" 
                :detail="{ desc: productType4Item.goodTitle, price: parseFloat(productType4Item.price), rate: parseFloat(productType4Item.starLevel), volumn: parseFloat(productType4Item.salesVolume), ellipsis: 2 }"
              />
            </nuxt-link>
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
      <van-tabs sticky swipeable animated :offset-top="'0.88rem'" color="#42B7AE" v-model="tabCategoryActive" @change="getSearchList" class="mt-20 mh-83 custom-home-tab" :ellipsis="false">
        <van-tab v-for="(categoryItem, tabIndex) in categoryList" :title="categoryItem.name" :key="'scroll-tab-' + tabIndex" :name="categoryItem.name">
          <empty-status v-if="searchList.length === 0" :image="require('@/assets/images/empty/order.png')" class="mlr-12 mh-83" />
          <van-list
            v-else
            v-model="loading"
            :finished="finished"
            @load="onLoad"
            class="mlr-12"
          >
            <!-- 加载中提示 -->
            <template #loading>
              <div class="hcenter">
                <van-loading color="#42B7AE" />loading...
              </div>
            </template>
            <template #finished>
              <div class="hcenter">没有多余数据了</div>
            </template>
            <template #error>
              <div class="hcenter">加载失败</div>
            </template>

            <!-- 瀑布流 -->
            <div class="flex between flex-wrap">
              <nuxt-link
                v-for="(searchItem, searchIndex) in searchList"
                :key="'search-list-' + searchIndex"
                :to="{ name: 'cart-product-id', params: { id: searchItem.productId } }"
                class="iblock mt-10">
                <ProductTopBtmSingle
                  :img="{ url: searchItem.mainPictureUrl, width: '3.4rem', height: '3.4rem', loadImage: require('@/assets/images/product-bgd-170.png') }" 
                  :detail="{ desc: searchItem.productTitle, price: searchItem.productPrice, rate: searchItem.starLevel, volumn: searchItem.saleCount, ellipsis: 2 }"
                />
              </nuxt-link>
            </div>
          </van-list>
        </van-tab>
      </van-tabs>

    </van-pull-refresh>

    
    <!-- 底部 -->
    <BmTabbar />
  </div>
</template>

<script>
import { Search, CountDown, Sticky, Tab, Tabs, PullRefresh, Loading, List } from 'vant';
import ProductTopBtmSingle from '@/components/ProductTopBtmSingle';
import EmptyStatus from '@/components/EmptyStatus';

export default {
  components: {
    vanSearch: Search,
    vanSticky: Sticky,
    vanTab: Tab,
    vanTabs: Tabs,
    vanCountDown: CountDown,
    vanPullRefresh: PullRefresh,
    vanLoading: Loading,
    vanList: List,
    ProductTopBtmSingle,
    EmptyStatus
  },
  data() {
    return {
      searchVal: '',
      // clearanceTime: 30*60*60*1000,
      swiperComponentOption: { // 一排三列 滚动
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 0,
        // loop: true,
        // loopFillGroupWithBlank: true,
        pagination: {
          el: '.swiper-group-pagination',
          clickable: true,
        },
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
      tabCategoryActive: '全部',
      refreshing: false,
      hotSearch: [],
      moduleData: [],
      categoryList: [],
      searchList: [],
      meta: {},
      loading: false,
      finished: false,
      pageIndex: 1,
      pageSize: 10,
      tabTotal: 0
    }
  },
  async fetch() {
    this.refreshing = false;
    const metaData = await this.$api.getHomeSeo(); // 获取SEO信息
    this.meta = metaData.data;

    const hotData = await this.$api.getHomeRecommendWord(); // 首页推荐词
    this.hotSearch = hotData.data; // 热门搜索

    const homeData = await this.$api.getHomeData(); // 组件数据
    this.moduleData = homeData.data.components; // 需要展示的模块数据

    const categoryList = await this.$api.getCategoryList(); // 分类列表
    this.categoryList = [ // 分类列表
      {
        name: '全部'
      },
      ...categoryList.data
    ];

    const searchList = await this.$api.getProductSearch({ categoryName: '', pageSize: this.pageSize, pageIndex: this.pageIndex }); // 搜索商品列表
    
    this.searchList = searchList.data.items.map(item => { // 搜索商品列表
      return {
        ...item,
        starLevel: parseFloat(item.starLevel),
        saleCount: parseFloat(item.saleCount),
        productPrice: parseFloat(item.productPrice)
      }
    })
    this.tabTotal = searchList.data.total; // 搜索商品列表商品总数目
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
  activated() {
    // 如果上次请求超过一分钟了，就再次发起请求
    if (this.$fetchState.timestamp <= Date.now() - 60000) {
      this.$fetch();
      console.log('+++++++++++++')
    }
  },
  methods: {
    stickyScroll(scrollObj) { // 吸顶滚动事件
      if (scrollObj.isFixed) {
        // 滚动时格式化样式 sticky-scroll
        if (scrollObj.scrollTop > 2) {
          this.$refs.headerStickyContainer.$el.classList.add('sticky-scroll')
        }
        if (scrollObj.scrollTop < 50) {
          this.$refs.headerStickyContainer.$el.classList.remove('sticky-scroll');
        }
      }
    },
    getSearchList(name) { // 获取搜索商品列表
      const categoryName = name === '全部' ? '' : name;
      this.$api.getProductSearch({ categoryName: categoryName, pageIndex: 1, pageSize: this.pageSize }).then(res => {
        this.searchList = res.data.items.map(item => {
          return {
            ...item,
            starLevel: parseFloat(item.starLevel),
            saleCount: parseFloat(item.saleCount),
            productPrice: parseFloat(item.productPrice)
          }
        })
      })
    },
    onHotDetail(hotDetail) { // 点击热区图进行跳转 imageLinkType: 0:商品链接(商品详情页)，跳转到搜索页(1:前端分类id，2:后端分类id，3:品牌，4:FBT，5:FBM，) 6:外部链接(直接打开)
      if (hotDetail.imageLinkType == 6) {
        location.href = hotDetail.outerLink;
        return false;
      }
      
      if (hotDetail.imageLinkType == 0) { // 商品详情页
        this.$router.push({
          name: 'cart-product-id',
          params: {
            id: hotDetail.goodsId
          }
        })
        return false;
      }
      // 下面全是跳转到搜索页面
      let _query = null;
      if (hotDetail.imageLinkType == 3) { // 搜索品牌
        _query = {
          brandId: hotDetail.brandIds,
          val: hotDetail.brandIds
        }
      }
      if (hotDetail.imageLinkType == 4) {
        _query = {
          deliveryType: 2,
          fbtStocks: hotDetail.fbtCountrys,
          val: 2
        }
      }
      if (hotDetail.imageLinkType == 5) {
        _query = {
          deliveryType: 1,
          val: 1,
          fbmStocks: hotDetail.fbmCountrys
        }
      }
      if (hotDetail.imageLinkType == 1 || hotDetail.imageLinkType == 2) { // 不论是前端分类还是后端分类，都传后端分类id进行搜索
        _query = {
          categoryId: hotDetail.imageLinkType == 2 ? hotDetail.serverMenuIds: hotDetail.frontMenuIds
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
          let _w = this.$refs[container][0].clientWidth;
          let _h = this.$refs[container][0].clientHeight;
          
          let timer = setInterval(() => { // 防止元素container的宽高获取不到，添加定时器，获取到定时器取消
            _w = this.$refs[container][0].clientWidth;
            _h = this.$refs[container][0].clientHeight;
            if (_w > 0 && _h > 0) {
              clearInterval(timer);
              this.$refs[ele][0].style.width = (hotItem.areaWidth / 100 * _w / 50) + 'rem';
              this.$refs[ele][0].style.left = (hotItem.positionX / 100 * _w / 50) + 'rem';
              this.$refs[ele][0].style.height =  (hotItem.areaHeight / 100 * _h / 50) + 'rem';
              this.$refs[ele][0].style.top = (hotItem.positionY / 100 * _h / 50) + 'rem';
            }
          }, 300);
        })
      }
    },
    onRefresh() { // 下拉刷新
      this.$fetch();
    },
    onLoad() { // 滚动加载
      if (this.tabTotal == this.searchList.length) { // 没有下一页了
        this.finished = true;
        this.loading = false;
        return false;
      }
      this.pageIndex += 1;
      this.$api.getProductSearch({ categoryName: this.tabCategoryActive === '全部' ? '' : this.tabCategoryActive, pageSize: this.pageSize, pageIndex: this.pageIndex }).then(res => { // 搜索商品列表
        
        this.tabTotal = res.data.total;
        let list = res.data.items.map(item => { // 搜索商品列表
          return {
            ...item,
            starLevel: parseFloat(item.starLevel),
            saleCount: parseFloat(item.saleCount),
            productPrice: parseFloat(item.productPrice)
          }
        })

        this.searchList = this.searchList.concat(list);
        
        // 加载状态结束
        this.loading = false;
      });
    }
  },
  beforeDestroy(){
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
.mh-83{
  min-height: 83vh;
}
</style>

<style lang="less">
@import url('../../assets/css/home.less');
</style>
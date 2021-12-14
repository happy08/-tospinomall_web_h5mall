<template>
  <!-- 店铺-店铺首页 -->
  <div class="vh-100 bg-grey pb-70">
    <div :class="{'store-container-headr': true, 'h-68': scrollTop > 40}" :style="storeBgdUrl != '' ? 'background-image: url(' + storeBgdUrl + ')' : 'background-color: #42b7ae'">
      <div :class="{'bg-black-65': scrollTop < 40 && storeBgdUrl != ''}">
        <div class="flex vcenter pl-20 pr-12 h-46">
          <van-icon name="arrow-left" color="#fff" size="18px" @click="leftBack"></van-icon>
          <van-search
            shape="round"
            class="w-100 ml-20 search-container"
            disabled
            slot="header-title"
            :placeholder="$t('search_our_products')"
            @click="$router.replace({ name: 'search', query: { shopId: $route.params.id, back: 'cart-store-id', backId: $route.params.id, backQuery: $route.query } })"
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
          </van-search>
        </div>
        <van-sticky offset-top="0" @scroll="onScroll" ref="vanSticky">
          <div :class="{'store-container-headr': scrollTop > 40 && storeBgdUrl != '', 'h-68': scrollTop > 40, 'bg-black': scrollTop > 40 && storeBgdUrl == ''}" :style="scrollTop > 40 && storeBgdUrl != '' ? 'background-image: url(' + storeBgdUrl + ')' : ''">
            <div :class="{'w-100 flex between plr-12 ptb-10 vcenter': true, 'bg-black-65': scrollTop > 40 && storeBgdUrl != ''}">
              <div class="flex vcenter mr-12 w-100 hidden-1">
                <!-- 店铺详情 -->
                <nuxt-link replace :to="{ name: 'cart-store-detail-id', params: { id: $route.params.id }, query: $route.query }" v-slot="{ navigate }" class="flex vcenter w-100 hidden-1">
                  <div @click="navigate" role="link">
                    <!-- 店铺logo -->
                    <BmImage
                      :url="detailData.storeLogoUrl"
                      :width="'0.96rem'" 
                      :height="'0.96rem'"
                      :isLazy="false"
                      :isShow="true"
                      class="round-8 hidden flex-shrink"
                      :errorUrl="require('@/assets/images/store-bgd.png')"
                      :loadUrl="require('@/assets/images/store-bgd.png')"
                      :alt="detailData.storeName"
                      :isClip="0"
                    />
                    <!-- 店铺名、关注数 -->
                    <dl class="ml-12 fm-helvetica white hidden-1">
                      <dt class="fs-14 fw hidden-1">{{ detailData.storeName }}</dt>
                      <dd class="fs-12 mt-4">{{ $t('shop_follower', { replace_tip: detailData.collectNum }) }}</dd>
                    </dl>
                  </div>
                </nuxt-link>
              </div>

              <!-- 取消订阅 -->
              <van-button  v-if="detailData && detailData.isAttention == 1" color="#FC2B31" plain class="round-8 h-26 plr-8 ws-nowrap bg-transparent" @click="onSubscribe(false)">{{ $t('followed') }}</van-button>
              <!-- 订阅 -->
              <van-button color="#FC2B31" class="round-8 h-26 plr-8 ws-nowrap" @click="onSubscribe(true)" v-else>{{ $t('add_subscribe') }}</van-button>
              
            </div>
          </div>
          <van-tabs v-if="tabbarActive == 1" sticky swipeable animated color="#42B7AE" class="customs-van-tabs bg-white plr-12" v-model="productTabActive" line-height="0" line-width="0" :before-change="beforeChange">
            <van-tab v-for="tabItem, tabIndex in $t('store_product_tab')" :key="tabIndex">
              <template #title="props" :class="{'flex vcenter': true}">
                <div :class="{'flex vcenter': true}">
                  <span class="ws-nowrap">{{ tabItem }} {{ props }}</span>
                  <BmIcon v-if="tabIndex === 2" :name="priceSortType == 0 ? 'sort-default': priceSortType == 1 ? 'sort-up' : 'sort-down'" :width="'0.4rem'" :height="'0.4rem'" />
                </div>
              </template>
            </van-tab>
          </van-tabs>
        </van-sticky>
      </div>
    </div>
    <!-- 导航栏 -->
    <!-- <div class="plr-12 bg-white flex vcenter">
      <nuxt-link :to="{ name: 'search' }">
        <van-icon name="search" size="0.48rem" color="#383838" />
      </nuxt-link>
      <van-tabs v-model="tabActive" class="customs-van-tabs w-200"  @click="changeTab">
        <van-tab title="Home" name="tab-0"></van-tab>
        <van-tab title="All the goods" name="tab-1"></van-tab>
      </van-tabs>
    </div> -->

    <!-- 轮播图 -->
    <!-- <swiper
      ref="swiperFullScreenRef"
      class="mlr-12 mt-12"
      :options="swiperFullScreenOption"
    >
      <swiper-slide 
        class="round-8 hidden" 
        v-for="(slideItem, slideIndex) in bannerList"
        :key="'swiper-slide-image-' + slideIndex"
      >
        <BmImage
          :url="slideItem.imageUrl"
          :loadUrl="require('@/assets/images/product-bgd-375.png')"
          :errorUrl="require('@/assets/images/product-bgd-375.png')"
          :height="'3.72rem'"
          :fit="'cover'"
        />
      </swiper-slide>
    </swiper> -->

    <!-- 推荐商品 -->
    <!-- <div class="mlr-12 mt-12 bg-white round-8 plr-12 pt-20 pb-16">
      <van-cell title="Recommend" title-class="black fs-14 fw" class="p-0" :border="false" value="More" value-class="light-grey" is-link :to="{}" />
      <div class="flex between mt-16">
        <div class="pic-title-price" v-for="item in 3" :key="item">
          <BmImage
            :url="require('@/assets/images/product-bgd-375.png')"
            :loadUrl="require('@/assets/images/product-bgd-375.png')"
            :errorUrl="require('@/assets/images/product-bgd-375.png')"
            :height="'2.06rem'"
            :width="'2.06rem'"
            :fit="'cover'"
            class="border round-4"
          />
          <h4 class="hidden-1 pic-title-price__title">Apple Iphone Max Pro 12，八核</h4>
          <div class="fw fs-16 pic-title-price__price">{{ $store.state.rate.currency }}49.92</div>
        </div>
      </div>
    </div> -->
    
    <!-- 店铺首页热图 -->
    <PullRefresh :refreshing="refreshing" @refresh="onRefresh" class="pb-30" ref="storeContainer">
      <div v-if="tabbarActive == 1 && scrollTop < 40" class="h-50"></div>
      <template v-if="tabbarActive == 0">
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
                  :alt="slideItem.goodTitle"
                  :isClip="0"
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
                :alt="moduleItem.moduleTitle"
                :isClip="0"
              />
              <!-- 图片坐标 -->
              <div v-for="hotItem, hotIndex in moduleItem.componentDetails" :key="'hot-picture-' + hotIndex" class="hot-container__position" :ref="'hotPosition' + moduleIndex + hotIndex" :style="hotStyle(hotItem, 'hotPosition' + moduleIndex + hotIndex, 'hotContainer' + moduleIndex)" @click="onHotDetail(hotItem)"></div>
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
                <nuxt-link :to="'/product/' + productItem.goodsId + '.html'" class="block">
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
                :to="'/product/' + productType4Item.goodsId + '.html'"
                class="iblock" 
                v-for="(productType4Item, productIndex) in moduleItem.componentDetails" 
                :key="productIndex"
              >
                <ProductTopBtmSingle
                  :img="{ url: productType4Item.mainPictureUrl, width: '3.4rem', height: '3.4rem', loadImage: require('@/assets/images/product-bgd-170.png') }" 
                  :detail="{ desc: productType4Item.goodTitle, price: parseFloat(productType4Item.price), rate: 0, volumn: parseFloat(productType4Item.salesVolume), ellipsis: 2 }"
                />
              </nuxt-link>
            </div>
          </template>
        </div>
      </template>

      <!-- 店铺商品列表 -->
      <template v-else-if="tabbarActive == 1">
        <!-- 空列表 -->
        <empty-status v-if="productList.length === 0" :image="require('@/assets/images/empty/order.png')" class="mlr-12" />
        <!-- 数据列表 -->
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text=""
          @load="onLoad"
          v-else
          class="bg-white"
        >
          <nuxt-link
            class="flex ptb-20 mlr-20 border-b"
            v-for="(productItem, productIndex) in productList"
            :key="'product-item-' + productIndex"
            :to="'/product/' + productItem.productId + '.html'">
            <!-- 商品图片 -->
            <div class="soldout-container">
              <!-- 无货 -->
              <div class="white fs-12 lh-1 flex center soldout-container__tip" v-if="productItem.stock == 0">{{ $t('sold_out') }}</div>
              <BmImage 
                :url="productItem.mainPictureUrl"
                :width="'1.8rem'" 
                :height="'1.8rem'"
                :fit="'cover'"
                class="border round-4 hidden"
                :alt="productItem.productTitle"
              />
            </div>
            <!-- 商品详情 -->
            <div class="ml-14 w-230">
              <h4 class="hidden-2 black fs-14 lh-20 fm-helvetica">{{ productItem.productTitle }}</h4>
              <van-rate disabled class="mt-10" v-model="productItem.starLevel" size="0.24rem" color="#F1520D" void-color="#DDDDDD" void-icon="star" />
              <div class="flex between mt-10">
                <div>
                  <span class="red fs-18 fw"><span class="fm-menlo">{{ $store.state.rate.currency }}</span><span>{{ productItem.minPrice }}</span></span>
                  <!-- <span class="fs-10 line-through bg-grey ml-8">{{ $store.state.rate.currency }}450</span> -->
                </div>
                <!-- 购买 -->
                <nuxt-link :to="'/product/' + productItem.productId + '.html'">
                  <van-button plain class="border round-8 h-25 black">{{ $t('buy') }}</van-button>
                </nuxt-link>
              </div>
              <!-- 商品服务与承诺因后台没有地方设置，暂时不展示 -->
              <!-- <p class="mt-10 fs-12 light-grey">Speed logistics .Speed refund</p> -->
            </div>
          </nuxt-link>
        </van-list>
        
      </template>
    </PullRefresh>

    <!-- 店铺新人券标识 -->
    <div class="store-coupon-logo" v-if="storeCoupons.length > 0">
      <BmImage
        :url="require('@/assets/images/coupon/store-coupon-logo.png')"
        :loadUrl="require('@/assets/images/product-bgd-90.png')"
        :errorUrl="require('@/assets/images/product-bgd-90.png')"
        :fit="'cover'"
        :width="'1.72rem'"
        :height="'1.36rem'"
        class="round-8 hidden"
        :alt="'TospinoMall'"
        :isClip="0"
        @onClick="isNewCoupon = true"
      />
    </div>

    <!-- 店铺新人红包 -->
    <dialog-gift-coupon :lists="storeCoupons" :isGiftShow="isNewCoupon" @onBeforeClose="isNewCoupon = $event" :type="1"></dialog-gift-coupon>

    <!-- 底部标签栏 -->
    <van-tabbar v-model="tabbarActive" active-color="#FA2A32" inactive-color="#DBDBDB" v-if="isTabbarShow">
      <van-tabbar-item>
        <template #icon="props">
          <img :src="props.active ? require('@/assets/images/icon/store-tab-1-active.png') : require('@/assets/images/icon/store-tab-1.png')" alt="store-tab" />
        </template>
        {{ $t('home_page') }}
      </van-tabbar-item>
      <van-tabbar-item>
        <template #icon="props">
          <img :src="props.active ? require('@/assets/images/icon/store-tab-2-active.png') : require('@/assets/images/icon/store-tab-2.png')" alt="store-tab" />
        </template>
        {{ $t('commodity') }}
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { Tab, Tabs, Tabbar, TabbarItem, Cell, Search, Sticky, Rate, List } from 'vant';
import { storeFollow, storeCancelFollow } from '@/api/store';
import ProductTopBtmSingle from '@/components/ProductTopBtmSingle';
import EmptyStatus from '@/components/EmptyStatus';
import 'swiper/css/swiper.css';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import PullRefresh from '@/components/PullRefresh';
import DialogGiftCoupon from '@/components/DialogGiftCoupon';

// let searchClient;
// let client;
// const algoliasearch = require('algoliasearch');

export default {
  components: {
    vanTab: Tab,
    vanTabs: Tabs,
    vanTabbar: Tabbar,
    vanTabbarItem: TabbarItem,
    vanCell: Cell,
    vanSearch: Search,
    vanSticky: Sticky,
    vanRate: Rate,
    vanList: List,
    ProductTopBtmSingle,
    EmptyStatus,
    swiper: Swiper,
    swiperSlide: SwiperSlide,
    PullRefresh,
    DialogGiftCoupon
  },
  data() {
    return {
      tabActive: 0,
      tabbarActive: 0,
      swiperFullScreenOption: {
        pagination: {
          el: '.swiper-full-pagination',
          clickable: true
        },
        loop: true,
        centeredSlides: true,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false,
        }
      },
      // bannerList: [
      //   {
      //     imageUrl: require('@/assets/images/product-bgd-375.png')
      //   }
      // ],
      detailData: { // 店铺详情
        storeLogoUrl: ''
      },
      productTabActive: 0,
      // rate: 2.5,
      moduleData: [],
      swiperComponentOption: { // 一排三列 滚动
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 0,
        pagination: {
          el: '.swiper-group-pagination',
          clickable: true,
        },
      },
      productList: [],
      pageIndex: 0,
      pageSize: 10,
      loading: false,
      finished: false,
      total: 0,
      priceSortType: 0, // 价格筛选类型 0 默认未选中，1选中升序，2选中降序
      sort: {},
      isTabbarShow: false,
      storeBgdUrl: '',
      scrollTop: 0,
      isFlag: false,
      refreshing: {
        isFresh: false
      },
      storeCoupons: [],
      isNewCoupon: false
    }
  },
  async fetch() {
    try {
      // if (this.$store.state.searchType == 2) { // algolia 搜索
      //   client = algoliasearch('62MLEBY33X','7a8da9a5fd3f8137ea8cb70b60806e8d');
      //   searchClient = client.initIndex('tospinoMall');
      // }
      // 获取店铺详情
      let _detailParams = {};
      if (this.$store.state.user.userInfo) {
        _detailParams.userId = this.$store.state.user.userInfo.id
      }
      const detailData = await this.$api.getStoreInfo({ sellerId: this.$route.query.sellerId, storeId: this.$route.params.id, ..._detailParams });
      if (!detailData.data) {
        this.detailData = { // 店铺详情
          storeLogoUrl: ''
        }
      } else { // 初始化
        this.detailData = {
          ...detailData.data,
          collectNum: detailData.data.collectNum == '' ? 0 : detailData.data.collectNum
        };
      }
      
      // 商品列表数据
      // if (this.$store.state.searchType == 0) { // 阿里搜索
        this.pageIndex = 0;
        this.sort = {
          shopId: this.$route.params.id, pageIndex: this.pageIndex, pageSize: this.pageSize
        }
        const listData = await this.$api.getProductSearch(this.sort);
        this.loading = false;
        if (!listData.data) {
          this.productList = [];
          this.total = 0;
        } else {
          this.total = listData.data.total;
          this.productList = listData.data.items.map(item => {
            return {
              ...item,
              starLevel: parseFloat(item.starLevel)
            }
          });
          this.finished = this.total == this.productList.length ? true : false;
        }
      // } else {
        // this.pageIndex = 0;
        // searchClient.search('', {
        //   page: this.pageIndex, // 从0开始算起
        //   hitsPerPage: this.pageSize,
        //   filters: `shopId:${this.$route.params.id}`
        // }).then(({hits, nbHits, facets}) => {
        //   this.total = nbHits;
        //   this.productList = hits;
        //   this.loading = false;
        //   this.finished = this.total == this.productList.length ? true : false;
        // })
      // }
      // 获取店铺新人优惠券
      const storeCoupons = await this.$api.getStoreCouponList(this.$route.params.id);
      this.storeCoupons = storeCoupons.data;
      
      // 店铺组件数据,店铺有装修才可看
      const moduleData = await this.$api.getStoreIndex({shopId: this.$route.params.id});
      if (!moduleData.data) {
        this.tabbarActive = 1;
        this.isTabbarShow = false;
        this.storeBgdUrl = '';
        this.moduleData = [];
        return false;
      };
      this.moduleData = moduleData.data.components;
      // 判断是不是有店铺背景图
      let storeBgdArr = moduleData.data.components.filter(item => {
        return item.type == 7;
      })
      this.storeBgdUrl = storeBgdArr.length > 0 && storeBgdArr[0].imageUrl ? storeBgdArr[0].imageUrl : '';
      // 判断店铺有没有装修
      const store_components = moduleData.data.components.filter(item => {
        return item.type == 2;
      })
      this.isTabbarShow = store_components.length > 1 ? true: false;
      this.tabbarActive = this.$route.query.tabbarActive ? parseFloat(this.$route.query.tabbarActive) : store_components.length > 1 ? 0 : 1;
      this.refreshing.isFresh = false;
    } catch (error) {
      console.log(error);
    }
  },
  activated() {
    this.isTabbarShow = false;
    // if (this.$route.query.tabbarActive) this.tabbarActive = parseFloat(this.$route.query.tabbarActive);
    this.$fetch();
    document.addEventListener('scroll', () => {
      console.log(this.$refs.storeContainer.$el.offsetTop)
    })
  },
  methods: {
    onSubscribe(flag) { // 订阅/取消订阅 flag: true 订阅 false 取消订阅
      if (!this.$store.state.user.authToken) {
        this.$router.push({
          path: '/login.html'
        })
         return false;
      }

      let _detailParams = {};
      if (this.$store.state.user.userInfo) {
        _detailParams.userId = this.$store.state.user.userInfo.id
      }

      if (this.isFlag) {
        return false;
      }
      this.isFlag = true;

      let _axios = flag ? storeFollow({ sellerId: this.$route.query.sellerId, storeId: this.$route.params.id }) : storeCancelFollow([this.$route.params.id]);
      _axios.then(() => {
        this.detailData.isAttention = this.detailData.isAttention == 1 ? 0 : 1;
        this.isFlag = false;
        this.$api.getStoreInfo({ sellerId: this.$route.query.sellerId, storeId: this.$route.params.id, ..._detailParams }).then(res => {
          this.detailData = {
            ...res.data,
            collectNum: res.data.collectNum == '' ? 0 : res.data.collectNum
          };
        }).catch(error => {
          console.log(error);
        })
      }).catch(error => {
        console.log(error);
      })
    },
    leftBack() { // 返回上一页
      if(window.history.length < 2){ //解决部分机型拿不到history
        this.$router.replace('/');
      }else{
        history.back();
      }
    },
    hotStyle(hotItem, ele, container) { // 热区图位置计算 todo
      if (process.client && this.$refs[container] && this.$refs[container].length > 0) {
        this.$nextTick(() => {
          let _w = this.$refs[container][0].clientWidth;
          let _h = this.$refs[container][0].clientHeight;
          
          let timer = setInterval(() => { // 防止元素container的宽高获取不到，添加定时器，获取到定时器取消
            if (this.tabbarActive != 0) {
              clearInterval(timer);
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
    onHotDetail(hotDetail) { // 点击热区图进行跳转 imageLinkType: 0:商品链接(商品详情页)，跳转到搜索页(1:前端分类id，2:后端分类id，3:品牌，4:FBT，5:FBM，) 6:外部链接(直接打开)
      if (hotDetail.imageLinkType == 6) {
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
    onLoad() {
      if (this.total == this.productList.length) { // 没有下一页了
        this.finished = true;
        this.loading = false;
        return false;
      }

      // if (this.$store.state.searchType == 2) {
      //   this.pageIndex += 1;
      //   searchClient.search('', {
      //     page: this.pageIndex, // 从0开始算起
      //     hitsPerPage: this.pageSize,
      //     filters: `shopId:${this.$route.params.id} ${this.productTabActive == 3 ? 'AND stock > 0' : ''}`,
      //   }).then(({hits, nbHits}) => {
      //     this.total = nbHits;
      //     this.productList = this.productList.concat(hits);
      //     this.finished = this.total == this.productList.length ? true : false;
      //     // 加载状态结束
      //     this.loading = false;
      //   })
      // } else {
        this.sort.pageIndex += 1;
        this.$api.getProductSearch(this.sort).then(res => { // 搜索商品列表
          this.total = res.data.total;
          let list = res.data.items.map(item => { // 搜索商品列表
            return {
              ...item,
              starLevel: parseFloat(item.starLevel)
            }
          })

          this.productList = this.productList.concat(list);
          this.finished = this.total == this.productList.length ? true : false;
          
          // 加载状态结束
          this.loading = false;
        }).catch(error => {
          console.log(error);
        })
      // }
    },
    beforeChange(index) { // 根据条件展示排序
      this.productTabActive = index;
      // if (this.$store.state.searchType == 2) { // algolia 搜索
      //   this.pageIndex = 0;
        
      //   if (index == 0) {
      //     searchClient = client.initIndex('tospinoMall');
      //   } else if (index == 1) { // 销量排序列表
      //     searchClient = client.initIndex('tospinoMall_sales_des');
      //   } else if (index == 3) { // 有货
      //     searchClient = client.initIndex('tospinoMall');
      //   }
      //   if (index == 2) { // 价格升序降序
      //     this.priceSortType = this.priceSortType == 0 ? 1 : this.priceSortType == 1 ? 2 : this.priceSortType == 2 ? 1 : 0;
      //     searchClient = this.priceSortType == 1 ? client.initIndex('tospinoMall_price_asc') : client.initIndex('tospinoMall_price_des'); // 价格升序
      //   } else {
      //     this.priceSortType = 0;
      //   }

      //   searchClient.search('', {
      //     page: this.pageIndex, // 从0开始算起
      //     hitsPerPage: this.pageSize,
      //     filters: `shopId:${this.$route.params.id} ${index == 3 ? 'AND stock > 0' : ''}`
      //   }).then(({hits, nbHits}) => {
      //     this.total = nbHits;
      //     this.productList = hits;
      //     this.finished = this.total == this.productList.length ? true : false;
      //   })
      //   return false;
      // }
      // 阿里搜索
      this.pageIndex = 0;
      if (index == 0) { // 推荐列表
        this.sort = {
          shopId: this.$route.params.id, pageIndex: this.pageIndex, pageSize: this.pageSize
        }
      }
      if (index == 1) { // 销量列表
        this.sort = {
          shopId: this.$route.params.id, pageIndex: this.pageIndex, pageSize: this.pageSize,
          sortMap: {
            key: 'sale_count',
            value: 0
          }
        }
      }
      if (index == 3) { // 有货
        this.sort = {
          shopId: this.$route.params.id, pageIndex: this.pageIndex, pageSize: this.pageSize,
          available: 1
        }
      }
      if (index == 2) { // 价格升降序
        this.priceSortType = this.priceSortType == 0 ? 1 : this.priceSortType == 1 ? 2 : this.priceSortType == 2 ? 1 : 0;
        this.sort = {
          shopId: this.$route.params.id, pageIndex: this.pageIndex, pageSize: this.pageSize,
          sortMap: {
            key: 'promotion_price',
            value: this.priceSortType == 1 ? 1 : 0
          }
        }
      } else {
        this.priceSortType = 0;
      }
      // 获取数据
      this.$api.getProductSearch(this.sort).then(res => { // 搜索商品列表
        
        this.total = res.data.total;
        let list = res.data.items.map(item => { // 搜索商品列表
          return {
            ...item,
            starLevel: parseFloat(item.starLevel)
          }
        })

        this.productList = list;
        this.finished = this.total == this.productList.length ? true : false;
      }).catch(error => {
        console.log(error);
      })
    },
    onScroll(scrollTop) {
      this.scrollTop = scrollTop.scrollTop;
    },
    async onRefresh() { // 刷新
      if (this.tabbarActive == 1) {
        this.beforeChange(this.productTabActive);
      } else {
        // 获取店铺详情
        let _detailParams = {};
        if (this.$store.state.user.userInfo) {
          _detailParams.userId = this.$store.state.user.userInfo.id
        }
        const detailData = await this.$api.getStoreInfo({ sellerId: this.$route.query.sellerId, storeId: this.$route.params.id, ..._detailParams });
        if (!detailData.data) {
          this.detailData = { // 店铺详情
            storeLogoUrl: ''
          }
        } else { // 初始化
          this.detailData = {
            ...detailData.data,
            collectNum: detailData.data.collectNum == '' ? 0 : detailData.data.collectNum
          };
        }

        // 店铺组件数据,店铺有装修才可看
        const moduleData = await this.$api.getStoreIndex({shopId: this.$route.params.id});
        if (!moduleData.data) {
          this.tabbarActive = 1;
          this.isTabbarShow = false;
          this.storeBgdUrl = '';
          this.moduleData = [];
          return false;
        };
        this.moduleData = moduleData.data.components;
        // 判断是不是有店铺背景图
        let storeBgdArr = moduleData.data.components.filter(item => {
          return item.type == 7;
        })
        this.storeBgdUrl = storeBgdArr.length > 0 && storeBgdArr[0].imageUrl ? storeBgdArr[0].imageUrl : '';
        // 判断店铺有没有装修
        const store_components = moduleData.data.components.filter(item => {
          return item.type == 2;
        })
        this.isTabbarShow = store_components.length > 1 ? true: false;
        if (!this.$route.query.tabbarActive) {
          this.tabbarActive = store_components.length > 1 ? 0 : 1;
        }
      }
      this.refreshing.isFresh = false;
    }
  },
  deactivated() {
    window.removeEventListener('scroll', this.onScroll); // 离开页面清除滚动事件
  },
}
</script>

<style lang="less" scoped>
.h-26{
  height: 26px;
}
.color-23{
  color: #231F20;
}
.pic-title-price{
  width: 2.06rem;
}
.w-200{
  width: 180px;
}
.pb-16{
  padding-bottom: 16px;
}
.h-46{
  height: 46px;
}
.hot-container{
  position: relative;
  .hot-container__position{
    position: absolute;
  }
}
.w-230{
  width: 230px;
}
.h-25{
  height: 25px!important;
}
.pb-70{
  padding-bottom: 70px;
}
.store-container-headr{
  background-position: center bottom;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  width: 100%;
  height: 114px;
  position: relative;
  z-index: 100;
}
.h-68{
  height: 68px;
}
.mt-48{
  margin-top: 48px;
}
.bg-black-65{
  background-color: rgba(0, 0, 0, .65);
}
.bg-black{
  background-color: #42b7ae;
}
.h-50{
  height: 50px;
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
.store-coupon-logo{
  position: fixed;
  right: 0;
  z-index: 1000;
  bottom: 179px;
}
</style>

<style lang="less">
.store-container-headr{
  .search-container{
    height: 34px!important;
    .van-search__content{
      height: 34px!important;
      padding-left: 10px!important;
    }
    .van-field__left-icon{
      height: 20px!important;
    }
    .van-cell {
      // padding: 0 !important;
      align-items: center;
      height: 100%!important;
    }
  }
}
</style>
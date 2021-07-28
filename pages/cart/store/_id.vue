<template>
  <!-- 店铺-店铺首页 -->
  <div class="vh-100 bg-grey">
    <div class="flex vcenter plr-12 bg-white h-46">
      <van-icon name="arrow-left" color="#383838" size="18px" @click="leftBack"></van-icon>
      <van-search
        shape="round"
        class="w-100 ml-20"
        disabled
        slot="header-title"
        @click="$router.push({ name: 'search' })"
      />
    </div>
    <van-sticky offset-top="0">
      <div class="flex between plr-12 bg-white pt-10">
        <div class="flex vcenter">
          <!-- 店铺详情 -->
          <nuxt-link :to="{ name: 'cart-store-detail-id', params: { id: $route.params.id }, query: { sellerId: this.$route.query.sellerId} }" v-slot="{ navigate }" class="flex vcenter">
            <div @click="navigate" role="link">
              <!-- 店铺logo -->
              <BmImage
                :url="detailData.storeLogoUrl"
                :width="'0.96rem'" 
                :height="'0.96rem'"
                :isLazy="false"
                :isShow="true"
                class="round-8 hidden"
                :errorUrl="require('@/assets/images/product-bgd-90.png')"
              ></BmImage>
              <!-- 店铺名、关注数 -->
              <dl class="ml-12 fm-helvetica">
                <dt class="fs-14 fw color-23">{{ detailData.storeName }}</dt>
                <dd class="fs-12 light-grey mt-4">{{ detailData.collectNum }} followers</dd>
              </dl>
            </div>
          </nuxt-link>
        </div>
        
        
        <!-- 取消订阅 -->
        <van-button  v-if="detailData && detailData.isAttention == 1" color="#FC2B31" class="round-8 h-26 plr-8" @click="onSubscribe(false)">Unsubscribe</van-button>
        <!-- 订阅 -->
        <van-button plain color="#FC2B31" class="round-8 h-26 plr-8" @click="onSubscribe(true)" v-else>
          +
          <span class="ml-4">Subscribe</span>
        </van-button>
        
      </div>
    </van-sticky>
    

    <!-- 导航栏 -->
    <!-- <div class="plr-12 bg-white flex vcenter">
      <nuxt-link :to="{ name: 'cart-store-search' }">
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
        ></BmImage>
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
          ></BmImage>
          <h4 class="hidden-1 pic-title-price__title">Apple Iphone Max Pro 12，八核</h4>
          <div class="fw fs-16 pic-title-price__price">{{ $store.state.rate.currency }}49.92</div>
        </div>
      </div>
    </div> -->
    <!-- 店铺首页热图 -->
    <template v-if="tabbarActive == 0">
      <div class="fs-0 hot-container">
        <!-- <BmImage
          :url="moduleItem.imageUrl"
          :loadUrl="require('@/assets/images/product-bgd-375.png')"
          :errorUrl="require('@/assets/images/product-bgd-375.png')"
        />
        <div v-for="hotItem, hotIndex in moduleItem.componentDetails" :key="'hot-picture-' + hotIndex" class="bg-white hot-container__position" :ref="'hotPosition' + moduleIndex + hotIndex" :style="hotStyle(hotItem, 'hotPosition' + moduleIndex + hotIndex, 'hotContainer' + moduleIndex)" @click="onHotDetail(hotItem)"></div> -->
      </div>
    </template>

    <!-- 店铺商品列表 -->
    <template v-if="tabbarActive == 1">
      <van-tabs sticky swipeable animated color="#42B7AE"  @change="getSearchList" class="customs-van-tabs bg-white plr-20" v-model="productTabActive" line-height="0">
        <van-tab :title="tabItem" v-for="tabItem, tabIndex in tabList" :key="tabIndex">
          
        </van-tab>
      </van-tabs>
      <div class="flex bg-white p-20">
        <!-- 商品图片 -->
        <div>
          <BmImage 
            :url="require('@/assets/images/product-bgd-90.png')"
            :width="'1.8rem'" 
            :height="'1.8rem'"
            :fit="'cover'"
            class="border round-4 hidden"
          ></BmImage>
        </div>
        <!-- 商品详情 -->
        <div class="ml-14 w-230">
          <h4 class="hidden-2 black fs-14 lh-20">Women’s Handbag High Quality Pure PU Leather For Together…</h4>
          <van-rate class="mt-10" v-model="rate" allow-half size="0.24rem" color="#F1520D" void-color="#DDDDDD" void-icon="star" />
          <div class="flex between mt-10">
            <div>
              <span class="red fs-18">{{ $store.state.rate.currency }}1192.00</span>
              <span class="fs-10 line-through bg-grey ml-8">{{ $store.state.rate.currency }}450</span>
            </div>
            <!-- 购买 -->
            <van-button plain class="border round-8 h-25 black">Buy</van-button>
          </div>
          <!-- 提示语 -->
          <p class="mt-10 fs-12 light-grey">Speed logistics .Speed refund</p>
        </div>
      </div>
    </template>

    <!-- 底部标签栏 -->
    <van-tabbar v-model="tabbarActive" active-color="#FA2A32" inactive-color="#DBDBDB">
      <van-tabbar-item>
        <template #icon="props">
          <img :src="props.active ? require('@/assets/images/icon/store-tab-1-active.png') : require('@/assets/images/icon/store-tab-1.png')" alt="store-tab" />
        </template>
        Home
      </van-tabbar-item>
      <van-tabbar-item>
        <template #icon="props">
          <img :src="props.active ? require('@/assets/images/icon/store-tab-2-active.png') : require('@/assets/images/icon/store-tab-2.png')" alt="store-tab" />
        </template>
        Commondity
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { Tab, Tabs, Tabbar, TabbarItem, Cell, Search, Sticky, Rate } from 'vant';
import { storeFollow, storeCancelFollow } from '@/api/store';

export default {
  components: {
    vanTab: Tab,
    vanTabs: Tabs,
    vanTabbar: Tabbar,
    vanTabbarItem: TabbarItem,
    vanCell: Cell,
    vanSearch: Search,
    vanSticky: Sticky,
    vanRate: Rate
  },
  data() {
    return {
      tabActive: 0,
      tabbarActive: 0,
      swiperFullScreenOption: {},
      bannerList: [
        {
          imageUrl: require('@/assets/images/product-bgd-375.png')
        }
      ],
      detailData: { // 店铺详情
        storeLogoUrl: ''
      },
      productTabActive: 0,
      rate: 2.5,
      tabList: ['推荐', '销量', '价格', '有货'],
    }
  },
  async fetch() {
    // 获取店铺详情
    const detailData = await this.$api.getStoreInfo({ sellerId: this.$route.query.sellerId, storeId: this.$route.params.id, userId: this.$store.state.user.userInfo.id });
    if (detailData.code != 0) return false;
    this.detailData = detailData.data;
  },
  activated() {
    // 如果上次请求超过一分钟了，就再次发起请求
    if (this.$fetchState.timestamp <= Date.now() - 60000) {
      this.$fetch();
    }
  },
  methods: {
    onSubscribe(flag) { // 订阅/取消订阅 flag: true 订阅 false 取消订阅
      let _axios = flag ? storeFollow({ sellerId: this.$route.query.sellerId, storeId: this.$route.params.id }) : storeCancelFollow([this.$route.params.id]);
      _axios.then(res => {
        this.$fetch();
      })
    },
    leftBack() { // 返回上一页
      if(window.history.length < 2){ //解决部分机型拿不到history
        this.$router.replace('/');
      }else{
        history.back();
      }
    },
    changeTabbar() { // 切换店铺tab
      // this.$router.replace({
      //   name: 'cart-store-product-id',
      //   params: {
      //     id: this.$route.params.id
      //   }
      // })
    },
    changeTab(name) { // 切换展示项
      if (name === 'tab-1') {
        this.changeTabbar();
      }
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
    getSearchList() { // 获取最新数据

    },
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
</style>
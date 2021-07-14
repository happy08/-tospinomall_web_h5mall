<template>
  <!-- 店铺-店铺首页 -->
  <div class="vh-100 bg-grey">
    <div class="flex between plr-12 bg-white">
      <div class="flex vcenter">
        <van-icon name="arrow-left" color="#383838" size="18px" @click="leftBack"></van-icon>
        <!-- 店铺详情 -->
        <nuxt-link :to="{ name: 'cart-store-detail-id', params: { id: $route.params.id } }" tag="div" class="flex vcenter">
          <!-- 店铺logo -->
          <BmImage
            :url="require('@/assets/images/product-bgd-90.png')"
            :width="'0.96rem'" 
            :height="'0.96rem'"
            :isLazy="false"
            :isShow="false"
            class="round-8 hidden"
          ></BmImage>
          <!-- 店铺名、关注数 -->
          <dl class="ml-12">
            <dt class="fs-14 fw color-23">TOSPINO照明</dt>
            <dd class="fs-12 light-grey mt-4">20141 followers</dd>
          </dl>
        </nuxt-link>
      </div>
      
      <!-- 订阅 -->
      <van-button plain color="#FC2B31" class="round-8 h-26 plr-8" @click="onSubscribe(true)">
        +
        <span class="ml-4">Subscribe</span>
      </van-button>
      <!-- 取消订阅 -->
      <!-- <van-button color="#FC2B31" class="round-8 h-26 plr-8" @click="onSubscribe(false)">Unsubscribe</van-button> -->
    </div>

    <!-- 导航栏 -->
    <div class="plr-12 bg-white flex vcenter">
      <nuxt-link :to="{ name: 'cart-store-search' }">
        <van-icon name="search" size="0.48rem" color="#383838" />
      </nuxt-link>
      <van-tabs v-model="tabActive" class="customs-van-tabs w-200"  @click="changeTab">
        <van-tab title="Home" name="tab-0"></van-tab>
        <van-tab title="All the goods" name="tab-1"></van-tab>
      </van-tabs>
    </div>

    <!-- 轮播图 -->
    <swiper
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
    </swiper>

    <!-- 推荐商品 -->
    <div class="mlr-12 mt-12 bg-white round-8 plr-12 pt-20 pb-16">
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
    </div>


    <!-- 底部标签栏 -->
    <van-tabbar v-model="tabbarActive">
      <van-tabbar-item name="home">
        <span>Home</span>
        <template #icon="props">
          <BmIcon :name="'store-icon1'" :width="'0.48rem'" :height="'0.48rem'" :color="props.active ? '#FF6666': ''"></BmIcon>
        </template>
      </van-tabbar-item>
      <van-tabbar-item icon="search" name="product" @click="changeTabbar">Commondity</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { Tab, Tabs, Tabbar, TabbarItem, Cell } from 'vant';

export default {
  components: {
    vanTab: Tab,
    vanTabs: Tabs,
    vanTabbar: Tabbar,
    vanTabbarItem: TabbarItem,
    vanCell: Cell
  },
  asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    return {
      tabActive: 0,
      tabbarActive: 'home',
      swiperFullScreenOption: {

      },
      bannerList: [
        {
          imageUrl: require('@/assets/images/product-bgd-375.png')
        }
      ]
    }
  },
  methods: {
    onSubscribe(flag) { // 订阅/取消订阅 flag: true 订阅 false 取消订阅
      
    },
    leftBack() { // 返回上一页
      if(window.history.length < 2){ //解决部分机型拿不到history
        this.$router.replace('/');
      }else{
        history.back();
      }
    },
    changeTabbar() { // 切换店铺tab
      this.$router.replace({
        name: 'cart-store-product-id',
        params: {
          id: this.$route.params.id
        }
      })
    },
    changeTab(name) { // 切换展示项
      if (name === 'tab-1') {
        this.changeTabbar();
      }
    }
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
</style>
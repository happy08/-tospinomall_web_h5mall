<template>
  <!-- 店铺-所有商品---该页面暂时无用 -->
  <div class="vh-100 bg-grey">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('cart.storeInformation')" />

    <!-- 标签栏 -->
    <van-tabs sticky swipeable animated :offset-top="44" color="#42B7AE"  @change="getSearchList" class="customs-van-tabs w-317" v-model="tabActive">
      <van-tab :title="tabItem" v-for="tabItem, tabIndex in tabList" :key="tabIndex">
        <div class="flex bg-white p-20">
          <!-- 商品图片 -->
          <div>
            <BmImage 
              :url="require('@/assets/images/product-bgd-90.png')"
              :width="'1.8rem'" 
              :height="'1.8rem'"
              :fit="'cover'"
              class="border round-4 hidden"
            />
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
      </van-tab>
    </van-tabs>

    <!-- 底部标签栏 -->
    <van-tabbar v-model="tabbarActive">
      <van-tabbar-item name="home" @click="changeTabbar">
        <span>Home</span>
        <template #icon="props">
          <BmIcon :name="'store-icon1'" :width="'0.48rem'" :height="'0.48rem'" :color="props.active ? '#FF6666': ''"></BmIcon>
        </template>
      </van-tabbar-item>
      <van-tabbar-item icon="search" name="product">Commondity</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { Rate, Button, Tab, Tabs, Tabbar, TabbarItem } from 'vant';

export default {
  components: {
    vanRate: Rate,
    vanButton: Button,
    vanTab: Tab,
    vanTabs: Tabs,
    vanTabbar: Tabbar,
    vanTabbarItem: TabbarItem
  },
  asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    return {
      rate: 3.5,
      tabActive: 0,
      tabList: ['Nomination', 'Sale', 'Price', 'In stock'],
      tabbarActive: 'product'
    }
  },
  methods: {
    getSearchList() { // 获取最新数据

    },
    changeTabbar() { // 切换店铺tab
      this.$router.replace({
        name: 'cart-store-id',
        params: {
          id: this.$route.params.id
        }
      })
    }
  },
}
</script>

<style lang="less" scoped>
.w-230{
  width: 230px;
}
.h-25{
  height: 25px!important;
}
</style>
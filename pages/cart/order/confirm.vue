<template>
  <!-- 购物车-订单支付-确认订单 -->
  <div class="vh-100 bg-grey">
    <div class="bg-green-linear pay-confirm-container">
      <van-sticky @scroll="stickyScroll" ref="headerStickyContainer">
        <BmHeaderNav :left="{ isShow: true, isEmit: true }" :title="isScrollShow ? '' : $t('you_may_also_like')" :border="false" :color="isScrollShow ? 'white' : 'black'" :bg_color="isScrollShow ? 'bg-green-linear bg-transparent' : 'white'"  @leftClick="leftClick" />
      </van-sticky>
      
      <!-- 结果提示 -->
      <div class="tc flex center">
        <!-- 失败 -->
        <template v-if="$route.query.isSuccess == 2">
          <BmIcon :name="'guanbi2'" :width="'0.4rem'" :height="'0.4rem'" :color="'#fff'" />
          <span class="ml-4 white fs-18">{{ $t('payment_failed') }}</span>
        </template>
        <!-- 货到付款下单成功 -->
        <template v-else-if="$route.query.isSuccess == 3">
          <BmIcon :name="'wancheng1'" :width="'0.4rem'" :height="'0.4rem'" :color="'#fff'" />
          <span class="ml-4 white fs-18">{{ $t('success_order') }}</span>
        </template>
        <!-- 成功 -->
        <template v-else>
          <BmIcon :name="'wancheng1'" :width="'0.4rem'" :height="'0.4rem'" :color="'#fff'" />
          <span class="ml-4 white fs-18">{{ $t('payment_successful') }}</span>
        </template>
        
      </div>

      <!-- 按钮 -->
      <div class="flex center pb-33 pt-35">
        <!-- 返回首页 -->
        <van-button plain class="round-8 h-32 custom-home-btn" @click="goHome">{{ $t('return_to_home_page') }}</van-button>
        <!-- 查看订单 -->
        <van-button plain color="#42B7AE" class="round-8 h-32 ml-18" @click="goViewOrder">{{ $t('view_order') }}</van-button>
      </div>
    </div>
    
    <!-- 可能喜欢的推荐列表展示 -->
    <div v-if="recommendList.length > 0">
      <van-divider class="plr-30 mt-24 fw fs-14 clr-black-85">
        <BmIcon :name="'xinaixin'" :width="'0.26rem'" :height="'0.22rem'" :color="'#FA2022'" class="mr-8" />
        {{ $t('you_may_also_like') }}
      </van-divider>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text=""
        @load="onLoad"
      >
        <div
          class="mx-auto my-2 plr-12"
          v-masonry
          item-selector=".custom-grid-item"
          fit-width="true"
          transition-duration="0s"
          stagger="0.03s"
          gutter="10"
        >
          <nuxt-link :to="'/product/' + searchItem.productId + '.html'" v-for="(searchItem, searchIndex) in recommendList" :key="'search-list-' + searchIndex" class="custom-grid-item" v-masonry-tile>
            <ProductTopBtmSingle
              :img="{ url: searchItem.mainPictureUrl, width: '3.4rem', height: '3.4rem', loadImage: require('@/assets/images/product-bgd-170.png') }" 
              :detail="{ desc: searchItem.productTitle, price: searchItem.productPrice, rate: parseFloat(searchItem.starLevel), volumn: searchItem.saleCount, ellipsis: 2, /*country: searchItem.supplyCountryName, country_url: searchItem.supplyCountryIcon, */stock: searchItem.stock }"
              class="mb-12"
            />
          </nuxt-link>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
import ProductTopBtmSingle from '@/components/ProductTopBtmSingle';
import { Divider, List, Sticky } from 'vant';

export default {
  components: {
    vanDivider: Divider,
    vanList: List,
    vanSticky: Sticky,
    ProductTopBtmSingle
  },
  data() {
    return {
      loading: false,
      finished: false,
      recommendList: [],
      total: 0,
      isScrollShow: true,
      pageNum: 0,
      pageSize: 10
    }
  },
  async fetch() {
    try {
      // if (this.$store.state.searchType == 0) { // 阿里搜索
        const recommendData = await this.$api.getRecommend({ type: 2, pageNum: this.pageNum, pageSize: this.pageSize});
        this.recommendList = this.pageNum == 0 ? recommendData.data.items : this.recommendList.concat(recommendData.data.items);
        this.total = recommendData.data.total;
        if (this.total > this.recommendList.length) {
          this.finished = false;
        }
        setTimeout(() => {
          if (typeof this.$redrawVueMasonry === 'function') {
            this.$redrawVueMasonry();
          }
        }, 50)
        // 加载状态结束
        this.loading = false;
      // }
    } catch (error) {
      console.log(error);
    }
  },
  activated() {
    this.recommendList = [];
    this.pageNum = 0;
    this.$fetch();
  },
  methods: {
    goHome() { // 返回首页
      this.$router.push({
        path: '/home.html'
      })
    },
    goViewOrder() { // 查看订单详情
      let orderId = JSON.parse(this.$route.query.orderId).orderId;
      if (orderId.length == 1) { // 一个订单跳转到订单详情
        this.$router.push({
          name: 'me-order-detail-id',
          params: {
            id: orderId[0]
          },
          query: {
            back: 'me-order'
          }
        })
      } else { // 两个及以上订单跳转到订单列表
        this.$router.push({
          name: 'me-order'
        })
      }
    },
    onLoad() { // 加载更多推荐商品
      if (this.total == this.recommendList.length) { // 没有下一页了
        this.finished = true;
        this.loading = false;
        return false;
      }
      this.pageNum += 1;
      this.$fetch();
    },
    stickyScroll(scrollObj) { // 吸顶滚动事件
      if (scrollObj.isFixed) {
        // 滚动时格式化样式 head-sticky-scroll
        if (scrollObj.scrollTop > 2) {
          this.$refs.headerStickyContainer.$el.classList.add('head-sticky-scroll');
          this.isScrollShow = false;
        }
        if (scrollObj.scrollTop < 60) {
          this.$refs.headerStickyContainer.$el.classList.remove('head-sticky-scroll');
          this.isScrollShow = true;
        }
      }
    },
    leftClick() {
      // if (this.$route.query.isSuccess && this.$route.query.isSuccess == 3) {
      //   this.$router.replace({
      //     name: 'me-order'
      //   });
      // } else if (this.$route.query.isSuccess && this.$route.query.isSuccess == 2) { // 订单余额支付
      //   this.$router.go(-2);
      // } else if (this.$route.query.isSuccess && this.$route.query.isSuccess == 4) { // 订单tingg支付
      //   this.$router.go(-4);
      // } else if (this.$route.query.isSuccess && this.$route.query.isSuccess == 5) { // 订单brij支付
      //   this.$router.go(-4);
      // } else { // 订单其他支付
      //   this.$router.go(-3);
      // }
      this.goViewOrder();
    }
  },
  deactivated(){
    window.removeEventListener('scroll', this.stickyScroll); // 离开页面清除滚动事件
  }
}
</script>

<style lang="less" scoped>
.custom-submit-bar{
  bottom: 50px;
  left: 0;
  right: 0;
  height: 56px;
  position: fixed;
}
.ml-18{
  margin-left: 18px!important;
}
.pb-33{
  padding-bottom: 33px!important;
}
.pt-35{
  padding-top: 35px!important;
}
.custom-home-btn{
  background-color: transparent;
  border-color: #fff;
  color: #fff;
}
</style>
<style lang="less">
.head-sticky-scroll{
  .min-h-95{
    min-height: 0;
    display: none;
    animation: all 1s;
  }
}
.pay-confirm-container{
  .van-hairline--bottom::after{
    display: none;
  }
}
</style>
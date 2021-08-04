<template>
  <!-- 购物车-订单支付-确认订单 -->
  <div class="vh-100 bg-grey">
    <div class="bg-green-linear">
      <BmHeaderNav :left="{ isShow: true }" :border="false" :color="'white'" :bg_color="'bg-green-linear'" />
      
      <!-- 结果提示 -->
      <div class="tc flex center">
        <!-- 成功图标 -->
        <BmIcon :name="'wancheng1'" :width="'0.4rem'" :height="'0.4rem'" :color="'#fff'" />
        <!-- 失败图标 -->
        <!-- <i class="iconfont icon-guanbi2 white fs-24"></i> -->
        <span class="ml-4 white fs-18">Payment successful</span>
      </div>

      <!-- 按钮 -->
      <div class="flex center pb-33 pt-35">
        <!-- 返回首页 -->
        <van-button plain class="round-8 h-32 custom-home-btn" @click="goHome">Return to home page</van-button>
        <!-- 查看订单 -->
        <van-button plain color="#42B7AE" class="round-8 h-32 ml-18" @click="goViewOrder">View Order</van-button>
      </div>
    </div>

    <!-- 可能喜欢的推荐列表展示 -->
    <div>
      <van-divider class="plr-30 mt-24 fw fs-14 clr-black-85">
        <BmIcon :name="'xinaixin'" :width="'0.4rem'" :height="'0.4rem'" :color="'#000'" class="mr-8" />
        {{ $t('common.mayLike') }}
      </van-divider>
      <div class="mlr-12 flex between flex-wrap">
        <ProductTopBtmSingle
          :img="{ url: '', width: '3.4rem', height: '3.4rem', loadImage: require('@/assets/images/product-bgd-170.png') }" 
          :detail="{ desc: 'categoryItem.name', price: 49.92, rate: 2.5, volumn: 50, ellipsis: 2, country: 'Ghana' }"
          v-for="(searchItem, searchIndex) in 6" 
          :key="'search-list-' + searchIndex"
          class="mb-12"
        ></ProductTopBtmSingle>
      </div>
    </div>
  </div>
</template>

<script>
import ProductTopBtmSingle from '@/components/ProductTopBtmSingle';
import { Divider } from 'vant';

export default {
  components: {
    vanDivider: Divider,
    ProductTopBtmSingle
  },
  methods: {
    goHome() { // 返回首页
      this.$router.push({
        name: 'home'
      })
    },
    goViewOrder() { // 查看订单详情
      let orderId = JSON.parse(this.$route.query.orderId).orderId;
      if (orderId.length == 1) { // 一个订单跳转到订单详情
        this.$router.push({
          name: 'me-order-detail-id',
          params: {
            id: this.$route.query.orderId
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
      
    }
  },
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
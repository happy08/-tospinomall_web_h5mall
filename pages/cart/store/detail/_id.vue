<template>
  <!-- 店铺-店铺详情 -->
  <div class="bg-grey vh-100">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('cart.storeInformation')" />

    <!-- 关注店铺 -->
    <div class="bg-white pr-12 pl-20 ptb-14 flex between vcenter">
      <div class="flex vcenter">
        <!-- 店铺logo -->
        <BmImage
          :url="detailData.storeLogoUrl"
          :width="'0.96rem'" 
          :height="'0.96rem'"
          :isLazy="false"
          :isShow="false"
          class="round-8 hidden"
          :errorUrl="require('@/assets/images/product-bgd-90.png')"
        ></BmImage>
        <!-- 店铺名、关注数 -->
        <dl class="ml-12">
          <dt class="fs-14 fw color-23 max-w-160">{{ detailData.storeName }}</dt>
          <dd class="fs-12 light-grey mt-4">{{ detailData.collectNum }} followers</dd>
        </dl>
      </div>
      <!-- 取消订阅 -->
      <van-button  v-if="detailData && detailData.isAttention == 1" color="#FC2B31" class="round-8 h-26 plr-8" @click="onSubscribe(false)">Unsubscribe</van-button>
      <!-- 订阅 -->
      <van-button plain color="#FC2B31" class="round-8 h-26 plr-8" @click="onSubscribe(true)" v-else>
        +
        <span class="ml-4">Subscribe</span>
      </van-button>
    </div>

    <!-- 详情 -->
    <van-cell-group class="mt-20" :border="false">
      <!-- 店铺星级 -->
      <van-cell title="Star Shop" title-class="black fs-14" class="p-20">
        <template #default>
          <van-rate class="mt-10" v-model="rate" allow-half size="0.24rem" color="#F7B500" void-color="#DDDDDD" void-icon="star" />
        </template>
      </van-cell>
      <!-- 用户评价 -->
      <van-cell title="User Evaluation" title-class="black fs-14" class="p-20" value="8.62 low" value-class="light-grey" />
      <!-- 物流绩效 -->
      <van-cell title="Logistics performance" title-class="black fs-14" class="p-20" value="9.04 middle" value-class="light-grey" />
      <!-- 售后服务 -->
      <van-cell title="After-sales service" title-class="black fs-14" class="p-20" value="9.32 high" value-class="light-grey" />
    </van-cell-group>

    <van-cell-group class="mt-20" :border="false">
      <!-- 开店时间 -->
      <van-cell title="Open a shop time" title-class="black fs-14" class="p-20" :value="detailData.createTime" value-class="light-grey" />
      <!-- 品牌销售 -->
      <van-cell title="Sales of the brand" title-class="black fs-14" class="p-20" value-class="light-grey">
        <template #default>
          <span v-for="(item, index) in detailData.brandNameList" :key="index">{{ item }}</span>
        </template>
      </van-cell>
    </van-cell-group>

    <!-- 所有商品 -->
    <nuxt-link class="ptb-20 flex center bg-white mt-20" v-slot="{ navigate }" :to="{ name: 'cart-store-product-id', params: { id: $route.params.id } }">
      <div @click="navigate" role="link">
        <span class="fs-14 black mr-20">All Products</span>
        <van-icon name="arrow" color="rgba(0, 0, 0, 0.45)" />
      </div>
    </nuxt-link>
  </div>
</template>

<script>
import { Cell, CellGroup, Rate } from 'vant';
import { storeFollow, storeCancelFollow } from '@/api/store';

export default {
  components: {
    vanCell: Cell,
    vanCellGroup: CellGroup,
    vanRate: Rate
  },
  data() {
    return {
      rate: 4,
      detailData: {}
    }
  },
  async fetch() {
    const detailData = await this.$api.getStoreInfo({ sellerId: this.$route.query.sellerId, storeId: this.$route.params.id, userId: this.$store.state.user.userInfo.id });
    if (detailData.code != 0) return false;

    this.detailData = detailData.data;
  },
  methods: {
    onSubscribe(flag) { // 订阅/取消订阅 flag: true 订阅 false 取消订阅
      let _axios = flag ? storeFollow({ sellerId: this.$route.query.sellerId, storeId: this.$route.params.id }) : storeCancelFollow([this.$route.params.id]);
      _axios.then(res => {
        this.$fetch();
      })
    },
  },
}
</script>

<style lang="less" scoped>
.h-26{
  height: 26px;
}
.max-w-160{
  max-width: 160px;
}
</style>
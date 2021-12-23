<template>
  <!-- 店铺-店铺详情 -->
  <div class="bg-grey vh-100">
    <BmHeaderNav :left="{ isShow: true, isEmit: true }" :title="$t('store_information')" @leftClick="leftClick" />

    <!-- 关注店铺 -->
    <div class="bg-white pr-12 pl-20 ptb-14 flex between vcenter">
      <div class="flex vcenter hidden-1">
        <!-- 店铺logo -->
        <BmImage
          :url="detailData.storeLogoUrl"
          :width="'0.96rem'" 
          :height="'0.96rem'"
          :isLazy="false"
          :isShow="true"
          class="round-8 hidden"
          :errorUrl="require('@/assets/images/store-bgd.png')"
          :alt="detailData.storeName"
        />
        <!-- 店铺名、关注数 -->
        <dl class="ml-12">
          <dt class="fs-14 fw color-23 max-w-160 hidden-1">{{ detailData.storeName }}</dt>
          <dd class="fs-12 light-grey mt-4">{{ $t('shop_follower', { replace_tip: detailData.collectNum }) }}</dd>
        </dl>
      </div>
      <!-- 取消订阅 -->
      <van-button  v-if="detailData && detailData.isAttention == 1" color="#FC2B31" plain class="round-8 h-26 plr-8" @click="onSubscribe(false)">{{ $t('followed') }}</van-button>
      <!-- 订阅 -->
      <van-button color="#FC2B31" class="round-8 h-26 plr-8" @click="onSubscribe(true)" v-else>{{ $t('add_subscribe') }}</van-button>
    </div>

    <!-- 详情 -->
    <!-- <van-cell-group class="mt-20" :border="false"> -->
      <!-- 店铺星级 -->
      <!-- <van-cell title="Star Shop" title-class="black fs-14" class="p-20">
        <template #default>
          <van-rate class="mt-10" v-model="rate" readonly size="0.24rem" color="#F7B500" void-color="#DDDDDD" void-icon="star" />
        </template>
      </van-cell> -->
      <!-- 用户评价 -->
      <!-- <van-cell title="User Evaluation" title-class="black fs-14" class="p-20" value="8.62 low" value-class="light-grey" /> -->
      <!-- 物流绩效 -->
      <!-- <van-cell title="Logistics performance" title-class="black fs-14" class="p-20" value="9.04 middle" value-class="light-grey" /> -->
      <!-- 售后服务 -->
      <!-- <van-cell title="After-sales service" title-class="black fs-14" class="p-20" value="9.32 high" value-class="light-grey" /> -->
    <!-- </van-cell-group> -->

    <van-cell-group class="mt-20" :border="false">
      <!-- 开店时间 -->
      <van-cell :title="$t('open_a_shop_time')" title-class="black fs-14 f-auto" class="p-20" :value="detailData.createTime" value-class="light-grey f-auto max-w-70" />
      <!-- 品牌销售 -->
      <van-cell :title="$t('sales_of_the_brand')" title-class="black fs-14 f-auto" class="p-20" value-class="light-grey f-auto max-w-70" :value="detailData.brandNameLabelList" />
    </van-cell-group>

    <!-- 所有商品 -->
    <nuxt-link class="ptb-20 flex center bg-white mt-20" replace v-slot="{ navigate }" :to="{ name: 'cart-store-id', params: { id: this.$route.params.id }, query: { ...$route.query, tabbarActive: 1 } }">
      <div @click="navigate" role="link">
        <span class="fs-14 black mr-20">{{ $t('all_products') }}</span>
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
      detailData: {},
      isFlag: false
    }
  },
  async fetch() {
    try {
      let _detailParams = {};
      if (this.$store.state.user.userInfo) {
        _detailParams.userId = this.$store.state.user.userInfo.id;
      }
      const detailData = await this.$api.getStoreInfo({ storeId: this.$route.params.id, ..._detailParams });
      this.isFlag = false;
      if (!detailData.data) return false;

      this.detailData = {
        ...detailData.data,
        collectNum: detailData.data.collectNum,
        brandNameLabelList: detailData.data.brandNameList.join('、')
      };
    } catch (error) {
      console.log(error);
    }
  },
  activated() {
    this.$fetch();
  },
  methods: {
    onSubscribe(flag) { // 订阅/取消订阅 flag: true 订阅 false 取消订阅
      if (!this.$store.state.user.authToken) {
        this.$router.push({
          path: '/login.html'
        })
        return false;
      }
      if (this.isFlag) {
        return false;
      }
      this.isFlag = true;
      let _axios = flag ? storeFollow({ storeId: this.$route.params.id }) : storeCancelFollow([this.$route.params.id]);
      _axios.then(() => {
        this.detailData.isAttention = this.detailData.isAttention == 1 ? 0 : 1;
        this.isFlag = false;
        this.$fetch();
      }).catch(error => {
        console.log(error);
      })
    },
    leftClick() {
      if(window.history.length < 3){ //解决部分机型拿不到history
        console.log('go home');
        this.$router.replace('/');
      }else{
        this.$router.replace({
          name: 'cart-store-id',
          params: {
            id: this.$route.params.id
          },
          query: {
            ...this.$route.query
          }
        })
      }
    }
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
.f-auto{
  flex: auto!important;
  width: fit-content;
}
.max-w-70{
  max-width: 70%!important;
}
</style>
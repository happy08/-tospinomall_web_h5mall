<template>
  <!-- 我的-订单-评价列表 -->
  <div class="vh-100 bg-grey">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.rate.evalutionCenter')">
      <nuxt-link :to="{ name: 'me-order-rate-rule' }" slot="header-right" class="green fs-14">{{ $t('me.rate.rules') }}</nuxt-link>
    </BmHeaderNav>

    <!-- 评价类型tab切换 -->
    <van-tabs sticky swipeable animated :offset-top="44" color="#42B7AE" class="customs-van-tabs" :ellipsis="false" @change="getList" v-model="tabActive">
      <van-tab v-for="(categoryItem, tabIndex) in categoryList" :title="categoryItem" :key="'scroll-tab-' + tabIndex" title-class="border-b pb-0" :name="tabIndex">
        <!-- 空列表 -->
        <empty-status v-if="lists.length === 0" :image="require('@/assets/images/empty/order.png')" />
        <!-- 列表展示 -->
        <div v-else v-for="(orderitem, index) in lists" :key="index" class="mb-12 plr-20 bg-white pt-20 pb-24">
          <OrderStoreSingle :status="tabActive === 2 ? $t('me.afterSale.refund'): ''" />
          <OrderSingle class="mt-20" :product_num="1" :product_desc="'Hassen’s new fall 2019 suede pointe…'" :product_size="'Black / L'" :price="256.23" />
          <!-- 评价操作 -->
          <div class="mt-18 flex hend">
            <!-- 待评价 -->
            <nuxt-link :to="{ name: 'me-order-rate-evalution-id', params: { id: orderitem.id } }">
              <BmButton :type="'info'" class="h-32" v-show="tabActive === 0" >{{ $t('me.rate.evaluation') }}</BmButton>
            </nuxt-link>
            <!-- 已评价/追评 -->
            <BmButton :type="'info'" class="h-32" v-show="tabActive === 1">{{ $t('me.rate.review') }}</BmButton>
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { Tab, Tabs } from 'vant';
import OrderSingle from '@/components/OrderSingle';
import OrderStoreSingle from '@/components/OrderStoreSingle';

export default {
  middleware: 'authenticated',
  components: {
    vanTab: Tab,
    vanTabs: Tabs,
    OrderStoreSingle,
    OrderSingle
  },
  asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    return {
      tabActive: 0,
      lists: [
        {
          id: 1,
          img: '',
          title: 'Microsoft official flagship store',
          followers: '260'
        },
        {
          id: 2,
          img: '',
          title: 'Microsoft official flagship store',
          followers: '260'
        },
        {
          id: 3,
          img: '',
          title: 'Microsoft official flagship store',
          followers: '260'
        }
      ],
      categoryList: ['Comment', 'Evaluated/reviewed']
    }
  },
  methods: {
    getList() {

    }
  },
}
</script>

<style lang="less" scoped>
.mt-18{
  margin-top: 18px;
}
</style>
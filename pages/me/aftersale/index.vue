<template>
  <!-- 我的-售后列表 -->
  <div class="vh-100 bg-grey">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.afterSale.title')" />
    <!-- 售后列表 -->
    <van-tabs sticky swipeable animated :offset-top="44" color="#42B7AE" class="bg-white customs-van-tabs" :ellipsis="false" @change="getSearchList" v-model="tabActive">
      <van-tab v-for="(categoryItem, tabIndex) in categoryList" :title="categoryItem" :key="'scroll-tab-' + tabIndex" title-class="border-b pb-0" :name="tabIndex">
        <div class="mlr-20 pb-20 flex between flex-wrap">
          <!-- 空列表 -->
          <empty-status v-if="lists.length === 0" :image="require('@/assets/images/empty/order.png')" />
          <!-- 列表展示 -->
          <div v-else v-for="(orderitem, index) in lists" :key="index" class="pt-20">
            <OrderStoreSingle :status="tabActive === 2 ? $t('me.afterSale.refund'): ''" />
            <OrderSingle class="mt-20" :product_num="1" :product_desc="'Hassen’s new fall 2019 suede pointe…'" :product_size="'Black / L'" :price="256.23" />
            
            <!-- 售后申请 -->
            <div class="mt-24 flex hend" v-show="tabActive === 0">
              <!-- 未超时 -->
              <BmButton :type="'info'" class="h-32">{{ $t('me.afterSale.applySales') }}</BmButton>
              <!-- 已超时 -->
              <BmButton :type="'info'" class="h-32 time-out">{{ $t('me.afterSale.applySales') }}</BmButton>
            </div>

            <!-- 处理中 -->
            <div class="mt-24 flex hend" v-show="tabActive === 1">
              <!-- 未超时 -->
              <BmButton :type="'info'" class="h-32">{{ $t('me.afterSale.cancelApplication') }}</BmButton>
              <!-- 已超时 -->
              <BmButton :type="'info'" class="h-32 time-out">{{ $t('me.afterSale.details') }}</BmButton>
            </div>

            <!-- 申请记录 -->
            <div class="mt-24 flex hend" v-show="tabActive === 2">
              <!-- 未超时 -->
              <BmButton :type="'info'" class="h-32">{{ $t('me.afterSale.details') }}</BmButton>
              <!-- 已超时 -->
              <BmButton :type="'info'" class="h-32 time-out">{{ $t('common.delete') }}</BmButton>
              <!-- 没有批准 -->
              <BmButton :type="'info'" class="h-32">{{ $t('me.afterSale.customerService') }}</BmButton>
            </div>
            <div class="driver-line fr"></div>
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
      categoryList: ['After-sale application', 'Processing', 'Application record'],
      tabActive: 0
    }
  },
  methods: {
    getSearchList() { // 获取列表数据

    }
  },
}
</script>

<style lang="less" scoped>
.driver-line{
  width: 209px;
  height: 1px;
  background-color: #eee;
  margin-top: 25px;
}
.time-out{
  border-color: #eee!important;
  color: #BFBFBF!important;
  background-color: transparent!important;
}
</style>
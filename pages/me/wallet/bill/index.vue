<template>
  <!-- 账单 -->
  <div class="bg-grey vh-100">
    <BmHeaderNav :left="{ isShow: true }" :border="false" :title="$t('me.wallet.bill')" />

    <!-- 搜索框 -->
    <nuxt-link :to="{ name: 'me-wallet-search' }" class="bg-white plr-12 pb-14 border-b" v-slot="{ navigate }">
      <van-search 
        v-model="searchVal" 
        :placeholder="$t('me.wallet.searchBillPlaceholder')"
        shape="round"
        @click="navigate" role="link"
      />
    </nuxt-link>

    <!-- 账单列表 -->
    <div v-for="item, index in lists" :key="index">
      <p class="fs-14 black fw ptb-10 plr-20">{{ item.date | dateFormat(false) }}</p>
      <p class="bg-white fs-14 light-grey ptb-14 plr-20 border-b">Expenses60.09 Income 1000.09</p>
      <nuxt-link :to="{ name: 'me-wallet-bill-id', params: { id: item.id } }">
        <div class="plr-12 pb-12 pt-20 bg-white flex between vcenter">
          <div class="flex">
            <BmImage 
              :url="require('@/assets/images/logo.png')"
              :width="'0.48rem'" 
              :height="'0.48rem'"
              :isLazy="false"
              :isShow="false"
              :round="true"
            ></BmImage>
            <!-- 名字和时间 -->
            <div class="ml-12">
              <p class="fs-14 black">Recharge your balance</p>
              <p class="mt-4">{{ item.detailDate | dateFormat(true) }}</p>
            </div>
          </div>
          <!-- 成功/失败 金额 -->
          <div class="tr">
            <p class="light-grey fs-14">Success</p>
            <p class="mt-10 amount-color">{{ $store.state.rate.currency }} 150</p>
          </div>
        </div>
      </nuxt-link>
      
    </div>
  </div>
</template>

<script>
import { Search } from 'vant';
import Moment from 'moment';

export default {
  components: {
    vanSearch: Search
  },
  data() {
    return {
      searchVal: '',
      lists: [
        {
          date: new Date(),
          detailDate: new Date(),
          id: 1
        },
        {
          date: new Date(),
          detailDate: new Date(),
          id: 2
        }
      ]
    }
  },
  filters: {
    dateFormat(val, isDay) {
      return isDay ? Moment(val).format('MMM.DD.YYYY') : Moment(val).format('MMM.YYYY');
    }
  }
}
</script>

<style lang="less" scoped>
.pb-14{
  padding-bottom: 14px;
}
.ptb-14{
  padding-top: 14px;
  padding-bottom: 14px;
}
.amount-color{
  color: #EC500D;
}
</style>
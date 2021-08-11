<template>
  <!-- 查看相似商品 -->
  <div class="pt-46 bg-grey">
    <BmHeaderNav :left="{ isShow: true }" :title="'相似商品'" :fixed="true" />

    <PullRefresh :refreshing="refreshing" @refresh="onRefresh">
      <empty-status v-if="lists.length === 0" :image="require('@/assets/images/empty/result.png')" />
      <van-list
        v-else
        v-model="loading"
        :finished="finished"
        finished-text=""
        @load="onLoad"
      >
        <div class="mlr-12 flex between flex-wrap">
          <ProductTopBtmSingle 
            v-for="(item, index) in lists" :key="'similar-' + index" 
            :img="{ url: item.mainPictureUrl, width: '3.4rem', height: '3.4rem', loadImage: require('@/assets/images/product-bgd-170.png') }" 
            :detail="{ desc: item.productTitle, price: parseFloat(item.productPrice), rate: parseFloat(item.starLevel), volumn: parseFloat(item.saleCount), ellipsis: 2, country: item.supplyCountryName, country_url: item.supplyCountryIcon }"
            class="mt-12"
          />
        </div>
        
      </van-list>
    </PullRefresh>
  </div>
</template>

<script>
import PullRefresh from '@/components/PullRefresh';
import EmptyStatus from '@/components/EmptyStatus';
import ProductTopBtmSingle from '@/components/ProductTopBtmSingle';
import { List } from 'vant';

export default {
  components: {
    vanList: List,
    PullRefresh,
    EmptyStatus,
    ProductTopBtmSingle
  },
  data() {
    return {
      lists: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      refreshing: {
        isFresh: false
      },
      loading: false,
      finished: false
    }
  },
  async fetch() {
    const listData = await this.$api.getSimilarGood({ pageNum: this.pageNum, pageSize: this.pageSize, goodId: this.$route.params.id });
    this.lists = this.pageNum == 1 ? listData.data.items : this.lists.concat(listData.data.items);
    this.total = listData.data.total;
    this.refreshing.isFresh = false;
    this.loading = false;
  },
  methods: {
    onRefresh() {
      this.pageNum = 1;
      this.$fetch();
    },
    onLoad() {
      if (this.total == this.lists.length) { // 没有下一页了
        this.finished = true;
        this.loading = false;
        return false;
      }
      this.pageNum += 1;
      this.$fetch();
    }
  },
}
</script>
<template>
  <!-- 查看相似商品 -->
  <div class="pt-46 bg-grey pb-20 v-percent-100">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('similar_goods')" :fixed="true" />

    <PullRefresh :refreshing="refreshing" @refresh="onRefresh" class="custom-min-height-46">
      <empty-status v-if="lists.length === 0" :image="require('@/assets/images/empty/result.png')" />
      <van-list
        v-else
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
          <nuxt-link
            :to="{ name: 'cart-product-id', params: { id: item.productId } }" 
            v-for="(item, index) in lists" :key="'similar-' + index"
            class="custom-grid-item"
            v-masonry-tile
          >
            <ProductTopBtmSingle 
              :img="{ url: item.mainPictureUrl, width: '3.4rem', height: '3.4rem', loadImage: require('@/assets/images/product-bgd-170.png') }" 
              :detail="{ desc: item.productTitle, price: parseFloat(item.minPrice), rate: parseFloat(item.starLevel), volumn: parseFloat(item.saleCount), ellipsis: 2, country: item.supplyCountryName, country_url: item.supplyCountryIcon }"
              class="mt-12"
            />
          </nuxt-link>
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
    try {
      // if (this.$store.state.searchType == 0) {
        const listData = await this.$api.getSimilarGood({ pageNum: this.pageNum, pageSize: this.pageSize, goodId: this.$route.params.id });
        this.lists = this.pageNum == 1 ? listData.data.items : this.lists.concat(listData.data.items);
        setTimeout(() => {
          if (typeof this.$redrawVueMasonry === 'function') {
            this.$redrawVueMasonry();
          }
        }, 50)
        this.total = listData.data.total;
      // }
      
      this.refreshing.isFresh = false;
      this.loading = false;
    } catch (error) {
      console.log(error);
    }
  },
  activated() {
    this.$fetch();
  },
  methods: {
    onRefresh() {
      this.pageNum = 1;
      this.$fetch();
    },
    onLoad() {
      this.finished = false;
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
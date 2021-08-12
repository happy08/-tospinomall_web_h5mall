<template>
  <!-- 我的-订单-评价列表 -->
  <div class="vh-100 bg-grey">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.rate.evalutionCenter')">
      <nuxt-link :to="{ name: 'me-order-rate-rule' }" slot="header-right" class="green fs-14">{{ $t('me.rate.rules') }}</nuxt-link>
    </BmHeaderNav>

    <!-- 评价类型tab切换 -->
    <van-tabs sticky swipeable animated :offset-top="44" color="#42B7AE" class="customs-van-tabs" :ellipsis="false" @change="getList" v-model="tabActive">
      <van-tab v-for="(categoryItem, tabIndex) in categoryList" :title="categoryItem + ' (' + (tabIndex == 1 ? hasCommentOrReview : notComment) + ')'" :key="'scroll-tab-' + tabIndex" title-class="border-b pb-0" :name="tabIndex">
        <PullRefresh :refreshing="refreshing" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            @load="onLoad"
            :finished-text="lists.length == 0 ? '' : ''"
          >
            <template #loading>
              <van-loading color="#42b7ae" />
            </template>
            <!-- 空列表 -->
            <empty-status v-if="lists.length === 0" :image="require('@/assets/images/empty/order.png')" />
            <!-- 列表展示 -->
            <div v-else v-for="(orderitem, index) in lists" :key="index" class="mb-12 plr-20 bg-white pt-20 pb-24">
              <OrderStoreSingle :name="orderitem.storeName" :showArrow="false" />
              <OrderSingle class="mt-20" :product_num="orderitem.goodQuantity" :product_desc="orderitem.goodName" :product_size="orderitem.goodAttr" :price="orderitem.goodPrice" :image="orderitem.goodImg" @onClick="onClick(orderitem.goodId)" />
              <!-- 评价操作 -->
              <div class="mt-18 flex hend">
                <!-- 待评价 -->
                <nuxt-link :to="{ name: 'me-order-rate-evalution-id', params: { id: orderitem.id } }" v-if="orderitem.isComment == 0">
                  <BmButton :type="'info'" class="h-32">{{ $t('me.rate.evaluation') }}</BmButton>
                </nuxt-link>
                <!-- 已评价/追评 -->
                <nuxt-link :to="{ name: 'me-order-rate-evalution-id', params: { id: orderitem.id }, query: { isAddId: orderitem.evaluateId } }" v-if="orderitem.isComment == 1">
                  <BmButton :type="'info'" class="h-32" v-show="tabActive === 1">追评</BmButton>
                </nuxt-link>
              </div>
            </div>
          </van-list>
        </PullRefresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { Tab, Tabs, List } from 'vant';
import OrderSingle from '@/components/OrderSingle';
import OrderStoreSingle from '@/components/OrderStoreSingle';
import PullRefresh from '@/components/PullRefresh';
import { getOrderRateCount } from '@/api/order';

export default {
  middleware: 'authenticated',
  components: {
    vanTab: Tab,
    vanTabs: Tabs,
    vanList: List,
    OrderStoreSingle,
    OrderSingle,
    PullRefresh
  },
  data() {
    return {
      tabActive: 0, // 0->未评价 1->已评价/追评
      lists: [],
      categoryList: ['Comment', 'Evaluated/reviewed'],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      refreshing: {
        isFresh: false
      },
      loading: false,
      finished: false,
      hasCommentOrReview: 0,
      notComment: 0
    }
  },
  async fetch() {
    // 查询评价订单列表
    let listData;
    if (this.$route.query.orderId) { // 查看某一个订单评价
      listData = await this.$api.getRateList({ pageNum: this.pageNum, pageSize: this.pageSize, status: this.tabActive, orderId: this.$route.query.orderId });
    } else {
      listData = await this.$api.getRateList({ pageNum: this.pageNum, pageSize: this.pageSize, status: this.tabActive });
    }

    if (listData.code != 0) return false;

    this.total = listData.data.total; // 列表总条数
    this.lists = this.pageNum == 1 ? listData.data.records : this.lists.concat(listData.data.records); // 列表数据
    this.refreshing.isFresh = false;

    getOrderRateCount().then(res => {
      if (res.code != 0) return false;

      this.hasCommentOrReview = res.data.hasCommentOrReview; // 已评价或追评
      this.notComment = res.data.notComment; // 待评价
      console.log(res)
    })
  },
  activated() {
    this.$fetch();
  },
  methods: {
    getList() {
      this.pageNum = 1;
      this.lists = [];
      this.$fetch();
    },
    onRefresh() { // 下拉刷新
      this.pageNum = 1;
      if (this.$route.query.orderId) { // 从我的订单页面跳转过来查看售后订单，刷新之后展示全部售后订单
        this.$router.replace({
          name: 'me-order-rate'
        })
        setTimeout(() => {
          this.$fetch();
        }, 100);
        return false;
      }
      this.$fetch();
    },
    onLoad() {
      if (this.total == this.lists.length) {
        this.loading = false;
        this.finished = true;
        return false;
      }
      this.pageNum += 1;
      this.$fetch();
    },
    onClick(productId) { // 跳转到商品详情页
      this.$router.push({
        name: 'cart-product-id',
        params: {
          id: productId
        }
      })
    }
  },
}
</script>

<style lang="less" scoped>
.mt-18{
  margin-top: 18px;
}
</style>
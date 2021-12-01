<template>
  <!-- 我的-我的优惠券使用记录 -->
  <div class="bg-grey v-percent-100">
    <van-sticky>
      <BmHeaderNav :left="{ isShow: true }" :title="$t('my_coupon')"></BmHeaderNav>

      <van-tabs v-model="recordTabActive" color="#42B7AE" class="customs-van-tabs" @click="onChangeTab">
        <van-tab title="已使用" name="1"></van-tab>
        <van-tab title="已过期" name="2"></van-tab>
      </van-tabs>
    </van-sticky>

    <PullRefresh :refreshing="refreshing" @refresh="onRefresh" class="custom-min-height-94">
      <div class="pb-20 bg-grey mlr-10">
        <!-- 空列表 -->
        <empty-status v-if="recordLists.length === 0" :image="require('@/assets/images/empty/order.png')" :description="$t('empty')" />
        <van-list
          v-else
          v-model="loading"
          :finished="finished"
          finished-text=""
          @load="onLoad"
          class="bg-grey"
        >
          <coupon-single v-for="item in recordLists" :key="item" class="mt-12"></coupon-single>
        </van-list>
      </div>
    </PullRefresh>
  </div>
</template>

<script>
import CouponSingle from '@/components/CouponSingle';
import { Tab, Tabs, Sticky, List } from 'vant';
import PullRefresh from '@/components/PullRefresh';
import { getRecordList } from '@/api/coupon';

export default {
  middleware: 'authenticated',
  components: {
    vanTab: Tab,
    vanTabs: Tabs,
    vanSticky: Sticky,
    vanList: List,
    CouponSingle,
    PullRefresh
  },
  data() {
    return {
      recordTabActive: '1',
      recordLists: [],
      recordTotal: 0,
      loading: false,
      finished: false,
      refreshing: {
        isFresh: false
      },
      recordPageNum: 0,
      recordPageSize: 20
    }
  },
  activated() {
    this.getRecordList();
  },
  methods: {
    getRecordList() { // 获取使用记录列表
      this.$toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      });
      let params = {
        pageNum: this.recordPageNum,
        pageSize: this.recordPageSize,
        couponStatus: this.recordTabActive
      }
      getRecordList(params).then(res => {
        this.recordLists = this.recordPageNum == 0 ? res.data.records : this.recordLists.concat(res.data.records);
        this.recordTotal = res.data.recordTotal;
        this.finished = this.recordTotal == this.recordLists.length ? true : false;
        this.$toast.clear();
      }).catch(error => {
        console.log(error);
        this.$toast.clear();
      })
    },
    onLoad() { // 加载更多
      if (this.recordTotal == this.recordLists.length) {
        this.loading = false;
        this.finished = true;
        return false;
      }
      this.recordPageNum += 1;
      this.getRecordList();
    },
    onChangeTab(name, title) { // tab切换 null->全部 0->未使用 1->已使用 2->已过期 3->已退还
      console.log(name, title)
      this.recordPageNum = 0;
      this.getRecordList();
    },
    onRefresh() { // 刷新
      this.recordPageNum = 0;
      this.finished = false;
      this.getRecordList();
    },
  }
}
</script>
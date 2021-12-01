<template>
  <!-- 我的-优惠券领券中心 -->
  <div class="bg-grey v-percent-100 pb-64">
    <van-sticky>
      <BmHeaderNav :left="{ isShow: true }" :title="$t('my_coupon')">
        <!-- 使用说明 -->
        <nuxt-link slot="header-right" class="fs-16 green" :to="{ name: 'service-type', params: { type: 'coupon' }, query: { isH5: 1 } }">{{ $t('coupon_use_instruction') }}</nuxt-link>
      </BmHeaderNav>

      <van-tabs v-model="centerTabActive" color="#42B7AE" class="customs-van-tabs"  @click="onChangeTab">
        <van-tab :title="'全部(' + allCount + ')'" name="100"></van-tab>
        <van-tab :title="'平台券(' + platformCount + ')'" name="1"></van-tab>
        <van-tab :title="'店铺券(' + shopCount + ')'" name="2"></van-tab>
      </van-tabs>
    </van-sticky>

    <PullRefresh :refreshing="refreshing" @refresh="onRefresh" class="custom-min-height-94">
      <div class="pb-20 bg-grey mlr-10">
        <!-- 空列表 -->
        <empty-status v-if="centerLists.length === 0" :image="require('@/assets/images/empty/order.png')" :description="$t('empty')" />
        <van-list
          v-else
          v-model="loading"
          :finished="finished"
          finished-text=""
          @load="onLoad"
          class="bg-grey"
        >
          <coupon-single v-for="item in centerLists" :key="item" class="mt-12"></coupon-single>
        </van-list>
      </div>
    </PullRefresh>

    <!-- <div class="mlr-10">
      <coupon-single v-for="item in 10" :key="item" class="mt-12"></coupon-single>
    </div> -->
  </div>
</template>

<script>
import CouponSingle from '@/components/CouponSingle';
import { Tab, Tabs, Sticky, List } from 'vant';
import { getCouponCenterList, getCouponCenterCount } from '@/api/coupon';
import PullRefresh from '@/components/PullRefresh';

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
      centerTabActive: 0,
      centerLists: [],
      centerTotal: 0,
      loading: false,
      finished: false,
      refreshing: {
        isFresh: false
      },
      centerPageNum: 0,
      centerPageSize: 20,
      allCount: 0, // 所有券
      platformCount: 0, // 平台券
      shopCount: 0, // 店铺券
    }
  },
  activated() {
    this.getCouponCenterCount();
    this.getCouponCenterList();
  },
  methods: {
    getCouponCenterList() { // 领券中心列表
      let params = {
        pageNum: this.centerPageNum,
        pageSize: this.centerPageSize
      }
      if (this.centerTabActive != 100) {
        params.couponActivityType = this.centerTabActive;
      }
      getCouponCenterList(params).then(res => {
        this.centerLists = res.data.records;
        this.centerTotal = parseFloat(res.data.total);
      }).catch(error => {
        console.log(error);
      })
    },
    onChangeTab(name, title) { // tab切换 name 100全部 1平台券 0店铺券
      console.log(name, title)
      this.pageNum = 0;
      this.getCouponCenterList();
    },
    onLoad() { // 滚动加载
      if (this.total == this.lists.length) {
        this.loading = false;
        this.finished = true;
        return false;
      }
      this.pageNum += 1;
      this.getCouponCenterList();
    },
    onRefresh() { // 刷新
      this.pageNum = 0;
      this.finished = false;
      this.getCouponCenterList();
    },
    getCouponCenterCount() { // 优惠券数量统计
      getCouponCenterCount().then(res => {
        this.allCount = res.data.allCount;
        this.platformCount = res.data.platformCount;
        this.shopCount = res.data.shopCount;
      })
    }
  }
}
</script>
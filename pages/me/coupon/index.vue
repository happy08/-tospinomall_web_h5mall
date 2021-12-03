<template>
  <!-- 我的-我的优惠券 -->
  <div class="bg-grey v-percent-100 pb-64">
    <van-sticky>
      <BmHeaderNav :left="{ isShow: true }" :title="$t('my_coupon')">
        <!-- 使用说明 -->
        <nuxt-link slot="header-right" class="fs-16 green" :to="{ name: 'service-type', params: { type: 'coupon' }, query: { isH5: 1 } }">{{ $t('coupon_use_instruction') }}</nuxt-link>
      </BmHeaderNav>

      <van-tabs v-model="tabActive" color="#42B7AE" class="customs-van-tabs" @click="onChangeTab" :ellipsis="false">
        <van-tab :title="item.tab + '(' + item.count + ')'" :name="item.tabName" v-for="(item, index) in lists" :key="index">
          <PullRefresh :refreshing="refreshing" @refresh="onRefresh" class="custom-min-height-158">
            <div class="bg-grey mlr-10">
              <!-- 空列表 -->
              <empty-status v-if="item.records.length === 0" :image="require('@/assets/images/empty/order.png')" :description="$t('empty')" />
              <van-list
                v-else
                v-model="loading"
                :finished="finished"
                finished-text=""
                @load="onLoad"
                class="bg-grey"
                :immediate-check="false"
              >
                <van-swipe-cell  v-for="(item, itemIndex) in item.records" :key="itemIndex">
                  <coupon-single :item="item" class="mt-12"></coupon-single>
                  <template #right>
                    <div class="flex hend h-100">
                      <BmButton class="round-0 bg-yellow h-100 w-70" @click="onDelete(item)">{{ $t('goods_remove_follow') }}</BmButton>
                    </div>
                  </template>
                </van-swipe-cell>
              </van-list>
            </div>
          </PullRefresh>
        </van-tab>
      </van-tabs>
    </van-sticky>

    <!-- <button @click="isCouponShow = !isCouponShow">isCouponShow</button> -->

    <div class="flex tc coupon-tabbar">
      <nuxt-link :to="{ name: 'me-coupon-record' }" class="fw black fs-14 flex-1 pb-14 pt-20 border-r">{{ $t('coupon_usage_history') }}</nuxt-link>
      <nuxt-link :to="{ name: 'me-coupon-center' }" class="fw black fs-14 flex-1 pb-14 pt-20">{{ $t('go_to_coupon_center') }}</nuxt-link>
    </div>

    <!-- 确认订单弹窗 -->
    <!-- <van-popup v-model="isCouponShow" style="height: 80%" position="bottom" class="border-tlr-radius-12 coupon-popup">
      <div class="coupon-popup__top">
        <h1 class="fs-16 tc pt-12">优惠</h1>
        <van-tabs v-model="couponActive" class="customs-van-tabs border-b">
          <van-tab title="可用优惠券"></van-tab>
          <van-tab title="不可用优惠券"></van-tab>
        </van-tabs>
        <p class="fs-12 p-10">您已选中优惠券1张，共抵用<span>¥120.0</span></p>
      </div>
      <div class="coupon-popup__bottom">
        <coupon-order-single class="mt-10 mlr-10" v-for="item in 10" :key="item"></coupon-order-single>
      </div>
    </van-popup> -->

    
  </div>
</template>

<script>
import CouponSingle from '@/components/CouponSingle';
import PullRefresh from '@/components/PullRefresh';
import { Tab, Tabs, Sticky, Popup, List, SwipeCell } from 'vant';
import { getCouponList, getCouponCount } from '@/api/coupon';

export default {
  middleware: 'authenticated',
  components: {
    vanTab: Tab,
    vanTabs: Tabs,
    vanSticky: Sticky,
    vanPopup: Popup,
    vanList: List,
    vanSwipeCell: SwipeCell,
    CouponSingle,
    PullRefresh
  },
  data() {
    return {
      tabActive: '100',
      isCouponShow: true,
      couponActive: 0,
      pageSize: 20,
      lists: [
        {
          tab: this.$t('all'),
          count: 0,
          tabName: '100',
          records: [],
          total: 0,
          pageNum: 1
        },
        {
          tab: this.$t('store_coupons'),
          count: 0,
          tabName: '1',
          records: [],
          total: 0,
          pageNum: 1
        },
        {
          tab: this.$t('platform_coupons'),
          count: 0,
          tabName: '0',
          records: [],
          total: 0,
          pageNum: 1
        }
      ],
      loading: false,
      finished: false,
      refreshing: {
        isFresh: false
      }
    }
  },
  activated() {
    this.$toast.loading({
      forbidClick: true,
      loadingType: 'spinner',
      duration: 0
    });
    // 数据初始化
    this.tabActive = '100';
    this.lists = [
      {
        tab: this.$t('all'),
        count: 0,
        tabName: '100',
        records: [],
        total: 0,
        pageNum: 1
      },
      {
        tab: this.$t('store_coupons'),
        count: 0,
        tabName: '2',
        records: [],
        total: 0,
        pageNum: 1
      },
      {
        tab: this.$t('platform_coupons'),
        count: 0,
        tabName: '1',
        records: [],
        total: 0,
        pageNum: 1
      }
    ];
    this.getCouponCount();
    this.getCouponList([this.lists[0]]);
  },
  methods: {
    getCouponList(couponList) { // 获取我的优惠券列表
      // couponType 优惠券类型:(0:店铺券 1:平台券),不传默认全部
      // pageNum: 0 , pageSize: 10
      let params = {
        pageNum: couponList[0].pageNum,
        pageSize: this.pageSize
      }
      if (this.tabActive != '100') {
        params.couponType = this.tabActive;
      }

      if (this.loading) {
        return false;
      }
      this.loading = true;

      getCouponList(params).then(res => {
        couponList[0].records = couponList[0].pageNum == 1 ? res.data.records : couponList[0].records.concat(res.data.records);;
        couponList[0].total = parseFloat(res.data.total);
        this.finished = couponList[0].total == couponList[0].records.length ? true : false;
        this.refreshing.isFresh = false;
        this.loading = false;
        this.$toast.clear();
      }).catch(error => {
        console.log(error);
        this.loading = false;
        this.refreshing.isFresh = false;
        this.$toast.clear();
      })
    },
    onChangeTab(name, title) { // tab切换 name 100全部 1平台券 0店铺券
      console.log(name, title)
      let currentList = this.lists.filter(item => {
        return item.tabName == this.tabActive;
      })
      if (currentList[0].records.length == 0) {
        this.$toast.loading({
          forbidClick: true,
          loadingType: 'spinner',
          duration: 0
        });
        this.getCouponList(currentList);
      } else {
        this.finished = currentList[0].total == currentList[0].records.length ? true : false;
      }
    },
    onLoad() { // 滚动加载
      let currentList = this.centerLists.filter(item => {
        return item.tabName == this.tabActive;
      })

      if (currentList.length == 0) {
        return false;
      }

      if (currentList[0].total == currentList.length) {
        this.loading = false;
        this.finished = true;
        return false;
      }
      currentList[0].pageNum += 1;
      this.getCouponList(currentList);
    },
    onRefresh() { // 刷新
      this.finished = false;
      let currentList = this.centerLists.filter(item => {
        return item.tabName == this.centerTabActive;
      })

      if (currentList.length == 0) {
        return false;
      }
      currentList[0].pageNum = 1;
      this.getCouponList(currentList);
    },
    getCouponCount() { // 获取优惠券数量
      getCouponCount().then(res => {
        this.lists[0].count = res.data.allCount;
        this.lists[2].count = res.data.platformCount;
        this.lists[1].count = res.data.shopCount;
      })
    }
  }
}
</script>

<style lang="less" scoped>
.coupon-tabbar{
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  z-index: 1000;
  min-height: 54px;
}
.flex-1{
  flex: 1;
}
.border-r{
  position: relative;
  &::after{
    content: '';
    display: block;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 20px;
    background-color: #F4F4F4;
  }
}
.pb-64{
  padding-bottom: 64px;
}
.custom-min-height-158{
  min-height: calc(100vh - 158px);
}
</style>
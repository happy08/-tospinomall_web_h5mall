<template>
  <!-- 我的-优惠券领券中心 -->
  <div class="bg-grey v-percent-100 pb-64 pt-46">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('coupon_center')" fixed></BmHeaderNav>

    <van-tabs sticky :offset-top="'0.92rem'" v-model="centerTabActive" color="#42B7AE" class="customs-van-tabs"  @click="onChangeTab" :ellipsis="false">
      <van-tab :title="item.tab + '(' + item.count + ')'" :name="item.tabName" v-for="(item, index) in centerLists" :key="index">
        <PullRefresh :refreshing="refreshing" @refresh="onRefresh" class="custom-min-height-94">
          <div class="pb-20 bg-grey mlr-10">
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
              <coupon-order-single class="mt-12" v-for="(item, itemIndex) in item.records" :key="'coupon-center' + itemIndex" :item="item" @onReceive="item.isReceive = $event"></coupon-order-single>
            </van-list>
          </div>
        </PullRefresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { Tab, Tabs, Sticky, List } from 'vant';
import { getCouponCenterList, getCouponCenterCount } from '@/api/coupon';
import PullRefresh from '@/components/PullRefresh';
import CouponOrderSingle from '@/components/CouponOrderSingle';

export default {
  // middleware: 'authenticated',
  components: {
    vanTab: Tab,
    vanTabs: Tabs,
    vanSticky: Sticky,
    vanList: List,
    PullRefresh,
    CouponOrderSingle
  },
  data() {
    return {
      centerTabActive: '100',
      centerLists: [
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
      ],
      loading: false,
      finished: false,
      refreshing: {
        isFresh: false
      },
      centerPageSize: 20,
      fromPageName: ''
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.name == 'me-coupon') {
        vm.fromPageName = 'myCoupon';
      }
    })
  },
  activated() {
    this.$toast.loading({
      forbidClick: true,
      loadingType: 'spinner',
      duration: 0
    });
    // 数据初始化
    this.centerTabActive = '100';
    this.centerLists = [
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
    this.getCouponCenterCount();
    this.getCouponCenterList([ this.centerLists[0] ]);
  },
  methods: {
    getCouponCenterList(couponList) { // 领券中心列表
      let params = {
        pageNum: couponList[0].pageNum,
        pageSize: this.centerPageSize
      }
      if (this.centerTabActive != '100') {
        params.couponActivityType = this.centerTabActive; // 券类型
      }
      if (this.$store.state.user.authToken) {
        params.buyerId = this.$store.state.user.userInfo.id; // 买家id
      }
      // if (this.fromPageName) {
      //   params.listType = this.fromPageName; // 列表类型
      // }
      // if (this.loading) {
      //   return false;
      // }
      // this.loading = true;
      getCouponCenterList(params).then(res => {
        if (!res.data) return false;
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
      let currentList = this.centerLists.filter(item => {
        return item.tabName == this.centerTabActive;
      })
      if (currentList[0].records.length == 0) {
        this.$toast.loading({
          forbidClick: true,
          loadingType: 'spinner',
          duration: 0
        });
        this.getCouponCenterList(currentList);
      } else {
        this.finished = currentList[0].total == currentList[0].records.length ? true : false;
      }
    },
    onLoad() { // 滚动加载
      let currentList = this.centerLists.filter(item => {
        return item.tabName == this.centerTabActive;
      })
      
      if (currentList[0].records.length == 0) {
        return false;
      }

      if (currentList[0].total == currentList[0].records.length) {
        this.loading = false;
        this.finished = true;
        return false;
      }
      currentList[0].pageNum += 1;
      this.getCouponCenterList(currentList);
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
      this.getCouponCenterList(currentList);
    },
    getCouponCenterCount() { // 优惠券数量统计
      let buyerId = '';
      if (this.$store.state.user.authToken) {
        buyerId = this.$store.state.user.userInfo.id;
      }
      getCouponCenterCount(buyerId).then(res => {
        if (res.code != 0 || !res.data) return false;
        this.centerLists[0].count = res.data.allCount;
        this.centerLists[2].count = res.data.platformCount;
        this.centerLists[1].count = res.data.shopCount;
        this.$toast.clear();
      }).catch(error => {
        console.log(error);
        this.$toast.clear();
      })
    }
  }
}
</script>
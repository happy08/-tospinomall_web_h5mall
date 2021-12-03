<template>
  <!-- 我的-优惠券领券中心 -->
  <div class="bg-grey v-percent-100 pb-64">
    <van-sticky>
      <BmHeaderNav :left="{ isShow: true }" :title="$t('coupon_center')">
        <!-- 使用说明 -->
        <nuxt-link slot="header-right" class="fs-16 green" :to="{ name: 'service-type', params: { type: 'coupon' }, query: { isH5: 1 } }">{{ $t('coupon_use_instruction') }}</nuxt-link>
      </BmHeaderNav>

      <van-tabs v-model="recordTabActive" color="#42B7AE" class="customs-van-tabs"  @click="onChangeTab" :ellipsis="false">
        <van-tab :title="item.tab + '(' + item.count + ')'" :name="item.tabName" v-for="(item, index) in recordLists" :key="index">
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
                <coupon-single v-for="(item, itemIndex) in item.records" :key="itemIndex" :item="item" :type="recordTabActive" class="mt-12" @onReceive="item.isReceive = $event"></coupon-single>
              </van-list>
            </div>
          </PullRefresh>
        </van-tab>
      </van-tabs>
    </van-sticky>
  </div>
</template>

<script>
import CouponSingle from '@/components/CouponSingle';
import { Tab, Tabs, Sticky, List } from 'vant';
import { getCouponCenterList, getCouponCenterCount } from '@/api/coupon';
import PullRefresh from '@/components/PullRefresh';

export default {
  // middleware: 'authenticated',
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
      recordLists: [
        {
          tab: this.$t('used'),
          count: 0,
          tabName: '1',
          records: [],
          total: 0,
          pageNum: 1
        },
        {
          tab: this.$t('expired'),
          count: 0,
          tabName: '2',
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
      recordPageSize: 20
    }
  },
  activated() {
    this.$toast.loading({
      forbidClick: true,
      loadingType: 'spinner',
      duration: 0
    });
    // 数据初始化
    this.recordTabActive = '1';
    this.recordLists = [
      {
        tab: this.$t('used'),
        count: 0,
        tabName: '1',
        records: [],
        total: 0,
        pageNum: 1
      },
      {
        tab: this.$t('expired'),
        count: 0,
        tabName: '2',
        records: [],
        total: 0,
        pageNum: 1
      }
    ];
    this.getCouponCenterCount();
    this.getCouponCenterList([ this.recordLists[0] ]);
  },
  methods: {
    getCouponCenterList(couponList) { // 领券中心列表
      let params = {
        pageNum: couponList[0].pageNum,
        pageSize: this.recordPageSize
      }
      if (this.recordTabActive != '100') {
        params.couponActivityType = this.recordTabActive;
      }
      if (this.loading) {
        return false;
      }
      this.loading = true;
      getCouponCenterList(params).then(res => {
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
      let currentList = this.recordLists.filter(item => {
        return item.tabName == this.recordTabActive;
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
      let currentList = this.recordLists.filter(item => {
        return item.tabName == this.recordTabActive;
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
      this.getCouponCenterList(currentList);
    },
    onRefresh() { // 刷新
      this.finished = false;
      let currentList = this.recordLists.filter(item => {
        return item.tabName == this.recordTabActive;
      })

      if (currentList.length == 0) {
        return false;
      }
      currentList[0].pageNum = 1;
      this.getCouponCenterList(currentList);
    },
    getCouponCenterCount() { // 优惠券数量统计
      getCouponCenterCount().then(res => {
        this.recordLists[0].count = res.data.allCount;
        this.recordLists[2].count = res.data.platformCount;
        this.recordLists[1].count = res.data.shopCount;
        this.$toast.clear();
      }).catch(error => {
        this.$toast.clear();
        console.log(error);
      })
    }
  }
}
</script>
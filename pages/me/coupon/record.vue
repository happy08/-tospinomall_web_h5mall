<template>
  <!-- 我的-优惠券领券中心 -->
  <div class="bg-grey v-percent-100 pb-64">
    <van-sticky>
      <BmHeaderNav :left="{ isShow: true }" :title="$t('my_coupon')"></BmHeaderNav>

      <van-tabs v-model="recordTabActive" color="#42B7AE" class="customs-van-tabs"  @click="onChangeTab" :ellipsis="false">
        <van-tab :title="item.tab" :name="item.tabName" v-for="(item, index) in recordLists" :key="index">
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
                <coupon-order-single class="mt-12"  v-for="(item, itemIndex) in item.records" :key="'coupon-center' + itemIndex" :item="item" :pageType="1" :type="1"></coupon-order-single>
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
import { getRecordList } from '@/api/coupon';
import PullRefresh from '@/components/PullRefresh';
import CouponOrderSingle from '@/components/CouponOrderSingle';

export default {
  // middleware: 'authenticated',
  components: {
    vanTab: Tab,
    vanTabs: Tabs,
    vanSticky: Sticky,
    vanList: List,
    CouponSingle,
    PullRefresh,
    CouponOrderSingle
  },
  data() {
    return {
      recordTabActive: '1',
      recordLists: [
        {
          tab: this.$t('used'),
          tabName: '1',
          records: [],
          total: 0,
          pageNum: 1
        },
        {
          tab: this.$t('expired'),
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
    this.getRecordList([ this.recordLists[0] ]);
  },
  methods: {
    getRecordList(couponList) { // 领券中心列表
      let params = {
        pageNum: couponList[0].pageNum,
        pageSize: this.recordPageSize
      }
      if (this.recordTabActive != '100') {
        params.couponActivityType = this.recordTabActive;
      }
      // if (this.loading) {
      //   return false;
      // }
      // this.loading = true;
      getRecordList(params).then(res => {
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
        this.getRecordList(currentList);
      } else {
        this.finished = currentList[0].total == currentList[0].records.length ? true : false;
      }
    },
    onLoad() { // 滚动加载
      let currentList = this.recordLists.filter(item => {
        return item.tabName == this.recordTabActive;
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
      this.getRecordList(currentList);
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
      this.getRecordList(currentList);
    }
  }
}
</script>
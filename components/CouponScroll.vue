<template>
  <!-- 商品优惠券弹窗 -->
  <van-popup v-model="isCouponShow" style="height: 80%" position="bottom" class="round-tlr-12 bg-white coupon-popup pt-20" @click-overlay="$emit('onBeforeClose', false)">
    <h3 class="black fs-18 pb-10 tc lh-20">{{ $t('coupon') }}</h3>
    <div class="container-absolute-height">
      <empty-status v-if="couponList.length === 0" :image="require('@/assets/images/empty/order.png')" :description="$t('empty')" />
      <van-list
        v-else
        v-model="loading"
        :finished="finished"
        finished-text=""
        @load="onLoad"
        class="bg-grey"
        :immediate-check="false"
      >
        <coupon-order-single class="mb-10 mlr-10" v-for="(item, index) in couponList" :key="'good-coupon-' + index" :item="item" @onReceive="item.isReceive = $event"></coupon-order-single>
      </van-list>
    </div>
  </van-popup>
</template>

<script>
import { Popup, List } from 'vant';
import CouponOrderSingle from '@/components/CouponOrderSingle';
import { getCouponCenterList } from '@/api/coupon';

export default {
  props: {
    type: { // 页面类型 商品详情页goodsDetails
      type: String
    },
    isShow: {
      type: Boolean,
      default: false
    },
    goodId: {
      type: String,
      default: ''
    },
    storeId: {
      type: String,
      default: ''
    }
  },
  components: {
    vanPopup: Popup,
    vanList: List,
    CouponOrderSingle
  },
  data() {
    return {
      loading: false,
      finished: false,
      couponPageNum: 1,
      couponPageSize: 20,
      couponTotal: 0,
      couponList: [],
      id: this.goodId,
      isCouponShow: this.isShow || false
    }
  },
  watch: {
    isShow() {
      this.isCouponShow = this.isShow;
    }
  },
  mounted() {
    console.log('商品优惠券')
    this.couponPageNum = 1;
    this.getGoodsCouponList();
  },
  methods: {
    onLoad() {
      if (this.couponTotal == this.couponList.length) {
        this.loading = false;
        this.finished = true;
        return false;
      }
      this.couponPageNum += 1;
      this.getGoodsCouponList();
    },
    getGoodsCouponList() { // 获取优惠券列表
      let params = {
        pageNum: this.couponPageNum,
        pageSize: this.couponPageSize,
        listType: this.type,
        buyerId: this.$store.state.user.authToken ? this.$store.state.user.userInfo.id : ''
      }
      if (this.type == 'goodsDetails') { // 商品详情需要商品id
        params.goodsId = this.goodId;
      }
      if (this.type == 'cart') { // 购物车是按照店铺查询优惠券，需要传店铺id
        params.storeId = this.storeId;
      }
      getCouponCenterList(params).then(res => {
        this.couponList = this.couponPageNum == 1 ? res.data.records : this.couponList.concat(res.data.records);
        this.couponTotal = parseFloat(res.data.total);
        this.loading = false;
        this.finished = this.couponTotal == this.couponList.length ? true : false;
        this.$emit('onGoodsCoupons', this.couponList);
      }).catch(error => {
        console.log(error);
      })
    }
  }
}
</script>

<style lang="less" scoped>
.container-absolute-height{
  height: calc(100% - 30px);
  overflow: scroll;
}
</style>
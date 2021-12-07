<template>
  <!-- 优惠券 -->
  <div class="round-8">
    <div :class="{'flex coupon-orde-single': true, 'dark-green': !isStoreCount, 'store-bgd dark-red': isStoreCount}">
      <div class="round-8 coupon-orde-single__left">
        <div class="fw">
          <span class="fs-16">{{ $store.state.rate.currency }}</span>
          <span class="fs-22">{{ item.subtractAmount }}</span>
        </div>
        <!-- 满减券 -->
        <div class="fs-10 mt-6 hidden-2" v-if="isFullDiscount">{{ $t('coupon_full_reduction', { replace_tip: $store.state.rate.currency + item.satisfyAmount , replace_tip1: this.$store.state.rate.currency + item.subtractAmount }) }}</div>
        <!-- 无门槛 -->
        <!-- <p :class="{'fs-10 lh-12 mt-6': true, 'dark-green': type == 0, 'light-grey': type != 0}" v-else>{{ $t('coupon_no_threshold') }}</p> -->
        <p :class="{'fs-10 lh-12 mt-6': true}" v-else>{{ $t('coupon_no_threshold') }}</p>
      </div>
      <div class="round-8 coupon-orde-single__right">
        <!-- 规则的展开与隐藏 -->
        <BmIcon :name="isStoreCount ? 'collapse-red' : 'collapse'" :width="'0.28rem'" :height="'0.28rem'" @iconClick="isOpenCollapse = !isOpenCollapse" class="coupon-collapse"></BmIcon>
        <h2 class="fs-14 hidden-1">{{ discountType }}</h2>
        <p class="fs-12 mt-6 hidden-1">{{ item.discountName }}</p>
        <div class="flex between mt-12">
          <!-- 开始时间-结束时间 -->
          <span class="fs-10 mt-4 w-130" v-if="item.validTimeType == 1 || !item.discountValidDate">{{ item.discountValidStartDate }}-{{ item.discountValidEndDate }}</span>
          <!-- 领取后x天有效 -->
          <span class="fs-10 mt-4 w-130" v-if="item.validTimeType == 0 || item.discountValidDate">{{ $t('coupon_validity_day', { replace_tip: item.discountValidDate }) }}</span>
          <!-- 未领取,可领取 -->
          <BmButton :class="{'fs-12 fw white round-100 plr-10 h-24': true, 'bg-dark-red-linear': isStoreCount, 'bg-green-linear': !isStoreCount}" v-if="item.isReceive == 0 || (item.isReceive == 3 && item.isH5CouponType)" @click="onReceive">{{ $t('coupon_get_it') }}</BmButton>
          <!-- 已领取 -->
          <div class="tc fs-12 lh-20 coupon-status" v-if="item.isReceive == 1">
            <p class="coupon-status__tip">{{ $t('coupon_received') }}</p>
            <BmImage
              :url="require('@/assets/images/coupon/store-collected.png')"
              :height="'0.9rem'"
              :isLazy="false"
              :isShow="true"
              :fit="'cover'"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="pl-16 pr-10 bg-white pt-2" v-show="isOpenCollapse">
      <div class="fs-10 light-grey pt-8 pb-12" v-html="item.discountDescription"></div>
    </div>
  </div>
</template>

<script>
import { receiveCoupon, getLinkCoupon } from '@/api/coupon';

export default {
  props: {
    type: { // 优惠券状态 0未使用 1已使用 2 已过期 3用完 -1可领取
      type: Number,
      default: 0
    },
    item: {
      type: Object,
      default: {
        checked: false,
        discountType: null, // 活动类型
        discountId: null, // 优惠券id
        discountDescription: null, // 优惠券说明
        discountName: null, //优惠券名称
        discountValidDate: null, // 领券后有效时间(天)
        discountValidEndDate: null, // 优惠券有效结束时间
        discountValidStartDate: null, // 优惠券有效开始时间
        isReceive: null, // 是否已领取:0 未领取;1 已领取(如果是h5链接客服券：1->已领取 2->不可领取 3->可领取)
        satisfyAmount: null, // 满多少面额(门槛)
        subtractAmount: null, // 减多少面额
        validTimeType: null, // 有效时间类型 0->领取后x天有效 1->固定的有效期
        isH5CouponType: null, // h5链接客服券
      }
    }
  },
  computed: {
    // 活动类型：1.平台新人满减券，2.平台新人立减券，3.客服满减券，4.客服立减券，5.店铺新人满减券，6.店铺新人立减券，7.店铺满减券，8.商品满减券，9.商品立减券
    discountType() {
      return this.item.discountType == 1 || this.item.discountType == 2 || this.item.discountType == 3 || this.item.discountType == 4 ? this.$t('platform_coupons') : this.$t('store_coupons');
    },
    isStoreCount() { // 是否是店铺券
      return this.item.discountType == 1 || this.item.discountType == 2 || this.item.discountType == 3 || this.item.discountType == 4 ? false : true;
    },
    isFullDiscount() { // 满减还是立减
      return this.item.discountType == 1 || this.item.discountType == 3 || this.item.discountType == 5 || this.item.discountType == 7 || this.item.discountType == 8 ? true : false;
    }
  },
  data() {
    return {
      isOpenCollapse: false
    }
  },
  methods: {
    async onReceive() { // 立即领取
      if (!this.$store.state.user.authToken) {
        this.$router.push({
          name: 'login'
        })
        return false;
      }

       // 已领取 || h5链接客服券且不可领取
      if (this.item.isReceive == 1 || (this.item.isReceive == 2 && this.item.isH5CouponType)) {
        return false;
      }
      this.$toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      });
      try {
        let receiveData = this.isH5CouponType ? await getLinkCoupon({ linkCouponId: this.$route.query.linkCouponId }) : await receiveCoupon({ discountId: this.item.discountId });

        this.$toast.clear();
        this.$toast({
          message: this.$t('receive_success'),
          duration: 3000
        });
        this.$emit('onSelect', false); // 已领取弹窗隐藏
        this.$emit('onReceive', 1); // 已领取
      } catch (error) {
        this.$emit('onSelect', false); // 失败弹窗隐藏
        // this.$toast.clear();
      }
    }
  }
}
</script>

<style lang="less" scoped>
.coupon-orde-single{
  background-image: url('../assets/images/coupon/coupon-green-bgd.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  position: relative;
  &.store-bgd{
    background-image: url('../assets/images/coupon/coupon-red-bgd.png');
  }
  .coupon-orde-single__left{
    width: 111px;
    padding: 20px 6px 14px 12px;
  }
  .coupon-orde-single__right{
    width: 244px;
    padding: 14px 15px 8px 11px;
  }
}
.h-24{
  height: 24px!important;
}
.round-100{
  border-radius: 100px!important;
}
.coupon-collapse{
  position: absolute;
  right: 9px;
  top: 7px;
}
.w-230{
  width: 230px;
}
.mt-6{
  margin-top: 6px;
}
.coupon-choose{
  position: absolute;
  right: 18px;
  top: 47px;
}
.coupon-status{
  position: absolute;
  height: 45px;
  right: 12px;
  bottom: 20px;
  transform: rotate(-21deg);
  .coupon-status__tip{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    word-break: keep-all;
  }
}  
.fs-22{
  font-size: 22px;
}
.w-130{
  width: 130px;
}
</style>
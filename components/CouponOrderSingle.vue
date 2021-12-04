<template>
  <!-- 优惠券 -->
  <div class="round-8 bg-white">
    <div class="dark-green flex coupon-orde-single">
      <div class="round-8 coupon-orde-single__left">
        <div class="fw">
          <span class="fs-16">{{ $store.state.rate.currency }}</span>
          <span class="fs-22">{{ item.subtractAmount }}</span>
        </div>
        <div class="fs-10 mt-6 hidden-2">Buy {{ $store.state.rate.currency }}{{ item.satisfyAmount }} cap at {{ this.$store.state.rate.currency }}{{ item.subtractAmount }} off</div>
      </div>
      <div class="round-8 coupon-orde-single__right">
        <!-- 规则的展开与隐藏 -->
        <BmIcon :name="type != 0 ? 'collapsed' : 'collapse'" :width="'0.28rem'" :height="'0.28rem'" @iconClick="isOpenCollapse = !isOpenCollapse" class="coupon-collapse" v-if="item.discountDescription"></BmIcon>
        <h2 class="fs-14">Free Shipping</h2>
        <p class="fs-12 mt-2">Tospino specific product</p>
        <div class="flex between mt-18">
          <span class="fs-10 mt-4">5-5 Nov.2021</span>
          <!-- 未领取 -->
          <BmButton class="fs-12 fw white round-100 plr-12 h-24 bg-green-linear" v-if="item.isReceive == 0" @click="onReceive">COLLECT</BmButton>
        </div>
      </div>
    </div>
    <div class="pl-16 pr-10 bg-white pt-2" v-show="isOpenCollapse">
      <div class="fs-10 light-grey mt-8 pb-12" v-html="item.discountDescription"></div>
    </div>
  </div>
</template>

<script>
import { receiveCoupon } from '@/api/coupon';

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
        isReceive: null, // 是否已领取:0 未领取;1 已领取
        satisfyAmount: null, // 满多少面额(门槛)
        subtractAmount: null // 减多少面额
      }
    }
  },
  computed: {
    // 活动类型：1.平台新人满减券，2.平台新人立减券，3.客服满减券，4.客服立减券，5.店铺新人满减券，6.店铺新人立减券，7.店铺满减券，8.商品满减券，9.商品立减券
    discountType() {
      return this.item.discountType == 1 || this.item.discountType == 2 ? this.$t('platform_coupons') : this.$t('store_coupons');
    }
  },
  data() {
    return {
      isOpenCollapse: false
    }
  },
  methods: {
    onReceive() { // 立即领取
      if (!this.$store.state.user.authToken) {
        this.$router.push({
          name: 'login'
        })
        return false;
      }

      if (this.item.isReceive == 1) { // 已领取
        return false;
      }
      this.$toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      });
      receiveCoupon({
        discountId: this.item.discountId
      }).then(res => {
        this.$toast.clear();
        this.$toast({
          message: this.$t('coupon_received'),
          duration: 3000
        });
        this.$emit('onSelect', false); // 已领取弹窗隐藏
        this.$emit('onReceive', 1);
      }).catch(error => {
        console.log(error);
        this.$emit('onSelect', false); // 失败弹窗隐藏
        this.$toast.clear();
      })
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
.mt-18{
  margin-top: 18px;
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
</style>
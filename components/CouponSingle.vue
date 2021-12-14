<template>
  <!-- 我的优惠券-组件样式 -->
  <div class="round-8 hidden">
    <div :class="{'coupon-content-title': true, 'light-green': type == 0, 'bg-grey-e3': type != 0}">
      <div class="flex between vcenter">
        <span :class="{'ptb-2 plr-8 round-8 white fs-10': true, 'bg-dark-green': type == 0, 'bg-dark-grey': type != 0}">{{ discountType }}</span>
        <BmIcon :name="type != 0 ? 'collapsed' : 'collapse'" :width="'0.28rem'" :height="'0.28rem'" @iconClick="isOpenCollapse = !isOpenCollapse" v-if="discountDescription"></BmIcon>
      </div>
      <div class="mt-10 flex">
        <!-- <BmImage
          :url="require('@/assets/images/product-bgd-90.png')"
          :width="'0.96rem'" 
          :height="'0.96rem'"
          :isLazy="false"
          :isShow="false"
          :alt="'coupon'"
          class="round-4 flex-shrink"
        /> -->
        <div class="ml-4 w-100">
          <div class="mt-2 flex between">
            <p :class="{'dark-green': type == 0, 'light-grey': type != 0}">
              <span class="fw fs-14">{{ this.$store.state.rate.currency }}</span>
              <span class="fw fm-din fs-22 lh-1">{{ item.subtractAmount }}</span>
            </p>
            <!-- 未领取 -->
            <BmButton class="fs-12 fw white round-100 plr-12 h-24 bg-green-linear mr-8" @btnClick="onHandle" v-if="item.isReceive == 0">{{ $t('coupon_get_it') }}</BmButton>
            <!-- 已领取 -->
            <BmButton class="fs-12 fw white round-100 plr-12 h-24 bg-green-linear mr-8" @btnClick="onHandle" v-if="item.isReceive == 1 || (pageType == 1 && item.useStatus)">{{ $t('coupon_use_it') }}</BmButton>
            <!-- type已使用1/已过期2 -->
            <BmImage
              :url="require('@/assets/images/coupon/used.png')"
              :width="'1.08rem'" 
              :height="'0.72rem'"
              :isLazy="false"
              :isShow="false"
              :alt="'coupon'"
              class="flex-shrink mr-18 coupon-status"
              v-if="type == 1"
            />
          </div>
          <!-- 满减券 -->
          <p :class="{'fs-10 lh-12 mt-6': true, 'dark-green': type == 0, 'light-grey': type != 0}" v-if="isFullDiscount">Min spend {{ this.$store.state.rate.currency }}{{ item.satisfyAmount }} Capped at {{ this.$store.state.rate.currency }}{{ item.subtractAmount }}</p>
          <!-- 无门槛 -->
          <p :class="{'fs-10 lh-12 mt-6': true, 'dark-green': type == 0, 'light-grey': type != 0}" v-else>{{ $t('coupon_no_threshold') }}</p>
        </div>
      </div>
    </div>
    <div class="coupon-content-descript">
      <div :class="{'sawtooth': true, 'sawtooth-active': type == 0}"></div>
      <div class="bg-round-l"></div>
      <div class="bg-round-r"></div>
      <p class="light-grey fs-10 lh-12 pt-2 pl-20 pb-4 bg-white">有限期:{{ discountValidStartDate }} - {{ discountValidEndDate }}</p>
    </div>

    <div class="pl-16 pr-10 bg-white pt-2" v-show="isOpenCollapse">
      <div class="w-230 border-b"></div>
      <div class="fs-10 light-grey mt-8 pb-12" v-html="discountDescription"></div>
    </div>
  </div>
</template>

<script>
import { CollapseItem } from 'vant';
import { receiveCoupon } from '@/api/coupon';

export default {
  props: {
    pageType: {
      type: Number,
      default: 0 // 1我的优惠券 2领券中心
    },
    type: { // 优惠券状态 0未使用 1已使用 2 已过期 3用完
      default: 0
    },
    item: {
      type: Object,
      default: () => {
        return {
          discountType: null, // 活动类型
          discountId: null, // 优惠券id
          discountDescription: null, // 优惠券说明
          discountName: null, //优惠券名称
          discountValidDate: null, // 领券后有效时间(天)
          discountValidEndDate: null, // 优惠券有效结束时间
          discountValidStartDate: null, // 优惠券有效开始时间
          isReceive: null, // 是否已领取:0 未领取;1 已领取
          satisfyAmount: null, // 满多少面额(门槛)
          subtractAmount: null, // 减多少面额
          useStatus: null, // 使用状态:true->可用 false:不可用
          goodsId: null, // 商品id
        };
      }
    }
  },
  components: {
    vanCollapseItem: CollapseItem
  },
  data() {
    return {
      isOpenCollapse: false
    }
  },
  computed: {
    // 活动类型：1.平台新人满减券，2.平台新人立减券，3.客服满减券，4.客服立减券，5.店铺新人满减券，6.店铺新人立减券，7.店铺满减券，8.商品满减券，9.商品立减券
    discountType() {
      return this.item.discountType == 1 || this.item.discountType == 2 ? this.$t('platform_coupons') : this.$t('store_coupons');
    },
    discountValidEndDate() { // 优惠券有效结束时间
      return this.pageType ? this.item.validEndTime : this.item.discountValidEndDate;
    },
    discountValidStartDate() { // 优惠券有效开始时间
      return this.pageType ? this.item.validStartTime : this.item.discountValidEndDate;
    },
    discountName() { // 优惠券名称
      return this.pageType ? this.item.couponName : this.item.discountName;
    },
    discountDescription() { // 优惠券说明
      return this.pageType ? this.item.couponDescription : this.item.discountDescription;
    },
    discountId() { // 优惠券id
      return this.pageType ? this.item.couponId : this.item.discountId;
    },
    isFullDiscount() { // 满减还是立减
      return this.item.discountType == 1 || this.item.discountType == 3 || this.item.discountType == 5 || this.item.discountType == 7 || this.item.discountType == 8 ? true : false;
    }
  },
  methods: {
    onHandle() { // 领取优惠券, 需要先判断是否登录
      if (!this.$store.state.user.authToken) {
        this.$router.push({
          name: 'login'
        })
        return false;
      }
      // 已领取-立即使用
      // 活动类型：1.平台新人满减券，2.平台新人立减券，3.客服满减券，4.客服立减券，5.店铺新人满减券，6.店铺新人立减券，7.店铺满减券，8.商品满减券，9.商品立减券
      // 我的优惠券列表立即使用
      if (this.item.isReceive == 1 || (this.pageType == 1 && this.item.useStatus)) {
        // 若是平台新人礼/平台客服券，点击跳转到商城首页
        if (this.item.discountType == 1 || this.item.discountType == 2 || this.item.discountType == 3 || this.item.discountType == 4) {
          this.$router.push({ name: 'home' });
        }

        // 若是店铺新人礼/店铺满减/立减券，点击跳转到对应店铺首页
        if (this.item.discountType == 5 || this.item.discountType == 6 || this.item.discountType == 7) {
          this.$router.push({ 
            name: 'cart-store-id', 
            params: { 
              id: this.item.storeId
            }, 
            query: {
              sellerId: this.item.sellerId
            } 
          });
        }

        // 若是商品满减券/立减券，点击跳转到对应商品详情页
        if (this.item.discountType == 8 || this.item.discountType == 9) {
          this.$router.push({ name: 'product-id', params: { id: this.item.goodsId } });
        }
        
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
          message: this.$t('receive_success'),
          duration: 3000
        });
        this.$emit('onReceive', 1);
      }).catch(error => {
        console.log(error);
        this.$toast.clear();
      })
    }
  }
}
</script>

<style lang="less" scoped>
.light-green{
  background-color: #D9F1EF;
}
.coupon-content-title{
  padding: 6px 6px 0 20px;
}
.sawtooth{
  width: 100%;
  height: 14px;
  background-image: url('../assets/images/coupon/sawtooth-bgd.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: top;
  &.sawtooth-active{
    background-image: url('../assets/images/coupon/sawtooth-bgd-active.png');
  }
}
.fs-22{
  font-size: 22px;
}
.h-24{
  height: 24px!important;
}
.round-100{
  border-radius: 100px;
}
.pt-2{
  padding-top: 2px;
}
.coupon-content-descript{
  position: relative;
  .bg-round-l, .bg-round-r{
    position: absolute;
    top: -3px;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: #FAFAFA;
  }
  .bg-round-l{
    left: 0;
    transform: translate(-50%, 50%);
  }
  .bg-round-r{
    right: 1px;
    transform: translate(50%, 50%);
  }
}
.w-230{
  width: 230px;
}
.mr-18{
  margin-right: 18px;
}
.bg-grey-e3{
  background-color: #E3E3E3;
}
.bg-dark-grey{
  background-color: #C2C2C2;
}
.coupon-status{
  position: absolute;
  right: 18px;
}
.ptb-2{
  padding-top: 2px;
  padding-bottom: 2px;
}
.mt-6{
  margin-top: 6px;
}
</style>
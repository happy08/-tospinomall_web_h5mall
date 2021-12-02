<template>
  <!-- 我的优惠券-组件样式 -->
  <div class="round-8 hidden">
    <div :class="{'coupon-content-title': true, 'light-green': type == 0, 'bg-grey-e3': type != 0}">
      <div class="flex between vcenter">
        <span :class="{'ptb-2 plr-8 round-8 white fs-10': true, 'bg-dark-green': type == 0, 'bg-dark-grey': type != 0}">{{ discountType }}</span>
        <BmIcon :name="type != 0 ? 'collapsed' : 'collapse'" :width="'0.28rem'" :height="'0.28rem'" @iconClick="isOpenCollapse = !isOpenCollapse"></BmIcon>
      </div>
      <div class="mt-10 flex">
        <BmImage
          :url="require('@/assets/images/product-bgd-90.png')"
          :width="'0.96rem'" 
          :height="'0.96rem'"
          :isLazy="false"
          :isShow="false"
          :alt="'coupon'"
          class="round-4 flex-shrink"
        />
        <div class="ml-4 w-100">
          <div class="mt-2 flex between">
            <!-- <p :class="{'dark-green': type == 0, 'light-grey': type != 0}"> -->
            <p :class="{'dark-green': true}">
              <span class="fw fs-14">Rp</span>
              <span class="fw fm-din fs-22 lh-1">{{ item.subtractAmount }}</span>
            </p>
            <!-- 未领取 -->
            <BmButton class="fs-12 fw white round-100 plr-12 h-24 bg-green-linear mr-8" @btnClick="onHandle" v-if="item.isReceive == 0" @click="onReceive">COLLECT</BmButton>
            <BmImage
              :url="require('@/assets/images/coupon/used.png')"
              :width="'1.08rem'" 
              :height="'0.72rem'"
              :isLazy="false"
              :isShow="false"
              :alt="'商品优惠券'"
              class="flex-shrink mr-18 coupon-status"
              v-else
            />
          </div>
          <p :class="{'fs-10 lh-12 mt-8': true, 'dark-green': type == 0, 'light-grey': type != 0}">Min spend Rp 20.000. Capped at Rp 10.000.</p>
        </div>
      </div>
    </div>
    <div class="coupon-content-descript">
      <div :class="{'sawtooth': true, 'sawtooth-active': type == 0}"></div>
      <div class="bg-round-l"></div>
      <div class="bg-round-r"></div>
      <p class="light-grey fs-10 lh-12 pt-2 pl-20 pb-4 bg-white">XXXX XXXX Validity:{{ item.discountValidStartDate }} - {{ item.discountValidEndDate }}</p>
    </div>

    <div class="pl-16 pr-10 bg-white pt-2" v-show="isOpenCollapse">
      <div class="w-230 border-b"></div>
      <div class="fs-10 light-grey mt-8 pb-12" v-html="item.discountDescription"></div>
    </div>
  </div>
</template>

<script>
import { CollapseItem } from 'vant';
import { receiveCoupon } from '@/api/coupon';

export default {
  props: {
    type: { // 是否过期
      default: 0
    },
    item: {
      type: Object,
      default: {
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
    }
  },
  methods: {
    onHandle() {
      console.log('success')
    },
    onReceive() { // 领取优惠券, 需要先判断是否登录
      if (!this.$store.state.user.authToken) {
        this.$router.push({
          name: 'login'
        })
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
        this.$emit('onReceive');
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
</style>
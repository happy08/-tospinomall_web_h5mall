<template>
  <!-- 我的优惠券-组件样式 -->
  <div class="round-8 hidden">
    <div :class="{'coupon-content-title': true, 'light-green': type == 0, 'bg-grey-e3': type != 0}">
      <div class="flex between vcenter">
        <span :class="{'ptb-2 plr-8 round-8 white fs-10': true, 'bg-dark-green': type == 0, 'bg-dark-grey': type != 0}">商品优惠券</span>
        <BmIcon :name="type != 0 ? 'collapsed' : 'collapse'" :width="'0.28rem'" :height="'0.28rem'" @iconClick="isOpenCollapse = !isOpenCollapse"></BmIcon>
      </div>
      <div class="mt-10 flex">
        <BmImage
          :url="require('@/assets/images/product-bgd-90.png')"
          :width="'0.96rem'" 
          :height="'0.96rem'"
          :isLazy="false"
          :isShow="false"
          :alt="'商品优惠券'"
          class="round-4 flex-shrink"
        />
        <div class="ml-4 w-100">
          <div class="mt-2 flex between">
            <p :class="{'dark-green': type == 0, 'light-grey': type != 0}">
              <span class="fw fs-14">Rp</span>
              <span class="fw fm-din fs-22 lh-1">40.000</span>
            </p>
            <BmButton class="fs-12 fw white round-100 plr-12 h-24 bg-green-linear mr-8" @btnClick="onHandle" v-if="type == 0">COLLECT</BmButton>
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
      <p class="light-grey fs-10 lh-12 pt-2 pl-20 pb-4 bg-white">XXXX XXXX Validity: 5 thg 11,2021 - 3 thg 2.2022 </p>
    </div>

    <div class="pl-16 pr-10 bg-white pt-2" v-show="isOpenCollapse">
      <div class="w-230 border-b"></div>
      <div class="fs-10 light-grey mt-8 pb-12">1.该商品券仅可使用于店铺的某某视频<br/>2.虚拟商品及部分商品流程不可使用，特殊流程如秒杀等不适用，请合理的使用优惠券，如发现不合规使用商家有权收回<br/>3.所有解释权归商家所有</div>
    </div>
  </div>
</template>

<script>
import { CollapseItem } from 'vant';

export default {
  props: {
    type: { // 优惠券状态 0未使用 1已使用 2 已过期 3用完
      type: Number,
      default: 0
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
  methods: {
    onHandle() {
      console.log('success')
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
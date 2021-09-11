<template>
  <!-- 我的-售后-售后申请 -->
  <div class="bg-grey vh-100" v-if="orderList.length > 0">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('after_sales_service')" />

    <!-- 订单详情 -->
    <template v-if="orderList.length == 1">
      <OrderSingle class="bg-white p-20" :image="detailItem.goodImg" :product_num="detailItem.canAfterApplyNum" :product_desc="detailItem.goodName" :product_size="detailItem.goodAttr" :price="detailItem.goodPrice"  v-for="(detailItem, orderIndex) in orderList" :key="'order-item-' + orderIndex" />
    </template>
    <template v-else>
      <swiper
        ref="swiperComponentRef"
        :class="{ 'swiper mt-12 mlr-20 order-page__global-swiper': true, 'swiper-no-swiping' : orderList.length <= 4 }"
        :options="{
          ...swiperComponentOption
        }"
      >
        <swiper-slide v-for="(productItem,productIndex) in orderList" :key="'swiper-' + productIndex">
          <BmImage 
            :url="productItem.goodImg"
            :width="'1.68rem'" 
            :height="'1.68rem'"
            :isLazy="false"
            :isShow="true"
            class="flex-shrink border round-4 hidden"
            :alt="productItem.goodName"
          />
          <div class="product-price">{{ $store.state.rate.currency }}{{ productItem.productAmount }}</div>
        </swiper-slide>
      </swiper>
    </template>
    

    <van-cell-group class="mt-12">
      <!-- 选择售后类型 type: 1仅退款 2退货退款 3换货 -->
      <van-cell class="ptb-20 plr-20" :title="$t('select_after_sales_type')" title-class="fs-14 black fw"/>
      <!-- 退货退款 -->
      <van-cell class="ptb-20 plr-20" :title="$t('I_want_to_return')" :title-class="{'fs-14': true, 'black': detail.status != 1, 'grey': detail.status == 1 }" is-link @click="onApply(2)" />
      <!-- 换货,暂时不做 -->
      <!-- <van-cell class="ptb-20 plr-20" :title="$t('me.afterSale.exchange')" title-class="fs-14 black"  is-link @click="onApply(3)" /> -->
      <!-- 仅退款 -->
      <van-cell class="ptb-20 plr-20" :title="$t('I_want_a_refund_no_return')" title-class="fs-14 black"  is-link @click="onApply(1)"  />
    </van-cell-group>

    <!-- 退货退款说明 -->
    <div class="mt-60 tc">
      <nuxt-link :to="{ name: 'service-type', params: { type: 'aftersale' }, query: { isH5: 1 } }" class="green">{{ $t('return_and_exchange_instructions') }}</nuxt-link>
    </div>
  </div>
</template>

<script>
import OrderSingle from '@/components/OrderSingle';
import { Cell, CellGroup } from 'vant';
import { aftersaleOrderItem } from '@/api/order';
import 'swiper/css/swiper.css';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';

export default {
  middleware: 'authenticated',
  components: {
    vanCell: Cell,
    vanCellGroup: CellGroup,
    OrderSingle,
    swiper: Swiper,
    swiperSlide: SwiperSlide
  },
  data() {
    return {
      detail: [],
      swiperComponentOption: { // 一排四列 滚动
        slidesPerView: 'auto',
        // slidesPerGroup: 4,
        spaceBetween: 0,
        // loop: true,
        // loopFillGroupWithBlank: true,
        pagination: {
          el: '.swiper-group-pagination',
          clickable: true,
        },
      },
      orderList: []
    }
  },
  fetch() {
    aftersaleOrderItem(this.$route.query.itemId).then(res => {
      if (!res.data) return false;

      this.detail = res.data.order;
      this.orderList = res.data.orderItemList;

    })
  },
  activated() {
    this.$fetch();
  },
  methods: {
    onApply(type) {
      if (type == 2 && this.detail.status == 1) return false; // 待发货时不可选择退货退款

      this.$router.push({ 
        name: 'me-aftersale-apply-type', 
        params: { type: type }, 
        query: { itemId: this.$route.query.itemId } 
      })
    }
  },
}
</script>

<style lang="less" scoped>
.order-page__global-swiper{
  height: 84px;
  .swiper-slide{
    width: 84px!important;
    position: relative;
    margin-left: 6px;
    &:first-child{
      margin-left: 0;
    }
    .product-price{
      position: absolute;
      bottom: 0;
      width: 100%;
      left: 0;
      color: #fff;
      background-color: rgba(0, 0, 0, .65);
      text-align: center;
      padding-top: 2px;
      padding-bottom: 2px;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }
}
</style>
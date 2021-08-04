<template>
  <!-- 订单列表展示组件 -->
  <div class="flex w-100" @click="onClick">
    <!-- 商品图片 -->
    <!-- 商品数量大于1，展示商品的缩略图 -->
    <BmImage 
      :url="image"
      :width="img_width" 
      :height="img_height"
      :isLazy="isLazy"
      :loadUrl="loadUrl"
      :errorUrl="errorUrl"
      class="flex-shrink border round-4 hidden"
    />
    <!-- 商品详情 -->
    <div class="tl product-detail" v-if="product_num === 1">
      <p class="fs-14 black lh-20 hidden-2 fm-helvetica">{{ product_desc }}</p>
      <p class="fs-14 lh-20 grey mt-8" v-if="product_size">{{ product_size }}</p>
      <div class="fs-16 red fw lh-20 mt-12" v-if="price >= 0 && isShowRight == false"><span class="fm-menlo">{{ $store.state.rate.currency }}</span><span class="fm-din">{{ price }}</span></div>
    </div>
    
    <!-- 商品价格和数量 -->
    <div class="tr" v-if="isShowRight">
      <p class="fs-18 fw black lh-20">{{ $store.state.rate.currency }}{{ price }}</p>
      <p class="light-grey fs-14 lh-20 mt-8">X{{ product_num }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    image: {
      type: String,
      default: require('@/assets/images/product-bgd-90.png')
    },
    img_width: {
      type: String,
      default: '1.68rem'
    },
    img_height: {
      type: String,
      default: '1.68rem'
    },
    isLazy: {
      type: Boolean,
      default: false
    },
    loadUrl: {
      type: String,
      default: require('@/assets/images/product-bgd-90.png')
    },
    errorUrl: {
      type: String,
      default: require('@/assets/images/product-bgd-90.png')
    },
    product_desc: { // 商品描述
      type: String,
      default: ''
    },
    product_size: { // 商品尺寸
      type: String,
      default: ''
    },
    price: { // 商品价格
      type: Number,
      default: 0
    },
    product_num: { // 商品件数
      type: Number,
      default: 1
    },
    isShowRight: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    onClick() {
      this.$emit('onClick');
    }
  },
}
</script>

<style lang="less" scoped>
.product-detail{
  // width: 135px;
  margin-left: 16px;
  margin-right: 16px;
  width: 100%;
}
</style>
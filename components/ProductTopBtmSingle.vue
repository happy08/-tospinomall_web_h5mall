<template>
  <!-- 商品列表，上面部分展示图片，下面部分展示信息 -->
  <div class="flex column top-bottom-songle" :style="'width: ' + img.width + ';'">
    <!-- 商品的图片 -->
    <BmImage 
      :url="img.url"
      :width="img.width" 
      :height="img.height"
      :isLazy="true"
      :loadUrl="img.loadImage"
      :errorUrl="img.loadImage"
    ></BmImage>
    <!-- 商品的信息 -->
    <div class="pt-12 pb-20 plr-4 bg-white" v-if="detail">
      <div class="flex vcenter pb-12" v-if="detail.country">
        <BmImage 
          :url="detail.country_url"
          :width="'0.36rem'" 
          :height="'0.36rem'"
          :isLazy="true"
          :loadUrl="img.loadImage"
          :errorUrl="img.loadImage"
          round
        ></BmImage>
        <span class="fs-10 color_666 ml-10">{{ detail.country }}</span>
      </div>
      <p class="fs-14 black" v-if="detail.desc" v-html="detail.desc" :class="{ 'hidden-1': detail.ellipsis === 1, 'hidden-2': detail.ellipsis === 2 }"></p>
      <van-rate class="mt-10" v-if="detail.rate" v-model="detail.rate" allow-half size="0.24rem" color="#F7B500" void-color="#DDDDDD" void-icon="star" />
      <div class="mt-12 flex between hidden-1 plr-4 vcenter" v-if="detail.price">
        <span class="red fs-16 fw">
          {{ $store.state.rate.currency }}{{ detail.price }} 
        </span>
        <span v-if="detail.volumn" class="fs-10 clr-black-25">{{ detail.volumn }}+Sold</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Rate } from 'vant';

export default {
  props: {
    img: { // 图片信息
      type: Object,
      required: true,
      default: function () {
        return {
          url: '',
          width: '1.8rem', // 90px
          height: '1.8rem', // 90px
          loadImage: require('@/assets/images/product-bgd-90.png') // 加载图片
        }
      }
    },
    detail: { // 商品信息
      type: Object,
      required: true,
      default: function () {
        return {
          desc: '', // 描述语
          rate: '', // 评分
          price: 0, // 价格
          volumn: '60+', // 累加
          ellipsis: 2, // 展示几行
          country: '', // 国家
          country_url: '' // 国家logo
        }
      }
    }
  },
  components: {
    vanRate: Rate
  },
  created() {
  }
}
</script>

<style lang="less" scoped>
.color_666{
  color: #666;
}
</style>
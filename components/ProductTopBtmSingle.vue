<template>
  <!-- 商品列表，上面部分展示图片，下面部分展示信息 -->
  <div class="flex column pb-20 bg-white" :style="'width: ' + img.width + ';'">
    <!-- 商品的图片 -->
    <BmImage 
      :url="img.url"
      :width="img.width" 
      :height="img.height"
      :isLazy="true"
      :loadUrl="img.loadImage"
      :errorUrl="img.loadImage"
      class="hidden round-8"
      :isShow="true"
    />
    <!-- 商品的信息 -->
    <div class="pt-12 plr-4" v-if="detail">
      <div class="flex vcenter pb-12" v-if="detail.country">
        <BmImage 
          :url="detail.country_url"
          :width="'0.36rem'" 
          :height="'0.36rem'"
          :isLazy="false"
          :loadUrl="img.loadImage"
          :errorUrl="img.loadImage"
          :isShow="false"
          :round="true"
        />
        <span class="fs-10 color_666 ml-10">{{ detail.country }}</span>
      </div>
      <!-- 商品描述 -->
      <p class="fs-14 black lh-20 fm-pf-r" v-if="detail.desc" v-html="detail.desc" :class="{ 'hidden-1': detail.ellipsis === 1, 'hidden-2': detail.ellipsis === 2 }"></p>
      <!-- 评分 -->
      <van-rate class="mt-10" v-if="detail.rate >= 0" v-model="detail.rate" allow-half size="0.24rem" color="#F7B500" void-color="#DDDDDD" void-icon="star" />
      <div class="mt-12 flex between hidden-1 plr-4 vcenter" v-if="detail.price >= 0 && detail.price != ''">
        <span class="red fs-16 fw">
          <span class="fm-menlo">{{ $store.state.rate.currency }}</span><span class="fm-din">{{ detail.price }}</span>
        </span>
        <span v-if="detail.volumn >= 0" class="fs-10 clr-black-25">{{ detail.volumn }}+Sold</span>
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
          rate: 0, // 评分
          price: 0, // 价格
          volumn: 0, // 累加
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
  mounted() {
  }
}
</script>

<style lang="less" scoped>
.color_666{
  color: #666;
}
.h-40{
  height: 40px;
}
</style>
<template>
  <!-- 商品详情页面 -->
  <div class="vh-100 bg-grey">
    <swiper
      ref="swiperComponentRef"
      :options="swiperOption"
    >
      <swiper-slide v-for="(productItem, productIndex) in imgLists" :key="productIndex">
        <van-image-preview v-model="isImgPreview" :startPosition="productIndex" :images="imgLists" @change="onChange">
          <template v-slot:index>第{{ index }}页</template>
        </van-image-preview>
        <BmImage
          :url="productItem"
          :width="'7.5rem'" 
          :height="'7.5rem'"
          :isLazy="false"
          :isShow="false"
        ></BmImage>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import { ImagePreview } from 'vant';

export default {
  components: {
    vanImagePreview: ImagePreview
  },
  asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    return {
      swiperOption: {

      },
      imgLists: [
        'https://img01.yzcdn.cn/vant/apple-1.jpg',
        'https://img01.yzcdn.cn/vant/apple-2.jpg',
      ],
      isImgPreview: false
    }
  },
  methods: {
    onChange(index) {
      
    }
  },
}
</script>
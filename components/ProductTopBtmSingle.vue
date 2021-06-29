<template>
  <!-- 商品列表，上面部分展示图片，下面部分展示信息 -->
  <div class="flex column top-bottom-songle" >
    <!-- 商品的图片 -->
    <img class="top-bottom-songle__img" :src="img.url" :width="img.width" :height="img.height" alt="">
    <!-- 商品的信息 -->
    <div class="mt-12" v-if="detail">
      <p class="fs-14 black" v-if="detail.desc" v-html="detail.desc"></p>
      <van-rate class="mt-4" v-if="detail.rate" v-model="detail.rate" size="14" color="#F7B500" />
      <div class="mt-12 flex between" v-if="detail.price">
        <span class="red fs-16 fw" v-html="detail.price"></span>
        <span v-if="detail.num" v-html="detail.num"></span>
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
          width: '170px',
          height: '170px'
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
          num: '60+'
        }
      }
    }
  },
  components: {
    vanRate: Rate
  }
}
</script>

<style lang="less" scoped>
.top-bottom-songle__img{
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
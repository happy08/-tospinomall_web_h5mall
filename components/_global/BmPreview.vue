<template>
  <!-- 预览 图片/视频 -->
  <div class="preview-container" v-if="isPreviewIndex != 'false'">
    <swiper :options="{...swiperOption, initialSlide: initialSlide}" @slideChange="onSlideChange" ref="previewSwiper">
      <swiper-slide v-for="(productItem, productIndex) in carouselMapUrls" :key="productIndex" @click.native="onClick" class="flex between h-100 vcenter">
        <!-- 图片 -->
        <BmImage
          :url="productItem.imgUrl"
          :height="'auto'"
          :isLazy="false"
          :isShow="false"
          :fit="'cover'"
          :alt="'TospinoMall'"
          v-if="productItem.fileType == 1"
        />
        <!-- 视频 -->
        <div v-else-if="productItem.fileType == 2" class="w-100">
          <video :src="productItem.imgUrl" :poster="carouselMapUrls[0].imgUrl" controls="controls" preload="auto" controlslist="nodownload nofullscreen" style="width:100%;height:7.5rem;" id="prew-video" webkit-playsinline="true" playsinline="true" x-webkit-airplay="allow" x5-video-player-type="h5" x5-playsinline="" >
            {{ $t('no_support_video') }}
          </video>
        </div>
      </swiper-slide>
      <div class="swiper-pagination swiper-pagination-preview" slot="pagination"></div>
    </swiper>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import 'swiper/css/swiper.css';

export default {
  props: {
    carouselMapUrls: {
      type: Array
    },
    initialSlide: { // 初始化时的索引
      type: Number,
      default: 0
    },
    isPreviewIndex: {
      default: 'false'
    }
  },
  components: {
    swiper: Swiper,
    swiperSlide: SwiperSlide
  },
  data() {
    return {
      swiperOption: {
        pagination: {
          el: '.swiper-pagination-preview',
          type: 'fraction'
        }
      },
      video: null
    }
  },
  mounted() {
    this.video = document.getElementById('prew-video');
    if (this.carouselMapUrls[this.initialSlide].fileType == 2) {
      this.video.play();
    }
  },
  methods: {
    onClick(e) {
      if (e.target.id && e.target.id == 'prew-video') {
        // if (this.video.paused) {
        //   this.video.play();
        // } else {
        //   this.video.pause();
        // }
        return false;
      }
      this.$emit('onClose');
    },
    onSlideChange() { // 切换slide
      if (this.carouselMapUrls[this.$refs.previewSwiper.$swiper.activeIndex].fileType != 2 && this.video) {
        this.video.pause();
      }
      
      this.$emit('onPreviewChange', this.$refs.previewSwiper.$swiper.activeIndex);
    }
  }
}
</script>

<style lang="less" scoped>
.preview-container{
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 1);
  z-index: 1000;
}
::v-deep .swiper-container, ::v-deep .swiper-wrapper{
  height: 100%;
  width: 100%;
  // z-index: 1001;
}
::v-deep .swiper-pagination-preview{
  // z-index: 1002;
  color: #fff;
}
::v-deep .van-image{
  max-height: 100%;
}
</style>
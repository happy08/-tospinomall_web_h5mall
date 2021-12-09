<template>
  <!-- 商品列表，上面部分展示图片，下面部分展示信息 -->
  <div class="pb-14 bg-white hidden round-8" :style="'width: ' + img.width + ';'">
    <!-- 商品的图片 -->
    <div class="soldout-container">
      <!-- 无货 -->
      <div class="white fs-12 lh-1 flex center soldout-container__tip" v-if="detail.stock == 0">{{ $t('sold_out') }}</div>
      <BmImage 
        :url="img.url"
        :width="img.width" 
        :height="img.height"
        :isLazy="true"
        :loadUrl="img.loadImage"
        :errorUrl="img.loadImage"
        :isShow="true"
        :alt="detail.desc"
      />
    </div>
    <!-- <SoldOut :isShow="true" :width="img.width" :height="img.height" :tip="$t('sold_out')">
      
    </SoldOut> -->
    <!-- 商品的信息 -->
    <div class="pt-4 plr-12" v-if="detail">
      <div class="flex vcenter pb-12" v-if="detail.country">
        <BmImage 
          :url="detail.country_url"
          :width="'0.54rem'" 
          :height="'0.36rem'"
          :isLazy="false"
          :loadUrl="img.loadImage"
          :errorUrl="img.loadImage"
          :isShow="true"
          :round="false"
          :alt="detail.desc"
        />
        <span class="fs-10 color_666 ml-10">{{ detail.country }}</span>
      </div>
      <!-- 商品描述 -->
      <!-- <div :class="{'h-40 flex vcenter': detail.ellipsis === 2 ? true : false}"> -->
      <div :class="{ 'h-40': isHeight && detail.ellipsis === 2 ? true: false }">
        <p class="fs-14 black fm-pf-r lh-20" v-if="detail.desc" v-html="detail.desc" :class="{ 'hidden-1': detail.ellipsis === 1, 'hidden-2': detail.ellipsis === 2 }"></p>
      </div>
      <div class="m-100 flex mt-8 vcenter hidden-1 round-4 product-tag" v-if="detail.transportMode && detail.supplyCountryName">
        <!-- 运输方式 1空运 2海运 3 陆运 -->
        <BmImage
          :url="require('@/assets/images/icon/'+ modeLabel)" 
          :width="'0.36rem'" 
          :height="'0.36rem'"
          :isLazy="false"
          :isShow="false"
          :fit="'cover'"
          :alt="'TospinoMall ship from tag'"
          class="flex-shrink"
        />
        <span class="fs-10 plr-4 lh-12 hidden-1 iblock w-100">{{ $t('ship_from') }}{{  detail.deliveryType == 2 ? 'TospinoMall' : detail.supplyCountryName }}</span>
      </div>
      <!-- 评分 -->
      <van-rate class="mt-10" v-if="detail.rate > 0" allow-half v-model="detail.rate" size="0.24rem" color="#F7B500" void-color="#DDDDDD" void-icon="star" />
      <div class="mt-12 flex between hidden-1 vcenter" v-if="detail.price >= 0 && String(detail.price) != ''">
        <span class="red fs-16 fw">
          <span class="fm-menlo" v-if="$store.state.rate">{{ $store.state.rate.currency }}</span><span class="fm-din">{{ detail.price }}</span>
        </span>
        <!-- <span v-if="detail.volumn >= 0" class="fs-10 clr-black-25">{{ detail.volumn }}{{ $t('add_sold') }}</span> -->
      </div>
    </div>
  </div>
</template>

<script>
import { Rate } from 'vant';
import SoldOut from '@/components/SoldOut';

export default {
  components: {
    SoldOut
  },
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
          country_url: '', // 国家logo
          stock: 1,
          transportMode: '', // 运输方式 1空运 2海运 3 陆运 
          supplyCountryName: '',
          deliveryType: '' // 2FBT 1FBM
        }
      }
    },
    isHeight: {
      type: Boolean,
      default: false
    }
  },
  components: {
    vanRate: Rate
  },
  computed: {
    modeLabel() {
      return this.detail.transportMode == 1 ? 'plane-icon.png' : this.detail.transportMode == 2 ? 'ship-icon.png' : 'truck-icon.png'
    }
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
.round-top-lr-8{
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
}
.soldout-container{
  position: relative;
  // width: 100%;
  // height: 100%;
  .soldout-container__tip{
    position: absolute;
    width: 70px;
    height: 70px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.65);
    z-index: 1;
  }
}
.product-tag{
  height: 18px;
  position: relative;
  border: 1px solid #42b7ae;
  width: fit-content;
}
.m-100{
  max-width: 100%;
}
</style>
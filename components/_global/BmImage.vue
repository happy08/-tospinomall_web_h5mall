<template>
  <van-image
    :src="w_url" 
    :width="width" 
    :height="height" 
    :fit="fit"
    :show-error="isShow"
    :show-loading="isShow"
    :round="round"
    :lazy-load="isLazy"
    @click="onClick"
    :alt="alt"
    ref="vanImage"
  >
    <template v-slot:error>
      <van-image
        :src="errorUrl" 
        :width="width" 
        :height="height" 
        :fit="fit"
        :alt="alt"
      />
    </template>
    <template v-slot:loading>
      <van-image
        :src="errorUrl" 
        :width="width" 
        :height="height" 
        :fit="fit"
        :alt="alt"
      />
    </template>
  </van-image>
</template>

<script>
export default {
  name: 'BmImage',
  props: {
    url: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    loadUrl: {
      type: String,
      default: null
    },
    errorUrl: {
      type: String,
      default: require('@/assets/images/product-bgd-90.png')
    },
    isLazy: {
      type: Boolean,
      default: false
    },
    isShow: {
      type: Boolean,
      default: false
    },
    round: {
      type: Boolean,
      default: false
    },
    fit: {
      type: String,
      default: 'cover'
    },
    alt: {
      type: String,
      default: ''
    },
    isClip: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      w_url: this.url
    }
  },
  watch: {
    url: {
      handler() {
        this.onClipPic();
      },
      deep: true
    }
  },
  mounted() {
    setTimeout(() => {
      this.onClipPic();
    }, 50)
  },
  methods: {
    onClick() {
      this.$emit('onClick');
    },
    onClipPic() {
      this.w_url = this.url.startsWith('https://') && this.isClip == 1 ? (this.url + '?x-oss-process=image/resize,w_' + parseInt(parseFloat(this.$refs.vanImage.$el.offsetWidth) * 1.5)) : this.url;
    }
  },
}
</script>
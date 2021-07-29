<template>
  <van-image
    :src="url" 
    :width="width" 
    :height="height" 
    :fit="fit"
    :show-error="isShow"
    :show-loading="isShow"
    :round="round"
    :lazy-load="isLazy"
    @click="onClick"
  >
    <template v-slot:error>
      <van-image
        :src="errorUrl" 
        :width="width" 
        :height="height" 
        :fit="fit"
      />
    </template>
    <template v-slot:loading>
      <van-image
        :src="errorUrl" 
        :width="width" 
        :height="height" 
        :fit="fit"
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
    }
  },
  methods: {
    onClick() {
      this.$emit('onClick');
    }
  },
}
</script>
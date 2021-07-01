<template>
  <van-image
    :src="url" 
    :width="width" 
    :height="width" 
    fit="cover"
    :lazy-load="isLazy"
  >
    <template v-slot:error>
      <van-image
        :src="errorUrl" 
        :width="width" 
        :height="height" 
        fit="cover"
      />
    </template>
    <template v-slot:loading>
      <van-image
        :src="errorUrl" 
        :width="width" 
        :height="height" 
        fit="cover"
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
      default: require('@/assets/images/product-bgd-90.png')
    },
    errorUrl: {
      type: String,
      default: require('@/assets/images/product-bgd-90.png')
    },
    isLazy: {
      type: Boolean,
      default: true
    }
  }
}
</script>
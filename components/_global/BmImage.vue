<template>
  <van-image
    :src="url" 
    :width="width" 
    :height="height" 
    fit="contain"
    :lazy-load="isLazy"
    :show-error="isShow"
    :show-loading="isShow"
    :round="round"
  >
    <template v-slot:error>
      <van-image
        :src="errorUrl" 
        :width="width" 
        :height="height" 
        fit="contain"
      />
    </template>
    <template v-slot:loading>
      <van-image
        :src="errorUrl" 
        :width="width" 
        :height="height" 
        fit="contain"
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
      default: ''
    },
    errorUrl: {
      type: String,
      default: ''
    },
    isLazy: {
      type: Boolean,
      default: true
    },
    isShow: {
      type: Boolean,
      default: true
    },
    round: {
      type: Boolean,
      default: false
    }
  }
}
</script>
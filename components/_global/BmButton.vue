<template>
  <van-button
    v-bind="$attrs"
    v-on="$listeners"
    :type="type === 'primary-linear' ? 'default' : type"
    :style="style"
    :disabled="disabled"
  >
    <slot />
  </van-button>
</template>

<script>
export default {
  name: 'BmButton',
  props: {
    type: {
      type: String,
      default: 'primary-linear'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    style() {
      return this.type === 'primary-linear'
        ? {
            background: 'linear-gradient(270deg, #3eb5ae 0%, #70ceb6 100%)',
            color: '#fff',
            border: '0px'
          }
        : this.type === 'info' 
        ? {
          background: 'rgba(66, 183, 174, .05)',
          color: '#42B7AE',
          border: '.02rem solid #42B7AE',
          height: '25px',
          'border-radius': '.16rem'
        } : '';
    }
  }
};
</script>

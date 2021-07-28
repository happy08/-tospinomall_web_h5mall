<template>
  <div class="soldout-container" :style="'width: ' + width + ';height: ' + height + ';'" @click="onClick">
    <div class="white fs-12 lh-1 flex center soldout-container__tip"  v-if="isShow">
      <span>Sold Out</span>
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    width: {
      type: String,
      default: '90px'
    },
    height: {
      type: String,
      default: '90px'
    },
    isShow: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onClick() {
      this.$emit('onClick');
    }
  },
}
</script>

<style lang="less" scoped>
.soldout-container{
  position: relative;
  .soldout-container__tip{
    position: absolute;
    width: 78%;
    height: 78%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.65);
    z-index: 1;
  }
}
</style>
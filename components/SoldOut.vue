<template>
  <div class="soldout-container" :style="'width: ' + width + ';height: ' + height + ';'" @click="onClick">
    <div class="white fs-12 lh-1 flex center soldout-container__tip"  v-show="isShow">
      <span>{{ tip }}</span>
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    width: {
      type: String,
      default: '1.8rem'
    },
    height: {
      type: String,
      default: '1.8rem'
    },
    isShow: {
      type: Boolean,
      default: false
    },
    tip: {
      type: String
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
  width: 100%;
  height: 100%;
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
</style>
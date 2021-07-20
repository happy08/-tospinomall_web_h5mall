<template>
  <svg
    class="icon"
    aria-hidden="true"
    :style="`width:${width};height:${height}`"
    @click="iconClick"
  >
    <use :xlink:href="'#icon-' + name" :fill="color"></use>
  </svg>
</template>

<script>
export default {
  name: 'BmIcon',
  props: {
    name: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "",
    },
    width: {
      type: String,
      default: "20px",
    },
    height: {
      type: String,
      default: "20px",
    },
  },
  methods: {
    iconClick() {
      this.$emit('iconClick')
    }
  },
};
</script>
<style lang="less" scoped>
.icon {
  max-height: 100%;
  max-width: 100%;
}
</style>

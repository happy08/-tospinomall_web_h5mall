<template>
  <van-button
    v-bind="$attrs"
    v-on="$listeners"
    :type="type === 'primary-linear' ? 'default' : type"
    :style="style"
  >
    <slot />
  </van-button>
</template>

<script>
export default {
  name: "BmButton",
  props: {
    type: {
      type: String,
      default: "primary-linear"
    }
  },
  computed: {
    style() {
      return this.type === "primary-linear"
        ? {
            background: "linear-gradient(270deg, #3eb5ae 0%, #70ceb6 100%)",
            color: "white",
            border: "0px"
          }
        : "";
    }
  }
};
</script>

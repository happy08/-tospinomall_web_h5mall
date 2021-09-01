<template>
  <!-- <div> -->
    <!-- <Nuxt keep-alive :keep-alive-props="{ max: 3 }" /> -->
    <Nuxt keep-alive v-show="isLoad" />
    <!-- <div v-else class="flex vcenter hcenter v-percent-100">
      <img class="w-128" src="@/assets/images/home-loading.png" alt="loading picture">
    </div> -->
    <!-- <Nuxt /> -->
  <!-- </div> -->
</template>

<script>
export default {
  name: 'LayOuts',
  data() {
    return {
      isLoad: false
    }
  },
  mounted() {
    this.isLoad = true;
  }
}
</script>
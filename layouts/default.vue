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
    // language用于控制访客端展示的语言类型，language=ZHCN为中文，language=EN为英文，您可按需设置一种语言类型
    // if (this.$store.state.user.authToken) {
      let customer_service = document.createElement('script');
      let language = this.$i18n.locale == 'zh-CN' ? 'ZHCN' : 'EN';
      customer_service.src = `https://webchat.7moor.com/javascripts/7moorInit.js?accessId=8171fc80-d163-11ea-bfcd-0ba873f67cbc&autoShow=true&language=${language}`;
      document.head.appendChild(customer_service);
    // }
  }
}
</script>

<style lang="less">
#chatBtn{
  display: none!important;
}
</style>
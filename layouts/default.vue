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
    // 添加facebook埋点---只在正式环境添加
    if (process.env.APP_MODE && process.env.APP_MODE != 'test') {
      let facebook_pixel = document.createElement('script');
      facebook_pixel.type = 'text/javascript';
      facebook_pixel.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '1277339612726533');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(facebook_pixel);
    }
  }
}
</script>

<style lang="less">
#chatBtn{
  display: none!important;
}
</style>
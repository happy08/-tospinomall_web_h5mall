<template>
  <!-- <div> -->
    <!-- <Nuxt keep-alive :keep-alive-props="{ max: 3 }" /> -->
    <!-- <div> -->
      <!-- <Nuxt keep-alive v-show="isLoad" /> -->
      <Nuxt keep-alive />
      <!-- <a href="https://gh.tospino.com/" target="_black" class="center tc bg-green white fs-12 lh-12 back-old-version" v-html="$t('backOldWeb')"></a> -->
    <!-- </div>s -->
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
    // 添加埋点---只在正式环境添加
    if (process.env.APP_MODE && process.env.APP_MODE != 'test') {
      // facebook埋点
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

      // Google埋点
      let google_pixel = document.createElement('script');
      google_pixel.src = `https://www.googletagmanager.com/gtag/js?id=UA-197562633-2`;
      document.head.appendChild(google_pixel);
      let google_pixel_content = document.createElement('script');
      google_pixel_content.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'UA-197562633-2');
      `;
      document.head.appendChild(google_pixel_content);
    }
  }
}
</script>

<style lang="less">
#chatBtn{
  display: none!important;
}
// .back-old-version{
//   position: fixed;
//   bottom: 15%;
//   width: 50px;
//   padding: 10px 2px;
//   z-index: 100000;
//   right: 0;
//   border-top-left-radius: 12px;
//   border-bottom-left-radius: 12px;
// }
</style>
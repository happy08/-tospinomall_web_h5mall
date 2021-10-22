<template>
  <!-- 我的-联系客服 -->
  <div>
    <div class="bg-green-linear">
      <BmHeaderNav :left="{ isShow: true }" :title="$t('customer_service')" :color="'white'" :bg_color="'bg-transparent'" :border="false"></BmHeaderNav>
      <p class="fs-14 pt-16 pb-47 white tc plr-20">{{ $t('concat_customer_service_tip') }}</p>
    </div>
    
    <div class="plr-12 mt-76">
      <BmButton class="fs-14 round-8 w-100 h-48" @btnClick="qimoChatClick">
        <div class="flex vcenter">
          <BmImage
            :url="require('@/assets/images/icon/online-icon.png')"
            :width="'0.3rem'" 
            :height="'0.32rem'"
            :isLazy="false"
            :isShow="false"
            :alt="'TospinoMall'"
          />
          <span class="ml-6">{{ $t('concat_customer_service_online') }}</span>
        </div>
      </BmButton>
      <a :href="'tel:' + $store.state.platform.shoppingHotline" class="w-100 mt-16 block">
        <BmButton class="fs-14 round-8 w-100 h-48 gery-border" :type="'info'">
            <div class="flex vcenter">
              <BmImage
                :url="require('@/assets/images/icon/tel-icon.png')"
                :width="'0.32rem'" 
                :height="'0.32rem'"
                :isLazy="false"
                :isShow="false"
                :alt="'TospinoMall'"
              />
              <span class="ml-6">{{ $t('concat_customer_service_tel') }}</span>
            </div>
        </BmButton>
      </a>
      <BmButton class="fs-14 round-8 w-100 h-48 mt-16 gery-border customer-copy-email" :type="'info'" @btnClick="onCopy">
        <div class="flex vcenter">
          <BmImage
            :url="require('@/assets/images/icon/email-icon.png')"
            :width="'0.32rem'" 
            :height="'0.26rem'"
            :isLazy="false"
            :isShow="false"
            :alt="'TospinoMall'"
          />
          <span class="ml-6">{{ $t('concat_customer_service_email') }}</span>
        </div>
      </BmButton>
    </div>
  </div>
</template>

<script>
import ClipboardJS from 'clipboard';

export default {
  middleware: 'authenticated',
  mounted() {
    // language用于控制访客端展示的语言类型，language=ZHCN为中文，language=EN为英文，您可按需设置一种语言类型
    if (this.$store.state.user.authToken) {
      let customer_service = document.createElement('script');
      let language = this.$i18n.locale == 'zh-CN' ? 'ZHCN' : 'EN';
      customer_service.src = `https://ykf-webchat.7moor.com/javascripts/7moorInit.js?accessId=79b98c00-2fd7-11ec-bee1-5126bd69b6e2&autoShow=false&language=${language}`;
      document.head.appendChild(customer_service);
    }
  },
  methods: {
    qimoChatClick() { // 唤起客服
      if (!this.$store.state.user.authToken) {
        this.$router.push({
          name: 'login'
        })
        return false;
      }
      qimoChatClick();
    },
    onCopy() {
      let clipboard = new ClipboardJS('.customer-copy-email', {
        text: () => {
          return this.$store.state.platform.kefuEmail;
        }
      })
      clipboard.on('success', () => {
        let msg = this.$t('t_copied_to_clipboard');
        this.$toast({
          message: msg,
          type: 'success'
        })
        clipboard.destroy();
      })
      clipboard.on('error', () => {
        let msg = this.$t('fail_copied_to_clipboard');
        this.$toast({
          message: msg,
          type: 'fail'
        })
        clipboard.destroy();
      })
    },
  }
}
</script>

<style lang="less" scoped>
.pb-47{
  padding-bottom: 47px;
}
.mt-76{
  margin-top: 76px;
}
.h-48{
  height: 48px!important;
}
.gery-border{
  border-color: #DFDFDF!important;
  color: #222222!important;
  background-color: transparent!important;
}
.ml-6{
  margin-left: 6px;
}
</style>
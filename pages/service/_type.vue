<template>
  <!-- 协议 -->
  <div :class="{'pt-46': isShow}">
    <BmHeaderNav :left="{ isShow: true }" :title="title" v-if="isShow" :fixed="true" />
    
    <div class="fs-14 mlr-20 mt-20 pb-20 lh-20 word-break" v-html="intro"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      intro: '',
      isShow: false
    }
  },
  head() { // 头部设置，方便seo
    return {
      title: this.title
    }
  },
  async fetch() {
    try {
      if (this.$route.query.isH5) { // h5 展示
        this.isShow = true;
      }
      // 获取协议类型
      let router_type = this.$route.params.type;
      if (router_type.indexOf('.html')) router_type = router_type.replace('.html', '');

      let _type;
      if (router_type == 'privacy') { // 隐私政策
        _type = 1;
      }
      if (router_type == 'serve') { // 服务协议
        _type = 2;
      }
      if (router_type == 'copyright') { // 版权信息
        _type = 3;
      }
      if (router_type == 'evaluation') { // 评价规则
        _type = 6;
      }
      if (router_type == 'aftersale') { // 退货/退款说明
        _type = 7;
      }
      if (router_type == 'take') { // 上门取件
        _type = 8;
      }
      if (router_type == 'coupon') { // 优惠券说明
        _type = 9;
      }

      const serverData = await this.$api.getService({ platform: 1, type: _type });
      this.title = serverData.data.name;
      this.intro = serverData.data.content;
    } catch (error) {
      console.log('error', error);
    }
  }
}
</script>
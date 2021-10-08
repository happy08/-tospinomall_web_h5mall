<template>
  <!-- 协议 -->
  <div :class="{'pt-46': isShow}">
    <BmHeaderNav :left="{ isShow: true }" :title="title" v-if="isShow" :fixed="true" />
    
    <div class="fs-14 mlr-20 mt-20 pb-20 lh-20 word-break" v-html="intro"></div>
  </div>
</template>

<script>
import { getService } from '@/api/user';

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
  activated() {
    if (this.$route.query.isH5) { // h5 展示
      this.isShow = true;
    }
    let _type;
    if (this.$route.params.type == 'serve') { // 服务协议
      _type = 2;
    }
    if (this.$route.params.type == 'privacy') { // 隐私政策
      _type = 1;
    }
    if (this.$route.params.type == 'evaluation') { // 评价规则
      _type = 6;
    }
    if (this.$route.params.type == 'aftersale') { // 退货/退款说明
      _type = 7;
    }
    if (this.$route.params.type == 'copyright') { // 版权信息
      _type = 3;
    }
    if (this.$route.params.type == 'take') { // 上门取件
      _type = 8;
    }
    getService({ platform: 1, type: _type }).then(res => {
      this.title = res.data.name;
      this.intro = res.data.content;
    })
  }
}
</script>
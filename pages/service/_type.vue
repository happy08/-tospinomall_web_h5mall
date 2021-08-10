<template>
  <!-- 协议 -->
  <div>
    <BmHeaderNav :left="{ isShow: true }" :title="title" v-if="isShow" />
    
    <div class="fs-14 mlr-20 mt-20" v-html="intro"></div>
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
  fetch() { // 根据type类型展示协议内容
    if (!this.$route.query.type) { // type = 'client'
      this.isShow = true;
    }
    if (this.$route.params.type == 'about') { // 用户协议
      this.title = '用户协议'
      this.intro = '协议内容';
    }
    if (this.$route.params.type == 'privacy') { // 隐私协议
      this.title = '隐私协议'
      this.intro = '协议内容';
    }
    if (this.$route.params.type == 'register') { // 注册协议
      this.title = '注册协议'
      this.intro = '协议内容';
    }
    if (this.$route.params.type == 'aftersale') { // 退货/退款说明
      this.title = '退货退款'
      this.intro = '退货退款内容';
    }
  },
  activated() {
    this.$fetch();
  }
}
</script>
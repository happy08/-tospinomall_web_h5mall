<template>
<!-- 导航栏 -->
  <van-nav-bar>
    <!-- 左侧内容 -->
    <template #left>
      <van-icon v-if="left.isShow" name="arrow-left" color="#000" size="18px" @click="leftBack"></van-icon>
    </template>
    <!-- 中间内容 -->
    <template #title>
      <div v-if="title" v-html="title"></div>
      <slot name="header-title"></slot>
    </template>
    <!-- 右侧内容 -->
    <template #right>
      <slot name="header-right"></slot>
    </template>
  </van-nav-bar>
</template>

<script>
export default {
  name: 'BmHeaderNav',
  props: {
    title: {
      type: String,
      default: ''
    },
    left: {
      type: Object,
      default: function () {
        return {
          url: '',
          isShow: false,
          isRep: false,
          isEmit: false
        }
      }
    }
  },
  methods: {
    leftBack() {
      if(this.left.isEmit){
        this.$emit('leftClick');
        return;
      }
      if(this.left.url){
        if(this.left.isRep){
          this.$router.replace({ path: this.left.url });
        }else{
          this.$router.push({ path: this.left.url });
        }
        return;
      }
      if(window.history.length < 2){ //解决部分机型拿不到history
        console.log('go home');
        this.$router.replace('/');
      }else{
        console.log('back');
        history.back();
      }
    }
  },
}
</script>
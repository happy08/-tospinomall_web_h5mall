<template>
<!-- 导航栏 -->
  <van-nav-bar :border="border" :class="bg_color" :fixed="fixed" class="z-1000">
    <!-- 左侧内容 -->
    <template #left>
      <van-icon v-if="left.isShow" name="arrow-left" :color="color" size="18px" @click="leftBack"></van-icon>
      <slot name="header-left"></slot>
    </template>
    <!-- 中间内容 -->
    <template #title>
      <h1 v-if="title" v-html="title" :class="['fs-18', color]"></h1>
      <slot name="header-title"></slot>
    </template>
    <!-- 右侧内容 -->
    <template #right>
      <slot name="header-right"></slot>
    </template>
  </van-nav-bar>
</template>

<script>
import { NavBar } from 'vant';

export default {
  name: 'BmHeaderNav',
  components: {
    vanNavBar: NavBar
  },
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
    },
    border: {
      type: Boolean,
      default: true
    },
    color: {
      type: String,
      default: 'black'
    },
    bg_color: {
      type: String,
      default: 'white'
    },
    fixed: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    leftBack() {
      if (this.$route.query.isShare) { // 如果是分享出去的页面，点击回退按钮时跳转到首页
        this.$router.replace('/home.html');
        return false;
      }
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
      if(window.history.length < 3){ //解决部分机型拿不到history
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

<style lang="less" scoped>
.z-1000{
  z-index: 1000;
}
</style>
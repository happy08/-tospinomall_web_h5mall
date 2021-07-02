<template>
<!-- 导航栏 -->
  <van-nav-bar>
    <!-- 左侧内容 -->
    <template #left>
      <van-icon v-if="left.isShow" name="arrow-left" color="#000" size="18px" @click="leftBack"></van-icon>
    </template>
    <!-- 中间内容 -->
    <template #title>
      <h1 v-if="title" v-html="title" class="fs-18 black"></h1>
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
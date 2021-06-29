<template>
  <van-tabbar route>
    <van-tabbar-item replace to="/home" icon="home-o">Home</van-tabbar-item>
    <van-tabbar-item replace to="/categories" icon="search">Categories</van-tabbar-item>
    <van-tabbar-item replace to="/cart" icon="search">Cart</van-tabbar-item>
    <van-tabbar-item replace to="/me" icon="search">Me</van-tabbar-item>
  </van-tabbar>
</template>

<script>
import { Tabbar, TabbarItem } from 'vant';

export default {
  components: {
    vanTabbar: Tabbar,
    vanTabbarItem: TabbarItem
  }
}
</script>

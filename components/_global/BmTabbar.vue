<template>
  <van-tabbar route>
    <van-tabbar-item replace to="/home" icon="home-o">{{ $t('common.home') }}</van-tabbar-item>
    <van-tabbar-item replace to="/categories" icon="search">{{ $t('common.categories') }}</van-tabbar-item>
    <van-tabbar-item replace to="/cart" icon="search">{{ $t('common.cart') }}</van-tabbar-item>
    <van-tabbar-item replace to="/me" icon="search">{{ $t('common.me') }}</van-tabbar-item>
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

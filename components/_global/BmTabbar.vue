<template>
  <van-tabbar route active-color="#43B7AF" inactive-color="#B6B6B6">
    <van-tabbar-item replace :to="{ name: tabItem.name }" v-for="(tabItem, index) in tabs" :key="'tab-' + index">
      <template #icon="props">
        <img :src="props.active ? require('@/assets/images/icon/tab-' + tabItem.icon + '-active.png') : require('@/assets/images/icon/tab-' + tabItem.icon + '-normal.png')" />
      </template>
      {{ $t(tabItem.text) }}
    </van-tabbar-item>
  </van-tabbar>
</template>

<script>
import { Tabbar, TabbarItem } from 'vant';

export default {
  components: {
    vanTabbar: Tabbar,
    vanTabbarItem: TabbarItem
  },
  data() {
    return {
      tabs: [
        {
          name: 'home',
          text: 'common.home',
          icon: 'home'
        },
        {
          name: 'categories',
          text: 'common.categories',
          icon: 'categories'
        },
        {
          name: 'cart',
          text: 'common.cart',
          icon: 'cart'
        },
        {
          name: 'me',
          text: 'common.me',
          icon: 'me'
        }
      ]
    }
  }
}
</script>

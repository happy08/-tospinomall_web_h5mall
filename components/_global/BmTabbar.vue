<template>
  <van-tabbar active-color="#43B7AF" inactive-color="#B6B6B6" v-model="$route.name">
    <nuxt-link :to="tabItem.path" class="van-tabbar-item ws-nowrap" v-for="(tabItem, index) in tabs" :key="'tab-' + index">
    <!-- <van-tabbar-item v-for="(tabItem, index) in tabs" :key="'tab-' + index" class="ws-nowrap" :name="tabItem.name"> -->
      <!-- <template #icon="props"> -->
          <div class="van-tabbar-item__icon">
            <img :src="$route.path == tabItem.path ? require('@/assets/images/icon/tab-' + tabItem.icon + '-active.png') : require('@/assets/images/icon/tab-' + tabItem.icon + '-normal.png')" />
          </div>
      <!-- </template> -->
      <div :class="{'van-tabbar-item__text': true, 'green': $route.path == tabItem.path, 'grey': $route.path != tabItem.path}">{{ $t(tabItem.text) }}</div>
      
    <!-- </van-tabbar-item> -->
    </nuxt-link>
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
          path: '/home.html',
          text: 'home',
          icon: 'home'
        },
        {
          path: '/categories.html',
          text: 'categories',
          icon: 'categories'
        },
        {
          path: '/cart.html',
          text: 'cart',
          icon: 'cart'
        },
        {
          path: '/me.html',
          text: 'me',
          icon: 'me'
        }
      ]
    }
  }
}
</script>

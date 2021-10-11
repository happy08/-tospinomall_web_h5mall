<template>
  <van-tabbar active-color="#43B7AF" inactive-color="#B6B6B6" v-model="$route.name">
    <nuxt-link :to="{ name: tabItem.name }" class="van-tabbar-item ws-nowrap" v-for="(tabItem, index) in tabs" :key="'tab-' + index">
    <!-- <van-tabbar-item v-for="(tabItem, index) in tabs" :key="'tab-' + index" class="ws-nowrap" :name="tabItem.name"> -->
      <!-- <template #icon="props"> -->
          <div class="van-tabbar-item__icon">
            <img :src="$route.name == tabItem.name ? require('@/assets/images/icon/tab-' + tabItem.icon + '-active.png') : require('@/assets/images/icon/tab-' + tabItem.icon + '-normal.png')" />
          </div>
      <!-- </template> -->
      <div :class="{'van-tabbar-item__text': true, 'green': $route.name == tabItem.name, 'grey': $route.name != tabItem.name}">{{ $t(tabItem.text) }}</div>
      
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
          name: 'home',
          text: 'home',
          icon: 'home'
        },
        {
          name: 'categories',
          text: 'categories',
          icon: 'categories'
        },
        {
          name: 'cart',
          text: 'cart',
          icon: 'cart'
        },
        {
          name: 'me',
          text: 'me',
          icon: 'me'
        }
      ]
    }
  }
}
</script>

import Vue from 'vue'
import { wrapFunctional } from './utils'

const components = {
  EmptyStatus: () => import('../..\\components\\EmptyStatus.vue' /* webpackChunkName: "components/empty-status" */).then(c => wrapFunctional(c.default || c)),
  OrderSingle: () => import('../..\\components\\OrderSingle.vue' /* webpackChunkName: "components/order-single" */).then(c => wrapFunctional(c.default || c)),
  OrderStoreSingle: () => import('../..\\components\\OrderStoreSingle.vue' /* webpackChunkName: "components/order-store-single" */).then(c => wrapFunctional(c.default || c)),
  ProductSku: () => import('../..\\components\\ProductSku.vue' /* webpackChunkName: "components/product-sku" */).then(c => wrapFunctional(c.default || c)),
  ProductTopBtmSingle: () => import('../..\\components\\ProductTopBtmSingle.vue' /* webpackChunkName: "components/product-top-btm-single" */).then(c => wrapFunctional(c.default || c)),
  PullRefresh: () => import('../..\\components\\PullRefresh.vue' /* webpackChunkName: "components/pull-refresh" */).then(c => wrapFunctional(c.default || c)),
  SoldOut: () => import('../..\\components\\SoldOut.vue' /* webpackChunkName: "components/sold-out" */).then(c => wrapFunctional(c.default || c)),
  GlobalBmButton: () => import('../..\\components\\_global\\BmButton.vue' /* webpackChunkName: "components/global-bm-button" */).then(c => wrapFunctional(c.default || c)),
  GlobalBmHeaderNav: () => import('../..\\components\\_global\\BmHeaderNav.vue' /* webpackChunkName: "components/global-bm-header-nav" */).then(c => wrapFunctional(c.default || c)),
  GlobalBmIcon: () => import('../..\\components\\_global\\BmIcon.vue' /* webpackChunkName: "components/global-bm-icon" */).then(c => wrapFunctional(c.default || c)),
  GlobalBmImage: () => import('../..\\components\\_global\\BmImage.vue' /* webpackChunkName: "components/global-bm-image" */).then(c => wrapFunctional(c.default || c)),
  GlobalBmTabbar: () => import('../..\\components\\_global\\BmTabbar.vue' /* webpackChunkName: "components/global-bm-tabbar" */).then(c => wrapFunctional(c.default || c))
}

for (const name in components) {
  Vue.component(name, components[name])
  Vue.component('Lazy' + name, components[name])
}

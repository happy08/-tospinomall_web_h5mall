import { wrapFunctional } from './utils'

export { default as EmptyStatus } from '../..\\components\\EmptyStatus.vue'
export { default as OrderSingle } from '../..\\components\\OrderSingle.vue'
export { default as OrderStoreSingle } from '../..\\components\\OrderStoreSingle.vue'
export { default as ProductSku } from '../..\\components\\ProductSku.vue'
export { default as ProductTopBtmSingle } from '../..\\components\\ProductTopBtmSingle.vue'
export { default as PullRefresh } from '../..\\components\\PullRefresh.vue'
export { default as SoldOut } from '../..\\components\\SoldOut.vue'
export { default as GlobalBmButton } from '../..\\components\\_global\\BmButton.vue'
export { default as GlobalBmHeaderNav } from '../..\\components\\_global\\BmHeaderNav.vue'
export { default as GlobalBmIcon } from '../..\\components\\_global\\BmIcon.vue'
export { default as GlobalBmImage } from '../..\\components\\_global\\BmImage.vue'
export { default as GlobalBmTabbar } from '../..\\components\\_global\\BmTabbar.vue'

export const LazyEmptyStatus = import('../..\\components\\EmptyStatus.vue' /* webpackChunkName: "components/empty-status" */).then(c => wrapFunctional(c.default || c))
export const LazyOrderSingle = import('../..\\components\\OrderSingle.vue' /* webpackChunkName: "components/order-single" */).then(c => wrapFunctional(c.default || c))
export const LazyOrderStoreSingle = import('../..\\components\\OrderStoreSingle.vue' /* webpackChunkName: "components/order-store-single" */).then(c => wrapFunctional(c.default || c))
export const LazyProductSku = import('../..\\components\\ProductSku.vue' /* webpackChunkName: "components/product-sku" */).then(c => wrapFunctional(c.default || c))
export const LazyProductTopBtmSingle = import('../..\\components\\ProductTopBtmSingle.vue' /* webpackChunkName: "components/product-top-btm-single" */).then(c => wrapFunctional(c.default || c))
export const LazyPullRefresh = import('../..\\components\\PullRefresh.vue' /* webpackChunkName: "components/pull-refresh" */).then(c => wrapFunctional(c.default || c))
export const LazySoldOut = import('../..\\components\\SoldOut.vue' /* webpackChunkName: "components/sold-out" */).then(c => wrapFunctional(c.default || c))
export const LazyGlobalBmButton = import('../..\\components\\_global\\BmButton.vue' /* webpackChunkName: "components/global-bm-button" */).then(c => wrapFunctional(c.default || c))
export const LazyGlobalBmHeaderNav = import('../..\\components\\_global\\BmHeaderNav.vue' /* webpackChunkName: "components/global-bm-header-nav" */).then(c => wrapFunctional(c.default || c))
export const LazyGlobalBmIcon = import('../..\\components\\_global\\BmIcon.vue' /* webpackChunkName: "components/global-bm-icon" */).then(c => wrapFunctional(c.default || c))
export const LazyGlobalBmImage = import('../..\\components\\_global\\BmImage.vue' /* webpackChunkName: "components/global-bm-image" */).then(c => wrapFunctional(c.default || c))
export const LazyGlobalBmTabbar = import('../..\\components\\_global\\BmTabbar.vue' /* webpackChunkName: "components/global-bm-tabbar" */).then(c => wrapFunctional(c.default || c))

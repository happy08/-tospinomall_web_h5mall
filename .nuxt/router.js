import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _79d24bac = () => interopDefault(import('..\\pages\\cart\\index.vue' /* webpackChunkName: "pages/cart/index" */))
const _739419b0 = () => interopDefault(import('..\\pages\\categories\\index.vue' /* webpackChunkName: "pages/categories/index" */))
const _7944948d = () => interopDefault(import('..\\pages\\home\\index.vue' /* webpackChunkName: "pages/home/index" */))
const _c171d782 = () => interopDefault(import('..\\pages\\login\\index.vue' /* webpackChunkName: "pages/login/index" */))
const _28068eb4 = () => interopDefault(import('..\\pages\\me\\index.vue' /* webpackChunkName: "pages/me/index" */))
const _3e4d9749 = () => interopDefault(import('..\\pages\\register\\index.vue' /* webpackChunkName: "pages/register/index" */))
const _11428ba4 = () => interopDefault(import('..\\pages\\search\\index.vue' /* webpackChunkName: "pages/search/index" */))
const _6c36033e = () => interopDefault(import('..\\pages\\cart\\search.vue' /* webpackChunkName: "pages/cart/search" */))
const _2578a190 = () => interopDefault(import('..\\pages\\login\\code.vue' /* webpackChunkName: "pages/login/code" */))
const _084eb3ef = () => interopDefault(import('..\\pages\\me\\about.vue' /* webpackChunkName: "pages/me/about" */))
const _c22dd4da = () => interopDefault(import('..\\pages\\me\\account\\index.vue' /* webpackChunkName: "pages/me/account/index" */))
const _61b7f16c = () => interopDefault(import('..\\pages\\me\\address\\index.vue' /* webpackChunkName: "pages/me/address/index" */))
const _6ae70c5d = () => interopDefault(import('..\\pages\\me\\aftersale\\index.vue' /* webpackChunkName: "pages/me/aftersale/index" */))
const _b57783e2 = () => interopDefault(import('..\\pages\\me\\feedback\\index.vue' /* webpackChunkName: "pages/me/feedback/index" */))
const _51862801 = () => interopDefault(import('..\\pages\\me\\footprint\\index.vue' /* webpackChunkName: "pages/me/footprint/index" */))
const _16d4845c = () => interopDefault(import('..\\pages\\me\\language\\index.vue' /* webpackChunkName: "pages/me/language/index" */))
const _7a6f3bb8 = () => interopDefault(import('..\\pages\\me\\likes\\index.vue' /* webpackChunkName: "pages/me/likes/index" */))
const _594d5379 = () => interopDefault(import('..\\pages\\me\\message\\index.vue' /* webpackChunkName: "pages/me/message/index" */))
const _5b728f52 = () => interopDefault(import('..\\pages\\me\\order\\index.vue' /* webpackChunkName: "pages/me/order/index" */))
const _c5d0e190 = () => interopDefault(import('..\\pages\\me\\pay\\index.vue' /* webpackChunkName: "pages/me/pay/index" */))
const _b475a0ca = () => interopDefault(import('..\\pages\\me\\wallet\\index.vue' /* webpackChunkName: "pages/me/wallet/index" */))
const _58746ae4 = () => interopDefault(import('..\\pages\\register\\changePwd.vue' /* webpackChunkName: "pages/register/changePwd" */))
const _585c1274 = () => interopDefault(import('..\\pages\\register\\password.vue' /* webpackChunkName: "pages/register/password" */))
const _3f674b36 = () => interopDefault(import('..\\pages\\register\\result.vue' /* webpackChunkName: "pages/register/result" */))
const _65416648 = () => interopDefault(import('..\\pages\\cart\\order\\confirm.vue' /* webpackChunkName: "pages/cart/order/confirm" */))
const _370e2663 = () => interopDefault(import('..\\pages\\cart\\store\\search.vue' /* webpackChunkName: "pages/cart/store/search" */))
const _7602faf6 = () => interopDefault(import('..\\pages\\me\\account\\bind\\index.vue' /* webpackChunkName: "pages/me/account/bind/index" */))
const _94ad4be2 = () => interopDefault(import('..\\pages\\me\\account\\security.vue' /* webpackChunkName: "pages/me/account/security" */))
const _5e77d148 = () => interopDefault(import('..\\pages\\me\\account\\userinfo.vue' /* webpackChunkName: "pages/me/account/userinfo" */))
const _7cdc9eb6 = () => interopDefault(import('..\\pages\\me\\account\\username.vue' /* webpackChunkName: "pages/me/account/username" */))
const _56fb3a0c = () => interopDefault(import('..\\pages\\me\\account\\verify\\index.vue' /* webpackChunkName: "pages/me/account/verify/index" */))
const _ef99e62e = () => interopDefault(import('..\\pages\\me\\account\\verifymethod.vue' /* webpackChunkName: "pages/me/account/verifymethod" */))
const _1f314f50 = () => interopDefault(import('..\\pages\\me\\address\\areacode.vue' /* webpackChunkName: "pages/me/address/areacode" */))
const _6a5f65b0 = () => interopDefault(import('..\\pages\\me\\address\\country.vue' /* webpackChunkName: "pages/me/address/country" */))
const _a7914b78 = () => interopDefault(import('..\\pages\\me\\address\\make.vue' /* webpackChunkName: "pages/me/address/make" */))
const _29717d2e = () => interopDefault(import('..\\pages\\me\\aftersale\\apply\\index.vue' /* webpackChunkName: "pages/me/aftersale/apply/index" */))
const _917505a0 = () => interopDefault(import('..\\pages\\me\\feedback\\result.vue' /* webpackChunkName: "pages/me/feedback/result" */))
const _5f200cf2 = () => interopDefault(import('..\\pages\\me\\order\\rate\\index.vue' /* webpackChunkName: "pages/me/order/rate/index" */))
const _723d5766 = () => interopDefault(import('..\\pages\\me\\order\\result.vue' /* webpackChunkName: "pages/me/order/result" */))
const _82c39750 = () => interopDefault(import('..\\pages\\me\\order\\search.vue' /* webpackChunkName: "pages/me/order/search" */))
const _5ce60774 = () => interopDefault(import('..\\pages\\me\\pay\\bank.vue' /* webpackChunkName: "pages/me/pay/bank" */))
const _5eda595a = () => interopDefault(import('..\\pages\\me\\pay\\changePwd.vue' /* webpackChunkName: "pages/me/pay/changePwd" */))
const _0ca06377 = () => interopDefault(import('..\\pages\\me\\pay\\code.vue' /* webpackChunkName: "pages/me/pay/code" */))
const _66070732 = () => interopDefault(import('..\\pages\\me\\pay\\confirmPwd.vue' /* webpackChunkName: "pages/me/pay/confirmPwd" */))
const _09a76025 = () => interopDefault(import('..\\pages\\me\\pay\\password.vue' /* webpackChunkName: "pages/me/pay/password" */))
const _4880e2ec = () => interopDefault(import('..\\pages\\me\\pay\\payment.vue' /* webpackChunkName: "pages/me/pay/payment" */))
const _5c1c067f = () => interopDefault(import('..\\pages\\me\\pay\\payPwd.vue' /* webpackChunkName: "pages/me/pay/payPwd" */))
const _8c475db2 = () => interopDefault(import('..\\pages\\me\\pay\\result.vue' /* webpackChunkName: "pages/me/pay/result" */))
const _4efc42ff = () => interopDefault(import('..\\pages\\me\\pay\\wait.vue' /* webpackChunkName: "pages/me/pay/wait" */))
const _519c8cf4 = () => interopDefault(import('..\\pages\\me\\wallet\\bill\\index.vue' /* webpackChunkName: "pages/me/wallet/bill/index" */))
const _82c0c5a2 = () => interopDefault(import('..\\pages\\me\\wallet\\search.vue' /* webpackChunkName: "pages/me/wallet/search" */))
const _0a4cf00e = () => interopDefault(import('..\\pages\\me\\account\\bind\\code.vue' /* webpackChunkName: "pages/me/account/bind/code" */))
const _bfb05708 = () => interopDefault(import('..\\pages\\me\\account\\bind\\rebind.vue' /* webpackChunkName: "pages/me/account/bind/rebind" */))
const _034345ae = () => interopDefault(import('..\\pages\\me\\account\\bind\\result.vue' /* webpackChunkName: "pages/me/account/bind/result" */))
const _dae9e116 = () => interopDefault(import('..\\pages\\me\\account\\verify\\code.vue' /* webpackChunkName: "pages/me/account/verify/code" */))
const _6fcbf5a5 = () => interopDefault(import('..\\pages\\me\\account\\verify\\result.vue' /* webpackChunkName: "pages/me/account/verify/result" */))
const _68ecb568 = () => interopDefault(import('..\\pages\\me\\account\\verify\\verifypwd.vue' /* webpackChunkName: "pages/me/account/verify/verifypwd" */))
const _787a5c22 = () => interopDefault(import('..\\pages\\me\\order\\detail\\logistics.vue' /* webpackChunkName: "pages/me/order/detail/logistics" */))
const _d18a7982 = () => interopDefault(import('..\\pages\\me\\order\\rate\\detail\\list.vue' /* webpackChunkName: "pages/me/order/rate/detail/list" */))
const _138f196c = () => interopDefault(import('..\\pages\\me\\aftersale\\proof\\detail\\_id.vue' /* webpackChunkName: "pages/me/aftersale/proof/detail/_id" */))
const _22b15329 = () => interopDefault(import('..\\pages\\me\\order\\rate\\detail\\_id.vue' /* webpackChunkName: "pages/me/order/rate/detail/_id" */))
const _f3daba06 = () => interopDefault(import('..\\pages\\me\\order\\rate\\evalution\\_id.vue' /* webpackChunkName: "pages/me/order/rate/evalution/_id" */))
const _c69c34b4 = () => interopDefault(import('..\\pages\\me\\order\\rate\\report\\_id.vue' /* webpackChunkName: "pages/me/order/rate/report/_id" */))
const _566d2a5e = () => interopDefault(import('..\\pages\\cart\\store\\detail\\_id.vue' /* webpackChunkName: "pages/cart/store/detail/_id" */))
const _735c70b4 = () => interopDefault(import('..\\pages\\cart\\store\\product\\_id.vue' /* webpackChunkName: "pages/cart/store/product/_id" */))
const _0f0335a0 = () => interopDefault(import('..\\pages\\me\\aftersale\\apply\\_type.vue' /* webpackChunkName: "pages/me/aftersale/apply/_type" */))
const _3337d654 = () => interopDefault(import('..\\pages\\me\\aftersale\\detail\\_id.vue' /* webpackChunkName: "pages/me/aftersale/detail/_id" */))
const _77590584 = () => interopDefault(import('..\\pages\\me\\aftersale\\negotiation\\_id.vue' /* webpackChunkName: "pages/me/aftersale/negotiation/_id" */))
const _4433160a = () => interopDefault(import('..\\pages\\me\\aftersale\\proof\\_id.vue' /* webpackChunkName: "pages/me/aftersale/proof/_id" */))
const _1dd2fc24 = () => interopDefault(import('..\\pages\\me\\aftersale\\tracking\\_id.vue' /* webpackChunkName: "pages/me/aftersale/tracking/_id" */))
const _59a96ea3 = () => interopDefault(import('..\\pages\\me\\message\\category\\_id.vue' /* webpackChunkName: "pages/me/message/category/_id" */))
const _4c1ee4ee = () => interopDefault(import('..\\pages\\me\\order\\detail\\_id.vue' /* webpackChunkName: "pages/me/order/detail/_id" */))
const _21113c5c = () => interopDefault(import('..\\pages\\me\\wallet\\bill\\_id.vue' /* webpackChunkName: "pages/me/wallet/bill/_id" */))
const _4408477c = () => interopDefault(import('..\\pages\\cart\\order\\_id.vue' /* webpackChunkName: "pages/cart/order/_id" */))
const _5e195441 = () => interopDefault(import('..\\pages\\cart\\product\\_id.vue' /* webpackChunkName: "pages/cart/product/_id" */))
const _8204ffe2 = () => interopDefault(import('..\\pages\\cart\\store\\_id.vue' /* webpackChunkName: "pages/cart/store/_id" */))
const _c3e20066 = () => interopDefault(import('..\\pages\\search\\similar\\_id.vue' /* webpackChunkName: "pages/search/similar/_id" */))
const _42bf0c8c = () => interopDefault(import('..\\pages\\service\\_type.vue' /* webpackChunkName: "pages/service/_type" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/cart",
    component: _79d24bac,
    name: "cart"
  }, {
    path: "/categories",
    component: _739419b0,
    name: "categories"
  }, {
    path: "/home",
    component: _7944948d,
    name: "home"
  }, {
    path: "/login",
    component: _c171d782,
    name: "login"
  }, {
    path: "/me",
    component: _28068eb4,
    name: "me"
  }, {
    path: "/register",
    component: _3e4d9749,
    name: "register"
  }, {
    path: "/search",
    component: _11428ba4,
    name: "search"
  }, {
    path: "/cart/search",
    component: _6c36033e,
    name: "cart-search"
  }, {
    path: "/login/code",
    component: _2578a190,
    name: "login-code"
  }, {
    path: "/me/about",
    component: _084eb3ef,
    name: "me-about"
  }, {
    path: "/me/account",
    component: _c22dd4da,
    name: "me-account"
  }, {
    path: "/me/address",
    component: _61b7f16c,
    name: "me-address"
  }, {
    path: "/me/aftersale",
    component: _6ae70c5d,
    name: "me-aftersale"
  }, {
    path: "/me/feedback",
    component: _b57783e2,
    name: "me-feedback"
  }, {
    path: "/me/footprint",
    component: _51862801,
    name: "me-footprint"
  }, {
    path: "/me/language",
    component: _16d4845c,
    name: "me-language"
  }, {
    path: "/me/likes",
    component: _7a6f3bb8,
    name: "me-likes"
  }, {
    path: "/me/message",
    component: _594d5379,
    name: "me-message"
  }, {
    path: "/me/order",
    component: _5b728f52,
    name: "me-order"
  }, {
    path: "/me/pay",
    component: _c5d0e190,
    name: "me-pay"
  }, {
    path: "/me/wallet",
    component: _b475a0ca,
    name: "me-wallet"
  }, {
    path: "/register/changePwd",
    component: _58746ae4,
    name: "register-changePwd"
  }, {
    path: "/register/password",
    component: _585c1274,
    name: "register-password"
  }, {
    path: "/register/result",
    component: _3f674b36,
    name: "register-result"
  }, {
    path: "/cart/order/confirm",
    component: _65416648,
    name: "cart-order-confirm"
  }, {
    path: "/cart/store/search",
    component: _370e2663,
    name: "cart-store-search"
  }, {
    path: "/me/account/bind",
    component: _7602faf6,
    name: "me-account-bind"
  }, {
    path: "/me/account/security",
    component: _94ad4be2,
    name: "me-account-security"
  }, {
    path: "/me/account/userinfo",
    component: _5e77d148,
    name: "me-account-userinfo"
  }, {
    path: "/me/account/username",
    component: _7cdc9eb6,
    name: "me-account-username"
  }, {
    path: "/me/account/verify",
    component: _56fb3a0c,
    name: "me-account-verify"
  }, {
    path: "/me/account/verifymethod",
    component: _ef99e62e,
    name: "me-account-verifymethod"
  }, {
    path: "/me/address/areacode",
    component: _1f314f50,
    name: "me-address-areacode"
  }, {
    path: "/me/address/country",
    component: _6a5f65b0,
    name: "me-address-country"
  }, {
    path: "/me/address/make",
    component: _a7914b78,
    name: "me-address-make"
  }, {
    path: "/me/aftersale/apply",
    component: _29717d2e,
    name: "me-aftersale-apply"
  }, {
    path: "/me/feedback/result",
    component: _917505a0,
    name: "me-feedback-result"
  }, {
    path: "/me/order/rate",
    component: _5f200cf2,
    name: "me-order-rate"
  }, {
    path: "/me/order/result",
    component: _723d5766,
    name: "me-order-result"
  }, {
    path: "/me/order/search",
    component: _82c39750,
    name: "me-order-search"
  }, {
    path: "/me/pay/bank",
    component: _5ce60774,
    name: "me-pay-bank"
  }, {
    path: "/me/pay/changePwd",
    component: _5eda595a,
    name: "me-pay-changePwd"
  }, {
    path: "/me/pay/code",
    component: _0ca06377,
    name: "me-pay-code"
  }, {
    path: "/me/pay/confirmPwd",
    component: _66070732,
    name: "me-pay-confirmPwd"
  }, {
    path: "/me/pay/password",
    component: _09a76025,
    name: "me-pay-password"
  }, {
    path: "/me/pay/payment",
    component: _4880e2ec,
    name: "me-pay-payment"
  }, {
    path: "/me/pay/payPwd",
    component: _5c1c067f,
    name: "me-pay-payPwd"
  }, {
    path: "/me/pay/result",
    component: _8c475db2,
    name: "me-pay-result"
  }, {
    path: "/me/pay/wait",
    component: _4efc42ff,
    name: "me-pay-wait"
  }, {
    path: "/me/wallet/bill",
    component: _519c8cf4,
    name: "me-wallet-bill"
  }, {
    path: "/me/wallet/search",
    component: _82c0c5a2,
    name: "me-wallet-search"
  }, {
    path: "/me/account/bind/code",
    component: _0a4cf00e,
    name: "me-account-bind-code"
  }, {
    path: "/me/account/bind/rebind",
    component: _bfb05708,
    name: "me-account-bind-rebind"
  }, {
    path: "/me/account/bind/result",
    component: _034345ae,
    name: "me-account-bind-result"
  }, {
    path: "/me/account/verify/code",
    component: _dae9e116,
    name: "me-account-verify-code"
  }, {
    path: "/me/account/verify/result",
    component: _6fcbf5a5,
    name: "me-account-verify-result"
  }, {
    path: "/me/account/verify/verifypwd",
    component: _68ecb568,
    name: "me-account-verify-verifypwd"
  }, {
    path: "/me/order/detail/logistics",
    component: _787a5c22,
    name: "me-order-detail-logistics"
  }, {
    path: "/me/order/rate/detail/list",
    component: _d18a7982,
    name: "me-order-rate-detail-list"
  }, {
    path: "/me/aftersale/proof/detail/:id?",
    component: _138f196c,
    name: "me-aftersale-proof-detail-id"
  }, {
    path: "/me/order/rate/detail/:id?",
    component: _22b15329,
    name: "me-order-rate-detail-id"
  }, {
    path: "/me/order/rate/evalution/:id?",
    component: _f3daba06,
    name: "me-order-rate-evalution-id"
  }, {
    path: "/me/order/rate/report/:id?",
    component: _c69c34b4,
    name: "me-order-rate-report-id"
  }, {
    path: "/cart/store/detail/:id?",
    component: _566d2a5e,
    name: "cart-store-detail-id"
  }, {
    path: "/cart/store/product/:id?",
    component: _735c70b4,
    name: "cart-store-product-id"
  }, {
    path: "/me/aftersale/apply/:type",
    component: _0f0335a0,
    name: "me-aftersale-apply-type"
  }, {
    path: "/me/aftersale/detail/:id?",
    component: _3337d654,
    name: "me-aftersale-detail-id"
  }, {
    path: "/me/aftersale/negotiation/:id?",
    component: _77590584,
    name: "me-aftersale-negotiation-id"
  }, {
    path: "/me/aftersale/proof/:id?",
    component: _4433160a,
    name: "me-aftersale-proof-id"
  }, {
    path: "/me/aftersale/tracking/:id?",
    component: _1dd2fc24,
    name: "me-aftersale-tracking-id"
  }, {
    path: "/me/message/category/:id?",
    component: _59a96ea3,
    name: "me-message-category-id"
  }, {
    path: "/me/order/detail/:id?",
    component: _4c1ee4ee,
    name: "me-order-detail-id"
  }, {
    path: "/me/wallet/bill/:id",
    component: _21113c5c,
    name: "me-wallet-bill-id"
  }, {
    path: "/cart/order/:id?",
    component: _4408477c,
    name: "cart-order-id"
  }, {
    path: "/cart/product/:id?",
    component: _5e195441,
    name: "cart-product-id"
  }, {
    path: "/cart/store/:id?",
    component: _8204ffe2,
    name: "cart-store-id"
  }, {
    path: "/search/similar/:id?",
    component: _c3e20066,
    name: "search-similar-id"
  }, {
    path: "/service/:type?",
    component: _42bf0c8c,
    name: "service-type"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}

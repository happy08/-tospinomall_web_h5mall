import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
  // 如果想要等到 nuxt 加载完毕
  // 再执行代码, 有一个函数叫做 window.onNuxtReady()
  // window.onNuxtReady(() => {
    createPersistedState({
      // 在这里其实, 是想要将 vuex 数据存放到 localStorage 里面
      key: 'b2c-store'
    })(store)
  // })
}
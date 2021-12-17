// 路由守卫
export default ({app, store, redirect}) => {
  
  app.router.beforeEach((to, from, next) => {
    // 白名单
    const whiteList = [ 'login', 'login-old', 'login-code', 'login-code-old', 'register', 'register-changePwd', 'register-password' ];
    // 缓存中有身份token直接赋值store中
    if (app.$cookies && app.$cookies.get('authToken')) {
      store.commit('user/SET_TOKEN', app.$cookies.get('authToken'));
    }
    // 如果已经登录就不应该访问登录注册页面
    if (store.state.user.authToken) {
      if (whiteList.includes(to.name) && history) { // 已登录就可以不访问了
        history.go(-1);
      }
    }
    
    // 如果输入的路由不存在跳回首页
    if (to.name === null && to.path != '/payment-middle.html' && to.path != '/service.html') {
      redirect({
        path: '/home.html'
      });
    }
    next();
  })
};
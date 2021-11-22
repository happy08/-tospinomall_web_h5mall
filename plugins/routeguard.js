// 路由守卫
export default ({app, store, redirect}) => {

  app.router.beforeEach((to, from, next) => {
    // 白名单
    const whiteList = [ 'login', 'login-old', 'login-code', 'login-code-old', 'register', 'register-changePwd', 'register-password' ];
    // 如果已经登录就不应该访问登录注册页面
    if (store.state.user.authToken) {
      if (whiteList.includes(to.name) && history) { // 已登录就可以不访问了
        history.go(-1);
      }
    }
    
    // 如果输入的路由不存在跳回首页
    if (to.name === null) {
      redirect({
        path: '/home.html'
      });
    }
    next();
  })
};
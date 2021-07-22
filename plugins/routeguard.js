// 路由守卫
export default ({app, store, redirect}) => {

  app.router.beforeEach((to, from, next) => {
    // 白名单
    const whiteList = [ 'login', 'login-code', 'register', 'register-changePwd', 'register-password', 'register-result' ];
    // 如果已经登录就不应该访问登录注册页面
    // if (store.state.user.token) {
    //   if (whiteList.includes(to.name)) { // 已登录就可以不访问了
    //     redirect({
    //       name: 'home'
    //     })
    //   }
    // }
    
    // 如果输入的路由不存在跳回首页
    if (to.name === null) {
      redirect({
        name: 'home'
      });
    }
    next();
  })
};
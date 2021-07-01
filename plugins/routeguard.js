// 路由守卫
export default ({app, store, redirect}) => {
  // 如果已经登录就不应该访问登录注册页面
  if (store.state.user.token) {
  }

  app.router.beforeEach((to, from, next) => {
    // 如果输入的路由不存在跳回首页
    if (to.name === null) {
      redirect({
        name: 'home'
      });
    }
    next();
  })
};
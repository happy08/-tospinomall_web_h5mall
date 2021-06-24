// 路由守卫
export default ({app, store, redirect}) => {
  app.router.beforeEach((to, from, next) => {
    // 判断是否登录
    if (!store.state.token) {
      redirect('/login');
    }
    // 如果输入的路由不存在跳回首页
    if (to.name == null) {
      redirect('/home');
    }
    next();
  })
};
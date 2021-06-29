// 路由守卫
export default ({app, store, redirect}) => {
  app.router.beforeEach((to, from, next) => {
    // 如果输入的路由不存在跳回首页
    if (to.name == null) {
      redirect({
        name: 'home'
      });
    }
    next();
  })
};
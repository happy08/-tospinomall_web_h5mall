// 登录页面需要
export default function ({ store, redirect }) {
  // 如果没有用户的token,则跳转到登录页面
  console.log('权限验证')
  console.log(store.state.user.authToken)
  if (!store.state.user.authToken) {
    return redirect('/login');
  }
}
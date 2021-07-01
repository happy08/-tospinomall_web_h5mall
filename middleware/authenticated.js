// 登录页面需要
export default function ({ store, redirect }) {
  // 如果没有用户的token,则跳转到登录页面
  if (!store.state.user.token) {
    return redirect('/login');
  }
}
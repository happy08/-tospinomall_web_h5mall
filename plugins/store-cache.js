export default function(ctx) {
  //离开页面 刷新前 将store中的数据存到localStorage
  window.addEventListener('beforeunload', () => {
    localStorage.setItem('b2cH5StoreCache', JSON.stringify(ctx.store.state))
  });
  // 获取localStorage中的store数据
  let b2cH5StoreCache = localStorage.getItem('b2cH5StoreCache')
  if (b2cH5StoreCache) {
    // 将localStorage中的store数据替换到store中
    ctx.store.replaceState(JSON.parse(b2cH5StoreCache));
  }
}
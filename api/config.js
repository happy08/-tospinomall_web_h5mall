//测试配置
const development = {
  DOMAIN_API: 'http://192.168.2.34:9999', //请求地址
  PATH_API: '', //接口路径  api/
  VERSION_API: '', //版本
  DOMAIN_LOGIN: 'http://192.168.2.35:19999'
};

//线上配置
const production = {
  DOMAIN_API: 'https://tospinomallapi.fyynet.com', //请求地址
  PATH_API: '', //接口路径  api/
  VERSION_API: '', //版本
  DOMAIN_LOGIN: 'https://tospinomallapi.fyynet.com' //https://auth.fyynet.com //登录、退出登录、刷新token、第三方登录接口地址
};

const isDev = process.env.NODE_ENV === 'development';
let config = {};
if (isDev) config = development;
else config = production;

let url = config.DOMAIN_API + config.PATH_API + config.VERSION_API;
let urlLogin = config.DOMAIN_LOGIN + config.PATH_API + config.VERSION_API;
if (isDev) {
  url = '/api';
  urlLogin = '/apiLogin';
} //跨域代理

export { url, urlLogin };

//导出配置
export default config;

//测试配置
const development = {
  DOMAIN_API: "http://www.test.net", //请求地址
  PATH_API: "", //接口路径  api/
  VERSION_API: "" //版本
};

//线上配置
const production = {
  DOMAIN_API: "https://tospinomallapi.fyynet.com", //请求地址
  PATH_API: "", //接口路径  api/
  VERSION_API: "" //版本
};

const isDev = process.env.NODE_ENV === "development";
let config = {};
if (isDev) config = development;
else config = production;

let url = config.DOMAIN_API + config.PATH_API + config.VERSION_API;
if (isDev) url = ""; //跨域代理

export { url };

//导出配置
export default config;

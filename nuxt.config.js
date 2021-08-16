export default {
  server: {
    host: '0.0.0.0',
    port: 8000
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "Tospino",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" },
      { hid: "description", name: "description", content: "Tospino Ghana online shopping" },
      { hid: 'keywords', name: 'keywords', content: 'Tospino Ghana online shopping' }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    script: [
      { src: "/js/rem.js", type: "text/javascript", charset: "utf-8" },
      { src: "/js/iconfont.js", type: "text/javascript", charset: "utf-8" }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    "@/assets/css/index.less",
    //"vant/lib/index.css"
  ],

  router: {
    //路由配置
    middleware: ["vue-i18n"] //路由中间件
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    "@/plugins/global-components",
    "@/plugins/vant",
    "@/api/index",
    "@/api/axios",
    "@/plugins/vue-i18n",
    { src: "@/plugins/utils", ssr: false },
    "@/plugins/routeguard.js",
    "@/plugins/swiper.js",
    { src: '@/plugins/vconsole', ssr: false }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    "cookie-universal-nuxt",
    // https://go.nuxtjs.dev/pwa
    "@nuxtjs/pwa"
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    proxy: true, // 开启代理
    prefix: "/api" // 请求url加个前缀 /api
    // credentials: true // 跨域请求时是否需要使用凭证
  },

  proxy: {
    "/api": {
      target: "http://192.168.2.34:9999", //120.78.145.142
      // target: "http://192.168.2.70:9999",
      // target: "https://tospinomallapi.fyynet.com",
      // target: "http://192.168.2.35:9999",
      //target: "http://120.78.145.142:9999",
      pathRewrite: {
        "^/api": "/"
      }
    }
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: "en"
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/vant.*?less/],
    //vant按需引入
    babel: {
      plugins: [
        [
          "import",
          {
            libraryName: "vant",
            style: name => {
              return `${name}/style/less`;
            }
          },
          "vant"
        ]
      ]
    },
    loaders: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          hack: `true; @import "/assets/css/vant-variables.less";`
        }
      }
    },
    postcss: [
      require("postcss-px2rem")({
        remUnit: 50
      })
    ]
  },
  loading: false, // 加载进度条
  resourceHints: false, // 资源提示,加快初始页面加载时间
};

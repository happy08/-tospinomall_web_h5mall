const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin'); // 打包删除注释

export default {
  server: {
    host: '0.0.0.0',
    port: 8000
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'TospinoMall',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, viewport-fit=cover, user-scalable=0' },
      { hid: 'description', name: 'description', content: 'TospinoMall Ghana online shopping' },
      { hid: 'keywords', name: 'keywords', content: 'TospinoMall Ghana online shopping' },
      { name: 'google-signin-scope', content: 'profile email' },
      { hid: 'og:title', property: 'og:title', content: 'TospinoMall Ghana online shopping' },
      { hid: 'og:description', property: 'og:description', content: 'TospinoMall Ghana online shopping' },
      { hid: 'og:image', property: 'og:image', content: '/logo.png' },
      { name: 'facebook-domain-verification', content: 'tpeeavo6b4l7jb9wzm9r7gfgyd8vt4' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      { src: '/js/rem.js', type: 'text/javascript', charset: 'utf-8' },
      { src: '/js/iconfont.js', type: 'text/javascript', charset: 'utf-8' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/css/index.less',
    //'vant/lib/index.css'
  ],

  router: {
    //路由配置
    middleware: ['vue-i18n'], //路由中间件
    extendRoutes(routes, resolve) {
      let oldRoutes = [];
      routes.forEach(ele => {
        let path = ele.path;
        if (ele.name == 'login' || ele.name == 'home' || ele.name == 'cart' || ele.name == 'categories' || ele.name == 'me' || ele.name == 'product-id') {
          // 因为要加.html如果路由名一样则会出现路由警告，所以原始的路由名改个名，通过name跳转时就跳转到有.html的路径
          oldRoutes.push({ 
            ...ele,
            name: ele.name + '-old'
          })
          ele.path = path + '.html';
        }
      })
      routes.push(...oldRoutes);
    }
  },

  env: {
    APP_ENV: process.env.APP_ENV,
    APP_MODE: process.env.APP_MODE
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/global-components',
    '@/plugins/vant',
    '@/api/index',
    '@/api/axios',
    '@/plugins/vue-i18n',
    { src: '@/plugins/utils', ssr: false },
    '@/plugins/routeguard.js',
    // { src: '@/plugins/vconsole', ssr: false },
    { src: '@/plugins/vue-masonry', ssr: false }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    'cookie-universal-nuxt',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    proxy: true, // 开启代理
    prefix: '' // 请求url加个前缀 /api
    // credentials: true // 跨域请求时是否需要使用凭证
  },

  proxy: {
    //登录、退出登录、刷新token、第三方登录接口地址
    '/apiLogin': {
      target: 'https://auth.fyynet.com',
      // target: 'http://192.168.2.35:19999',
      pathRewrite: {
        '^/apiLogin': '/'
      }
    },
    // '/api/order/pay/order': {
    //   // target: 'http://192.168.2.34:9999', //120.78.145.142
    //   // target: 'http://192.168.2.70:9999',
    //   // target: 'https://tospinomallapi.fyynet.com',
    //   // target: 'http://192.168.2.35:9999',
    //   //target: 'http://120.78.145.142:9999',
    //   target: 'http://rnzsgf7l.dongtaiyuming.net',
    //   pathRewrite: {
    //     '^/api/order/pay/order': '/order/pay/order'
    //   }
    // },
    '/api': {
      // target: 'http://192.168.2.34:9999', //120.78.145.142
      // target: 'http://192.168.2.70:9999',
      target: 'https://tospinomallapi.fyynet.com',
      // target: 'http://192.168.2.35:9999',
      //target: 'http://120.78.145.142:9999',
      // target: 'http://rnzsgf7l.dongtaiyuming.net',
      pathRewrite: {
        '^/api': '/'
      }
    },
    "/brij": {
      target: "https://staging.orobo.site",
      pathRewrite: {
          "^/brij": "/"
      }
    },
    "/theteller": {
      target: "https://prod.theteller.net",
      pathRewrite: {
          "^/theteller": "/"
      }
    },
    "/payswitch": {
      target: "https://test.theteller.net",
      pathRewrite: {
          "^/payswitch": "/"
      }
    },
    '/tingg': {
      target: 'https://developer.tingg.africa',
      pathRewrite: {
        "^/tingg": "/"
      }
    }
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
      name: 'TospinoMall',
      short_name: 'TospinoMall'
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/vant.*?less/],
    //vant按需引入
    babel: {
      plugins: [
        [
          'import',
          {
            libraryName: 'vant',
            style: name => {
              return `${name}/style/less`;
            }
          },
          'vant'
        ]
      ]
    },
    loaders: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          hack: `true; @import '/assets/css/vant-variables.less';`
        }
      }
    },
    postcss: [
      require('postcss-px2rem')({
        remUnit: 50
      })
    ],
    vendor: ['vant', 'axios'],
    analyze: false,
    productionSourceMap: false,
    productionGzip: true,
    productionGzipExtensions: ['js', 'css', 'svg'],
    plugins: [
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en-gb/), // 只打包英文語言
      new CompressionPlugin({
        test: /\.js$|\.html$|\.css/, // 匹配文件名
        threshold: 10240, // 对超过10kb的数据进行压缩
        deleteOriginalAssets: false // 是否删除原文件
      })
    ],
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
      splitChunks: {
        minSize: 10000,
        maxSize: 450000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/](swiper|vue-awesome-swiper)[\\/]/,
            name: 'vendor-swiper',
            chunks: 'all',
          },
          moment: {
            test: /[\\/]node_modules[\\/](moment)[\\/]/,
            name: 'vendor-moment',
            chunks: 'all',
          },
          vant: {
            test: /[\\/]node_modules[\\/](vant)[\\/]/,
            name: 'vendor-vant',
            chunks: 'all',
          },
          clipboard: {
            test: /[\\/]node_modules[\\/](clipboard)[\\/]/,
            name: 'vendor-clipboard',
            chunks: 'all',
          }
        }
      }
    }
  },
  loading: false, // 加载进度条
  resourceHints: false, // 资源提示,加快初始页面加载时间
  // render: { // 预加载
  //   resourceHints: false
  // }
};

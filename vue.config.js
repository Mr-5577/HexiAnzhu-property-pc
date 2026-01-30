const px2rem = require('postcss-px2rem')

const postcss = px2rem({
  remUnit: 20 //基准大小 baseSize，需要和rem.js中相同
})

module.exports = {
  lintOnSave: true,
  publicPath: "/web",
  outputDir: "web",
  devServer: {
    proxy: {
      // 黄接口
      // "/api": {
      //   target: "http://192.168.160.204:8098",
      //   ws: true,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     "^/api": "" //重写接口访问
      //   }
      // },
      // "/api": {
      //   target: "http://192.168.180.142:8088",
      //   ws: true,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     "^/api": "" //重写接口访问
      //   }
      // },
      // 测试服务器
      "/api": {
        // target: "http://vpn.ygddzy.cn:16010",
        target: "http://192.168.20.200:8088", // 本地-地址
        // target: "http://wyapinp.hexianzhu.cn:8803", // 测试-地址
        // target: "https://wynp.hexianzhu.cn", // 正式-地址
        ws: true,
        changeOrigin: true,
        // pathRewrite: {
        //   "^/api": "" //重写接口访问
        // }
        pathRewrite: {
          // 处理各种可能的 .api 变体
          "^/api/(.*)\\.api$": "/$1",        // /api/xxx.api -> /xxx
          "^/api/(.*)\\.api\\?(.*)$": "/$1?$2", // /api/xxx.api?param=1 -> /xxx?param=1
          "^/api": "/"                       // 其他普通 /api 请求
        },
      },
    }
  },
  pages: {
    index: {
      entry: "src/main.js",
      template: "public/index.html",
      filename: "index.html"
    },
    receipt: {
      entry: "src/h5/receipt/receipt.js",
      template: "src/h5/receipt/receipt.html",
      filename: "receipt.html",
    },
    invoice: {
      entry: "src/h5/invoice/invoice.js",
      template: "src/h5/invoice/invoice.html",
      filename: "invoice.html",
    }
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          postcss
        ]
      }
    }
  },
  
  productionSourceMap: false, 
  filenameHashing: true,
  configureWebpack: config => {
    if (process.env.NODE_ENV === "production") {
      // 为生产环境修改配置...
      config.mode = "production";
      config["performance"] = {
        //打包文件大小配置
        maxEntrypointSize: 10000000,
        maxAssetSize: 30000000
      };
    }
  }
};

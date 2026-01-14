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
        target: "http://vpn.ygddzy.cn:16010",
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "" //重写接口访问
        }
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

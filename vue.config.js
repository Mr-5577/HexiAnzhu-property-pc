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
        target: "http://192.168.1.200:8082", // 本地-地址
        // target: "http://wyapinp.hexianzhu.cn:8803", // 测试-地址
        // target: "http://wy.hexianzhu.cn", // 正式-地址
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
      // 固定收据页面的chunk名称
      chunks: ['receipt']
    },
    invoice: {
      entry: "src/h5/invoice/invoice.js",
      template: "src/h5/invoice/invoice.html",
      filename: "invoice.html",
      // 固定发票页面的chunk名称
      chunks: ['invoice']
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
      config.output = {
        ...config.output,
        // 强制chunk固定命名格式，杜绝undefined哈希
        chunkFilename: 'js/[name].[contenthash:8].js'
      }
    }
  },
  chainWebpack: (config) => {
    // 分割chunk稳定哈希，缓存友好
    config.optimization.splitChunks({
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'chunk-vendors',
          chunks: 'all'
        },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          chunks: 'all'
        }
      }
    })
  }
};

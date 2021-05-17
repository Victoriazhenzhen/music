module.exports = {
  devServer: {
    // 使用代理服务器解决跨域发送请求的问题
    proxy: {
      // 表示以api开头的接口需要我们去代理服务器 拿到数据
      '/api': {
        // 后台服务器端口
        target: 'http://localhost:3000',
        changeOrigin: false,
        pathRewrite: {
          // 给/重写成/api开头
          '/api': '/'
        }
      }
    }
  },
  // "postcss": {
  //   "plugins": {
  //       "autoprefixer": {},
  //       "postcss-pxtorem": {
  //           "rootValue": 75,   
  //           "propList":["*"]   
  //     }
  //   }
  // }
}
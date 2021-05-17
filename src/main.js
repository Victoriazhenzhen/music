import Vue from 'vue'
import 'lib-flexible'
import App from './App.vue'
import router from './router'
import store from './store/index'
import './assets/css/reset.css'
import './assets/fonts/iconfont.css'
import './assets/css/common.css'
// 使用轮播图插件以及它的样式
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
// 引入懒加载插件
import VueLazyLoad from 'vue-lazyload'
// 引入better-scroll插件让滚动体验更加流畅





Vue.use(VueAwesomeSwiper, /* { default global options } */)
Vue.use(VueLazyLoad,{
  // 写绝对路径  public省略 把图片从assets中复制到public下面 该文件夹可以用来存放静态资源，
  // 存放在该文件夹的东西不会被打包影响，而是会原封不动的输出到dist文件夹中
  loading:"/load.gif",
  error: '/user-bg.png'
})




Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

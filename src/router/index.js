import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Recommend from '../views/recommend'
import Artists from '../views/artists'
import Rank from '../views/rank'
import PlayListView from '../views/playListView'
import PlayListInfo from '../views/playListInfo';
import RankInfo from '../views/rankInfo';
import ArtistsInfo from '../views/artistsInfo';
import Search from '../views/search'
import UserCenter from '../views/userCenter'
import UserHistoryList from '../views/userHistoryList'
import UserLoveList from '../views/userLoveList'
import UserPlayList from '../views/userPlayList'


Vue.use(VueRouter)
// 解决重复点击路由报错的BUG
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/recommend',
        name: 'recommend',
        component: Recommend
      },
      {
        path: '/playListView',
        name: 'playListView',
        component: PlayListView,
        children: [
          {
            path: ':id',
            name: 'playListInfo',
            component: PlayListInfo
          }
        ]
      },
      {
        path: '/rank',
        name: 'rank',
        component: Rank,
        children: [
          {
            path: ':id',
            name: 'rankInfo',
            component: RankInfo
          }
        ]
      },
      {
        path: '/artists',
        name: 'artists',
        component: Artists,
        children: [
          {
            path: ':id',
            name: 'artistsInfo',
            component: ArtistsInfo
          }
        ]
      },
      {
        path: '/search',
        name: 'search',
        component: Search
      },
      {
        path: '/userCenter',
        name: 'userCenter',
        component: UserCenter,
        children:[
          {
          path: '/userHistoryList',
          name: 'userHistoryList',
          component:UserHistoryList
          },
          {
            path: '/userLoveList',
            name: 'userLoveList',
            component:UserLoveList
            },
            {
              path: '/userPlayList',
              name: 'userPlayList',
              component:UserPlayList
              },
        ]
      }
    ]},
  ]

  // 这样分开每个页面都单独一个路由  会出现页面每次跳转都会重新去请求一次数据  大大的加大了服务器的压力  所以要进行路由嵌套
  // {
  //   path: '/recommend',
  //   name: 'recommend',
  //   component: Recommend
  // },
  // {
  //   path: '/playListView',
  //   name: 'playListView',
  //   component: PlayListView
  // },
  // {
  //   path: '/artists',
  //   name: 'artists',
  //   component: Artists
  // },
  // {
  //   path: '/rank',
  //   name: 'rank',
  //   component: Rank
  // },
  // {
  //   path: '/playListInfo/:id',
  //   name: 'playListInfo',
  //   component: PlayListInfo
  // },
  // {
  //   path: '/rankInfo/:id',
  //   name: 'rankInfo',
  //   component: RankInfo
  // },
  // {
  //   path: '/artistsInfo/:id',
  //   name: 'artistsInfo',
  //   component: ArtistsInfo
  // },

const router = new VueRouter({
  routes
})

export default router

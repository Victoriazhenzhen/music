<template>
  <div>
    <div class="header">
      <div @click="goToUserCenter">我的</div>
      <div>MIKO</div>
      <div>
        <i class="iconfont icon-chaxun" @click="goToSearch"></i>
      </div>
    </div>
    <!-- 头部结束 -->
    <scroll :data = 'artistsData' class="home-container">
      <div>
        <div class="swiper-content home-item">
        <!-- 使用轮播图插件部分 -->
          <swiper class="swiper" :options="swiperOption">
            <swiper-slide v-for="(item,index) in newSongData" :key="index">
              <!-- `${item.song.album.blurPicUrl}?param=400y400`这样写请求的图片会质量差一些 不会很大会比较合理 -->
              <img :src="`${item.song.album.blurPicUrl}?param=400y400`" alt="">
              <!-- 添加懒加载就是在图片上把：src换成v-lazy  这里轮播图不需要懒加载就不需要改-->
              <!-- <img v-lazy="`${item.song.album.blurPicUrl}?param=400y400`" alt=""> -->
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        <!-- 分类导航 -->
          <ul class="nav">
            <li @click="goToRecommend">
              <div class="icon-container">
                <i class="iconfont icon-date icon"></i>
              </div>
              <p>每日推荐</p>
            </li>
            <li @click="goToplayListView">
              <div class="icon-container">
                <i class="iconfont icon-music-list icon"></i>
              </div>
              <p>歌单</p>
            </li>
            <li @click="goToRank">
              <div class="icon-container">
                <i class="iconfont icon-rank icon"></i>
              </div>
              <p>排行榜</p>
            </li>
          </ul>
        </div>
        <!-- 每日推荐 -->
        <div class="home-item">
          <div class="title-wrapper">
            <div class="title">
              每日推荐
            </div>
            <div class="more" @click="goToplayListView">
              <i class=" iconfont icon-more"></i>
            </div>
          </div>
          <div class="play-list-wrapper">
          <play-list :data='playListData' @clickItem="goToPlayListInfo"></play-list>
          </div>
        </div>
        <!-- 热门歌手 -->
        <div class="home-item">
          <div class="title-wrapper">
            <div class="title">
              热门歌手
            </div>
            <div class="more" @click="goToArtists">
              <i class=" iconfont icon-more"></i>
            </div>
          </div>
          <artist-list :data ='artistsData' @clickItem="goToArtistsInfo"></artist-list>
        </div>
      </div>
    </scroll>
    
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import axios from 'axios'
import playList from '../components/playList'
import ArtistList from '../components/artistList'
import Scroll from '../components/scroll'
export default {
  name: 'Home',
  components:{
    playList,
    ArtistList,
    Scroll
  },
  data() {
    return {
      swiperOption: {
        pagination: {
          el: '.swiper-pagination'
        }
      },
      newSongData:[],
      playListData:[],
      artistsData:[]
    }
  },
  created(){
    this.getNewSongs()
    this.getPlayList()
    this.getArtists()
  },
  methods:{
    async getNewSongs(){
      const {data:res} = await axios.get('/api/personalized/newsong')
      // console.log(res);
      if(res.code === 200){
        this.newSongData = res.result
      }
    },
    async getPlayList(){
      const{data:res} = await axios.get('/api/personalized')
      if(res.code === 200){
        this.playListData = res.result.slice(0,6)
      }
    },
    async getArtists(){
      const{data:res} = await axios.get('/api/top/artists?limit=10')
      if(res.code === 200){
        this.artistsData = res.artists
      }
    },
    goToRecommend(){
      this.$router.push({
        name:'recommend'
      })
    },
    goToplayListView(){
      this.$router.push({
        name:'playListView'
      })
    },
    goToRank(){
      this.$router.push({
        name:'rank'
      })
    },
    goToArtists(){
      this.$router.push({
        name:'artists'
      })
    },
    goToPlayListInfo(item){
      this.$router.push({
                name:'playListInfo',
                params:{
                    id:item.id
                }
      })

    },
    goToArtistsInfo(item){
            this.$router.push({
                name:'artistsInfo',
                params:{
                    id:item.id
                }
            })
    },
    goToSearch(){
      this.$router.push({
        name : 'search'
      })
    },
    goToUserCenter(){
      this.$router.push({
        name: 'userCenter'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.header{
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  height: 90px;
  padding: 0 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: white;
  background-color: #f2353c;
  font-size: 36px;
  z-index: 9;
  i{
    font-size: 36px;
  }
  .personal{
    color: #f9aeb0;
  }
}
.home-item{
  padding: 20px;
  margin-bottom: 20px;
  background-color: white;
  .title-wrapper{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 40px;
    .title{
      padding-left: 20px;
      font-size: 34px;
      border-left: 6px solid #f2353c;
      color: #4c4c4c;
      line-height: 38px;
    }
    .more{
      width: 50px;
      height: 38px;
      border: 1px solid #ccc;
      border-radius: 25px;
      text-align: center;
      line-height: 38px;
    }
  }
}
.swiper-content{
  margin-top: 90px;
  .swiper-container{
    height: 350px;
    width: 100%;
    border-radius: 10px;
    img{
      width: 100%;
    }
  }
}
.nav{
  padding: 20px 30px 0 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  li{
    text-align: center;
  }
  .icon-container{
    width: 120px;
    height: 120px;
    background-color: red;
    border-radius: 50%;
    margin-bottom: 20px;
    line-height: 120px;
  }
  .icon{
    font-size: 70px;
    color: white;
  }
  p{
    font-size: 24px;
  }
}
.play-list-wrapper{
  height: 650px;
}
.home-container{
  height: calc(100vh - 200px);
  overflow: hidden;
  margin-top: 90px;
}
</style>

<!-- 搜索页面 -->
<template>
<!-- 注意这里要加上page公共样式才会显示出来  因为有层级关系 -->
<div class="page">
  <div class="search-header">
    <i class="iconfont icon-chaxun" @click="searchSongs"></i>
    <input type="text" v-model="keyWord" @keyup.enter="searchSongs" @focus="toggleResultShow(false)">
    <i class="iconfont icon-shanchu2" v-show="keyWord" @click="clearKeyWord"></i>
    <div class="cancle" @click="goBack">取消</div>
  </div>
  <scroll class="list-container history-list" v-show="!resultShow">
    <ul>
      <li class="list-title" v-if="searchText.length > 0">搜索历史</li>
      <li class="list-item history-item" v-for="(item,index) in searchText" :key="index" @click="addToSearch(item)">
        {{item}} <i class="iconfont icon-shanchu1" @click.stop="delKeyWord(item)"></i>
      </li>
      <li class="list-title">热门搜索</li>
      <!-- 在同一级li上key都是index 从0开始 就会报错  要不同的index值-->
      <li class="list-item" v-for="(item,index) in hotWords" :key="`hot-${index}`" @click="addToSearch(item.first)">{{item.first}}</li>
    </ul>
  </scroll>
  <!-- 下面是搜索后的结果   与搜索历史是互斥的 出现一个则另一个不出现 -->
  <div v-show="resultShow">
    <p class="list-count">共有{{resultData.length}}歌曲</p>
    <scroll class="list-container result-list">
      <ul>
        <li class="list-item" v-for="(item,index) in resultData" :key="index" @click="addToPlay(item,index)">
          <p >{{item.name}}</p>
          <p class="artists-name">
            <span v-for="(item,index) in item.ar" :key="index">
              {{item.name}}
            </span>
          </p>
        </li>
      </ul>
    </scroll>
  </div>
</div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import Scroll from '../components/scroll'
import axios from 'axios'
import { formatSongDetail } from '../common/js/util'
import playMixin from '../common/js/playMixin'
export default {
    name:"search",
    components:{
      Scroll
    },
    mixins: [playMixin],
    data(){
      return {
        // 切换显示阀门
        resultShow : false,
        // 热门搜索
        hotWords: [],
        // 搜索关键词
        keyWord: '',
        // 输入框输入的关键词后搜索   请求到的数据对象
        resultData: []
      }
    },
    computed:{
      ...mapGetters([
        'searchText'
      ])
    },
    created(){
        this.searchHotWords()
    },
    methods:{
      ...mapMutations([
        'SET_SEARCH_TEXT',
        'DEL_FROM_SEARCH_TEXT'
      ]),
      
      async searchHotWords() {
        const {data} = await axios.get('/api/search/hot')
        if(data.code === 200) {
          this.hotWords = data.result.hots
        }
      },
      async searchSongs(){
        if(!this.keyWord.trim()) return
        const {data} = await axios.get(`/api/search?keywords=${this.keyWord}`)
        if(data.code === 200) {
          this.resultData = formatSongDetail(data.result.songs)
        }
        // 添加到搜索历史
        this.SET_SEARCH_TEXT(this.keyWord)
        // 搜索历史添加后  搜索结果的页面显示出来  历史页面隐藏
        this.toggleResultShow(true)
      },
      toggleResultShow(val) {
        this.resultShow = val
      },
      addToSearch(val) {
        this.keyWord = val
        this.searchSongs()
      },
      goBack(){
        this.$router.back()
      },
      delKeyWord(val){
        this.DEL_FROM_SEARCH_TEXT(val)
      },
      clearKeyWord(){
        this.keyWord = ''
      },
      addToPlay(item,index){
      this.SET_FULLSCREEN(true);
      this.SET_PLAY_LIST(this.resultData);
      this.SET_SEQUENCE_LIST(this.resultData);
      this.SET_CURRENT_INDEX(index)
    }
    }
}
</script>
<style lang = 'less' scoped>
 .search-header{
   position: relative;
   padding: 15px 30px;
   background-color: #f2353c;
   height: 60px;
   display: flex;
   flex-direction: row;
   align-items: center;

   input{
     border-radius: 10px;
     height: 60px;
     font-size: 32px;
     color: #999;
     padding-left: 65px;
     flex: 1;
     box-sizing: border-box;
   }
   .icon-chaxun{
     position: absolute;
     left:45px; 
     top: 29px;
     font-size: 32px;
     color: #999;
   }
    
    .icon-shanchu2{
      position: absolute;
      top: 29px;
      right: 130px;
      font-size: 32px;
      color: #999;
    }
    .cancle{
      font-size: 28px;
      color: white;
      margin-left: 30px;
    }
 }
 
 .history-list{
   /* 滚动的部分必须要给个高度 */
   height: calc(100vh - 200px);
 }

 .list-container{
   overflow: hidden;
   
   .list-title{
     padding: 0 30px;
     line-height: 65px;
     font-size: 24px;
     color: #989898;
   }
   .list-item{
     padding: 30px;
     font-size: 28px;
     color: #333;
     background-color: white;
     border-bottom: 1PX solid #e6e6e6;
   }
   .history-item{
     display: flex;
     flex-direction: row;
     justify-content: space-between;
     align-items: center;
   }
   .icon-shanchu1{
     font-size: 30px;
     color: #999;
   }

   .artists-name{
     margin-top: 10px;
     color: #b2b2b2;
     font-size: 20px;
   }
 }


.list-count{
  line-height: 80px;
  padding: 0 30px;
  font-size: 26px;
  color: #808080;
}
.result-list{
  height: calc(100vh - 280px);
}


</style>
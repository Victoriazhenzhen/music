<!-- 这是歌手详情页面 -->
<template>
<div class="page">
    <!-- 组件渲染在请求数据之前所以就会报错 即加上v-if="newSongData.length>0" 先请求到数据再渲染组件  但是这个方法还有个问题  若没有数据时该怎么写呢？-->
    <!-- <top v-if="newSongData.length>0" :title="newSongData[0].name" :img="newSongData[0].song.album.picUrl" :count="newSongData.length"></top> -->
    <top :title="title" :img="img" :count="formatData.length"></top>
    <!-- 这里只需要在外层加上封装好的scroll插件 -->
    <Scroll class="page-info-list">
        <song-list :data="formatData" @clickItem = 'addToPlay'></song-list>
    </Scroll>
</div>
</template>

<script>
import infoMixin from '../common/js/infoMixin'
import {formatSongDetail} from '../common/js/util'
import axios from 'axios'
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
import playMixin from '../common/js/playMixin'
export default {
    name:"artists-info",
    mixins:[infoMixin,playMixin],
    // 下面代码全放入infoMixin中
    // components:{
    //     Top,
    //     SongList,
    //     Scroll
    // },
    // data(){
    //     return{
    //         newSongData:[],
    //         // 下面是格式化后的newSongData
    //         formatData:[]

    //     }
    // },
    // // 没有数据返回时 添加计算属性  如下操作
    // computed:{
    //     title(){
    //         if(this.formatData.length > 0){
    //             return this.formatData[0].name
    //         }else{
    //             return '暂无数据'
    //         }
    //     },
    //     img(){
    //         if(this.formatData.length > 0){
    //             return this.formatData[0].al.picUrl
    //         }else{
    //             return ''
    //         }
    //     },

    // },
    created(){
      this.getInfo(this.$route.params.id)
    },
    methods:{
      // 下面的代码都放到playList.js公共代码中去  直接引入就行
      // ...mapMutations([
      //   'SET_FULLSCREEN',
      //   'SET_CURRENT_INDEX',
      //   'SET_SEQUENCE_LIST',
      //   'SET_PLAY_LIST',
      // ]),
      async getInfo(id){
        const {data} = await axios.get(`/api/artists?id=${id}`)
        // 格式化数据
        this.formatData = formatSongDetail(data.hotSongs)
      },
      // addToPlay(item,index){
      //   this.SET_FULLSCREEN(true);
      //   this.SET_PLAY_LIST(this.formatData);
      //   this.SET_SEQUENCE_LIST(this.formatData);
      //   this.SET_CURRENT_INDEX(index)
      // }
    }
}
</script>
<style lang = 'less' scoped>

</style>
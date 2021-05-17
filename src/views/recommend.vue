<!-- 每日推荐 -->
<template>
<div class="page">
    <!-- 组件渲染在请求数据之前所以就会报错 即加上v-if="newSongData.length>0" 先请求到数据再渲染组件  但是这个方法还有个问题  若没有数据时该怎么写呢？-->
    <!-- <top v-if="newSongData.length>0" :title="newSongData[0].name" :img="newSongData[0].song.album.picUrl" :count="newSongData.length"></top> -->
    <top :title="title" :img="img" :count="formatData.length"></top>
    <!-- 这里只需要在外层加上封装好的scroll插件 -->
    <Scroll class="page-info-list">
        <song-list :data="formatData" @clickItem="addToPlay"></song-list>
    </Scroll>
</div>
</template>

<script>
import axios from 'axios'
// import Top from '../components/top'
// import SongList from '../components/songList'
// import Scroll from '../components/scroll'
// 以上3行放入公共js内   引入下面这行就行（artistsInfo、RankInfo、playListInfo都是这样使用mixin快速完成详情页面）
import infoMixin from '../common/js/infoMixin'
import playMixin from '../common/js/playMixin'
import {formatSongDetail} from '../common/js/util'
export default {
    name:"recommend",
    mixins:[infoMixin,playMixin],
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
        this.getNewSongs()
    },
    methods:{
        async getNewSongs(){
            const {data:res} = await axios.get('/api/personalized/newsong')
            // console.log(res);
            if(res.code === 200){
                this.newSongData = res.result
                // 格式化数据
                this.formatData = formatSongDetail(res.result)
                console.log(this.formatData)
            }
        },
    }
}
</script>
<style lang = 'less' scoped>
/* 把下列样式是共用的  所以放到公共样式中去  类名改成page-info-list*/
/* .recommend-list{
    /* 减去top区域的高度 */
    /* height: calc(100vh-380px);
    overflow: hidden;
} */ 
</style>
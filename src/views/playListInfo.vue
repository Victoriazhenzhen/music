<!-- 点击每个歌单跳转的页面    歌单详情页面-->
<template>
<div class="page">
    <!-- 组件渲染在请求数据之前所以就会报错 即加上v-if="newSongData.length>0" 先请求到数据再渲染组件  但是这个方法还有个问题  若没有数据时该怎么写呢？-->
    <!-- <top v-if="newSongData.length>0" :title="newSongData[0].name" :img="newSongData[0].song.album.picUrl" :count="newSongData.length"></top> -->
    <top :title="title" :img="img" :count="formatData.length"></top>
    <!-- 这里只需要在外层加上封装好的scroll插件 -->
    <Scroll class="page-info-list">
        <song-list :data="formatData" @clickItem = "addToPlay"></song-list>
    </Scroll>
</div>
</template>

<script>
import axios from 'axios'
import infoMixin from '../common/js/infoMixin'
import playMixin from '../common/js/playMixin'
import {formatSongDetail} from '../common/js/util'
export default {
    name:"play-list-info",
    mixins:[infoMixin, playMixin],
    
    created(){
      this.getInfo(this.$route.params.id)
    },
    methods:{
      async getInfo(id){
        const {data} = await axios.get(`/api/playlist/detail?id=${id}`)
        // 格式化数据
        this.formatData = formatSongDetail(data.playlist.tracks)
      }
    }
}
</script>
<style lang = 'less' scoped>

</style>
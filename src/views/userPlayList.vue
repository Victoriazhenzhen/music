<!-- 播放列表 -->
<template>
<div class="page">
  <div class="page">
    <m-header>播放列表</m-header>
    <count class="mt90">{{playList.length}}</count>
    <scroll class="user-list-container">
      <song-list :data= "playList" @clickItem="addToPlay"></song-list>
    </scroll>
  </div>
</div>
</template>

<script>
import mHeader from '../components/mHeader'
import Count from '../components/count'
import Scroll from '../components/scroll'
import SongList from '../components/songList'
import { mapGetters } from 'vuex'
import playMixin from '../common/js/playMixin'
export default {
    name:"user-play-list",
    mixins:[playMixin],
    components:{
      mHeader,
      Count,
      Scroll,
      SongList
    },
    computed:{
      ...mapGetters([
        'playList'
      ])
    },
    methods:{
      addToPlay(item,index){
      this.SET_FULLSCREEN(true);
      this.SET_PLAY_LIST(this.playList);
      this.SET_SEQUENCE_LIST(this.playList);
      this.SET_CURRENT_INDEX(index)
      }
    }
}
</script>
<style lang = 'less' scoped>
.user-list-container{
  height: clac(100vh - 280px);
  overflow: hidden;
}
</style>
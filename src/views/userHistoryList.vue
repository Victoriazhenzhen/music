<!-- 历史播放列表 -->
<template>
<div class="page">
  <m-header>最近听过</m-header>
  <count class="mt90">{{historyList.length}}</count>
  <scroll class="user-list-container">
    <song-list :data= "historyList" @clickItem="addToPlay"></song-list>
  </scroll>
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
    name:"user-history-list",
    components:{
      mHeader,
      Count,
      Scroll,
      SongList
    },
    mixins:[playMixin],
    computed:{
      ...mapGetters([
        'historyList'
      ])
    },
    methods:{
      addToPlay(item,index){
      this.SET_FULLSCREEN(true);
      this.SET_PLAY_LIST(this.historyList);
      this.SET_SEQUENCE_LIST(this.historyList);
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
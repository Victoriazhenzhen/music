<!-- 用户喜爱收藏列表 -->
<template>
  <div class="page">
    <m-header>我的收藏</m-header>
    <count class="mt90">{{loveList.length}}</count>
    <scroll class="user-list-container">
      <song-list :data= "loveList" @clickItem="addToPlay"></song-list>
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
    name:"user-love-list",
    mixins:[playMixin],
    components:{
      mHeader,
      Count,
      Scroll,
      SongList
    },
    computed:{
      ...mapGetters([
        'loveList'
      ])
    },
    methods:{
      addToPlay(item,index){
      this.SET_FULLSCREEN(true);
      this.SET_PLAY_LIST(this.loveList);
      this.SET_SEQUENCE_LIST(this.loveList);
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
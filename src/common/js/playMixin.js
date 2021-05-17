// 把所有播放列表里公共的代码  写到这里   组件里直接引用就行
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'

export default {
  methods:{
    ...mapMutations([
      'SET_FULLSCREEN',
      'SET_CURRENT_INDEX',
      'SET_SEQUENCE_LIST',
      'SET_PLAY_LIST',
    ]),
    addToPlay(item,index){
      this.SET_FULLSCREEN(true);
      this.SET_PLAY_LIST(this.formatData);
      this.SET_SEQUENCE_LIST(this.formatData);
      this.SET_CURRENT_INDEX(index)
    }
  }
}
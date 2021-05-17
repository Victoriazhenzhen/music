// state的计算属性
const getters = {
  fullScreen(state) {
    return state.fullScreen;
  },
  playList(state) {
    return state.playList;
  },
  sequencesList(state) {
    return state.sequencesList;
  },
  currentIndex(state) {
    return state.currentIndex;
  },
  mode(state) {
    return state.mode;
  },
  // 当前播放歌曲的信息 获取当前播放歌曲的数据对象
  currentSong(state){
    return state.playList[state.currentIndex]
  },
  // 增加一个状态值来判断是否已经添加喜爱收藏
  isLove(state) {
    let isLove = false
    const currentSong = state.playList[state.currentIndex]
    for(let i = 0; i < state.loveList.length; i++) {
      if(currentSong && state.loveList[i].id === currentSong.id){
        isLove = true
        return isLove
      }
    }
    return isLove
  },
  searchText(state) {
    return state.searchText
  },
  historyList(state) {
    return state.historyList
  },
  loveList(state) {
    return state.loveList
  }
}

export default getters
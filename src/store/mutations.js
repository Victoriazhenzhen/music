
// 改变state里的值
const mutations = {
  SET_FULLSCREEN(state,val){
    state.fullScreen = val
  },
  SET_PLAY_LIST(state,val){
    state.playList = val
  },
  SET_SEQUENCE_LIST(state,val){
    state.sequencesList = val
  },
  SET_CURRENT_INDEX(state,val){
    state.currentIndex = val
  },
  SET_MODE(state,val){
    state.mode = val
  },
  // 点击播放列表里删除或者播放
  DEL_FROM_PLAY_LIST(state,val) {
    const index = state.playList.findIndex(item => item.id === val.delSong.id)
    state.playList.splice(index, 1)
    if(val.delSong.id !== val.curSong.id){
    state.currentIndex = state.playList.findIndex(item => item.id === val.curSong.id)
    }
  },
  // 更改历史数据操作
  SET_HISTORY_LIST(state,val) {
    let haveHistory = false
    for(let i=0; i<state.historyList.length; i +=1) {
      if(state.historyList[i].id === val.id){
        haveHistory = true
        return
      }
    }
    if(!haveHistory){
      state.historyList.push(val)
    }
    // 把state.historyList传递到localStorage里  因为只能传字符串  要把json转换成字符串格式
    localStorage.setItem('HistoryList',JSON.stringify(state.historyList))
  },
  // 添加喜欢收藏数据操作
  SET_LOVE_LIST(state,val) {
    let haveLove = false
    for(let i=0; i<state.loveList.length; i +=1) {
      if(state.loveList[i].id === val.id){
        haveLove = true
        return
      }
    }
    if(!haveLove){
      state.loveList.push(val)
    }
    // 把state.historyList传递到localStorage里  因为只能传字符串  要把json转换成字符串格式
    // getItem()方法:获取到每一项  setItem():设置里面每一项
    localStorage.setItem('LoveList',JSON.stringify(state.loveList))
  },
  // 取消收藏操作
  DEL_FROM_LOVE_LIST(state,val) {
    const index = state.loveList.findIndex(item => item.id === val.id)
    state.loveList.splice(index,1)
    localStorage.setItem('LoveList',JSON.stringify(state.loveList))
  },
  // 搜索历史的添加
  SET_SEARCH_TEXT(state,val) {
    let haveText = false
    for(let i = 0; i < state.searchText.length; i++){
      if(state.searchText[i] === val.trim()) {
        haveText = true
        return
      }
    }
    if(!haveText) {
      // unshift向数组开头添加元素 改变原数组 注意其返回的是数组新的长度
      state.searchText.unshift(val)
      // 当历史数据超过10条就不再存储它
      state.searchText = state.searchText.slice(0,10)
    }
    localStorage.setItem('SearchText',JSON.stringify(state.searchText))
  },
  // 搜索历史的删除
  DEL_FROM_SEARCH_TEXT(state, val) {
    for(let i = 0; i < state.searchText.length; i++){
      if(state.searchText[i] === val.trim()) {
        state.searchText.splice(i,1)
      }
    }
    localStorage.setItem('SearchText',JSON.stringify(state.searchText))
  }

}
export default mutations
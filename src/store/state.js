import {playMode} from '../common/js/aliasConfig'
// 需要共享的state数据
const state = {
  // 点击列表里的歌曲要出现全屏播放器
  fullScreen: false,
  // 播放列表
  playList: [],
  // 没打乱前最开始的排序列表
  sequencesList:[],
  // 当前点击播放的歌曲在列表中的位置
  currentIndex: 0,
  // 播放模式   在common/js下新建一个配置文件aliasConfig.js 来存储播放模式
  mode: playMode.sequence,
  // 在localStorage里拿到数据是字符串的要转换成json格式   历史数据
  historyList : JSON.parse(localStorage.getItem('HistoryList')) || [],
  // 在localStorage里拿到数据是字符串的要转换成json格式   喜爱数据
  loveList: JSON.parse(localStorage.getItem('LoveList')) || [],
  // 搜索历史也是通过localStorage来显示关键词的  getItem()方法:获取到每一项  setItem():设置里面每一项
  searchText: JSON.parse(localStorage.getItem('SearchText')) || [],

  
}

export default state
<!-- 播放组件 -->
<template>
<div>
  <!-- 播放器小屏 -->
  <div v-show="!fullScreen" class="mini-player">
    <div class="player-info" @click="toggleShow(true)">
      <div class="player-img rotate" :class="rotateStop">
        <img :src="songImg" alt="">
      </div>
      <div>
        <p class="player-name">{{songName}}</p>
        <p class="player-artists">
          <span v-for="(item,index) in songArtists" :key="index">{{item.name}}</span>
        </p>
      </div>
    </div>
    <div class="player-operate">
        <i class="iconfont icon-op" :class="playIcon" @click="togglePlay"></i>
        <i class="iconfont icon-xiayiqu" @click="next"></i>
    </div>
    <!-- 进度条  这里是不能拖动的 -->
    <div class="mini-progress" :style="{'width': `${barPercent}`}"></div>
  </div>
  <!-- 播放器全屏   给全屏添加动画效果transition-->
  <transition name="play">
    <div v-show="fullScreen" class="player" :style="{'backgroundImage':`url(${songImg})`}">
      <!-- 为了让背景图看起来更暗  添加一层mask遮罩 -->
      <div class="player-mask"></div>
      <!-- 上部分 -->
      <div class="player-header">
        <i class="iconfont icon-xia" @click="toggleShow(false)"></i>
        <div class="header-info">
          <p>{{songName}}</p>
          <p class="header-artists">
            <span v-for="(item,index) in songArtists" :key="index">{{item.name}}</span>
          </p>
        </div>
      </div>
      <!-- 中间其内容是可以左右滑动切换的  所以可以使用swiper插件   可以从home组件里复制过来做下修改即可-->
      <swiper :options="swiperOption">
          <swiper-slide class="img-container">
            <!-- 封面 -->
            <img :src="songImg" alt="" :class="rotateStop" class="rotate">
            <i class="iconfont icon-xiai" :class="{'icon-xiai-red':isLove}" @click="addToLove"></i>
          </swiper-slide>
          <swiper-slide class="lyric-container">
            <!-- 这里是歌词  要加滚动效果 添加scroll组件-->
            <scroll ref="lyricScroll" class="lyric-scroll">
              <!-- 因为Scroll只对第一个子项有作用   所以要在歌词外层加上div -->
              <div>
                <ul v-if="lyricLines.length > 0">
                  <li ref="lyricLine" v-for="(item,index) in lyricLines" :key="index" class="list-item" :class="{'active':index === currentLineNumber}">
                    {{item.txt}}
                  </li>
                </ul>
                <div v-else >暂无歌词</div>
              </div>
            </scroll>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
      <!-- 下部分 -->
      <div class="player-operate">
        <!-- 下部分内容也会暗一点   所以也加上一层mask -->
        <div class="operate-mask"></div>
        <div class="progress">
          <span class="time">{{formatTime(currentTime)}}</span>
          <div class="progress-bar" ref="progressBar" @click="progressClick">
            <!-- 进度条  这里时可以拖动的  所以加上btn-->
            <div class="bar-moved" :style="{width: `${barPercent}`}"></div>
            <!-- @touchmove.prevent阻止默认行为  touchmove、touchend事件：手指在dom元素身上移动事件、离开事件-->
            <div class="bar-btn" :style="{left: `${barPercent}`}" @touchmove.prevent="progressMove" @touchend="progressEnd"></div>
          </div>
          <span class="time">{{formatTime(overTime)}}</span>
        </div>
        <div class="operate-icon">
          <i class="iconfont fs-40" :class="modeIcon" @click="changeMode"></i>
          <i class="iconfont icon-shangyiqu fs-80" @click="prev"></i>
          <i class="iconfont fs-100" :class="playIcon" @click="togglePlay"></i>
          <i class="iconfont icon-xiayiqu fs-80" @click="next"></i>
          <i class="iconfont icon-more fs-40" @click="togglePlaylistShow"></i>
        </div>
      </div>
    </div>
  </transition>
  <!-- 点击更多出现播放列表 -->
  <div v-if="playlistShow" class="playlist-mask" @click="togglePlaylistShow"></div>
  <transition name="playlist">
    <scroll v-if="playlistShow" class="playlist-scroll">
      <ul>
        <li v-for="(item,index) in playList" :key="index" @click="addToPlay(index)">
          <p>{{item.name}} - <span class="artists-name" v-for="(arItem,arIndex) in item.ar" :key="arIndex">{{arItem.name}}</span></p>
          <i class="iconfont icon-shanchu2" @click.stop="delFromPlayList(item)"></i>
        </li>
      </ul>
      <div class="close" @click="togglePlaylistShow">关闭</div>
    </scroll>
  </transition>
  <!-- 音频标签audio   先将引用词ref写入所要引用标签中  后面$refs可以拿到ref="audio"所在的dom结构-->
  <!-- timeupdate事件  当目前的播放位置已更改时 -->
  <audio :src="musicData.url" ref="audio" @timeupdate="updateTime" @ended="end" ></audio>
</div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import axios from 'axios'
import {playMode} from '../common/js/aliasConfig'
import Scroll from './scroll'
export default {
    name:"player",
    components:{
      Scroll
    },
    data(){
      return{
        // 通过一个字段来控制切换显示哪个屏的播放器
        // fullScreen:true,
        swiperOption: {
          pagination: {
            el: '.swiper-pagination'
          }
         },
        //  歌曲信息
        musicData:{},
        // 歌词信息
        lyricData: null,
        // 当前播放状态
        playing:false,
        // loaded:false,
        // 当前时间
        currentTime: 0,
        // 总时长
        overTime: 0,
        // 防止在播放时移动 出现跳动的情况  添加一个字段  类似于阀门
        touchBarWillMove: false,
        // 添加一个字段存放格式化后的歌词
        lyricLines : [],
        // 正在播放那一行的下标
        currentLineNumber: 0,
        // 控制是否出现播放列表
        playlistShow: false
      }
    },
    computed:{
      ...mapGetters([
        'fullScreen',
        'playList',
        'sequencesList',
        'currentIndex',
        'currentSong',
        'mode',
        'isLove'
      ]),
      songName(){
        return this.currentSong ? this.currentSong.name : '暂无播放歌曲'
      },
      songArtists(){
        return this.currentSong ? this.currentSong.ar : []
      },
      songImg(){
        // 如果我们拿到的这张图片不存在  就选用默认的图片
        return this.currentSong && this.currentSong.al.picUrl ? `${this.currentSong.al.picUrl}?param=400y400` : require('../assets/image/user-bg.png')
      },
      playIcon(){
        return this.playing ? 'icon-bofang' : 'icon-zanting'
      },
      modeIcon(){
        return this.mode === playMode.sequence ? 'icon-liebiaoxunhuan' : (this.mode === playMode.loop ? 'icon-danquxunhuan' : 'icon-suiji')
      },
      barPercent() {
        let p = this.currentTime / this.overTime;
        if (p === 0) {
          return 0;
        }
        // toFixed()四舍五入
        p = Number(p * 100).toFixed();
        return `${p}%`;
      },
      rotateStop() {
        return this.playing ? '' : 'rotate-stop'
      }
    },
    watch:{
      currentSong(newVal,oldVal){
        // oldval有可能是undefined  因为还未点击歌单列表时  是没有oldval的
        if( oldVal === undefined || newVal.id !== oldVal.id){
          this.getMusicUrl(newVal.id)
          this.getLyricData(newVal.id)
        }
      }
    },
    methods:{
      ...mapMutations([
        'SET_FULLSCREEN',
        'SET_CURRENT_INDEX',
        'SET_MODE',
        'SET_PLAY_LIST',
        'DEL_FROM_PLAY_LIST',
        'SET_HISTORY_LIST',
        'SET_LOVE_LIST',
        'DEL_FROM_LOVE_LIST'
      ]),
      toggleShow(val){
        this.SET_FULLSCREEN(val)
      },
      // 当currentSong的值变化时   才会去请求歌曲的url以及歌词的信息
      async getMusicUrl(id){
        const {data} = await axios.get(`/api/song/url?id=${id}`)
        // console.log(data);
        if (data.code === 200 && data.data[0].code === 200) {
          this.musicData = data.data[0];
          // 要经过dom更新后才执行
          this.$nextTick(() =>{
            this.togglePlay(true)
            // 要歌曲播放后才会添加到历史记录
            this.SET_HISTORY_LIST(this.currentSong)
          })
        }
      },
      // 获取歌词
      async getLyricData(id){
        const {data} = await axios.get(`/api/lyric?id=${id}`)
        if(data.code === 200 && data.lrc) {
          this.lyricData = data.lrc.lyric
          // 拿到歌词后  格式化歌词
          this.initLines()
        }else{
          this.lyricData = null
        }
      },
      togglePlay(val){
        if(!this.currentSong) return;
        if(val === true || val === false){
          this.playing = val
        }else{
          this.playing = !this.playing
        }
        // 拿到ref = audio的dom所在的位置
        const audio = this.$refs.audio
        if(this.playing) {
          audio.play()
        }else{
          audio.pause()
        }

      },
      prev(){
        // if (!this.loaded) return;
        // this.loaded = false;
        const len = this.playList.length
        let newIndex = this.currentIndex -1
        if(newIndex < 0){
          newIndex = len - 1
        }
        this.SET_CURRENT_INDEX(newIndex)
      },
      next(){
        // if (!this.loaded) return;
        // this.loaded = false;
        const len = this.playList.length
        let newIndex = this.currentIndex + 1
        if(newIndex === len){
          newIndex = 0
        }
        this.SET_CURRENT_INDEX(newIndex)
      },
      changeMode(){
        // mode是播放模式  SET_MODE设置播放模式
        const modeNumber = (this.mode + 1) % 3
        this.SET_MODE(modeNumber)
        // newPlayList是新的播放顺序列表
        let newPlayList = []
        // playMode是我们引入的公共js  也就是播放模式  当播放模式等于playMode下的随机模式时
        if(this.mode === playMode.random){
          //sequenceList是未被打乱顺序之前的排序列表
          newPlayList = this.getRandomList(this.sequencesList)
        }else{
          newPlayList = this.sequencesList
        }
        // currentSong.id是当前播放的歌曲id  当新列表中的id等于当前播放的歌曲id时返回该歌曲在新列表中的位置
        const newIndex = newPlayList.findIndex( item => item.id === this.currentSong.id )
        // console.log(newIndex);  
        // console.log(newPlayList);
        this.SET_PLAY_LIST(newPlayList)
        // 这个返回的位置就是当前播放的歌曲在列表中的位置
        this.SET_CURRENT_INDEX(newIndex)

      },
      // 得到随机播放的列表
      getRandomList(arr){
        const newArr = [].concat(arr)
        return newArr.sort((a,b) => (Math.random() >0.5 ? -1 : 1))
      },
      end(){
        if(this.mode === playMode.loop){
          this.loop()
        }else{
          // next()已经定义过了
          this.next()
        }
      },
      loop(){
        const audio = this.$refs.audio
        audio.currenTime = 0
        audio.play()
      },
      songLoad() {
        this.loaded = true;
      },
      updateTime(e){
        // !touchBarWillMove  意思是为false时 不会去移动进度条的值时
        if(!this.touchBarWillMove){
          // currentTime 设置或返回音频/视频中的当前播放位置（以秒计），当设置该属性时，播放会跳跃到指定的位置。
          this.currentTime = e.target.currentTime
          // duration  返回当前音频/视频的长度（以秒计）
          this.overTime = e.target.duration
        }
        // 当播放位置更改的时候  要滚动歌词 前提是有歌词的时候
        if(this.lyricData) {
          this.moveLyric()
        }
      },
      // 把纯秒的时间格式化成有分有秒的四位数
      formatTime(val){
        // 先判断val是不是数字  如果不是就返回00：00
        if(isNaN(val)) return '00:00'
        let m = Math.floor(val / 60)
        let s = Math.floor(val % 60)
        // 为了使时间格式是4位数
        if(m < 10){
          m = `0${m}`
        }
        if(s < 10){
          s = `0${s}`
        }
        return `${m}:${s}`
      },
      progressMove(e){
        this.touchBarWillMove = true
        // 拿到当前手指触摸屏幕事件时 水平方向上离左边的值   然后要转化成百分比
        const pageX = e.touches[0].pageX
        this.calcPercent(pageX)
      },
      // 点击进度条 （这里就不是拖动了）
      progressClick(e){
        this.touchBarWillMove = true;
        const pageX = e.pageX;
        this.calcPercent(pageX);
        this.resetPlayer();
      },
      // 拿到pageX的值还需要减去进度条开始位置到左边的距离  才能拿到已经移动的距离  然后再去除以进度条的总长度  得到百分比
      calcPercent(x){
        const offsetLeft = this.$refs.progressBar.offsetLeft
        const barWidth = this.$refs.progressBar.clientWidth
        let moveWidth = x - offsetLeft
        if(moveWidth > barWidth) moveWidth = barWidth
        if(moveWidth < 0 ) moveWidth = 0
        let p = moveWidth / barWidth
        this.currentTime = this.overTime * p
        // 当拖动进度条的时候  也要滚动歌词 
        this.moveLyric()
      },
      // 当移动完成时再去执行resetPlayer方法
      progressEnd(){
        this.resetPlayer()
      },
      resetPlayer(){
        this.$refs.audio.currentTime = this.currentTime
        this.togglePlay(true)
        this.touchBarWillMove = false
      },
      // 格式化歌词
      initLines() {
        this.lyricLines = []
        if(this.lyricData){
          // 通过\n  分割成数组 然后遍历每一项(每一项代表每一行)
          const lines = this.lyricData.split('\n')
          for(let i = 0; i < lines.length; i++) {
            const line = lines[i]
            // 通过正则把时间匹配出来
            const timeExp = /\[(\d{2}):(\d{2}\.\d{2,3})\]/g
            // exec()方法  找到了匹配的文本，则返回一个结果数组。否则，返回 null。
            const result = timeExp.exec(line)
            // console.log(result);
            if(result){
              // 转换成毫秒值
              const time = Number(result[1]*60*1000) + Number(result[2]*1000)
              // 把匹配到的时间替换成空
              const txt = line.replace(timeExp, '').trim()
              this.lyricLines.push({
                time,
                txt
              })
            }
          }
        }
      },
      // 滚动歌词的方法
      moveLyric(){
        this.currentLineNumber = this.findCurrentNumber(this.currentTime *1000)
        if(this.currentLineNumber > 6){
          // scrollToElement(el, time, offsetX , offsetY )接收4个参数  滚动到指定的目标元素   这里是大于六行的时候才开始滚动
          this.$refs.lyricScroll.scrollToElement(this.$refs.lyricLine[this.currentLineNumber - 6], 1000)
        }else{
          // scrollTo滚动到指定位置(scrollToX, scrollToY, scrollToTime, easing)接收4个参数，1.x横轴坐标(px) 2.y 纵轴坐标(px) 3.滚动动画执行的时长(ms) 4.easing 缓动函数，一般不建议修改
          this.$refs.lyricScroll.scrollTo(0, 0, 1000)
        }
      },
      findCurrentNumber(time){
        for(let i = 0; i < this.lyricLines.length; i++) {
          if(time < this.lyricLines[i].time) {
            return i - 1
          }
        }
        // 当到最后的时候进度条当前的时间肯定会大于歌词的时间的  所以这个时候就显示歌词最后一条
        return this.lyricLines.length - 1
      },
      togglePlaylistShow(){
        this.playlistShow = !this.playlistShow
      },
      addToPlay(index){
        this.SET_CURRENT_INDEX(index)
        this.togglePlaylistShow()
      },
      delFromPlayList(item){
        // this.DEL_FROM_PLAY_LIST(item)
        this.DEL_FROM_PLAY_LIST({
          // 点击删除那首歌的信息对象
          'delSong':item,
          //当前播放歌曲的信息对象
          'curSong': this.currentSong
        })
      },
      addToLove() {
        if(this.isLove) {
          this.DEL_FROM_LOVE_LIST(this.currentSong)
        }else {
          this.SET_LOVE_LIST(this.currentSong)
        }
      }
    }
}
</script>
<style lang = 'less' scoped>
.mini-player{
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #150a06;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: white;
  padding: 10px 30px 10px 20px;
  z-index: 9999;

  .player-info{
      display: flex;
      flex-direction: row;
      align-items: center;
  }

  .player-img{
      width: 80px;
      height: 80px;
      /* 不让图片缩放   当宽度大于父元素时 */
      flex-shrink: 0;
      border-radius: 50%;
      overflow: hidden;
      border: 4PX solid #695945;
      margin-right: 20px;

      img{
        width: 100%;
      }
  }
  .player-name{
      font-size: 26px;
      margin-bottom: 10px;
      line-height: 30px;
    }

    .player-artists{
      font-size: 20px;
      color: #b2b2b2;
    }

    .player-operate{

      i{
        font-size: 65px;
        color: #c9c3c1;
      }

      .icon-op{
        margin-right: 50px;
      }
    }
    .mini-progress{
      /* width: 30%; */
      height: 6px;
      background-color: #f2353c;
      position: absolute;
      left: 0;
      bottom: 0;
    }
}
.player{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  /* background-image: url("../assets/image/1.jpeg"); */
  /* 图片放大至铺满整个背景 但是可能会显示不全   具体看csdn上的收藏 */
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  overflow: hidden;
  color: white;

  /* 添加背景模糊效果   添加伪类加filter：blur()  具体看css高级技巧笔记 印象笔记*/
  &:after{
    content:'' ;
    background: inherit;
    position: absolute;
    top: -40px;
    left: -40px;
    width: calc(100% + 80px);
    height: calc(100% + 80px);
    filter: blur(20px);
    z-index: -2;
  }
  .player-mask{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: black;
    opacity: .5;
    z-index: -1;
  }
  .player-header{
    height: 60px;
    padding: 30px;
    i{
      font-size: 46px;
      position: absolute;
      top: 30px;
      left: 30px;
    }
    .header-info{
      width: 70%;
      margin: 0 auto;
      text-align:center;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 30px;
    }
    .header-artists{
        font-size: 18px;
        color: #b2b2b2;
        margin-top: 12px;
    }
  }
  .swiper-container{
      width: 100%;
      height: calc(100% - 360px);
  }
  .img-container{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: relative;

    img{
      width: 500px;
      height: 500px;
      border-radius: 50%;
      border: 20px solid #2b433c;
    }

    i{
      position:absolute;
      left: 30px;
      bottom: 30px;
      font-size: 50px;
      color: #c4b9bb;
    }
  }
  .player-operate{
    width: 100%;
    height: 300px;
    position: relative;

    .operate-mask{
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0,0,0,.1);
      z-index: -1;
    }
  }
  .progress{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 50px;
    padding: 30px;

    .time{
      /* 给个固定的宽度   防止样式撑开 */
      width: 60px;
    }
    .progress-bar{
      width: 560px;
      height: 4px;
      background-color: #7e7374;
      position: relative;
      margin: 0 30px;
    }
    .bar-moved{
      position: absolute;
      left: 0;
      top: 0;
      height: 4px;
      background-color: #f2353c;
      /* width: 30px; */
    }
    .bar-btn{
      position: absolute;
      /* left: 30px; */
      top: 0;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: white;
      border: 5px solid #5d5759;
      transform: translate3d(-50%,-50%,0);
    } 
  }
  .operate-icon{
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 0 30px;
      color: #c4b9bb;

      .fs-40{
        font-size: 40px;
      }
      .fs-80{
        font-size: 80px;
      }
      .fs-100{
        font-size: 100px;
      }
  }
}
/* 给全屏添加动画效果 */
.play-enter-active,
.play-leave-active{
  transition:  all .3s;
  opacity: 1;
  .player-header,.player-operate{
    transform: translate3d(0,0,0);
    transition:all .3s cubic-bezier(0.86,0.18,0.82,1.32) ;
  }
}
.play-enter,
.play-leave-to{
  opacity: 0;

  .player-header{
    transform: translate3d(0,-100px,0);
  }
  .player-operate{
    transform: translate3d(0,100px,0);
  }
}
.lyric-container{
  height: 100%;
  box-sizing: border-box;
  padding: 30px 30px 70px 30px;
  overflow: hidden;
}
.lyric-scroll{
    height: 100%;
    width: 100%;
    color: white;
    overflow: hidden;
    text-align: center;
    .list-item{
      font-size: 24px;
      /* 理他最近的那个子元素的font-size乘上1.5
         使用因子方式定义line-height是非常安全的方式，将可以避免文字重叠的现象
       */
      line-height: 1.5;
      /* 最小高度50px */
      min-height: 50px;
      opacity: .5;
      &.active{
        opacity: 1;
      }
    }
  }
  .playlist-scroll{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 800px;
    overflow: hidden;
    z-index: 99999;
    background-color: rgba(255, 255, 255, .95);
    border-radius: 10px 10px 0 0;

    ul{
      padding-bottom: 80px;

      li{
        padding: 30px 20px;
        font-size: 24px;
        border-bottom: 1PX solid #e6e6e6;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }

      .artists-name{
        font-size: 18px;
        color: #b3b3b3;
      }

      i{
        font-size: 24px;
        color: lightgray;
      }
    }

    .close{
      line-height: 80px;
      font-size: 30px;
      color: #333;
      text-align: center;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      border-top: 1PX solid #e6e6e6;
      background-color: white;
    }
  }

  .playlist-mask{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99999;
    background-color: rgba(0, 0, 0, .4);
  }
  .playlist-enter-active,
  .playlist-leave-active{
    transition: all .3s
  }
  .playlist-enter,
  .playlist-leave-to{
    transform: translate3d(0,100%,0);
  }
  /* 动画序列  给播放图片加动画效果 */
  /* @keyframes规定动画 */
  @keyframes rotate{
    /*  用百分比来规定变化发生的时间，或用 `from` 和 `to`，等同于 0% 和 100% */
    from{
      /* rotate旋转 单位是：deg 角度为正时，顺时针，角度为负时，逆时针 默认的旋转点为元素中心点 */
      transform: rotate(0deg);
    }
    to{
      transform: rotate(360deg);
    }
  }
  /* 调用动画 */
  .rotate{
    animation: rotate 30s linear infinite;
  }
  /* 歌曲不播放时暂停旋转 */
  .rotate-stop{
    animation-play-state: paused;
  }
</style>
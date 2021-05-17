<!-- 个人中心页面 -->
<template>
<div>
  <div class="page">
    <m-header :red='false'>
      个人中心
    </m-header>
    <div class="user-bg">
      <img src="../assets/image/user-bg.png" alt="">
      <p>MIKO</p>
    </div>
    <ul class="user-list">
      <li @click="goToPage('userPlayList')">
        <div class="icon-wrap">
          <i class="iconfont icon-music"></i>播放列表
        </div>
        <i class="iconfont icon-you"></i>
      </li>
      <li class="split-item" @click="goToPage('userLoveList')">
        <div class="icon-wrap">
          <i class="iconfont icon-xiai"> </i>我的收藏
        </div>
        <i class="iconfont icon-you"></i>
      </li>
      <li @click="goToPage('userHistoryList')">
        <div class="icon-wrap">
          <i class="iconfont icon-guangdie"></i>最近听过
        </div>
        <i class="iconfont icon-you"></i>
      </li>
    </ul>
  </div>
  <!-- 添加得路由会渲染到这里   要加上动画效果 -->
  <transition name="slide">
    <router-view></router-view>
  </transition>
</div>
</template>

<script>
import mHeader from '../components/mHeader'
export default {
    name:"user-center",
    components:{
      mHeader
    },
    methods:{
      goToPage(path){
        this.$router.push({
          name: path
        })
      }
    }
}
</script>
<style lang = 'less' scoped>
.user-bg{
  width: 100%;
  height: 400px;
  background: url('../assets/image/user-bg.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 30px;
  img{
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-top: 60px;
    margin-bottom: 20px;
  }
}
.user-list{

  li{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 100px;
    font-size: 30px;
    color: #333;
    padding: 0 30px;
    background-color: white;
    border-bottom: 1PX solid #e6e6e6;

  }

  i{
    font-size: 40px;
    color: #ccc;
  }
  .icon-wrap{
    display: flex;
    align-items: center;

    i{
      margin-right: 20px;
    }
  }
  .split-item{
    margin-top: 20px;
  }
}
</style>
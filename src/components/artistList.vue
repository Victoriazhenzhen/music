<!-- 首页热门歌手组件 -->
<template>
  <ul class="artists-list">
        <li v-for="(item,index) in data" :key="index" @click="handleClick(item)"> 
          <!-- `${item.song.album.blurPicUrl}?param=400y400`这样写请求的图片会质量差一些 不会很大会比较合理 -->
          <!-- 添加懒加载就是在图片上把：src换成v-lazy -->
          <img v-lazy="`${item.picUrl}?params=400y400`" alt="">
          <div>
            <p class="name">{{item.name}}</p>
            <p class="info">专辑{{item.albumSize}}张，共{{item.musicSize}}首歌</p>
          </div>
        </li>
  </ul>
</template>

<script>
export default {
    name:"artist-list",
    props:{
      data:{
        type:Array,
        default(){
          return[]
        }
      }
    },
    methods:{
      handleClick(item){
        this.$emit('clickItem',item)
      }
    }
}
</script>
<style lang = 'less' scoped>
.artists-list{
  li{
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 30px;
    // 注意这里大写是不需要转换成rem 解决1像素边框重叠问题
    border-top: 1PX solid #e6e6e6;
    margin-left: -20px;
    margin-right: -20px;
    img{
      width: 80px;
      height: 80px;
      margin-right: 20px;
    }
    .name{
      font-size: 30px;
      color: #000;
      margin-bottom: 20px;
    }
    .info{
      font-size: 24px;
      color: #b2b2b2;
    }
  }
}
</style>
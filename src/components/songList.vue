<!-- 每日推荐里的歌曲列表组件 -->
<template>
<div>
  <ul class="song-list">
    <li v-for="(item,index) in data" :key="index" @click="handleClick(item,index)">
      <div>
        <img v-lazy="`${item.al.picUrl}?param=400y400`" alt="">
      </div>
      <div>
        <p>{{item.name}}</p>
        <p class="artists">
          <span v-for="(item,index) in item.ar" :key="index">{{item.name}}</span>
        </p>
      </div>
    </li>
  </ul>
</div>
</template>

<script>
export default {
    name:"song-list",
    props:{
      data:{
        type:Array,
        default(){
          return[]
        }
      }
    },
    methods:{
      handleClick(item,index){
        this.$emit('clickItem',item,index)
      }
    }
}
</script>
<style lang = 'less' scoped>
.song-list{
  li{
    padding: 30px;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 1px solid #e6e6e6;
    font-size: 30px;
    background-color: white;
    img{
      width: 80px;
      height: 80px;
      margin-right: 25px;
    }
  }
  .artists{
    font-size: 20px;
    color: #b2b2b2;
    margin-top: 10px;
  }
}
</style>
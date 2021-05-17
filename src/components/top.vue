<!-- 每日推荐里的头部组件 -->
<template>
<div>
  <div class="top" :style="{'backgroundImage':`url(${img}?param=400y400)`}">
    <m-header :red='false'>
      {{title}}
    </m-header>
    <img :src="`${img}?param=400y400`" alt="">
  </div>
  <!-- <div class="count">
    共用{{count}}首歌曲
  </div> -->
  <count>{{count}}</count>
</div>
</template>

<script>
import mHeader from './mHeader'
import Count from './count'
export default {
    name:"top",
    components:{
      mHeader,
      Count
    },
    props:{
      title:{
        type: String,
        default:''
      },
      img:{
        type:String,
        default:""
      },
      count:{
        type:Number,
        default:0
      }
    }
}
</script>
<style lang = 'less' scoped>
.top{
  position: relative;
  width: 100%;
  height: 300px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  overflow: hidden;
  &:after{
    content:"";
    position:absolute;
    top: -40px;
    left: -40px;
    /* calc动态计算长度值  注意运算符号前后要加空格 */
    width: calc(100% + 80px);
    height: calc(100% + 80px);
    /* 继承父级的background属性 */
    background: inherit;
    /* filter：blur（）数值越大越模糊 */
    filter: blur(20px);

  }
  img{
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 10px solid #9e8d7f;
    position: absolute;
    left: 50%;
    top: 60%;
    /* transform: translate3d(x, y, z)`：其中x、y、z 分别指要移动的轴的方向的距离 */
    transform: translate3d(-50%,-50%,0);
    z-index: 1;
  }
}
.count{
  height: 80px;
  line-height: 80px;
  font-size: 26px;
  color: #808080;
  padding-left: 30px;
}
</style>
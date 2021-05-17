<!-- 首页头部区域子组件 -->
<template>
<div class="header" :class="{'red':red}">
  <i class="iconfont icon-zuo" @click="goBack"></i>
  <slot></slot>
</div>
</template>

<script>
export default {
    name:"m-header",
    props:{
      red:{
        type:Boolean,
        default:true
      }
    },
    methods:{
      goBack(){
        // 返回上个路由
        this.$router.go(-1)
      }
    }
}
</script>
<style lang = 'less' scoped>
.header{
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  height: 90px;
  line-height: 90px;
  font-size: 34px;
  color: #fefefe;
  text-align: center;
  z-index: 999;
  i{
    position: absolute;
    font-size: 50px;
    left: 20px;
  }
  &.red{
    background-color: #f2353c;
  }
}
</style>
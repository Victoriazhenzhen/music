<template>
  <div id="app">
    <router-view/>
    <player></player>
  </div>
</template>

<script>
  import Player from './components/player';
  import eruda from 'eruda'

  export default {
    name: 'app',
    components: {
      Player
    },
    // 创建实例的时候  添加eruda插件移动端调试工具
    created(){
      // 创建一个元素并且添加到文档中
      const el = document.createElement('div')
      document.body.appendChild(el)
      eruda.init({
        // 插件最终展现在哪个位置
        container: el,
        // 配置参数  调式工具所需要用到的
        tool:['concole', 'elements']
      })

    }
  }
</script>

<style lang="less" scoped>
</style>

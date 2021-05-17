<!-- 这是scorll插件的封装  因为有很多地方要使用到  所以我们再进行一次封装 -->
<template>
<div class="scroll-wrapper" ref="scrollWrapper">
    <!-- 数据会填充到slot插槽  所以要监测到slot的变化 就调用refresh（）方法   监测数据变化就要先接收父组件传递过来的数据-->
    <slot></slot>
</div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
    name:"scroll",
    props:{
        data:{
            type:Array,
            default(){
                return[]
            }
        }
    },
    watch:{
        // 监听data数据的变化  val是变化的数据
        data(val){
            this.$nextTick(()=>{
                // 在请求数据结尾之后再更新后   执行better-scroll
                this.refresh()
            })
        }
    },
    // mounted钩子函数  模板内容已经渲染完成  这样才能确认拿到滚动数据的高度
    mounted(){
        // 生命周期中不能直接进行DOM操作(执行时间差问题)，因而放到请求数据事件结尾（dom更新之后）
        this.$nextTick(()=>{
            this.initScorll()
        })
    },

    methods:{
      initScorll(){
        //   $refs是要拿到所在的dom结构
          if(!this.$refs.scrollWrapper) return;
          this.scroll = new BScroll(this.$refs.scrollWrapper,{
              click:true
          })
        //   console.log(this.scroll);
      },
    //   refresh  更新重新计算better-scroll  当dom结构发生变化(比如说数据从10条减少到5条 这时候就必要去刷新一下数据)时务必要调用确保滚动的效果正常
      refresh(){
          this.scroll && this.scroll.refresh()
      },
      scrollToElement(){
        //   scrollToElement(el, time, offsetX , offsetY )接收4个参数  滚动到指定的目标元素
          this.scroll && this.scroll.scrollToElement.apply(this.scroll,arguments)
      },
      scrollTo(){
          // scrollTo滚动到指定位置(scrollToX, scrollToY, scrollToTime, easing)接收4个参数，1.x横轴坐标(px) 2.y 纵轴坐标(px) 3.滚动动画执行的时长(ms) 4.easing 缓动函数，一般不建议修改  
          this.scroll && this.scroll.scrollTo.apply(this.scroll,arguments)
      }
    }
}
</script>
<style lang = 'less' scoped>

</style>
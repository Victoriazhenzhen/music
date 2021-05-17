// 把各个详情页相同的代码部分做成公共的  直接引用就行

import Top from '@/components/top.vue'
import SongList from '@/components/songList.vue'
import Scroll from '@/components/scroll.vue'

export default{
  components:{
    Top,
    SongList,
    Scroll
},
data(){
    return{
        newSongData:[],
        // 下面是格式化后的newSongData
        formatData:[]

    }
},
// 没有数据返回时 添加计算属性  如下操作
computed:{
    title(){
        if(this.formatData.length > 0){
            return this.formatData[0].name
        }else{
            return '暂无数据'
        }
    },
    img(){
        if(this.formatData.length > 0){
            return this.formatData[0].al.picUrl
        }else{
            return ''
        }
    },

},
}
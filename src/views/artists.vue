<!-- 歌手 -->
<template>
<div class="page">
    <div v-if="artistsData.length">
        <m-Header>全部歌手</m-Header>
        <scroll :data = "artistsData" class="page-view-list">
            <artist-list :data= 'artistsData' class="artists" @clickItem="goToArtistsInfo"></artist-list>
        </scroll>
    </div>
    <loading v-else></loading>
    <transition name="slide">
      <router-view></router-view>
    </transition>
</div>
</template>

<script>
import axios from 'axios'
import mHeader from '../components/mHeader'
import ArtistList from '../components/artistList'
import Scroll from '../components/scroll'
import Loading from '../components/loading'

export default {
    name:"artists",
    components:{
        mHeader,
        ArtistList,
        Scroll,
        Loading
    },
    data(){
        return{
            artistsData:[]
        }
    },
    created(){
        this.getArtists()
    },
    methods:{
        async getArtists(){
            const{data:res} = await axios.get('/api/top/artists')
            if(res.code === 200){
                this.artistsData = res.artists
            }
        },
        goToArtistsInfo(item){
            this.$router.push({
                name:'artistsInfo',
                params:{
                    id:item.id
                }
            })
        }
    }
}
</script>
<style lang = 'less' scoped>
.artists{
    margin-top: 90px;
    background-color: white;
    padding: 0 20px;
}
</style>
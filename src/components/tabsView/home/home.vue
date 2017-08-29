<template>
    <div class="home-content" :style="{height: homeHeight + 'px' }">
        Hello
        <!-- <div class="ssss">
            <el-button type="primary" @click="test">添加Tab(Open)</el-button>
        </div>
        <div class="ssss">
            <el-button type="primary" @click="test1">添加Tab(Close)</el-button>
        </div> -->
    </div>
</template>

<script>
    export default {
        data() {
		    return {
                homeHeight: document.body.clientHeight - 98,
		   	}
		},
        mounted: function() {
            if(this.tests){
                require('../../../assets/css/cool.css')
            }else{
                require('../../../assets/css/classic.css')
            }
            this.$nextTick(function () {

            })
	    },
        methods: {
            test (){
                console.log(12467587);
                let item = {
                    title: 'Test',
                    code: 'sssss',
                    path: '/tabsview/test'
                }
                this.$store.commit('AddOneTab', item)
                this.$store.commit('ActiveTab', item)
                this.$router.push({ path: '/tabsview/test' })
            },
            test1 (){
                console.log(12467587);
                let item = {
                    title: 'Test0',
                    code: 'sssssdf',
                    path: '/tabsview/test0'
                }
                this.$store.commit('AddOneTab', item)
                // this.$store.commit('ActiveTab', item)
                // this.$router.push({ path: '/tabsview/test' })
            }
		}
    }
</script>

<style>
    .home-content{
        color: white;
        text-align: center;
        background-color: rgba(4, 0, 0, 0.2);
    }
    .ssss{
        margin-top: 200px;
    }
</style>

<template>
    <div><router-view></router-view></div>
</template>

<script>
    export default {
        data() {
		   return {

		   	}
		},
        mounted: function() {
            if(this.$store.state.themeModel){
                require('./assets/css/cool.css')
            }else{
                require('./assets/css/classic.css')
            }
	        // this.$nextTick(function() {
            //     var that = this
            //     var savedDate = that.$router.app.$options.store.state.savedDate
            //     var authSavedDate = new Date(savedDate)
            //     var nowTime = new Date()
            //     var leave_a_moment = (nowTime.getTime() - authSavedDate.getTime()) < 10 * 1000
            //
            //     if(!leave_a_moment){
            //         that.$store.commit('CLEAR_ALL_DATA')
            //         that.$router.push({ path: '/main' })
            //     }
            //
            //     setInterval(function(){
            //         that.$store.commit('UPDATE_SAVEDDATE', new Date())
            //     }, 1000 * 10)
	        // })
	        // this.$router.push({ path: '/main' })


            // Notification.requestPermission(function (status) {
            //     // 这将使我们能在 Chrome/Safari 中使用 Notification.permission
            //     if (Notification.permission !== status) {
            //         Notification.permission = status
            //     }
            // })
	    },
        methods: {

		}
    }
</script>

<style>
    ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        background-color: white;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb {
        background-color: rgba(4, 0, 0, 0.9);
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
    }
</style>

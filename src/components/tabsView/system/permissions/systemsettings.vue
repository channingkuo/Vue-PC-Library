<template>
    <div class="" :style="{height: homeHeight + 'px' }">

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
            this.$nextTick(function () {

            })
	    },
        methods: {

		}
    }
</script>

<style>

</style>

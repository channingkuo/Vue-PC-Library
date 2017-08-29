<template>
    <div class="theme-pane">
        <!-- 需要实现的是选择主题后获取到对应主题的唯一识别码，反馈给父组件 -->
        <el-dialog title="更换主题" :visible="isShow" :before-close="handleClose" :modal="false">
            <div style="margin-bottom: 10px;">
                <span>更换主题</span>
                <button type="button" aria-label="Close" class="el-dialog__headerbtn" @click="closeThePane"><i class="el-dialog__close el-icon el-icon-close"></i></button>
            </div>
            <hr class="hr" />
            <div class="theme-main">
                <div class="theme-content" @click="chooseTheme(theme)" v-for="(theme, index) in themeDataList" :v-key="index">
                    <img class="theme-image" :src="theme.img">
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
		    return {
                themeDataList: []
		   	}
		},
        props: {
            isShow: {
                default: false
            }
        },
        watch:{
            isShow: function(val){
                // 主题面板打开的初始化
                if(val){
                    this.themeDataList = [{
                        id: '0',
                        img: '../../../static/imgs/skin-violate.jpg',
                        background: '../../../static/imgs/body/violate.jpg',
                        color: {
                            backgroundColor: 'rgba(255, 255, 255, 1)'
                        }
                    },{
                        id: '1',
                        img: '../../../static/imgs/skin-lights.jpg',
                        background: '../../../static/imgs/body/lights.jpg',
                        color: {
                            backgroundColor: 'rgba(0, 0, 0, 1)'
                        }
                    },{
                        id: '2',
                        img: '../../../static/imgs/skin-city.jpg',
                        background: '../../../static/imgs/body/city.jpg',
                        color: {
                            backgroundColor: 'rgba(4, 0, 0, 0.2)'
                        }
                    },{
                        id: '3',
                        img: '../../../static/imgs/skin-greenish.jpg',
                        background: '../../../static/imgs/body/greenish.jpg',
                        color: {
                            backgroundColor: 'rgba(4, 0, 0, 0.2)'
                        }
                    },{
                        id: '4',
                        img: '../../../static/imgs/skin-night.jpg',
                        background: '../../../static/imgs/body/night.jpg',
                        color: {
                            backgroundColor: 'rgba(4, 0, 0, 0.2)'
                        }
                    },{
                        id: '5',
                        img: '../../../static/imgs/skin-blue.jpg',
                        background: '../../../static/imgs/body/blue.jpg',
                        color: {
                            backgroundColor: 'rgba(4, 0, 0, 0.2)'
                        }
                    },{
                        id: '6',
                        img: '../../../static/imgs/skin-sunny.jpg',
                        background: '../../../static/imgs/body/sunny.jpg',
                        color: {
                            backgroundColor: 'rgba(4, 0, 0, 0.2)'
                        }
                    },{
                        id: '7',
                        img: '../../../static/imgs/skin-cloth.jpg',
                        background: '../../../static/imgs/body/cloth.jpg',
                        color: {
                            backgroundColor: 'rgba(4, 0, 0, 0.2)'
                        }
                    },{
                        id: '8',
                        img: '../../../static/imgs/skin-tectile.jpg',
                        background: '../../../static/imgs/body/tectile.jpg',
                        color: {
                            backgroundColor: 'rgba(4, 0, 0, 0.2)'
                        }
                    },{
                        id: '9',
                        img: '../../../static/imgs/skin-chrome.jpg',
                        background: '../../../static/imgs/body/chrome.jpg',
                        color: {
                            backgroundColor: 'rgba(4, 0, 0, 0.2)'
                        }
                    },{
                        id: '10',
                        img: '../../../static/imgs/skin-ocean.jpg',
                        background: '../../../static/imgs/body/ocean.jpg',
                        color: {
                            backgroundColor: 'rgba(4, 0, 0, 0.2)'
                        }
                    },{
                        id: '11',
                        img: '../../../static/imgs/skin-sunset.jpg',
                        background: '../../../static/imgs/body/sunset.jpg',
                        color: {
                            backgroundColor: 'rgba(4, 0, 0, 0.2)'
                        }
                    },{
                        id: '12',
                        img: '../../../static/imgs/skin-yellow.jpg',
                        background: '../../../static/imgs/body/yellow.jpg',
                        color: {
                            backgroundColor: 'rgba(4, 0, 0, 0.2)'
                        }
                    },{
                        id: '13',
                        img: '../../../static/imgs/skin-kiwi.jpg',
                        background: '../../../static/imgs/body/kiwi.jpg',
                        color: {
                            backgroundColor: 'rgba(4, 0, 0, 0.2)'
                        }
                    }]
                }
            }
        },
        mounted: function() {
            this.$nextTick(function () {

            })
	    },
        methods: {
            closeThePane (){
                this.$emit('update:isShow', false)
            },
            handleClose (done){
                this.closeThePane()
                done()
            },
            chooseTheme (theme){
                this.$store.commit('BGSettings', theme)
                this.closeThePane()
            }
		}
    }
</script>

<style>
    .theme-pane .el-dialog__header{
        display: none;
    }
    .theme-pane .el-dialog{
        top: 33px !important;
        background-color: rgba(0, 0, 0, 0.68);
    }
    .theme-pane .el-dialog__body{
        padding: 10px 20px 20px 20px;
        color: white;
        font-size: 10pt;
    }
    .hr{
        height:1px;
        border:none;
        border-top: 1px solid rgba(255, 255, 255, 0.11);
    }
    .theme-main{
        margin-top: 10px;
        width: 100%;
        display: flex;
        display: -webkit-flex;
        flex-flow: row wrap;
        -webkit-flex-flow: row wrap;
    }
    .theme-content{
        text-align: center;
        margin: 0px 3.156px 4px 3.156px;
        cursor: pointer;
        opacity: 0.8;
    }
    .theme-content:hover{
        opacity: 1;
    }
    .theme-image{
        width: 147px;
        height: 86px;
    }
</style>

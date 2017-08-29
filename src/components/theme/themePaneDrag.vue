<template>
    <div class="theme-pane">
        <!-- 需要实现的是选择主题后获取到对应主题的唯一识别码，反馈给父组件 -->
        <div class="overlay" :style="{display: showModel}" @click="closeThePane"></div>
        <div ref="dialog" class="win-dialog" :style="{display: showModel, left: marginLeft + 'px'}">
            <div class="theme-dialog">
                <div style="margin: 10px;cursor:move;" ref="header" class="dialog-header">
                    <span>更换主题</span>
                    <button type="button" aria-label="Close" class="el-dialog__headerbtn" @click="closeThePane">
                        <i class="el-dialog__close el-icon el-icon-close"></i>
                    </button>
                </div>
                <hr class="hr" />
                <div class="theme-main">
                    <div class="theme-content" @click="chooseTheme(theme)" v-for="(theme, index) in themeDataList" :v-key="index">
                        <img class="theme-image" :src="theme.img">
                    </div>
                    <div class="theme-content" @click="changeThemeModel"
                        style="border-left: 1px dashed rgba(255, 255, 255, 0.2); padding-left: 6px;position: relative;">
                        <img class="theme-image" src="../../../static/imgs/classic.png" />
                        <span class="classic-theme">经典</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
		    return {
                marginLeft: document.body.clientWidth / 2 - 450,
                isThemePaneShows: false,

                themeDataList: [],
                showModel: '',

                bDrag: false,
                disX: 0,
                disY: 0
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
                    this.showModel = 'block'
                }else{
                    this.showModel = 'none'
                }
            }
        },
        mounted: function() {
            this.$nextTick(function () {
                /**************控制弹出层拖拽移动************************/
                /**************必须写在this.$nextTick()中***************/
                var dialog = this.$refs.dialog
                var header = this.$refs.header

                var that = this
                header.onmousedown = function (event) {
                    var event = event || window.event
                    that.bDrag = true
                    that.disX = event.clientX - dialog.offsetLeft
                    that.disY = event.clientY - dialog.offsetTop
                    this.setCapture && this.setCapture()
                    return false
                };
                document.onmousemove = function (event) {
                    if (!that.bDrag)
                        return;
                    var event = event || window.event
                    var iL = event.clientX - that.disX
                    var iT = event.clientY - that.disY
                    var maxL = document.documentElement.clientWidth - dialog.offsetWidth
                    var maxT = document.documentElement.clientHeight - dialog.offsetHeight
                    iL = iL < 0 ? 0 : iL
                    iL = iL > maxL ? maxL : iL
                    iT = iT < 0 ? 0 : iT
                    iT = iT > maxT ? maxT : iT

                    dialog.style.marginTop = dialog.style.marginLeft = 0
                    dialog.style.left = iL + "px"
                    dialog.style.top = iT + "px"
                    return false
                };
                document.onmouseup = window.onblur = header.onlosecapture = function () {
                    that.bDrag = false
                    header.releaseCapture && header.releaseCapture()
                };
                /**************控制弹出层拖拽移动************************/
            })
	    },
        methods: {
            closeThePane (){
                this.$emit('update:isShow', false)
            },
            chooseTheme (theme){
                this.$store.commit('BGSettings', theme)
                this.closeThePane()
            },
            // 切换经典酷炫模式
            changeThemeModel (){
                this.$confirm('是否切换配色系统', '提示', {
                    confirmButtonText: '确定',
                    confirmButtonClass: 'ConfirmButtonClass',
                    cancelButtonText: '取消',
                    cancelButtonClass: 'CancelButtonClass',
                    type: 'warning'
                }).then(() => {
                    this.closeThePane()
                    this.$store.commit('ThemeModel', !this.$store.getters.getThemeModel)
                    this.$router.go(0)
                }).catch(() => {
                    return
                })
            }
		}
    }
</script>

<style scoped>
    .overlay{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        opacity: 0.5;
        filter: alpha(opacity = 50);
        display: none;
    }
    .win-dialog{
        position: absolute;
        top: 33px;
        background-color: rgba(0, 0, 0, 0.68);
        display: none;
        z-index: 9000;
    }
    .theme-dialog{
        width: 920px;
        height: 320px;
    }
    .dialog-header{
        color: white;
        font-size: 10pt;
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
    .theme-content:hover .classic-theme{
        display: block;
    }
    .classic-theme{
        display: none;
        color: #d7d5d5;
        font-size: 25px;
        position: absolute;
        left: 55px;
        top: 30px;
    }
    .ConfirmButtonClass{
        height: 30px;
        padding: 0px;
        width: 60px;
        border-radius: 15px !important;
        background-color: #ffba08 !important;
        color: #fff !important;
        padding: 0px !important;
        border: none !important;
    }
    .ConfirmButtonClass:hover{
        color: #fff !important;
        border: none !important;
        background-color: #ffc634 !important;
    }
    .ConfirmButtonClass:active{
        color: #fff !important;
        border: none !important;
        background-color: #f8a616 !important;
    }
    .CancelButtonClass{
        height: 30px;
        padding: 0px;
        width: 60px;
        border-radius: 15px !important;
        border-color: #ffba08 !important;
        background-color: #fff !important;
        color: #ffc634 !important;
        padding: 0px !important;
    }
    .CancelButtonClass:hover{
        border-color: #ffc634 !important;
        color: #ffc634 !important;
        background-color: #fff !important;
    }
    .CancelButtonClass:active{
        border-color: #f8a616 !important;
        color: #f8a616 !important;
        background-color: #fff !important;
    }
</style>

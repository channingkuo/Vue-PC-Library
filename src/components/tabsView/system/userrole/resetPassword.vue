<template>
    <div class="reset-user-password">
        <div class="user-password-overlay" :style="{display: showModel, width: width + 'px', height: height + 'px'}"></div>
        <div ref="userPassword" class="user-password" :style="{ top: marginTop + 'px', left: marginLeft + 'px', display: showModel }">
            <!-- header -->
            <div ref="userPasswordHeader" class="set-user-password-header">
                <div style="font-size: 14px;color: #d7d5d5;height: 16px;line-height:16px;">重置密码</div>
                <div style="height: 16px;margin-top: 1px;">
                    <button type="button" aria-label="Close" class="el-dialog__headerbtn" @click="close">
                        <i class="el-dialog__close el-icon el-icon-close" style="font-size: 14px;"></i>
                    </button>
                </div>
            </div>
            <!-- form content -->
            <div style="margin-top: 18px;" class="user-password-panel">
                <div class="password-input">
                    <div style="line-height: 30px;">密　码</div>
                    <el-input style="width: 420px;margin-left: 12px;" class="reset-password" placeholder="请输入密码，区分大小写" v-model="newPassword"  type="password"></el-input>
                </div>
                <div style="text-align: center;margin-top: 30px;">
                    <k-button text="保存" icon="" @click="resetPasseword"></k-button>
                    <k-button text="取消" icon="" style="margin-left: 40px;" @click="close"></k-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { Loading } from 'element-ui'

    export default {
        props: {
            isShow: {
                default: false
            },
            userInfoList: {
                type: Array,
                default: function () {
                    return []
                }
            }
        },
        data() {
		    return {
                showModel: '',
                width: document.body.clientWidth,
                height: document.body.clientHeight,
                marginLeft: (document.body.clientWidth - 88) / 2 - 280,
                marginTop: (document.body.clientHeight - 88) / 2 - 260,

                bDrag: false,
                disX: 0,
                disY: 0,

                newPassword: ''
		   	}
		},
        watch:{
            isShow: function(val){
                // 面板打开的初始化
                if(val){
                    this.showModel = 'block'
                    this.$nextTick(function () {
                        /**************控制弹出层拖拽移动************************/
                        /**************必须写在this.$nextTick()中***************/
                        var dialog = this.$refs.userPassword
                        var header = this.$refs.userPasswordHeader

                        var that = this
                        header.onmousedown = function (event) {
                            var event = event || window.event
                            that.bDrag = true
                            that.disX = event.clientX - dialog.offsetLeft
                            that.disY = event.clientY - dialog.offsetTop
                            this.setCapture && this.setCapture()
                            return false
                        };
                        window.onmousemove = function (event) {
                            if (!that.bDrag)
                                return;
                            var event = event || window.event
                            var iL = event.clientX - that.disX
                            var iT = event.clientY - that.disY
                            var maxL = document.documentElement.clientWidth - 100 - dialog.offsetWidth
                            var maxT = document.documentElement.clientHeight - 100 - dialog.offsetHeight
                            iL = iL < 0 ? 0 : iL
                            iL = iL > maxL ? maxL : iL
                            iT = iT < 0 ? 0 : iT
                            iT = iT > maxT ? maxT : iT

                            dialog.style.marginTop = dialog.style.marginLeft = 0
                            dialog.style.left = iL + "px"
                            dialog.style.top = iT + "px"
                            return false
                        };
                        window.onmouseup = window.onblur = header.onlosecapture = function () {
                            that.bDrag = false
                            header.releaseCapture && header.releaseCapture()
                        };
                        /**************控制弹出层拖拽移动************************/
                    })
                }else{
                    this.showModel = 'none'
                }
            }
        },
        methods: {
            close (){
                this.$emit('update:isShow', false)
                this.beforeClose()
            },
            beforeClose (){
                this.newPassword = ''
            },
            resetPasseword (){
                if(cooler.isNullOrWhiteSpace(this.newPassword)){
                    this.$message({
                        showClose: true,
                        message: '密码不能为空！',
                        type: 'warning'
                    })
                    return
                }
                // 密码规则验证
                var regex = /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S+$/g
                if(!regex.test(this.newPassword)){
                    this.$message({
                        showClose: true,
                        message: '密码必须包含大写、小写字母、数字其中至少两项！',
                        type: 'warning'
                    })
                    return
                }
                alert('缺少重置密码的接口')
                console.log(this.userInfoList)
            }
        }
    }
</script>

<style>
    .user-password-overlay{
        position: fixed;
        top: 0;
        left: 0;
        background: #000;
        opacity: 0.5;
        filter: alpha(opacity = 50);
        display: none;
        z-index: 2;
    }
    .user-password{
        width: 550px;
        position: absolute;
        background-color: rgba(4, 0, 0, 0.8);
        min-height: 168px;
        display: none;
        z-index: 2;
    }
    .user-dialog-header-password{
        color: white;
        font-size: 10pt;
        border-bottom: 1px solid gray;
        cursor: move;
    }
    .set-user-password-header{
        background-color: rgba(0, 0, 0, 0.6);
        padding: 10px 15px;
        display: flex;
        display: -webkit-flex;
        justify-content: space-between;
        -webkit-justify-content: space-between;
        cursor: move;
    }

    .password-input{
        display: flex;
        display: -webkit-flex;
        justify-content: center;
        -webkit-justify-content: center;
    }
    .reset-password .el-input__inner{
        width: 420px;
        border-radius: 0px;
        background-color: rgba(39, 157, 218, 0.3);
        border: 1px solid #279dda;
        color: #d7d5d5;
    }
    .reset-password .el-input__inner:hover,.reset-password .el-input__inner:focus{
        background-color: rgba(0, 0, 0, 0.3);
    }
</style>

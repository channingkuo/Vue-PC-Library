<template>
    <div class="add-new-user">
        <div class="overlay1" :style="{display: showModel, width: width + 'px', height: height + 'px'}"></div>
        <div ref="adduser" class="add-pane" :style="{ top: marginTop + 'px', left: marginLeft + 'px', display: showModel }">
            <!-- header -->
            <div ref="userheader" class="add-user-header">
                <div style="font-size: 14px;color: #d7d5d5;height: 16px;line-height:16px;">新增用户</div>
                <div style="height: 16px;margin-top: 1px;">
                    <button type="button" aria-label="Close" class="el-dialog__headerbtn" @click="close">
                        <i class="el-dialog__close el-icon el-icon-close" style="font-size: 14px;"></i>
                    </button>
                </div>
            </div>
            <!-- form content -->
            <div style="margin: 18px 38px 0px 38px;" class="add-user-content">
                <el-form label-position="left" label-width="80px" :model="formUserData">
                    <el-form-item label="用　户" required>
                        <el-input v-model="formUserData.userName" placeholder="请输入内容" style="width: 100%;"></el-input>
                    </el-form-item>
                    <el-form-item label="邮　件" required>
                        <el-input v-model="formUserData.userEmail" placeholder="请输入内容" style="width: 100%;"></el-input>
                    </el-form-item>
                    <el-form-item label="手　机" required>
                        <el-input v-model="formUserData.userPhoto" placeholder="请输入内容" style="width: 100%;"></el-input>
                    </el-form-item>
                    <el-form-item label="密　码" required>
                        <el-input type="password" v-model="formUserData.userPassword" placeholder="请输入内容" style="width: 100%;"></el-input>
                    </el-form-item>

                    <div style="margin-top: 30px;text-align: center;">
                        <k-button text="确定" icon="" @click="saveTheUser"></k-button>
                        <k-button text="取消" icon="" style="margin-left: 40px;" @click="close"></k-button>
                    </div>
                </el-form>
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

                formUserData: {
                    userName: '',
                    userEmail: '',
                    userPhoto: '',
                    userPassword: ''
                }
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
                        var dialog = this.$refs.adduser
                        var header = this.$refs.userheader

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
            saveTheUser (){
                if(cooler.isNullOrWhiteSpace(this.formUserData.userName)){
                    this.$message({
                        showClose: true,
                        message: '用户名不能为空！',
                        type: 'warning'
                    })
                    return
                }
                if(cooler.isNullOrWhiteSpace(this.formUserData.userEmail)){
                    this.$message({
                        showClose: true,
                        message: '邮件不能为空！',
                        type: 'warning'
                    })
                    return
                }
                if(cooler.isNullOrWhiteSpace(this.formUserData.userPhoto)){
                    this.$message({
                        showClose: true,
                        message: '手机不能为空！',
                        type: 'warning'
                    })
                    return
                }
                if(cooler.isNullOrWhiteSpace(this.formUserData.userPassword)){
                    this.$message({
                        showClose: true,
                        message: '密码不能为空！',
                        type: 'warning'
                    })
                    return
                }
                // 密码规则验证
                var regex = /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S+$/g
                if(!regex.test(this.formUserData.userPassword)){
                    this.$message({
                        showClose: true,
                        message: '密码必须包含大写、小写字母、数字其中至少两项！',
                        type: 'warning'
                    })
                    return
                }

                var that = this
                let apiUrl = 'SystemAPI/whapi/User/add'
                let bodyData = {
                    userctf: that.$store.state.userInfo.userCertificate,
                    cid: that.$store.state.userInfo.resCompany.id,
                    username: that.formUserData.userName,
                    phonenum: that.formUserData.userPhoto,
                    email: that.formUserData.userEmail,
                    pwd: that.formUserData.userPassword
                }
                let loading = Loading.service({
                    fullscreen: true,
                    text: '正在保存...'
                })
                that.$auth.post(apiUrl, bodyData).then((resp) => {
                    loading.close()
                    if(resp.data.errcode === '0'){
                        that.$message({
                            showClose: true,
                            message: '新增成功！',
                            type: 'success'
                        })
                        that.close()
                    }else{
                        throw (resp.data.errmsg)
                    }
                }).catch((err) => {
                    loading.close()
                    that.$message({
                        showClose: true,
                        message: err,
                        type: 'error'
                    })
                })
            },
            beforeClose (){
                this.formUserData = {
                    userName: '',
                    userEmail: '',
                    userPhoto: '',
                    userPassword: ''
                }
            }
        }
    }
</script>

<style>
    .overlay1{
        position: fixed;
        top: 0;
        left: 0;
        background: #000;
        opacity: 0.5;
        filter: alpha(opacity = 50);
        display: none;
        z-index: 2;
    }
    .add-pane{
        width: 550px;
        position: absolute;
        background-color: rgba(0, 0, 0, 0.7);
        min-height: 306px;
        display: none;
        z-index: 2;
    }


    .add-user-header{
        background-color: rgba(0, 0, 0, 0.6);
        padding: 10px 15px;
        display: flex;
        display: -webkit-flex;
        justify-content: space-between;
        -webkit-justify-content: space-between;
        cursor: move;
    }
    .add-user-content .el-input__inner{
        border-radius: 0px;
        background-color: rgba(39, 157, 218, 0.3);
        border: 1px solid #279dda;
        color: #d7d5d5;
    }
    .add-user-content .el-input__inner:hover,.add-user-content .el-input__inner:focus{
        background-color: rgba(0, 0, 0, 0.3);
    }
</style>

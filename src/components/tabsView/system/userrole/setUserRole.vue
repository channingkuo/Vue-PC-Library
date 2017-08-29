<template>
    <div class="set-user-role">
        <div class="user-role-overlay" :style="{display: showModel, width: width + 'px', height: height + 'px'}"></div>
        <div ref="userRole" class="user-role" :style="{ top: marginTop + 'px', left: marginLeft + 'px', display: showModel }">
            <!-- header -->
            <div ref="userRoleHeader" class="set-user-role-header">
                <div style="font-size: 14px;color: #d7d5d5;height: 16px;line-height:16px;">设置角色</div>
                <div style="height: 16px;margin-top: 1px;">
                    <button type="button" aria-label="Close" class="el-dialog__headerbtn" @click="close">
                        <i class="el-dialog__close el-icon el-icon-close" style="font-size: 14px;"></i>
                    </button>
                </div>
            </div>
            <!-- form content -->
            <div style="margin: 18px 38px 0px 38px;" class="user-role-panel">
                <el-form label-position="left" label-width="80px" :model="userRoleData">
                    <div style="margin-bottom: 12px;">当前用户：{{ userInfo.empname }}</div>
                    <el-form-item label="角　色">
                        <el-select v-model="userRoleData.roleData" multiple placeholder="请选择用户角色" style="width: 100%;">
                            <el-option v-for="item in userRoleList" :key="item.id" :label="item.rolename" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>

                    <div style="text-align: center;margin-top: 30px;">
                        <k-button text="保存" icon="" @click="saveTheUserRole"></k-button>
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
            },
            userInfo: {
                type: Object,
                default: function () {
                    return {}
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

                userRoleData: {
                    roleData: []
                },
                userRoleList: []
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
                        var dialog = this.$refs.userRole
                        var header = this.$refs.userRoleHeader

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
                    this.loadRoleList()
                }else{
                    this.showModel = 'none'
                }
            }
        },
        methods: {
            loadRoleList (){
                let loading = Loading.service({
                    fullscreen: true,
                    text: '正在加载...'
                })
                let apiUrl = 'SystemAPI/api/Role/getrole'
                var bodyData = {
                    userctf: this.$store.state.userInfo.userCertificate,
                    cid: this.$store.state.userInfo.resCompany.id
                }
                var that = this
                that.$auth.post(apiUrl, bodyData).then((resp) => {
                    if(resp.data.errcode === '0'){
                        that.userRoleList = resp.data.resData.rolearray
                        let api = 'SystemAPI/whapi/User/loadone'
                        let body = {
                            userctf: that.$store.state.userInfo.userCertificate,
                            cid: that.$store.state.userInfo.resCompany.id,
                            chooseID: that.userInfo.id
                        }
                        return that.$auth.post(api, body)
                    }else{
                        throw (resp.data.errmsg)
                    }
                }).then((resp) => {
                    loading.close()
                    if(resp.data.errcode === '0'){
                        resp.data.resData.userInfo.roles.forEach((role, index) =>{
                            that.userRoleData.roleData.push(role.id)
                        })
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
            close (){
                this.$emit('update:isShow', false)
                this.beforeClose()
            },
            beforeClose (){
                this.userRoleData.roleData = []
            },
            // 保存用户选择的角色
            saveTheUserRole (){

            }
        }
    }
</script>

<style>
    .user-role-overlay{
        position: fixed;
        top: 0;
        left: 0;
        background: #000;
        opacity: 0.5;
        filter: alpha(opacity = 50);
        display: none;
        z-index: 2;
    }
    .user-role{
        width: 550px;
        position: absolute;
        background-color: rgba(4, 0, 0, 0.8);
        min-height: 200px;
        display: none;
        z-index: 2;
    }
    .set-user-role-header{
        background-color: rgba(0, 0, 0, 0.6);
        padding: 10px 15px;
        display: flex;
        display: -webkit-flex;
        justify-content: space-between;
        -webkit-justify-content: space-between;
        cursor: move;
    }
    .user-role-panel .el-input__inner{
        border-radius: 0px;
        background-color: rgba(39, 157, 218, 0.4);
        border: 1px solid #279dda;
        color: #d7d5d5;
    }
    .user-role-panel .el-input__inner:focus{
        background-color: rgba(39, 157, 218, 0.3);
    }
</style>

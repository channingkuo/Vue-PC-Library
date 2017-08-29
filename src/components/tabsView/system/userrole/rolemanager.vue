<template>
    <div class="role-manager" :style="{height: homeHeight + 'px' }">
        <div class="role-manager-content">
            <!-- 角色管理 -->
            <div class="role-manager-table">
                <div style="font-size: 14px;color: #d7d5d5;">角色管理</div>

                <div class="role-control">
                    <k-button text="新增" icon="icon-add"></k-button>
                    <k-button text="禁用" icon=""></k-button>
                    <k-button text="删除" icon=""></k-button>
                    <k-button text="导出" icon="icon-export"></k-button>
                    <k-button text="导出关联"></k-button>
                </div>

                <div class="role-table">
                    <el-table ref="roletable" :data="roleDataList" border stripe :height="homeHeight - 84"
                        :row-class-name="stripeClass"
                        @row-click="setCurrent" highlight-current-row>
                        <el-table-column align="center" type="selection" width="55"></el-table-column>
                        <el-table-column type="index" width="50"></el-table-column>
                        <el-table-column align="center" prop="rolename" label="角色名称" sortable></el-table-column>
                        <el-table-column align="center" prop="roletype" label="属性"></el-table-column>
                        <el-table-column align="center" prop="status" label="状态"
                            :filters="[{ text: '禁用', value: '禁用' }, { text: '启用', value: '启用' }]"
                            :filter-method="filterTag" filter-placement="bottom-end"></el-table-column>
                    </el-table>
                </div>
            </div>
            <!-- 角色用户 -->
            <div class="role-manager-table">
                <div style="font-size: 14px;color: #d7d5d5;">所属用户</div>
                <div class="role-control" style="justify-content: space-between;-webkit-justify-content: space-between;">
                    <el-input class="user-search-input" style="margin-left: 0px;"
                        placeholder="请输入内容" icon="search" v-model="userToRoleSearchText" :on-icon-click="searchUserToRole"></el-input>
                    <div>
                        <k-button text="导出" icon="icon-export"></k-button>
                        <k-button text="移除" icon="icon-arrow-right"></k-button>
                    </div>
                </div>
                <div class="role-table">
                    <el-table :data="userToRole" border stripe :height="homeHeight - 84"
                        :row-class-name="stripeClass">
                        <el-table-column align="center" type="selection" width="55"></el-table-column>
                        <el-table-column type="index" width="50"></el-table-column>
                        <el-table-column align="center" prop="rolename" label="员工" sortable></el-table-column>
                        <el-table-column align="center" prop="roletype" label="工号"></el-table-column>
                        <el-table-column align="center" prop="status" label="手机"></el-table-column>
                    </el-table>
                </div>
            </div>
            <!-- 未分配用户 -->
            <div class="role-manager-table">
                <div style="font-size: 14px;color: #d7d5d5;">未分配用户</div>
                <div class="role-control" style="justify-content: space-between;-webkit-justify-content: space-between;">
                    <k-button text="加入" icon="icon-arrow-left"></k-button>
                    <el-input class="user-search-input" placeholder="请输入内容"
                        icon="search" v-model="unselectedUserSearchText" :on-icon-click="searchUnselectedUser"></el-input>
                </div>
                <div class="role-table">
                    <el-table :data="unselectedUser" border stripe :height="homeHeight - 84"
                        :row-class-name="stripeClass">
                        <el-table-column align="center" type="selection" width="55"></el-table-column>
                        <el-table-column type="index" width="50"></el-table-column>
                        <el-table-column align="center" prop="rolename" label="员工" sortable></el-table-column>
                        <el-table-column align="center" prop="roletype" label="工号"></el-table-column>
                        <el-table-column align="center" prop="status" label="手机"></el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { Loading } from 'element-ui'

    export default {
        data() {
		    return {
                homeHeight: document.body.clientHeight - 98,

                allUser: [],

                roleDataList: [],
                userToRole: [],
                unselectedUser: [],
                userToRoleSearchText: '',
                unselectedUserSearchText: ''
		   	}
		},
        mounted: function() {
            this.$nextTick(function () {
                this.loadUserRoleList()
            })
	    },
        methods: {
            // 加载所有用户数据
            loadAllUser (){

            },
            // 获取所有角色列表
            loadUserRoleList (){
                let loading = Loading.service({
                    fullscreen: true,
                    text: '正在加载...'
                })
                var that = this
                let apiUrl = 'SystemAPI/api/Role/getrole?userctf=' + that.$store.state.userInfo.userCertificate + '&cid=' + that.$store.state.userInfo.resCompany.id
                that.$auth.post(apiUrl).then((resp) => {
                    loading.close()

                    if(resp.data.errcode !== '0'){
                        throw (resp.data.errmsg)
                    }else{
                        that.roleDataList = resp.data.resData.rolearray

                        if(that.roleDataList.length > 0){
                            that.loadUserToRole(that.roleDataList[0].id)
                            // 默认选中第一行
                            setTimeout(function(){
                                that.$refs.roletable.setCurrentRow(that.roleDataList[0])
                            }, 500)
                        }
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
            loadUserToRole (roleId){
                let api = 'SystemAPI/api/Role/loadrole'
                var bodyData = {
                    userctf: this.$store.state.userInfo.userCertificate,
                    cid: this.$store.state.userInfo.resCompany.id,
                    roleid: roleId
                }
                var that = this
                that.$auth.post(api, bodyData).then((resp) => {
                    if(resp.data.errcode !== '0'){
                        throw (resp.data.errmsg)
                    }else{
                        that.userToRole = resp.data.resData
                    }
                }).catch((err) => {
                    that.$message({
                        showClose: true,
                        message: err,
                        type: 'error'
                    })
                })
            },
            stripeClass (row, index){
                if(index % 2 === 0){
                    return 'user-table-row-0'
                }else{
                    return 'user-table-row-1'
                }
            },
            setCurrent (row, event, column){
                this.$refs.roletable.setCurrentRow(row)
                // 加载用户数据
                this.loadUserToRole(row.id)
            },
            filterTag (value, row){
                return row.status === value
            },
            searchUserToRole (){

            },
            searchUnselectedUser (){

            }
		}
    }
</script>

<style>
    .role-manager{
        position: relative;
        background-color: rgba(4, 0, 0, 0.2);
        color: #D7D5D5;
    }
    .role-manager-content{
        display: flex;
        display: -webkit-flex;
        justify-content: space-between;
        -webkit-justify-content: space-between;
        padding: 10px;
    }
    .role-manager-table{
        width: 33%;
    }
    .role-control{
        padding: 10px 0px;
        display: flex;
        display: -webkit-flex;
        height: 30px;
    }
    .user-table-row-0{
        background-color: rgba(0, 0, 0, .3) !important;
        color: #d7d5d5;
    }
    .user-table-row-1{
        background-color: rgba(0, 0, 0, .2) !important;
        color: #d7d5d5;
    }
    .user-search-input{
        height: 30px;
        width: 200px;
        margin-left: 40px;
        background-color: rgba(39, 157, 218, 0.3);
        border-radius: 0px;
    }
    .user-search-input .el-input__inner{
        height: 30px;
        width: 200px;
        color: white;
        background-color: rgba(39, 157, 218, 0.3);
        border: 1px solid #279dda;
        border-radius: 0px;
    }
    .user-search-input .el-input__inner:focus{
        background-color: transparent;
    }
</style>

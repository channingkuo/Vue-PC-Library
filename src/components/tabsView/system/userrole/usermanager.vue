<template>
    <div class="user-manager" :style="{height: homeHeight + 'px' }" @click="hideTheHelpPanel">
        <!-- 帮助按钮及帮助面板 -->
        <div class="user-help" @click.stop="showTheHelpPanel">帮助</div>
        <transition name="el-zoom-in-center">
            <div v-show="isShowHelpPanel" class="user-help-panel" :style="{height: helpPanelHeight - 10 + 'px' }" @click.stop="">
                <div>帮助内容</div>
            </div>
        </transition>
        <!-- 操作控件 -->
        <div class="user-contorl">
            <k-button text="新增" icon="icon-add" @click="addUser"></k-button>
            <k-button text="编辑" icon="icon-apply" @click="editSelectedUser"></k-button>
            <k-button text="禁用" icon="" @click="disabledUser"></k-button>
            <k-button text="删除" icon="" @click="deleteUser"></k-button>
            <k-button text="重置" icon="icon-refresh" @click="refreshUser"></k-button>
            <k-button text="同步" icon="" @click="test"></k-button>
            <k-button text="导出" icon="icon-export" style="margin-left: 30px;" @click="test"></k-button>
            <k-button text="导入" icon="icon-upload" @click="test"></k-button>

            <el-input class="user-search-input" placeholder="请输入内容" icon="search" v-model="searchText" :on-icon-click="searchClick"></el-input>

            <el-checkbox class="user-check-box" v-model="showDisabledUser" @change="changeDisplay(showDisabledUser)">仅显示禁用用户</el-checkbox>
        </div>

        <!-- Table数据 -->
        <div class="user-table">
            <el-table :data="userDataList" border stripe :height="helpPanelHeight - 30" :row-class-name="stripeClass"
                @row-dblclick="editUser" @selection-change="handleSelectionChange">
                <el-table-column align="center" type="selection" width="55"></el-table-column>
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column align="center" prop="empname" label="员工" width="160" sortable></el-table-column>
                <el-table-column align="center" prop="empcode" label="工号" width="150" sortable></el-table-column>
                <el-table-column align="center" prop="phone" label="手机" width="200"></el-table-column>
                <el-table-column align="center" prop="isenabled" label="状态" width="100"
                    :filters="[{ text: '禁用', value: '否' }, { text: '启用', value: '是' }]"
                    :filter-method="filterTag" filter-placement="bottom-end">
                    <template scope="scope">{{ scope.row.isenabled == '是' ? '启用' : '禁用' }}</template>
                </el-table-column>
                <el-table-column align="center" prop="createuser" label="创建人" width="160"></el-table-column>
                <el-table-column align="center" prop="createdate" label="创建时间" width="200" sortable></el-table-column>
                <el-table-column align="left" prop="roles" label="角色"></el-table-column>
                <el-table-column align="center" label="操作" width="100">
                    <template scope="scope">
                        <el-button type="text" size="small" @click="editUserRole(scope)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 操作面板 -->
        <add-user :is-show.sync="addUserData"></add-user>
        <edit-user :is-show.sync="editUserData" :user-id="selectedRow.id"></edit-user>
        <edit-user-role :is-show.sync="editUserRoleShow" :user-info="selectedRow"></edit-user-role>
        <reset-user-password :is-show.sync="resetUserPasswordShow" :user-info-list="multselectedRows"></reset-user-password>
    </div>
</template>

<script>
    import { Loading } from 'element-ui'
    var addUser = require('./userNewDialog.vue')
    var editUser = require('./userEditDialog.vue')
    var editUserRoleVue = require('./setUserRole.vue')
    var resetUserPassword = require('./resetPassword.vue')

    export default {
        data() {
		    return {
                homeHeight: document.body.clientHeight - 98,
                helpPanelHeight: document.body.clientHeight - 98 - 30,
                isShowHelpPanel: false,

                searchText: '',
                showDisabledUser: false,

                userData: [],
                userDataList: [],
                selectedRow: [],

                addUserData: false,
                editUserData: false,
                editUserRoleShow: false,
                resetUserPasswordShow: false,
                selectedRow: {},
                multselectedRows: []
		   	}
		},
        components: {
            'add-user': addUser,
            'edit-user': editUser,
            'edit-user-role': editUserRoleVue,
            'reset-user-password': resetUserPassword
        },
        mounted: function() {
            this.$nextTick(function () {
                this.loadUserList()
            })
	    },
        watch: {
            addUserData: function(oldder, newer){
                if(newer){
                    this.loadUserList()
                }
            },
            editUserData: function(oldder, newer){
                if(newer){
                    this.loadUserList()
                }
            }
        },
        methods: {
            test (){
                alert('暂未开放！')
            },
            // 禁用用户
            disabledUser (){
                if(this.multselectedRows.length <= 0){
                    this.$message({
                        showClose: true,
                        message: '请先选择需要禁用的行！',
                        type: 'warning'
                    })
                    return
                }
                this.$confirm('是否确认禁用选中的用户？', '询问', {
                    confirmButtonText: '确定',
                    confirmButtonClass: 'ConfirmButtonClass',
                    cancelButtonText: '取消',
                    cancelButtonClass: 'CancelButtonClass',
                    type: 'warning'
                }).then(() => {
                    alert('缺少禁用接口')
                    console.log(this.multselectedRows)
                }).catch(() => {
                    return
                })
            },
            // 删除用户
            deleteUser (){
                if(this.multselectedRows.length <= 0){
                    this.$message({
                        showClose: true,
                        message: '请先选择需要删除的行！',
                        type: 'warning'
                    })
                    return
                }
                this.$confirm('数据删除后无法恢复，是否确认删除？', '询问', {
                    confirmButtonText: '确定',
                    confirmButtonClass: 'ConfirmButtonClass',
                    cancelButtonText: '取消',
                    cancelButtonClass: 'CancelButtonClass',
                    type: 'warning'
                }).then(() => {
                    alert('缺少删除接口')
                    console.log(this.multselectedRows)
                }).catch(() => {
                    return
                })
            },
            // 重置用户密码
            refreshUser (){
                if(this.multselectedRows.length <= 0){
                    this.$message({
                        showClose: true,
                        message: '请先选择需要重置密码的用户！',
                        type: 'warning'
                    })
                    return
                }
                this.resetUserPasswordShow = true
                // alert('缺少重置接口')
                // console.log(this.multselectedRows)
            },
            loadUserList (){
                let loading = Loading.service({
                    fullscreen: true,
                    text: '正在加载...'
                })
                var that = this
                let apiUrl = 'SystemAPI/whapi/User/loadcusers?userctf=' + that.$store.state.userInfo.userCertificate + '&cid=' + that.$store.state.userInfo.resCompany.id

                that.$auth.post(apiUrl).then((resp) => {
                    loading.close()

                    if(resp.data.errcode !== '0'){
                        throw (resp.data.errmsg)
                    }else{
                        that.userData = that.userDataList = resp.data.resData
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
            // 搜索用户
            searchClick (){

            },
            addUser (){
                this.addUserData = true
            },
            showTheHelpPanel (){
                this.isShowHelpPanel = !this.isShowHelpPanel
            },
            hideTheHelpPanel (){
                this.isShowHelpPanel = false
            },
            // 前端本地筛选过滤，不是很好
            changeDisplay (value){
                if(value){
                    // 显示禁用用户
                    this.userDataList = []
                    this.userData.forEach((user, index) => {
                        if(user.status === 0){
                            this.userDataList.push(user)
                        }
                    })
                }else{
                    // 显示所有用户
                    this.userDataList = this.userData
                }
            },
            stripeClass (row, index){
                if(index % 2 === 0){
                    return 'user-table-row-0'
                }else{
                    return 'user-table-row-1'
                }
            },
            filterTag (value, row){
                return row.isenabled === value
            },
            // 表格行双击操作
            editUser (row, event){
                this.editUserData = true
                this.selectedRow = row
            },
            // 选择每一行的事件
            handleSelectionChange (items){
                this.multselectedRows = items
            },
            // 编辑选中的一行的内容
            editSelectedUser (){
                if(this.multselectedRows.length <= 0){
                    this.$message({
                        showClose: true,
                        message: '请先选择一行再进行编辑',
                        type: 'warning'
                    })
                    return
                }
                if(this.multselectedRows.length >= 2){
                    this.$message({
                        showClose: true,
                        message: '单次只能编辑一个用户',
                        type: 'warning'
                    })
                    return
                }
                this.editUserData = true
                this.selectedRow = this.multselectedRows[0]
            },
            // 设置用户的角色
            editUserRole (scope){
                this.editUserRoleShow = true
                this.selectedRow = scope.row
            }
		}
    }
</script>

<style>
    .user-manager{
        position: relative;
        background-color: rgba(4, 0, 0, 0.2);
        color: #D7D5D5;
    }
    .user-help{
        position: absolute;
        top: 8px;
        right: 16px;
        font-size: 14px;
        cursor: pointer;
    }
    .user-contorl{
        height: 30px;
        padding: 10px;
        display: flex;
        display: -webkit-flex;
    }
    .user-help-panel{
        position: absolute;
        right: 0px;
        top: 30px;
        width: 200px;
        background-color: rgba(0, 0, 0, 0.6);
        overflow-y: auto;
        z-index: 9000;
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
    .user-check-box{
        line-height: 30px;
        margin-left: 40px;
        color: #d7d5d5;
    }
    .user-check-box .el-checkbox__inner{
        background-color: rgba(39, 157, 218, 0.3);
        border: 1px solid #279dda;
        border-radius: 0px;
        width: 16px;
        height: 16px;
    }
    .user-check-box .el-checkbox__label{
        padding-left: 8px;
    }

    .user-table{
        padding: 0px 10px;
    }
    .user-table .el-table{
        width: 99.9%;
        max-width: 99.9%;
    }
    .user-table .el-table__body-wrapper{
        overflow-x: hidden;
    }
    .user-table-row-0{
        background-color: rgba(0, 0, 0, .3) !important;
        color: #d7d5d5;
    }
    .user-table-row-1{
        background-color: rgba(0, 0, 0, .2) !important;
        color: #d7d5d5;
    }
</style>

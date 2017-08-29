<template>
    <div class="login" @keyup.enter="login('ruleForm')">
        <div class="logoStyle">
            <img class="logoImg" src="../../assets/imgs/login-left.jpg" />
        </div>
        <div class="formStyle">
            <div style="padding-top: 30%;">
                <img src="">
            </div>

            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm formPosition">
                <el-form-item prop="username">
                    <el-input style="width: 90%;" placeholder="用户名" type="text" v-model="ruleForm.username" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input style="width: 90%;" placeholder="密码" type="password" v-model="ruleForm.password" auto-complete="off"></el-input>
                </el-form-item>
                <div>
                    <el-form-item prop="type" style="width: 90%;">
                        <!-- <a class="forget-password" href="#">忘记密码？</a> -->
                    </el-form-item>
                </div>
                <div class="loginButtonDiv">
                    <el-button class="loginButton" type="primary" @click="login('ruleForm')" :loading="isLogining">{{isLogining ? '登录中' : '登录'}}</el-button>
                </div>
            </el-form>

            <div class="copyright">
                <span>Copyright © 2017 苏州金普软件科技有限公司 All Rights Reserved</span>
            </div>
        </div>

        <company-select :is-show.sync="isShowCompanyPane" :company-list="companyList"></company-select>

    </div>
</template>

<script>
    var company = require('./companySelected.vue')
    import { Loading } from 'element-ui'

    export default {
        data() {
            var validateUsername = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入用户名'))
                } else {
                    if (this.ruleForm.username !== '') {
                        callback()
                    }
                }
            }

            var validatePassword = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'))
                } else {
                    if (this.ruleForm.password !== '') {
                        callback()
                    }
                }
            }

            return {
                isShowCompanyPane: false,
                companyList: [],

                isLogining: false,
                ruleForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        { validator: validateUsername, trigger: 'blur' }
                    ],
                    password: [
                        { validator: validatePassword, trigger: 'blur' }
                    ]
                }
            }
        },
        components: {
            'company-select': company
        },
        mounted: function () {
            this.$nextTick(function () {
                let bgSettings = {
                    id: '',
                    background: '../../../static/imgs/body/blue.jpg',
                    img: '../../../static/imgs/skin-blue.jpg',
                    color: {
                        backgroundColor: 'rgba(4, 0, 0, 0.2)'
                    }
                }
                if(cooler.isNull(this.$store.state.backgroundSettings) || cooler.isNullOrWhiteSpace(this.$store.state.backgroundSettings.background)){
                    this.$store.commit('BGSettings', bgSettings)
                }
            })
        },
        methods: {
            login(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var user = {
                            username: this.ruleForm.username,
                            password: this.ruleForm.password
                        }
                        this.checkLogin(user)
                    } else {
                        return false
                    }
                })
            },
            checkLogin(userInfo) {
                this.isLogining = true
                var that = this
                let tokenUrl = 'Systemapi/whapi/Token/getutoken?uname=workhub_admin&pwd=kingpro-65732285'
                that.$auth.post(tokenUrl).then((resp) => {
                    if(resp.data.errcode !== '0'){
                        throw (resp.data.errmsg)
                    }else{
                        // 存储token信息
                        that.$store.commit('UpdateToken', {
                            accessToken: resp.data.resdata.value.accesstoken,
                            refreshToken: resp.data.resdata.value.refreshToken
                        })

                        let loginUrl = 'Systemapi/whapi/User/login?uname=' + userInfo.username + '&pwd=' + userInfo.password
                        return that.$auth.post(loginUrl)
                    }
                }).then((resp) => {
                    that.isLogining = false
                    if(resp.data.errcode !== '0'){
                        throw (resp.data.errmsg)
                    }else{
                        // 设置登录状态和userCertificate
                        that.$store.commit('Login', {
                            isLoggedIn: true,
                            userCertificate: resp.data.resdata.userCertificate
                        })
                        if(resp.data.resdata.resCompany.length > 1){
                            // 企业选择，选择后设置当前企业
                            that.isShowCompanyPane = true
                            that.companyList = resp.data.resdata.resCompany
                        }else{
                            // 设置当前企业
                            that.$store.commit('UpdateUserInfo', {
                                companycode: resp.data.resdata.resCompany[0].companycode,
                                companyname: resp.data.resdata.resCompany[0].companyname,
                                contract: resp.data.resdata.resCompany[0].contract,
                                contractphone: resp.data.resdata.resCompany[0].contractphone,
                                id: resp.data.resdata.resCompany[0].id
                            })
                            this.$store.commit('ActiveTab', {
                                title: '首页',
                                path: '/tabsview/home'
                            })
                            this.$router.push({ path: '/tabsview/home' })
                        }
                    }
                }).catch((err) => {
                    that.isLogining = false
                    that.$message({
                        showClose: true,
                        message: err,
                        type: 'error'
                    })
                })
            }
        }
    }
</script>

<style scoped>
    .login {
        width: 100%;
        height: 100%;
        display: flex;
        display: -webkit-flex;
        flex-direction: row;
        -webkit-flex-direction: row;
        justify-content: center;
        -webkit-justify-content: center;
    }

    .logoStyle {
        position: fixed;
        left: 0;
        top: 0;
        overflow: hidden;
        z-index: 0;
        opacity: 1;
        width: 100%;
        height: 100%;
        transition: opacity 1s;
        -moz-transition: opacity 1s;
        -webkit-transition: opacity 1s;
        -o-transition: opacity 1s;
        -ms-transition: opacity 1s;
        transition-property: opacity;
        transition-duration: 1s;
    }

    .copyright {
        position: absolute;
        bottom: 15px;
        font-size: 14px;
        color: #999;
    }

    .forget-password {
        float: right;
        color: #0078d7;
        text-decoration: none;
    }

    .logoImg {
        height: 100%;
    }

    .formStyle {
        background: #fff;
        position: fixed;
        right: 0;
        float: right;
        height: 100%;
        width: 40%;
        margin: 0;
        padding: 0px 40px;
        z-index: 1;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .formPosition {
        padding-top: 100px;
    }

    .loginButton {
        width: 92px;
        color: #fff !important;
    }

    .loginButton:hover {
        color: #fff !important;
        border: none !important;
    }

    .loginButton {
        color: #fff !important;
        border: none !important;
    }
</style>

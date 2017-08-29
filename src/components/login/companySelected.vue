<template>
    <transition name="el-zoom-in-center">
        <div class="company-selected" v-show="isShow">
            <div class="overlay"></div>
            <div class="company-pane" :style="{ left: marginLeft + 'px', top: marginTop + 'px' }">
                <div style="padding: 10px;" class="dialog-header">
                    <span>选择企业</span>
                    <button type="button" aria-label="Close" class="el-dialog__headerbtn" @click="closeThePane">
                        <i class="el-dialog__close el-icon el-icon-close"></i>
                    </button>
                </div>

                <ul class="company-list">
                    <li v-for="(company, index) in companyList" :key="index" class="company-label" @click="companyChoose(company)">
                        {{ company.companyname }}
                    </li>
                </ul>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        data() {
		    return {
                marginLeft: document.body.clientWidth / 2 - 150,
                marginTop: document.body.clientHeight / 2 - 150
		   	}
		},
        props: {
            isShow: {
                default: false
            },
            companyList: {
                type: Array,
                default: function () {
                    return []
                }
            }
        },
        watch:{
            isShow: function(val){

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
            companyChoose (company){
                this.$store.commit('UpdateUserInfo', {
                    companycode: company.companycode,
                    companyname: company.companyname,
                    contract: company.contract,
                    contractphone: company.contractphone,
                    id: company.id
                })
                this.$store.commit('ActiveTab', {
                    title: '首页',
                    path: '/tabsview/home'
                })
                this.$router.push({path: '/tabsview/home'})
            }
		}
    }
</script>

<style scoped>
    .company-selected{
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 2;
    }
    .overlay{
        position: absolute;
        display: block;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        opacity: 0.5;
        filter: alpha(opacity = 50);
    }
    .company-pane{
        width: 300px;
        position: relative;
        background-color: rgba(4, 0, 0, 0.68);
        min-height: 300px;
    }
    .dialog-header{
        color: white;
        font-size: 10pt;
        border-bottom: 1px solid gray;
    }
    .company-list{
        font-size: 16px;
        color: #d7d5d5;
        padding: 7px 10px;
    }
    .company-label{
        cursor: pointer;
        height: 30px;
        line-height: 30px;
        text-align: center;
    }
    li.company-label:hover{
        color: #fff;
        background-color: rgba(0, 0, 0, 0.8);
    }
</style>

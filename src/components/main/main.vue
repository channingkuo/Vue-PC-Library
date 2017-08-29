<template>
    <div class="home-page" :style="{background: 'url(' + backgroundSettings.background + ')no-repeat'}">
        <div class="top-header">
            <div class="top-header-sub">
                <div class="header-menu" :style="backgroundSettings.color">
                    <div class="header-logo">WORKHUB</div>
                    <div class="company" :style="{ width: contentWidth + 'px' }">{{ companyName }}</div>
                    <div style="display: inline-flex;position: absolute;top: 0px;left: 180px;">
                        <div class="header-buttons" v-for="(button, index) in headerMenus" :key="button.id" @click="selectMenu(button)">
                            <div class="header-button" :class="{active: activedTopMenu.areatitle === button.areatitle }"
                                @mouseenter="borderAnimation($event)" @mouseout="hideBorder">
                                {{ button.areatitle }}
                            </div>
                        </div>
                        <div class="header-button-border" :style="{left: borderLeft + 'px', width: borderWidth + 'px'}"></div>
                    </div>
                    <div class="header-button-group">
                        <div class="search-bar">
                            <el-input class="search-input" placeholder="Search..." icon="search" v-model="searchText" :on-icon-click="searchClick"></el-input>
                        </div>
                        <div class="button-fixed">
                            <!-- 个人中心的下拉选项 -->
                            <div class="button-fixed-style">
                                <div class="iconfont icon-account" style="line-height: 1;font-size: 20px;"></div>
                                <ul class="userinfo-pane">
                                    <li>个人偏好</li>
                                    <li>系统设置</li>
                                    <li @click="logout">注销</li>
                                </ul>
                            </div>
                            <div class="button-fixed-style iconfont icon-mail" style="line-height: 16px;font-size: 20px;" title="消息"></div>
                            <!-- 经典主题包含到更换主题中 -->
                            <img class="button-fixed-style" style="width: 26px;" :src="backgroundSettings.img" title="更换主题" @click="changeTheme" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="content-main">
            <div class="content-sub">
                <div ref="sidebar" class="sidebar" :style="backgroundSettings.color">
                    <div :style="{ height: sidebarHeight + 'px', display: displayName }">
                        <!-- SideBar菜单 -->
                        <ul class="hub-menu-vertical">
                            <li class="menu-icon-base" v-for="(menu, index) in sideBarMenus" :key="menu.id" :class="{'first-margin': index === 0}">
                                <div class="menu-icon-content">
                                    <i class="iconfont" :class="menu.iconclass" style="opacity: 0.8;margin-left: 10px;font-size: 20px;"></i>
                                    <div class="menu-text">{{ menu.sname }}</div>
                                </div>
                                <div class="float-submenu">
                                    <div style="display: flex;display: -webkit-flex;background-color: rgba(0, 0, 0, 0.9);">
                                        <div v-for="(secondMenu, secondIndex) in menu.submenu" :key="secondMenu.id"
                                            :class="{'dividedLine': secondIndex != menu.submenu.length - 1}">
                                            <li class="float-submenu-mainmenu" @click="menuClick(secondMenu)">{{ secondMenu.lname }}</li>
                                            <ul v-if="secondMenu.submenu.length > 0">
                                                <li class="submenu-content" v-for="(thirdMenu, thirdIndex) in secondMenu.submenu" :key="thirdMenu.id" @click="menuClick(thirdMenu)">
                                                    {{ thirdMenu.lname }}
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="tabs-router-view" :style="{ width: contentWidth + 'px' }">
                    <!-- 隐藏SideBar操作入口 -->
                    <div class="flush-button":style="{ height: sidebarHeight - 46 + 'px' }" @click="hideSideBar(isShowSideBar)">
                        <i :class="flushicon" class="breath-light"
                            style="font-size: 1px;position: relative;right: 15px;"
                            :style="{ marginTop: sidebarHeight / 2 - 23 + 'px' }"></i>
                    </div>

                    <div class="tabs">
                        <el-tabs v-model="activedTab" type="card" closable @tab-click="changeTab" @tab-remove="removeTab">
                            <el-tab-pane v-for="(item, index) in tabsList" :key="item.code" :label="item.title" :name="item.path"></el-tab-pane>
                        </el-tabs>
                        <div class="action-button">
                            <i class="iconfont icon-close button-close-all" title="关闭所有选项" @click="closeAllTabs"></i>
                            <i class="iconfont icon-refresh button-close-all" title="刷新" @click="refreshTheTab"></i>
                        </div>
                    </div>
                    <!-- 右下方显示页面的路由控制页 -->
                    <router-view></router-view>
                </div>
            </div>
        </div>

        <!-- <theme-pane :is-show.sync="isThemePaneShow" :selected-theme.sync="selectedTheme"></theme-pane> -->
        <theme-pane-drag :is-show.sync="isThemePaneShow"></theme-pane-drag>
    </div>
</template>

<script>
    var themePane = require('../theme/theme.vue')
    var themePaneDrag = require('../theme/themePaneDrag.vue')
    import { Loading } from 'element-ui'

    export default {
        data() {
		    return {
                sidebarHeight: document.body.clientHeight - 52,
                contentWidth: document.body.clientWidth - 40,

                searchText: '',

                borderWidth: 0,
                borderLeft: 0,

                isShowSideBar: true,//用于判段是否显示sidebar栏
                displayName: '',//用于隐藏显示sidebar栏
                flushicon: 'el-icon-d-arrow-left',

                sideBarMenus: [],
                sideBarAllMenus: [],

                companyName: this.$store.state.userInfo.resCompany.companyname,
                headerMenus: [],
                activedTopMenu: {},

                isThemePaneShow: false,
                selectedTheme: this.$store.state.backgroundSettings
		   	}
		},
        components: {
            'theme-pane': themePane,
            'theme-pane-drag': themePaneDrag
        },
        computed: {
            tabsList (){
                return this.$store.state.tabsList
            },
            backgroundSettings (){
                return this.$store.state.backgroundSettings
            },
            activedTab: {
                // getter
                get: function () {
                    return this.$store.getters.activedTabPath
                },
                // setter
                // 不添加这个setter控制台会有一个vue警告，不知道vue为什么会设计成这样
                set: function (newValue) {}
            }
        },
        mounted: function() {
            // 浏览器桌面通知实例
            // var options = {
            //     body: 'Hello World',
            //     icon: '../../../static/imgs/skin-violate.jpg'
            // }
            // var n = new Notification("Hi!", options)
            this.$nextTick(function () {
                this.loadMenuList()
            })
	    },
        methods: {
            // 获取菜单数据
            loadMenuList (){
                let loading = Loading.service({
                    fullscreen: true,
                    text: '正在加载...'
                })
                var that = this
                let apiUrl = 'SystemAPI/whapi/Menu/load?userctf=' + that.$store.state.userInfo.userCertificate +  '&cid=' + that.$store.state.userInfo.resCompany.id

                that.$auth.post(apiUrl).then((resp) => {
                    loading.close()

                    if(resp.data.errcode !== '0'){
                        throw (resp.data.errmsg)
                    }

                    that.headerMenus = resp.data.resData.value.areas
                    that.activedTopMenu = that.headerMenus[0]

                    that.sideBarAllMenus = resp.data.resData.value.menus
                    that.sideBarAllMenus.forEach((menu, index) => {
                        if(menu.pid === that.activedTopMenu.id){
                            that.sideBarMenus.push(menu)
                        }
                    })
                }).catch((err) => {
                    loading.close()
                    that.$message({
                        showClose: true,
                        message: err,
                        type: 'error'
                    })
                })
            },
            // 搜索
            searchClick (){
                // 实时监控(可考虑)
            },
            logout (){
                // 注销

            },
            // 顶部栏菜单下划线动画
            borderAnimation (event){
                this.borderWidth = event.currentTarget.clientWidth
                this.borderLeft = event.currentTarget.offsetLeft
            },
            hideBorder (){
                this.borderWidth = 0
            },
            hideSideBar (isShowSideBar) {
                let sidebar = this.$refs.sidebar
                if(isShowSideBar){
                    sidebar.className = "sidebar-hidden-animation"
                    this.displayName = 'none'
                    this.flushicon = 'el-icon-d-arrow-right'
                }else{
                    sidebar.className = "sidebar"
                    this.displayName = 'block'
                    this.flushicon = 'el-icon-d-arrow-left'
                }
                this.isShowSideBar = !isShowSideBar
            },
            // 打开"选择主题面板"
            changeTheme (){
                this.isThemePaneShow = true
            },
            changeTab (tab, event){
                let activedTab = {
                    title: tab.label,
                    path: tab.name
                }
                this.$store.commit('ActiveTab', activedTab)
                this.$router.push({ path: tab.name })
            },
            removeTab (targetName){
                let tabs = this.tabsList
                let currentTab = {
                    title: '',
                    code: '',
                    path: this.activedTab
                }
                if(currentTab.path === targetName){
                    tabs.forEach((tab, index) =>{
                        if(tab.path === targetName){
                            let nextTab = tabs[index + 1] || tabs[index - 1]
                            if(nextTab){
                                currentTab = {
                                    title: nextTab.title,
                                    code: nextTab.code,
                                    path: nextTab.path
                                }
                            }
                        }
                    })
                }

                // tab数组删除一项
                this.$store.commit('RemoveOneTab', targetName)

                // 判段当前Tab是不是被删除的Tab
                if(this.activedTab === targetName){
                    // 如果所有的tab都关闭了则显示main页面
                    if(this.tabsList.length <= 0){
                        this.$router.push({ path: '/main' })
                    }else{
                        // 关闭tab后显示相邻的页面
                        this.$router.push({ path: currentTab.path })
                    }
                    // 更新当前选中的tab
                    this.$store.commit('ActiveTab', currentTab)
                }
            },
            selectMenu (button){
                this.sideBarMenus = []
                this.activedTopMenu = button
                this.sideBarAllMenus.forEach((menu, index) => {
                    if(menu.pid === this.activedTopMenu.id){
                        this.sideBarMenus.push(menu)
                    }
                })
            },
            // SideBar菜单点击打开Tab栏
            menuClick (menu){
                if(!cooler.isNullOrWhiteSpace(menu.murl)){
                    this.addTab({
                        title: menu.lname,
                        code: menu.id,
                        path: menu.murl
                    })
                    this.$router.push({ path: menu.murl })
                }
            },
            addTab (item){
                this.$store.commit('AddOneTab', item)
                this.$store.commit('ActiveTab', item)
            },
            // 刷新当前Tab页内容
            refreshTheTab (){
                this.$router.push({path: this.activedTab, query: {t: new Date()}})
            },
            // 删除所有Tab保留第一个Tab
            closeAllTabs (){
                this.$store.commit('RemoveAllTab')
                this.$router.push({ path: this.activedTab })
            }
		}
    }
</script>

<style>
    .home-page{
        height: 100%;
        display: flex;
        display: -webkit-flex;
        flex-direction: column;
        -webkit-flex-direction: column;
        filter:"progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale')" !important;
        -moz-background-size: 100% 100% !important;
        background-size: 100% 100% !important;
    }
    .top-header{
        /*该样式会导致IE浏览器样式不兼容*/
        /*flex-basis: 0;
        -webkit-flex-basis: 0;*/
    }
    .top-header-sub{
        display: flex;
        display: -webkit-flex;
        height: 52px;
    }
    .breath-light {
        opacity: 0.8;                                   /* 不透明度 */
        overflow: hidden;                               /* 溢出隐藏 */

        /* IE9以及更早的版本不支持 */
        animation-name: breath;                         /* 动画名称 */
        animation-duration: 5s;                         /* 动画时长3秒 */
        animation-timing-function: ease-in-out;         /* 动画速度曲线：以低速开始和结束 */
        animation-iteration-count: infinite;            /* 播放次数：无限 */

        /* Safari and Chrome */
        -webkit-animation-name: breath;                 /* 动画名称 */
        -webkit-animation-duration: 5s;                 /* 动画时长3秒 */
        -webkit-animation-timing-function: ease-in-out; /* 动画速度曲线：以低速开始和结束 */
        -webkit-animation-iteration-count: infinite;    /* 播放次数：无限 */

        -ms-animation-name: breath;                 /* 动画名称 */
        -ms-animation-duration: 5s;                 /* 动画时长3秒 */
        -ms-animation-timing-function: ease-in-out; /* 动画速度曲线：以低速开始和结束 */
        -ms-animation-iteration-count: infinite;    /* 播放次数：无限 */
    }
    @keyframes breath {
        from { opacity: 0.2; }                          /* 动画开始时的不透明度 */
        50%  { opacity:   1; }                          /* 动画50% 时的不透明度 */
        to   { opacity: 0.2; }                          /* 动画结束时的不透明度 */
    }
    @-webkit-keyframes breath {
        from { opacity: 0.5; }                          /* 动画开始时的不透明度 */
        50%  { opacity:   1; }                          /* 动画50% 时的不透明度 */
        to   { opacity: 0.5; }                          /* 动画结束时的不透明度 */
    }
    .header-menu{
        color: white;
        line-height: 52px;
        background-color: rgba(4, 0, 0, 0.2);
        flex: 1;
        -webkit-flex: 1;
    }
    .company{
        font-size: 20px;
        color: #D7D5D5;
        position: absolute;
        top: 0px;
        text-align: center;
    }
    .weather{
        font-size: 10pt;
        color: #ccca71;
        position: absolute;
        top: 0px;
        text-align: center;
    }
    .header-button-group{
        position: absolute;
        top: 0px;
        right: 0px;
        display: flex;
        display: -webkit-flex;
    }
    .search-bar{
        position: relative;
        top: 11px;
        right: 20px;
    }
    .search-input .el-input__inner{
        height: 30px;
        width: 200px;
        color: white;
        background-color: transparent;
        border-radius: 15px;
    }
    .header-logo{
        color: #ccca71;
        width: 110px;
        text-align: left;
        margin-left: 30px;
        font-size: 20px;
        font-family: -webkit-body;
    }
    .header-buttons{
        color: #d7d5d5;
        font-size: 18px;
        /*margin-right: 22px;*/
        display: flex;
        display: -webkit-flex;
        cursor: pointer;
    }
    .header-button{
        width: 70px;
        text-align: center;
    }
    .header-buttons:hover{
        color: white;
    }
    .active{
        color: white;
    }
    .header-button-border{
        position: absolute;
        height: 3px;
        width: 0px;
        background-color: #ccca71;
        left: 0px;
        top: 49px;
        -webkit-transition: all .3s cubic-bezier(.4,0,.2,1);
        transition: all .3s cubic-bezier(.4,0,.2,1);
    }
    .button-fixed{
        margin: 0px 8px 0px 0px;
        display: flex;
        display: -webkit-flex;
        cursor: pointer;
        position: relative;
    }
    .userinfo-pane{
        display: none;
        position: absolute;
        top: 52px;
        right: 80px;
        background-color: rgba(4, 0, 0, 0.9);
        width: 90px;
        text-align: center;
        font-size: 14px;
        z-index: 5000;
    }
    ul.userinfo-pane li{
        height: 30px;
        line-height: 30px;
        color: #d7d5d5;
    }
    ul.userinfo-pane li:hover{
        color: #fff;
        background-color: rgba(4, 0, 0, 0.7);
    }
    div.button-fixed-style:hover .userinfo-pane{
        display: block;
    }
    .button-fixed-style{
        width: 20px;
        height: 20px;
        padding: 16px 20px 16px 0px;
        color: #d7d5d5;
    }
    .button-fixed-style:hover{
        color: #fff;
    }
    .content-main{
        flex-basis: 2;
        -webkit-flex-basis: 2;
    }
    .content-sub{
        display: flex;
        display: -webkit-flex;
    }
    .flush-button{
        position: absolute;
        width: 8px;
        background-color: rgba(4, 0, 0, 0);
        top: 98px;
        left: 80px;
        z-index: 2000;
        cursor: pointer;
        text-align: center;
    }
    .flush-button:hover{
        background-color: rgba(0, 0, 0, 0.6);
        width: 8px;
        text-align: center;
    }
    .sidebar{
        color: white;
        text-align: center;
        position: relative;
        width: 80px;
        min-width: 80px;
        background-color: rgba(4, 0, 0, 0.2);

        /* IE9以及更早的版本不支持 */
        animation-name: show-sidebar;                         /* 动画名称 */
        animation-duration: .3s;                         /* 动画时长0.3秒 */
        animation-timing-function: ease-in-out;         /* 动画速度曲线：以低速开始和结束 */
        animation-fill-mode: forwards;
        /* Safari and Chrome */
        -webkit-animation-name: show-sidebar;                 /* 动画名称 */
        -webkit-animation-duration: .3s;                 /* 动画时长0.3秒 */
        -webkit-animation-timing-function: ease-in-out; /* 动画速度曲线：以低速开始和结束 */
        -webkit-animation-fill-mode: forwards;

        -ms-animation-name: show-sidebar;                 /* 动画名称 */
        -ms-animation-duration: .3s;                 /* 动画时长0.3秒 */
        -ms-animation-timing-function: ease-in-out; /* 动画速度曲线：以低速开始和结束 */
        -ms-animation-fill-mode: forwards;
    }
    @keyframes show-sidebar {
        from { left: -33px; }
        50%  { left: -16px; }
        to   { left: 0; }
    }
    @-webkit-keyframes show-sidebar {
        from { left: -33px; }
        50%  { left: -16px; }
        to   { left: 0;}
    }
    .sidebar-hidden-animation{
        position: relative;
        overflow: hidden;                               /* 溢出隐藏 */
        /* IE9以及更早的版本不支持 */
        animation-name: hidden-sidebar;                         /* 动画名称 */
        animation-duration: .3s;                         /* 动画时长0.3秒 */
        animation-timing-function: ease-in-out;         /* 动画速度曲线：以低速开始和结束 */
        animation-fill-mode: forwards;
        /* Safari and Chrome */
        -webkit-animation-name: hidden-sidebar;                 /* 动画名称 */
        -webkit-animation-duration: .3s;                 /* 动画时长0.3秒 */
        -webkit-animation-timing-function: ease-in-out; /* 动画速度曲线：以低速开始和结束 */
        -webkit-animation-fill-mode: forwards;

        -ms-animation-name: hidden-sidebar;                 /* 动画名称 */
        -ms-animation-duration: .3s;                 /* 动画时长0.3秒 */
        -ms-animation-timing-function: ease-in-out; /* 动画速度曲线：以低速开始和结束 */
        -ms-animation-fill-mode: forwards;
    }
    .sidebar-hidden-animation+.tabs-router-view{
        width: 100% !important;
        position: relative !important;
        margin: 7px 0px 0px 0px !important;
    }
    .sidebar-hidden-animation+.tabs-router-view .flush-button{
        left: 0px;
        top: 39px;
    }
    .sidebar-hidden-animation+.tabs-router-view .flush-button .el-icon-d-arrow-right{
        right: 0px !important;
    }
    @keyframes hidden-sidebar {
        from { left: 0; }
        50%  { left: -26px; }
        to   { left: -52px;}
    }
    @-webkit-keyframes hidden-sidebar {
        from { left: 0; }
        50%  { left: -26px; }
        to   { left: -52px;}
    }
    .hub-menu-vertical:before{
        display: table;
        content: "";
    }
    .first-margin{
        margin-top: 0px !important;
    }
    .menu-icon-base{
        height: 27px;
        margin-top: 4px;
        padding-top: 6px;
        cursor: pointer;
        position: relative;
        z-index: 3000;
    }
    .menu-icon-base:hover{
        background-color: rgba(4, 0, 0, 0.9);
    }
    .menu-icon-base:hover .float-submenu{
        display: block !important;

        /* IE9以及更早的版本不支持 */
        animation-name: fade-in;                         /* 动画名称 */
        animation-duration: .15s;                         /* 动画时长0.15秒 */
        animation-timing-function: ease-in-out;         /* 动画速度曲线：以低速开始和结束 */
        /* Safari and Chrome */
        -webkit-animation-name: fade-in;                 /* 动画名称 */
        -webkit-animation-duration: .15s;                 /* 动画时长0.15秒 */
        -webkit-animation-timing-function: ease-in-out; /* 动画速度曲线：以低速开始和结束 */

        -ms-animation-name: fade-in;                 /* 动画名称 */
        -ms-animation-duration: .15s;                 /* 动画时长0.15秒 */
        -ms-animation-timing-function: ease-in-out; /* 动画速度曲线：以低速开始和结束 */
    }
    @keyframes fade-in {
        from { left: 140%; }
        50%  { left: 120%; }
        to   { left: 100%; }
    }
    @-webkit-keyframes fade-in {
        from { left: 140%; }
        50%  { left: 120%; }
        to   { left: 100%; }
    }
    .menu-icon-content{
        position: relative;
        display: flex;
        display: -webkit-flex;
        align-items: center;
        -webkit-align-items: center;
    }
    .menu-icon{
        width: 20px;
        height: 20px;
        opacity: 0.8;
        margin-left: 10px;
    }
    .menu-text{
        height: 20px;
        margin-left: 8px;
        line-height: 20px;
        color: #d7d5d5;
    }
    .dividedLine{
        border-right: 1px dashed rgba(255, 255, 255, 0.2);
    }
    .menu-icon-base:hover .menu-text{
        color: #fff;
    }
    .float-submenu{
        display: none;
        position: absolute;
        top: 0;
        left: 100%;
        z-index: 10;
    }
    .float-submenu-mainmenu{
        width: 108px;
        height: 33px;
        line-height: 33px;
        text-align: left;
        padding-left: 22px;
        background-color: transparent;
        font-size: 14px;
    }
    .submenu-content{
        height: 30px;
        line-height: 30px;
        text-align: left;
        padding-left: 22px;
        background-color: transparent;
        font-size: 12px;
        color: #bcbaba;
    }
    .submenu-content:hover{
        color: #d37927;
    }
    .tabs{
        position: relative;
        margin-bottom: 1px;
    }
    .button-close-all{
        font-size: 16px;
        color: #d7d5d5;
        cursor: pointer;
        margin-left: 10px;
    }
    .button-close-all:hover{
        color: white;
    }
    .action-button{
        position: absolute;
        right: 18px;
        top: 11px;
    }
    .tabs-router-view{
        margin: 8px 0px 0px 8px;
        background-color: transparent;
    }
    .tabs .el-tabs__item{
        height: 38px;
        line-height: 38px;
    }
    .tabs .el-tabs__header{
        margin: 0;
        border: none;
    }
    .tabs .el-tabs__item .is-closable{
        border: none;
    }
    .tabs .el-tabs--card>.el-tabs__header .el-tabs__item.is-active{
        background-color: rgba(4, 0, 0, 0.2);
        border: none;
        border-radius: 0px;
    }
    .tabs .el-tabs--card>.el-tabs__header .el-tabs__item{
        transition: none;
        border: none;
    }
    .tabs .el-tabs__item.is-active{
        color: #ccca71;
        font-size: 16px;
    }
    .tabs .el-tabs__item{
        color: #bfbdbd;
        font-size: 16px;
    }
    .tabs .el-tabs__content{
        display: none;
    }
</style>

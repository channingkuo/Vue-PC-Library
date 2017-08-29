// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import BabelPolyfill from 'babel-polyfill'
import Vue from 'vue'
import router from './router'
import store from './store'
import axios from 'axios'
import './assets/css/reset.css'
import './assets/js/rtportal.js'

// 引用element-ui
import ElementUI from 'element-ui'
import '../theme/index.css'

Vue.use(ElementUI)
Vue.config.productionTip = false

Vue.prototype.$http = Vue.http = axios

import App from './app'

/* Auth plugin */
import Auth from './auth'
Vue.use(Auth)

// 开启debug模式
Vue.config.debug = true
// 配置是否允许vue-devtools 检查代码  默认为true
// Vue.config.devtools = true

// 注册自定义的组件
import customButton from './components/UIControl/buttonControl.vue'
Vue.component("k-button", customButton)

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
})

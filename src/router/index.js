import Vue from 'vue'
import Router from 'vue-router'

const App = resolve => require(['../app.vue'], resolve)
const Login = resolve => require(['@/components/login/login.vue'], resolve)
const Main = resolve => require(['@/components/main/main.vue'], resolve)
const HomeContent = resolve => require(['@/components/tabsView/home/home.vue'], resolve)

const usermanager = resolve => require(['@/components/tabsView/system/userrole/usermanager.vue'], resolve)
const rolemanager = resolve => require(['@/components/tabsView/system/userrole/rolemanager.vue'], resolve)
const systemsettings = resolve => require(['@/components/tabsView/system/permissions/systemsettings.vue'], resolve)

Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/StartApp',
            name: 'App',
            meta: { keepAlive: true },
            component: App
        },
        {
            path: '/',
            name: 'Login',
            meta: { keepAlive: true },
            component: Login
        },
        {
            path: '/main',
            name: 'Main',
            meta: { keepAlive: true },
            component: Main,
            // beforeEnter: guardRoute,
            children: [{
                path: '/tabsview/home',
                name: 'Home',
                meta: { keepAlive: true },
                component: HomeContent,
                // beforeEnter: guardRoute,
            },{
                path: '/tabsview/usermanager',
                name: 'usermanager',
                meta: { keepAlive: true },
                component: usermanager,
                // beforeEnter: guardRoute,
            },{
                path: '/tabsview/rolemanager',
                name: 'rolemanager',
                meta: { keepAlive: true },
                component: rolemanager,
                // beforeEnter: guardRoute,
            },{
                path: '/tabsview/systemsettings',
                name: 'systemsettings',
                meta: { keepAlive: true },
                component: systemsettings,
                // beforeEnter: guardRoute,
            }]
        },
        { path: '*', redirect: '/main' }
    ]
})

function guardRoute (to, from, next) {
    // work-around to get to the Vuex store (as of Vue 2.0)
    const auth = router.app.$options.store.state.auth

    if (!auth.isLoggedIn) {
        next({
            path: '/'
        })
    } else {
        next()
    }
}

export default router

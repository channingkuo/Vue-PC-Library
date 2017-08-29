import Vue from 'vue'
import axios from 'axios'
import router from './router'
import store from './store'
import qs from 'qs'

const TOKEN_URL = 'http://www.cloudhub.top:90/Systemapi/whapi/Token/getutoken?uname=workhub_admin&pwd=kingpro-65732285'

/**
 * Auth Plugin
 *
 * (see https://vuejs.org/v2/guide/plugins.html for more info on Vue.js plugins)
 *
 * Handles login and token authentication using OAuth2.
 */
export default {
    /**
     * Install the Auth class.
     * Creates a axios http interceptor to handle automatically adding auth headers
     * and refreshing tokens. Then attaches this object to the global Vue (as Vue.auth).
     * @param {Object} Vue The global Vue.
     * @param {Object} options Any options we want to have in our plugin.
     * @return {void}
     */
    install(Vue, options) {
        var that = this

        axios.defaults.baseURL = 'http://www.cloudhub.top:90/'

        // Creates a axios http interceptor
        // Add a request interceptor
        axios.interceptors.request.use(function(config) {
            // Do something before request is sent
            const auth = store.state.userToken
            if(!cooler.isNullOrWhiteSpace(auth.accessToken) && config.url !== TOKEN_URL){
                config.headers.Authorization = 'Bearer ' + auth.accessToken
            }

            if(config.method === 'post') {
                config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
                config.data = qs.stringify({
                    ...config.data
                })
            } else if(config.method === 'get') {
                config.params = {
                    ...config.params
                }
            }

            return config
        }, function(error) {
            // Do something with request error
            return Promise.reject(error)
        });

        // Add a response interceptor
        axios.interceptors.response.use(function(response) {
            // Do something with response data
            if(response.data.errmsg === 'Invalid or timed!'){
                router.push({ name: 'Login' })
                return Promise.reject(response.data.errmsg)
            }
            return response
        }, function(error) {
            // Do something with response error
            // if (that._isInvalidToken(error.response)) {
                // return that.refreshToken(error)
            // }
            return Promise.reject(error)
        });

        // 添加 $auth 插件到Vue的全局对象上
        Vue.prototype.$auth = Vue.auth = this
    },

    /**
     * Check if the axios Response is an invalid token response.
     *
     * @private
     * @param {Response} response The axios Response instance received from an http call.
     * @return {boolean}
     */
    _isInvalidToken(response) {
        const status = response.status
        const error = response.statusText
        return (status == 401 && (error == 'Unauthorized' || error == 'invalid_token' || error == 'expired_token'))
    },

    /**
     * Login
     * @param {Object.<string>} userInfo The username and password for logging in.
     * @return {Promise}
     */
    login(userInfo) {
        const params = "grant_type=password&username=" + userInfo.username + "&password=" + userInfo.password
        return Vue.http.post(LOGIN_URL, params)
            .then((resp) => {
                // 保存登陆信息
                this.storeToken(resp)

                return {
                    errMsg: '0',
                    data: resp.data
                }
            })
            .catch((err) => {
                var data = err.response.data
                var error = ''
                if (data.error_description != undefined || data.error_description != '') {
                    error = data.error_description
                }
                if (data.error != undefined || data.error != '') {
                    error = data.error
                }
                return {
                    errMsg: '1',
                    data: error
                }
            })
    },

    /**
     * Http get
     * @param {Object.<string>} apiUrl webapi url.
     * @param {Object.<Object>} config headers data.
     * @return {Promise}
     */
    get(apiUrl, config) {
        return Vue.http.get(apiUrl, config)
    },

    /**
     * Http post
     * @param {Object.<string>} apiUrl webapi url.
     * @param {Object.<Object>} data body data.
     * @param {Object.<Object>} config headers data.
     * @return {Promise}
     */
    post(apiUrl, data, config) {
        return Vue.http.post(apiUrl, data, config)
    },

    /**
     * Store tokens
     * Update the Vuex store with the access/refresh tokens received from the response from the Oauth2 server.
     * @private
     * @param {Response} response axios Response instance from an OAuth2 server. that contains our tokens.
     * @return {void}
     */
    storeToken(response) {
        const auth = store.state.auth

        var responseData = response.data
        auth.isLoggedIn = true
        auth.accessToken = responseData.access_token
        auth.refreshToken = responseData.refresh_token
        auth.expiresIn = responseData.expires_in
        auth.expiresTime = responseData[".expires"]
        auth.issuedTime = responseData[".issued"]
        auth.tokenType = responseData.token_type

        store.commit('UPDATE_AUTH', auth)
        store.commit('UPDATE_SAVEDDATE', new Date())
    },

    /**
     * Store UserInfos
     * Update the Vuex store with the UserInfos received from the response from the Oauth2 server.
     * @private
     * @param {Response} response axios Response instance from an OAuth2 server. that contains UserInfos.
     * @return {void}
     */
    storeUserInfo(userInfo) {
        const user = store.state.user

        user.userRole = userInfo.UserRole
        user.userName = userInfo.UserName
        user.userCode = userInfo.UserCode
        user.systemUserId = userInfo.SystemUserId

        store.commit('UPDATE_USER', user)
    },

    /**
     * getUserInfo
     * @return {objec}
     */
    getUserInfo() {
        return store.state.user
    },

    /**
     * Logout
     * Clear all data in our Vuex store (which resets logged-in status) and redirect back to login form.
     * @return {void}
     */
    logout() {
        store.commit('CLEAR_ALL_DATA')
        router.push({ name: 'Login' })
    },

    /**
     * Refresh the access token
     * Make an ajax call to the OAuth2 server to refresh the access token (using our refresh token).
     * @private
     * @param {Request} request Vue-resource Request instance, the original request that we'll retry.
     * @return {Promise}
     */
    refreshToken(response) {
        const params = "grant_type=refresh_token&refresh_token=" + store.state.auth.refreshToken
        if (rt.isNullOrWhiteSpace(store.state.auth.refreshToken)) {
            Promise.reject(response)
        }
        return Vue.http.post(REFRESH_TOKEN_URL, params)
            .then((resp) => {
                this.storeToken(resp)
                return Vue.http.request(response.config)
            })
            .catch((err) => {
                return Promise.reject(err)
            })
    }
}

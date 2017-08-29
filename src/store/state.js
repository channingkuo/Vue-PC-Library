// Set the key we'll use in local storage.
// Go to Chrome dev tools, application tab, click "Local Storage" and "http://localhost:8080"
// and you'll see this key set below (if logged in):
export const TABS_AND_THEME = 'StoreForTabsAndTheme'
export const BACKGROUND = 'BackgroundSettings'
export const TOKEN = 'TokenInfo'

 let tabAndTheme = {
    tabsList: [{
        title: '首页',
        code: 'M001',
        path: '/tabsview/home'
    }],
    activedTab: {
        title: '首页',
        code: 'home',
        path: '/tabsview/home'
    },
    // themeModel值为true表示酷炫模式，值为false表示经典模式
    themeModel: true
}

let backgroundSetting = {
    backgroundSettings: {
        id: '',
        background: '',
        img: '',
        color: {
            backgroundColor: ''
        }
    }
}

let userInfo = {
    userToken: {
        accessToken: null,
        refreshToken: null
    },
    userInfo: {
        isLoggedIn: false,
        userCertificate: null,
        resCompany: {
            companycode: null,
            companyname: null,
            contract: null,
            contractphone: null,
            id: null
        }
    }
}

// Sync with local storage.
if (localStorage.getItem(BACKGROUND)) {
    backgroundSetting = JSON.parse(localStorage.getItem(BACKGROUND))
}

if (sessionStorage.getItem(TOKEN)){
    userInfo = JSON.parse(sessionStorage.getItem(TOKEN))
}

// Sync with session storage.
if (sessionStorage.getItem(TABS_AND_THEME)) {
    tabAndTheme = JSON.parse(sessionStorage.getItem(TABS_AND_THEME))
}

export const state = Object.assign(tabAndTheme, backgroundSetting, userInfo)

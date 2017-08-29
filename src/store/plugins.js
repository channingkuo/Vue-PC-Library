import { TABS_AND_THEME, BACKGROUND, TOKEN } from './state'

const sessionStoragePlugin = store => {
    store.subscribe((mutation, state) => {
        const tabAndTheme = { tabsList: state.tabsList, activedTab: state.activedTab, themeModel: state.themeModel }
        const userToken = {
            userToken: state.userToken,
            userInfo : state.userInfo
        }

        sessionStorage.setItem(TABS_AND_THEME, JSON.stringify(tabAndTheme))
        sessionStorage.setItem(TOKEN, JSON.stringify(userToken))

        if (mutation.type === 'CLEAR_ALL_DATA') {
            sessionStorage.removeItem(TABS_AND_THEME)
        }
    })
}

const localStoragePlugin = store => {
    store.subscribe((mutation, state) => {
        const backgroundSettings = { backgroundSettings: state.backgroundSettings }

        localStorage.setItem(BACKGROUND, JSON.stringify(backgroundSettings))

        if (mutation.type === 'CLEAR_ALL_SETTINGS_DATA') {
            localStorage.removeItem(BACKGROUND)
        }
    })
}

// TODO: setup env
// export default process.env.NODE_ENV !== 'production' ? [localStoragePlugin] : [localStoragePlugin]
export default [sessionStoragePlugin, localStoragePlugin]

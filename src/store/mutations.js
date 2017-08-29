export const AddOneTab = (state, tabItem) => {
    let tabName = state.tabsList.map(i => i.code)
    if (!tabName.find(i => i === tabItem.code)) {
        state.tabsList.push(tabItem)
    }
}

export const RemoveOneTab = (state, tabPath) => {
    let item = state.tabsList.find(i => i.path === tabPath)
    state.tabsList.splice(state.tabsList.indexOf(item), 1)
}

export const RemoveAllTab = (state) => {
    state.tabsList.splice(1, state.tabsList.length -1)
    state.activedTab = {
        title: state.tabsList[0].title,
        code: state.tabsList[0].code,
        path: state.tabsList[0].path
    }
}

export const ActiveTab = (state, tabItem) => {
    if (!cooler.isNullOrWhiteSpace(tabItem.path)) {
        state.activedTab = tabItem
    }
}

export const ThemeModel = (state, model) => {
    state.themeModel = model
}

export const BGSettings = (state, settings) => {
    state.backgroundSettings = settings
}

export const UpdateToken = (state, token) => {
    state.userToken = token
}

export const Login = (state, logInfo) => {
    state.userInfo.isLoggedIn = logInfo.isLoggedIn
    state.userInfo.userCertificate = logInfo.userCertificate
}

export const UpdateUserInfo = (state, authInfo) => {
    state.userInfo.resCompany = authInfo
}

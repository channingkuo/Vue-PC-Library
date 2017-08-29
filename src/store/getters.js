//
export const activedTabPath = state => {
    return state.activedTab ?　state.activedTab.path : ''
}

export const getThemeModel = state => {
    return state.themeModel
}

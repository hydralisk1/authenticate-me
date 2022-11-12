import Cookies from "js-cookie"

// action types
const SET_LANGUAGE = 'language/SET'

export const setLanguage = (language) => ({
    type: SET_LANGUAGE,
    language
})

const initialState = Cookies.get('language') || 'EN'

const languageReducer = (state = initialState, action) => {
    const availableLanguages = ['EN', 'KR']

    switch(action.type){
        case SET_LANGUAGE:
            return availableLanguages.includes(action.language) ? action.language : state
        default:
            return state
    }
}

export default languageReducer

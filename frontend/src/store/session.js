import { csrfFetch } from "./csrf"

// action types
const SIGN_IN = 'session/SIGN_IN'
const SIGN_OUT = 'session/SIGN_OUT'

// action creators
export const signIn = user => ({
    type: SIGN_IN,
    user
})

const signOut = () => ({
    type: SIGN_OUT,
})

// thunk action creators
export const signInUser = credential => async dispatch => {
    try{
        const response = await csrfFetch('/api/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(credential)
        })

        const result = await response.json()
        dispatch(signIn(result))
        result.ok = true
        return result
    }catch(e){
        return e
    }
}

export const signOutUser = () => async dispatch => {
    try{
        const response = await csrfFetch('/api/session', {method: 'DELETE'})
        const result = await response.json()
        dispatch(signOut())

        return result
    } catch(e) {
        return e
    }
}

export const signUpUser = user => async dispatch => {
    try{
        const response = await csrfFetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(user)
        })

        const result = await response.json()
        dispatch(signIn(result))
        result.ok = true
        return result
    }catch(e){
        return e
    }
}

export const restoreUser = () => async dispatch => {
    try {
        const response = await csrfFetch('/api/session')
        const result = await response.json()
        if(result.user) {
            dispatch(signIn(result.user))
            return true
        }
        return false
    }catch {
        return false
    }
}

const sessionReducer = (state = { user: null, isLoggedIn: false }, action) => {
    switch(action.type){
        case SIGN_IN:
            const user = {
                id: action.user.id,
                firstName: action.user.firstName,
                lastName: action.user.lastName,
                email: action.user.email,
                username: action.user.username
            }

            return { user, isLoggedIn: true }

        case SIGN_OUT:
            return { user: null, isLoggedIn: false }

        default:
            return state
    }
}

export default sessionReducer

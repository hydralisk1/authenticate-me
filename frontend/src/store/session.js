import { csrfFetch } from "./csrf"

// action types
const SIGN_IN = 'session/SIGN_IN'
const SIGN_OUT = 'session/SIGN_OUT'

// action creators
export const signIn = user => ({
    type: SIGN_IN,
    user
})

export const signOut = () => ({
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

const sessionReducer = (state = { user: null }, action) => {
    switch(action.type){
        case SIGN_IN:
            const user = {
                id: action.user.id,
                firstName: action.user.firstName,
                lastName: action.user.lastName,
                email: action.user.email,
                username: action.user.username
            }

            return { user }

        case SIGN_OUT:
            return { user: null }

        default:
            return state
    }
}

export default sessionReducer

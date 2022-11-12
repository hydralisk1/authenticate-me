import { csrfFetch } from "./csrf"

// action types
const SIGN_IN = 'session/SIGN_IN'
const SIGN_OUT = 'session/SIGN_OUT'

// action creators
const signIn = user => ({
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
        return result
    }catch(e){
        return e
    }
}

const sessionReducer = (state = { user: null }, action) => {
    switch(action.type){
        case SIGN_IN:
            const user = {...action.user}
            delete user.firstName
            delete user.lastName

            return { user }

        case SIGN_OUT:
            return { user: null }

        default:
            return state
    }
}

export default sessionReducer

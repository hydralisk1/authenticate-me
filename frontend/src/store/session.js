import { csrfFetch } from "./csrf"
import Cookies from "js-cookie"

// action types
const SIGN_IN = 'session/SIGN_IN'
const SIGN_OUT = 'session/SIGN_OUT'
const GET_MY_GROUPS = 'session/GET_MY_GROUPS'
const ADD_GROUP = 'session/ADD_GROUP'
const REMOVE_GROUP = 'session/REMOVE_GROUP'

// action creators
export const deleteGroup = (groupId, joined = true) => ({
    type: REMOVE_GROUP,
    joined,
    groupId
})

const addGroup = (groupId, joined = true) => ({
    type: ADD_GROUP,
    joined,
    groupId
})

export const getGroups = groups => ({
    type: GET_MY_GROUPS,
    groups
})

const signIn = user => ({
    type: SIGN_IN,
    user
})

const signOut = () => ({
    type: SIGN_OUT,
})

// thunk action creators
// remove an organized group
export const removeGroup = groupId => async dispatch => {
    try{
        const response = await csrfFetch(`/api/groups/${groupId}`, {
            method: 'DELETE'
        })

        if(response.status >= 400) throw new Error()
        dispatch(deleteGroup(groupId, false))
    }catch {}
}

// leave a grouop
export const leaveGroup = (groupId, body) => async dispatch => {
    try{
        const response = await csrfFetch(`/api/groups/${groupId}/membership`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        })
        if(response.status >= 400) throw new Error()
        dispatch(deleteGroup(Number(groupId)))
        return true
    }catch {
        return false
    }
}

// get all groups joned and organized by user
export const getMyGroups = userId => async dispatch => {
    try{
        const response = await csrfFetch('/api/groups/current')
        if(response.status >= 400) throw new Error()

        const result = await response.json()
        const groups = {
            organized: [],
            joined: [],
        }

        result.Groups.forEach(group => {
            if(group.organizerId === userId) groups.organized.push(group.id)
            else groups.joined.push(group.id)
        })

        dispatch(getGroups(groups))
    } catch {}
}

// join a group
export const joinGroup = groupId => async dispatch => {
    try{
        const response = await csrfFetch(`/api/groups/${groupId}/membership`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}
        })
        if(response.status >= 400) throw new Error()
        dispatch(addGroup(Number(groupId)))
        return true
    }catch {
        return false
    }
}

// organize a group
export const organizeGroup = body => async dispatch => {
    try{
        const response = await csrfFetch('/api/groups', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        })

        if(response.status >= 400) throw new Error()
        const result = await response.json()
        dispatch(addGroup(result.id, false))
        return result.id
    } catch {
        return -1
    }
}

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

const initialState = {
    user: null,
    isLoggedIn: false,
    groups: {
        organized: [],
        joined: [],
    }
}

const sessionReducer = (state = initialState, action) => {
    switch(action.type){
        case GET_MY_GROUPS:
            Cookies.set('groups', JSON.stringify(action.groups))
            return {...state, groups: action.groups}

        case ADD_GROUP:
            const groups = {...state.groups}

            if(action.joined) groups.joined.push(action.groupId)
            else groups.organized.push(action.groupId)

            Cookies.set('groups', JSON.stringify(groups))
            return {...state, groups}

        case REMOVE_GROUP:
            const newGroups = {...state.groups}
            const groupId = Number(action.groupId)

            if(action.joined) newGroups.joined = newGroups.joined.filter(id => id !== groupId)
            else newGroups.organized = newGroups.organized.filter(id => id !== groupId)

            Cookies.set('groups', JSON.stringify(newGroups))
            return {...state, groups: newGroups}

        case SIGN_IN:
            const user = {
                id: action.user.id,
                firstName: action.user.firstName,
                lastName: action.user.lastName,
                email: action.user.email,
                username: action.user.username
            }

            return {...state, user, isLoggedIn: true }

        case SIGN_OUT:
            Cookies.remove('groups')
            return {...initialState}

        default:
            return state
    }
}

export default sessionReducer

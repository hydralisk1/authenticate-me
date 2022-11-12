const TOGGLE_MODAL = 'modal/TOGGLE'
const OPEN_MODAL = 'modal/OPEN'
const CLOSE_MODAL = 'modal/CLOSE'
const SET_MODAL = 'modal/SET'

export const toggleModal = () => ({
    type: TOGGLE_MODAL
})

export const openModal = () => ({
    type: OPEN_MODAL
})

export const closeModal = () => ({
    type: CLOSE_MODAL
})

export const setModal = (open) => ({
    type: SET_MODAL,
    open
})

const initialState = false

const modalReducer = (state = initialState, action) => {
    switch(action.type){
        case TOGGLE_MODAL:
            return !state
        case OPEN_MODAL:
            return true
        case CLOSE_MODAL:
            return false
        case SET_MODAL:
            return action.open
        default:
            return state
    }
}

export default modalReducer

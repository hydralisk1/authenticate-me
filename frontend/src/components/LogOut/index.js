import { signOutUser } from '../../store/session'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

const LogOut = () => {
    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(() => {
        dispatch(signOutUser())
            .then(() => {
                history.push('/')
                window.location.reload();
            })
    }, [dispatch, history])

    return null
}

export default LogOut

import { signOutUser } from '../../store/session'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Redirect } from 'react-router-dom'

const LogOut = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(signOutUser())
        localStorage.removeItem('userPersist')
    }, [dispatch])

    return <Redirect to='/' />
}

export default LogOut

import { useDispatch, useSelector } from "react-redux"
import { useParams, useHistory } from "react-router-dom"
import { removeGroup } from '../../store/session'
import { useEffect } from 'react'

const GroupRemove = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const { groupId } = useParams()
    const groups = useSelector(state => state.session.groups)

    const closeGroup = () => {
        dispatch(removeGroup(groupId))
            .then(() => {
                window.alert('Successfully removed')
            })
            .catch(() => {
                window.alert('Something went wrong')
            })
    }

    useEffect(() => {
        if(groups.organized.includes(Number(groupId))){
            console.log(2)
            closeGroup()
            history.push('/groups')
        }
    }, [])

    return null
}

export default GroupRemove

import { csrfFetch } from '../../../store/csrf'
import { joinGroup, leaveGroup } from '../../../store/session'
import { useEffect, useState } from 'react'
import { useHistory, useParams } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import Cats from '../../HomePage/HomePageLayout/ShowingEvents/Cats'
import scripts from './scripts'
import styles from './groupdetail.module.css'
import brokenLink from '../../../assets/broken-link.webp'

const GroupDetail = () => {
    const history = useHistory()
    const { groupId } = useParams()
    const dispatch = useDispatch()
    const [isLoaded, setIsLoaded] = useState(false)
    const [isJoined, setIsJoined] = useState(0) // 0: not joined, 1: member, 2: organizer
    const [group, setGroup] = useState({})
    const currLanguage = useSelector(state => state.language)
    const groups = useSelector(state => state.session.groups)
    const user = useSelector(state => state.session.user)

    useEffect(() => {
        csrfFetch(`/api/groups/${groupId}`)
            .then(res => {
                if(res.status < 400) return res.json()
                else {
                    window.alert('Group couldn\'t be found')
                    history.goBack()
                }
            })
            .then(res => {
                if(groups.organized.includes(res.id)) setIsJoined(2)
                else if (groups.joined.includes(res.id)) setIsJoined(1)
                setGroup(res)
                setIsLoaded(true)
            })
    }, [groupId, groups, history])

    const joinRequest = () => {
        dispatch(joinGroup(groupId))
            .then(res => {
                if(!res) window.alert('Failed')
                else{
                    window.alert('Successfully requested')
                    setIsJoined(1)
                }
            })
    }

    const leaveThisGroup = () => {
        const body = {memberId: user.id,}
        dispatch(leaveGroup(groupId, body))
            .then(res => {
                if(res){
                    setIsJoined(0)
                    window.alert('Success')
                }else window.alert('failed')
            })
    }

    const detailPage = () => {
        return (
            <>
                <div className={styles.container}>
                    <div>
                        {
                            !!group.GroupImages.length ?
                                <img src={group.GroupImages[0].url} alt='group' onError={e => e.target.src=brokenLink} width='100%' /> :
                                <Cats width='100%' borderRadius='0' />
                        }
                    </div>
                    <div>
                        <h1>{group.name}</h1>
                        <div className={styles.groupInfo}>
                            <div>
                                <svg viewBox="0 0 16 16" id="icon-location-pin--small" width="100%" height="100%">
                                    <title>location-pin--small</title>
                                    <path d="M7.972 7.606a.79.79 0 0 1-.778-.8c0-.441.349-.8.778-.8.43 0 .778.359.778.8 0 .44-.348.8-.778.8m0-2.4c-.858 0-1.555.717-1.555 1.6 0 .882.697 1.6 1.555 1.6s1.556-.718 1.556-1.6c0-.883-.698-1.6-1.556-1.6m2.215 8.816A2.652 2.652 0 0 1 7.972 15.2a2.652 2.652 0 0 1-2.214-1.178c-2.113-3.09-3.23-5.585-3.23-7.217C2.528 2.905 5.332.8 7.972.8s5.445 2.105 5.445 6.005c0 1.632-1.118 4.128-3.23 7.217M7.972 0C4.913 0 1.75 2.546 1.75 6.805c0 1.823 1.135 4.406 3.372 7.677.66.965 1.7 1.518 2.85 1.518 1.151 0 2.19-.553 2.85-1.518 2.238-3.27 3.372-5.854 3.372-7.677C14.194 2.545 11.031 0 7.972 0" fillRule="evenodd"></path>
                                </svg>
                            </div>
                            <div>
                                {`${group.city}, ${group.state}`}
                            </div>
                            <div>
                                <svg viewBox="0 0 16 16" id="icon-profiles--small" width="100%" height="100%">
                                    <title>profiles--small</title>
                                    <path d="M11.816 9.085c.199.266.372.55.518.853 1.192.275 2.087 1.376 2.087 2.694 0 .87-.679 1.579-1.513 1.579h-.692c-.204.303-.46.562-.742.789h1.434c1.271 0 2.303-1.061 2.303-2.368 0-1.94-1.516-3.514-3.395-3.547m-3.908-1.19H5.145C2.856 7.895 1 9.804 1 12.159 1 13.727 2.238 15 3.763 15H9.29c1.527 0 2.764-1.273 2.764-2.841 0-2.355-1.856-4.264-4.145-4.264m2.566-4.737c-.178 0-.35.023-.516.06.016.137.042.271.042.414 0 .14-.026.273-.041.409a1.57 1.57 0 0 1 .515-.094 1.58 1.58 0 0 1 0 3.158 1.578 1.578 0 0 1-1.465-.997 3.595 3.595 0 0 1-.612.535 2.36 2.36 0 0 0 4.445-1.117 2.368 2.368 0 0 0-2.368-2.368M6.368.789a2.842 2.842 0 1 0 0 5.685 2.842 2.842 0 0 0 0-5.685m1.54 7.895c1.85 0 3.355 1.559 3.355 3.475 0 1.131-.885 2.052-1.974 2.052H3.763c-1.088 0-1.974-.921-1.974-2.052 0-1.916 1.506-3.475 3.356-3.475h2.763M6.368 1.58c1.133 0 2.053.92 2.053 2.053 0 1.13-.92 2.052-2.053 2.052a2.056 2.056 0 0 1-2.052-2.052c0-1.133.921-2.053 2.052-2.053" fillRule="evenodd"></path>
                                </svg>
                            </div>
                            <div>
                                {group.numMembers + " "}{Number(group.numMembers) > 1 ? scripts[currLanguage].Members : scripts[currLanguage].Member} · {group.private ? scripts[currLanguage].PrivateGroup : scripts[currLanguage].PublicGroup}
                            </div>
                            <div>
                                <svg viewBox="0 0 16 16" id="icon-profile--small" width="100%" height="100%">
                                    <title>profile--small</title>
                                    <path d="M11.033 15.2H4.811c-1.286 0-2.333-1.077-2.333-2.4 0-2.206 1.744-4 3.889-4h3.11c2.145 0 3.89 1.794 3.89 4 0 1.323-1.047 2.4-2.334 2.4M9.478 8H6.367C3.79 8 1.7 10.15 1.7 12.8c0 1.767 1.393 3.2 3.111 3.2h6.222c1.718 0 3.111-1.433 3.111-3.2 0-2.65-2.09-4.8-4.666-4.8M7.922.8c1.287 0 2.334 1.077 2.334 2.4S9.209 5.6 7.922 5.6C6.636 5.6 5.59 4.523 5.59 3.2S6.636.8 7.922.8m0 5.6c1.718 0 3.111-1.433 3.111-3.2 0-1.767-1.393-3.2-3.11-3.2C6.203 0 4.81 1.433 4.81 3.2c0 1.767 1.393 3.2 3.111 3.2" fillRule="evenodd"></path>
                                </svg>
                            </div>
                            <div>
                                {scripts[currLanguage].Organized}<strong>{`${group.Organizer.firstName} ${group.Organizer.lastName}`}</strong>
                            </div>
                        </div>
                        <div className={styles.joinButtonContainer}>
                        {
                            isJoined === 2 ?
                                <button className={styles.settingButton}>
                                    {scripts[currLanguage].GroupSetting}
                                </button> :
                            isJoined === 1 ?
                                <button className={styles.leaveButton} onClick={leaveThisGroup}>
                                    {scripts[currLanguage].YouReMember}
                                </button> :
                                <button className={styles.joinButton} onClick={joinRequest}>
                                    {scripts[currLanguage].JoinThisGroup}
                                </button>
                        }



                        </div>
                    </div>
                </div>
                <div className={styles.groupDetailContainer}>
                    <div className={styles.groupDetail}>
                        <h2>{scripts[currLanguage].WhatWe}</h2>
                        <p>{group.about}</p>
                    </div>
                </div>
            </>
        )
    }

    return isLoaded ?
        detailPage() :
        'Loading...'
}

export default GroupDetail

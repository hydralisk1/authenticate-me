import { csrfFetch } from '../../../store/csrf'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Cats from '../../HomePage/HomePageLayout/ShowingEvents/Cats'
import styles from './groupbody.module.css'
import scripts from './scripts'
import brokenLink from '../../../assets/broken-link.webp'

const MyGroupBody = () => {
    const currLanguage = useSelector(state => state.language)
    // const user = useSelector(state => state.session.user)
    const [myGroups, setMyGroups] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)
    const groups = useSelector(state => state.session.groups)

    useEffect(() => {
        csrfFetch('/api/groups/current')
            .then(res => res.json())
            .then(res => {
                setMyGroups(res.Groups.reduce((p, c) => {
                    p[c.id] = c
                    return p
                }, {}))
                setIsLoaded(true)
            })
    }, [])

    const groupView = () => {
        if(!groups.joined.length && !groups.organized.length)
            return <h2>{scripts[currLanguage].NoGroup}</h2>

        return (
            <>
                { !!groups.organized.length && <>
                <h2>{scripts[currLanguage].OrganizedGroups}</h2>
                <div className={styles.groupsContainer}>
                    {
                        groups.organized.map((gId, i) =>
                            <Link key={myGroups[gId].name + i} to={`/groups/${gId}`}>
                                <div key={myGroups[gId].createdAt + i}>
                                    {myGroups[gId].previewImage ?
                                        <img src={myGroups[gId].previewImage} alt='group' key={myGroups[gId].createdAt} onError={e => e.target.src={brokenLink} }/> :
                                        <Cats borderRadius='8px' />
                                    }
                                    <h3 key={gId + myGroups[gId].about}>{myGroups[gId].name}</h3>
                                </div>
                            </Link>
                        )
                    }
                </div>
                </>}

                { !!groups.joined.length && <>
                <h2>{scripts[currLanguage].JoinedGroups}</h2>
                <div className={styles.groupsContainer}>
                    {
                        groups.joined.map((gId, i) =>
                            <Link key={myGroups[gId].name + i} to={`/groups/${gId}`}>
                                <div key={myGroups[gId].about + i}>
                                    {myGroups[gId].previewImage ?
                                        <img src={myGroups[gId].previewImage} alt='group' key={myGroups[gId].createdAt} onError={e => e.target.src = {brokenLink}} /> :
                                        <Cats borderRadius='8px' />
                                    }
                                    <h3 key={myGroups[gId].createdAt + gId}>{myGroups[gId].name}</h3>
                                </div>
                            </Link>
                        )
                    }
                </div>
                </>}
            </>
        )
    }

    return (isLoaded ?
        <div className={styles.container}>
            <div className={styles.back}>
                <div><Link to='/home'>←</Link></div>
                <div><Link to='/home'>{scripts[currLanguage].BackToHome}</Link></div>
            </div>
            <div>
                <h1>{scripts[currLanguage].YourGroups}</h1>
                {groupView()}
            </div>
        </div> : 'Loading...'
    )
}

export default MyGroupBody

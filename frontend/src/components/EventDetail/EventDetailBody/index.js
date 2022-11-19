import { csrfFetch } from '../../../store/csrf'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from "react-router-dom"
import { Link } from 'react-router-dom'
import styles from './eventdetail.module.css'
import scripts from './scripts'
import brokenLink from '../../../assets/broken-link.webp'
import { dateFormatConverter } from '../../../util/timeConverter'
import Maps from '../../Maps'
import closeIcon from '../../../assets/x-symbol-svgrepo-com.svg'
import { joinGroup } from '../../../store/session'

const EventDetailBody = () => {
    const dispatch = useDispatch()
    const currLanguage = useSelector(state => state.language)
    const { eventId } = useParams()
    const [isEventLoaded, setIsEventLoaded] = useState(false)
    const [areAttendeesLoaded, setAreAttendeesLoaded] = useState(false)
    const [permission, setPermission] = useState(0) // 2: organizer, 1: memeber, 0: not a member
    const [event, setEvent] = useState([])
    const [attendees, setAttendees] = useState([])
    const [isJoiningGroup, setIsJoiningGroup] = useState(false)
    const [remainingSpot, setRemainingSpot] = useState(0)
    const [isAttendee, setIsAttendee] = useState(false)
    const [eventImages, setEventImages] = useState([])
    const [eventImage, setEventImage] = useState('')
    const [eventImageError, setEventImageError] = useState('')
    const [eventImageInput, setEventImageInput] = useState(false)
    const [eventImageInputClicked, setEventImageInputClicked] = useState(false)
    const [showingEventImage, setShowingEventImage] = useState('')
    const groups = useSelector(state => state.session.groups)
    const user = useSelector(state => state.session.user)

    // const [isModifyMode, setIsModifyMode] = useState(false)
    const addEventImage = () => {
        if(!eventImageError.length){
            const url = `/api/events/${eventId}/images`
            const options = {
                method: 'POST',
                body: JSON.stringify({
                    url: eventImage,
                    preview: 'true'
                })
            }

            csrfFetch(url, options)
                .then(res => res.json())
                .then(res => {
                    setEventImages([...eventImages, res])
                    setEventImageInput(false)
                    setEventImage('')
                    setEventImageInputClicked(false)
                    window.alert('Successfully added')
                })
                .catch((e) => {
                    window.alert('Something went wrong')
                })
        }
    }

    const attendThisEvent = () => {
        if(groups.joined.includes(event.groupId)) {
            csrfFetch(`/api/events/${eventId}/attendance`, {method: 'POST'})
                .then(res => {
                    if(res.status < 400) {
                        window.alert('Successfully requested')
                        const newAttendee = {
                            id: user.id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            Attendance: {
                                status: 'pending'
                            }
                        }
                        setEvent({...event, numAttending: event.numAttending + 1})
                        setAttendees([...attendees, newAttendee])
                        setIsAttendee(true)
                        setIsJoiningGroup(false)
                    }
                })
                .catch(() => window.alert('Something went wrong'))
        }else {
            setIsJoiningGroup(true)
        }
    }

    const joinAndRequest = () => {
        dispatch(joinGroup(event.groupId))
            .then(res => {
                if(res) attendThisEvent()
                else window.alert('Something went wrong')
            })
            .catch()
    }

    useEffect(() => {
        const regex = new RegExp('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')
        if(!regex.test(eventImage)) setEventImageError('Invalid URL')
        else setEventImageError('')
    }, [eventImage])

    // const cancelThisEvent = () => {
    //     csrfFetch(`/api/events/${eventId}/attendance`, {
    //         method: 'DELETE',
    //         body: JSON.stringify({memberId: user.id})
    //     })
    //     .then(res => {
    //         if(res.status < 400){
    //             window.alert('Successfully canceled your attendance')
    //             setIsAttendee(false)
    //         }
    //     })
    //     .catch(() => window.alert('Something went wrong'))
    // }

    const detailPage = () => {
        return (
            <>
                <div className={styles.titleContainer}>
                    <div className={styles.content}>
                        <h1 className={styles.eventName}>{event.name}</h1>
                        <div className={styles.buttonContainer}>
                            {/* {
                                permission === 2 &&
                                (isModifyMode ?
                                    <button className={styles.settingButton} onClick={() => setIsModifyMode(false)}>{scripts[currLanguage].Cancel}</button> :
                                    <button className={styles.settingButton} onClick={() => setIsModifyMode(true)}>{scripts[currLanguage].Modify}</button>
                                )
                            } */}
                        </div>
                    </div>
                </div>
                <div className={styles.bodyContainer}>
                    <div className={`${styles.content} ${styles.body}`}>
                        <div className={styles.left}>
                            { !!eventImages.length && (<>
                                    <div className={styles.eventImageContainer}>
                                        <img className={styles.eventImage} src={showingEventImage || eventImages[0].url} alt='event' />
                                    </div>

                                    <div className={styles.eventImagesContainer}>
                                        {eventImages.map(image =>
                                        <div key={image.url} className={styles.anImagesContainer} onClick={() => {setShowingEventImage(image.url)}}><div className={styles.anImageFrame} key={image.id + image.url}>
                                            <img className={styles.eventImage} key={image.id} src={image.url} alt='img' onError={(e) => e.target.src = brokenLink} />
                                        </div></div>)}
                                    </div>
                                </>
                            )}
                            {
                                eventImageInput && <>
                                    <div className={styles.imageInputContainer}>
                                        <div>
                                            <input type='url' value={eventImage} className={styles.imageInput} onChange={e => setEventImage(e.target.value)} onBlur={() => {setEventImageInputClicked(true)}} />
                                        </div>
                                        <button className={styles.add} onClick={addEventImage}>{scripts[currLanguage].Add}</button>
                                    </div>
                                    { eventImageInputClicked && <div className={styles.error}>{eventImageError}</div>}
                                </>
                            }
                            { permission === 2 && (
                                eventImageInput ?
                                    <div className={styles.imageAdd} onClick={() => {setEventImageInput(false)}}>{scripts[currLanguage].CancelAddingImage}</div> :
                                    <div className={styles.imageAdd} onClick={() => {setEventImageInput(true)}}>{scripts[currLanguage].AddImage}</div>
                                )
                            }
                            <h2>{scripts[currLanguage].Details}</h2>
                            <p className={styles.desc}>{event.description}</p>
                            <h2>{`${scripts[currLanguage].Attendees} (${event.numAttending})`}</h2>
                            { areAttendeesLoaded &&
                                <div className={styles.attendees}>
                                    {attendees.map(attendee =>
                                        <div className={styles.attendee} key={attendee.id}>
                                            <div className={styles.profile}>
                                                {attendee.firstName[0].toUpperCase()}
                                            </div>
                                            <p>{attendee.firstName}</p>
                                            <p>{attendee.lastName}</p>
                                            <p className={styles.attendance}>{attendee.Attendance.status}</p>
                                        </div>)
                                    }
                                </div>
                            }

                        </div>
                        <div className={styles.right}>
                            <Link to={`/groups/${event.groupId}`}>
                                <div className={styles.fisrtRightContent}>
                                    <h3>{event.Group.name}</h3>
                                    <p className={styles.attendance}>{event.Group.private ? scripts[currLanguage].PrivateGroup : scripts[currLanguage].PublicGroup}</p>
                                </div>
                            </Link>
                            <div className={styles.lastRightContent}>
                                <div className={styles.timeAndPlace}>
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M20.5 12C20.5 16.6944 16.6944 20.5 12 20.5C7.30558 20.5 3.5 16.6944 3.5 12C3.5 7.30558 7.30558 3.5 12 3.5C16.6944 3.5 20.5 7.30558 20.5 12ZM22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM14.4697 15.5303C14.7626 15.8232 15.2374 15.8232 15.5303 15.5303C15.8232 15.2374 15.8232 14.7626 15.5303 14.4697L12.8232 11.7626C12.7763 11.7157 12.75 11.6521 12.75 11.5858L12.75 6C12.75 5.58579 12.4142 5.25 12 5.25C11.5858 5.25 11.25 5.58579 11.25 6L11.25 11.5858C11.25 12.0499 11.4344 12.495 11.7626 12.8232L14.4697 15.5303Z" fill="black"/>
                                        </svg>
                                    </div>
                                    <div>{dateFormatConverter(event.startDate, currLanguage, false)}{scripts[currLanguage].To}{dateFormatConverter(event.endDate, currLanguage, false)}{scripts[currLanguage].To2}</div>
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M18.5 10C18.5 13.9971 16.3 17.3706 12.1839 20.1101C12.0724 20.1843 11.9276 20.1843 11.8161 20.1101C7.70005 17.3706 5.5 13.9971 5.5 10C5.5 6.41015 8.41015 3.5 12 3.5C15.5899 3.5 18.5 6.41015 18.5 10ZM20 10C20 14.6519 17.4032 18.4382 13.015 21.3588C12.4001 21.7681 11.5999 21.7681 10.985 21.3588C6.59679 18.4382 4 14.6519 4 10C4 5.58172 7.58172 2 12 2C16.4183 2 20 5.58172 20 10ZM13.5 10C13.5 10.8284 12.8284 11.5 12 11.5C11.1716 11.5 10.5 10.8284 10.5 10C10.5 9.17157 11.1716 8.5 12 8.5C12.8284 8.5 13.5 9.17157 13.5 10ZM15 10C15 11.6569 13.6569 13 12 13C10.3431 13 9 11.6569 9 10C9 8.34315 10.3431 7 12 7C13.6569 7 15 8.34315 15 10Z" fill="black"/>
                                        </svg>
                                    </div>
                                    <div>{`${event.Venue.address} · ${event.Venue.city}, ${event.Venue.state}`}</div>
                                </div>
                            </div>
                            <Maps lat={parseFloat(event.Venue.lat)} lng={parseFloat(event.Venue.lng)} />
                        </div>
                    </div>
                </div>
                <div className={styles.attendContainer}>
                    <div className={styles.attendContentContainer}>
                        <div>
                            <h3 className={styles.time}>{dateFormatConverter(event.startDate, currLanguage)}</h3>
                            <h3 className={styles.location}>
                                {event.type === 'Online' ? scripts[currLanguage].Online : `${event.Venue.address}, ${event.Venue.city}`}
                            </h3>
                        </div>
                        <div className={styles.buttons}>
                            <div>
                                <div className={styles.price}>{!!event.price ? `$ ${parseFloat(event.price).toFixed(2)}` : 'Free'}</div>
                                <div className={styles.spots}>{remainingSpot} spot{remainingSpot > 1 && 's'} left</div>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', width: '200px'}}>
                                {
                                    permission < 2 &&
                                    // permission < 2 && remainingSpot > 0 &&
                                    //     <button className={styles.attendButton}>
                                    //         {scripts[currLanguage].Settings}
                                    //     </button>
                                    // :
                                        <button className={styles.attendButton} onClick={attendThisEvent} disabled={isAttendee || remainingSpot < 1}>
                                            {scripts[currLanguage].Attend}
                                        </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{height: document.documentElement.scrollHeight}} className={isJoiningGroup ? `${styles.modalContainer} ${styles.modalVisible}` : styles.modalContainer} onClick={() => setIsJoiningGroup(false)}>
                    <div className={isJoiningGroup ? `${styles.joiningGroup} ${styles.joiningGroupVisible}` : styles.joiningGroup} onClick={e => e.stopPropagation()}>
                        <div className={styles.closeButton} onClick={() => setIsJoiningGroup(false)}>
                            <img src={closeIcon} alt='close' width='14px' height='14px' />
                        </div>
                        <div className={styles.explain}>{scripts[currLanguage].InOrder}</div>
                        <div className={styles.groupName}>{event.Group.name}</div>
                        <div className={styles.explain}>{scripts[currLanguage].DoYou}</div>
                        <div className={styles.joinButtonContainer}>
                            <button className={styles.joinButton} onClick={() => joinAndRequest()}>{scripts[currLanguage].Join}</button>
                            <button className={styles.cancelButton} onClick={() => setIsJoiningGroup(false)}>{scripts[currLanguage].Cancel}</button>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    useEffect(() => {
        csrfFetch(`/api/events/${eventId}`)
            .then(res => res.json())
            .then(res => {
                if(groups.organized.includes(res.groupId)) setPermission(2)
                else if(groups.joined.includes(res.groupId)) setPermission(1)
                setRemainingSpot(res.capacity - res.numAttending)
                setEvent(res)
                setEventImages(res.EventImages)
                setShowingEventImage(res.EventImages.length ? res.EventImages[0].url : '')
                setIsEventLoaded(true)
            })

        csrfFetch(`/api/events/${eventId}/attendees`)
            .then(res => res.json())
            .then(res => {
                if(res.Attendees.some(a => a.id === user.id)) setIsAttendee(true)
                setAttendees(res.Attendees)
                setAreAttendeesLoaded(true)
            })
    }, [eventId])

    useEffect(() => {
        setRemainingSpot(event.capacity - event.numAttending)
    }, [attendees])

    return isEventLoaded ?
        detailPage()
        : 'Loading...'

}

export default EventDetailBody

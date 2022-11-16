import { csrfFetch } from '../../../store/csrf'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from "react-router-dom"
import styles from './eventdetail.module.css'
import scripts from './scripts'
import brokenLink from '../../../assets/broken-link.webp'
import { dateFormatConverter } from '../../../util/timeConverter'
import Maps from '../../Maps'

const EventDetailBody = () => {
    const currLanguage = useSelector(state => state.language)
    const { eventId } = useParams()
    const [isEventLoaded, setIsEventLoaded] = useState(false)
    const [areAttendeesLoaded, setAreAttendeesLoaded] = useState(false)
    const [event, setEvent] = useState({})
    const [attendees, setAttendees] = useState({})


    // function initMap() {
        // const location = {lat: event.Venue.lat, lng: event.Venue.lng }
        // const map = new google.maps.Map(document.getElementById('map'), {
        //     zoom: 4,
        //     center: location
        // })
        // const marker = new google.maps.Marker({
        //     position: location,
        //     map: map
        // })
    // }

    const detailPage = () => {
        return (
            <>
                <div className={styles.titleContainer}>
                    <div className={styles.content}><h1 className={styles.eventName}>{event.name}</h1></div>
                </div>
                <div className={styles.bodyContainer}>
                    <div className={`${styles.content} ${styles.body}`}>
                        <div className={styles.left}>
                            { event.EventImages.map(image => <img key={image.id} src={image.url} alt='img' onError={(e) => e.target.src = brokenLink} />)}
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
                            <div className={styles.fisrtRightContent}>
                                <h3>{event.Group.name}</h3>
                                <p className={styles.attendance}>{event.Group.private ? scripts[currLanguage].PrivateGroup : scripts[currLanguage].PublicGroup}</p>
                            </div>
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
                            <Maps lat={event.Venue.lat} lng={event.Venue.lng} />
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
                setEvent(res)
                setIsEventLoaded(true)
            })

        csrfFetch(`/api/events/${eventId}/attendees`)
            .then(res => res.json())
            .then(res => {
                setAttendees(res.Attendees)
                setAreAttendeesLoaded(true)
            })
    }, [eventId])

    return isEventLoaded ?
        detailPage()
        : 'Loading...'

}

export default EventDetailBody

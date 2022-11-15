import { csrfFetch } from '../../../store/csrf'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from "react-router-dom"
import styles from './eventdetail.module.css'
import scripts from './scripts'
import brokenLink from '../../../assets/broken-link.webp'

const EventDetailBody = () => {
    const currLanguage = useSelector(state => state.language)
    const { eventId } = useParams()
    const [isEventLoaded, setIsEventLoaded] = useState(false)
    const [areAttendeesLoaded, setAreAttendeesLoaded] = useState(false)
    const [event, setEvent] = useState({})
    const [attendees, setAttendees] = useState({})

    const detailPage = () => {
        return (
            <>
                <div className={styles.titleContainer}>
                    <div className={styles.content}><h1 className={styles.eventName}>{event.name}</h1></div>
                </div>
                <div className={styles.bodyContainer}>
                    <div className={`${styles.content} ${styles.body}`}>
                        <div className={styles.left}>
                            { event.EventImages.map(image => <img key={image.id} src={image.url} alt='image' onError={(e) => e.target.src = brokenLink} />)}
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
                        <div className={styles.right}>Right</div>
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
    }, [])

    return isEventLoaded ?
        detailPage()
        : 'Loading...'

}

export default EventDetailBody

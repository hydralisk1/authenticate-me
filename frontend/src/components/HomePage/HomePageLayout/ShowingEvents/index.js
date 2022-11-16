import { csrfFetch } from '../../../../store/csrf'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Cats from './Cats'
import styles from './showevents.module.css'
import scripts from './scripts'
import brokenLink from '../../../../assets/broken-link.webp'
import onlineVideo from '../../../../assets/video.svg'
import { dateFormatConverter } from '../../../../util/timeConverter'

const ShowingEvents = () => {
    const [shownMonth, setShownMonth] = useState(new Date())
    const currLanguage = useSelector(state => state.language)
    const [events, setEvents] = useState([])

    const changeMonth = (previous = false) => {
        const year = shownMonth.getFullYear()
        const month = previous ? shownMonth.getMonth() - 1 : shownMonth.getMonth() + 1

        setShownMonth(new Date(year, month, 1))
    }

    const getEvents = () => {
        csrfFetch('/api/events')
            .then(response => response.json())
            .then(result => {
                // filtering outdated events
                // for test, not filtering outdated events
                const availableEvents = result.Events.filter(event => {
                    const [year, month, date] = event.startDate.split('T')[0].split('-')
                    const thisYear = new Date().getFullYear()
                    const thisMonth = new Date().getMonth()
                    const thisDate = new Date().getDate()

                    return new Date(year, month, date).getTime() >= new Date(thisYear, thisMonth + 1, thisDate).getTime()
                }).sort((a, b) => {
                    const [aYear, aMonth, aDate] = a.startDate.split('T')[0].split('-')
                    const [bYear, bMonth, bDate] = b.startDate.split('T')[0].split('-')

                    return new Date(aYear, aMonth, aDate).getTime() - new Date(bYear, bMonth, bDate).getTime()
                })

                if(!availableEvents.length) setEvents([scripts[currLanguage].NoEvent])
                else setEvents(availableEvents)

                // setEvents(result.Events) // for test
            })
            .catch(() => setEvents([scripts[currLanguage].FailedLoading]))
    }

    const calendar = (shownMonth) => {
        const year = shownMonth.getFullYear()
        const month = shownMonth.getMonth()
        // this month's first day
        // Sunday - Saturday : 0 - 6
        const firstDay = new Date(year, month, 1).getDay()

        const startDate = new Date(year, month, 1 - firstDay)
        const lastDate = new Date(year, month + 1, 1)

        const cnt = Math.ceil(((lastDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000) + 1) / 7) * 7

        const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

        const result = Array.from({length: cnt / 7}, () => [])

        for(let i = 0; i < cnt; i++)
            result[~~(i / 7)].push(new Date(year, month, 1 - firstDay + i))

        return (
            <div>
                <div className={styles.monthAndYear}>
                    <button className={styles.changeMonth} onClick={() => changeMonth(true)}>&lt;&lt;</button>
                    {months[month]}, {year}
                    <button className={styles.changeMonth} onClick={() => changeMonth(false)}>&gt;&gt;</button>
                </div>
                <table>
                    <thead>
                        <tr>
                            {days.map(day => <td key={day} className={styles.gray}>{day}</td>)}
                        </tr>
                    </thead>
                    <tbody>
                        {result.map(week =>
                            <tr key={week}>
                                {week.map(day =>
                                    <td key={day} className={day.getMonth() !== month ? styles.gray : new Date().getTime() - day.getTime() < 24 * 60 * 60 * 1000 && new Date().getTime() - day.getTime() >= 0 ? styles.today : ''}>{day.getDate()}</td>
                                )}
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }

    useEffect(getEvents, [currLanguage])

    return (
        <div className={styles.container}>
            <div className={styles.yourEventsContainer}><h2 className={styles.yourEvents}>{scripts[currLanguage].Events}</h2></div>
            <div className={styles.subContainer}>
                <div className={styles.left}>
                    <div className={styles.calendar}>
                        {calendar(shownMonth)}
                    </div>
                    <div className={styles.yourInterests}></div>
                </div>
                <div className={styles.right}>
                    {events.length === 0 ?
                        'Loading' :
                        events.map(event =>
                            <Link key={event.id + event.endDate + event.startDate} to={`/events/${event.id}`}>
                                <div className={styles.event} key={event.id}>
                                    <div className={styles.imgHolder} key={event.startDate}>
                                        {
                                            event.type === 'Online' && <div className={styles.online}><img src={onlineVideo} alt='online' width="18px" height="18px" />{" "}{scripts[currLanguage].OnlineEvent}</div>
                                        }
                                        {
                                            event.previewImage ?
                                                <img src={event.previewImage} style={{borderRadius: '4px'}} alt='preview' key={event.endDate} width='168px' onError={(e) => e.target.src = brokenLink} /> :
                                                <Cats key={event.endDate} />
                                        }
                                    </div>
                                    <div key={event.id + event.startDate} className={styles.eventDesc}>
                                        <div key={event.id + event.endDate} className={styles.eventContainer}>
                                            <p className={styles.date}>{dateFormatConverter(event.startDate, currLanguage)}</p>
                                            <p className={styles.eventName}>{event.name}</p>
                                            <p className={styles.groupName}>{event.Group.name}</p>
                                        </div>
                                        <div key={event.id + event.numAttending.toString()} className={styles.numAttending}>
                                            {event.numAttending}{scripts[currLanguage].Attendees}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default ShowingEvents

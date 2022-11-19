import { csrfFetch } from "../../../store/csrf"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useHistory, useParams, Link } from "react-router-dom"
import scripts from "./scripts"
import styles from './eventsetting.module.css'
import Cats from "../../HomePage/HomePageLayout/ShowingEvents/Cats"
import brokenLink from '../../../assets/broken-link.webp'
import { dateFormatConverter } from "../../../util/timeConverter"

const EventSettingBody = () => {
    const groups = useSelector(state => state.session.groups)
    const currLanguage = useSelector(state => state.language)
    const history = useHistory()
    const { groupId } = useParams()

    const [venues, setVenues] = useState([])
    const [events, setEvents] = useState([])
    const [isVenueLoaded, setIsVenueLoaded] = useState(false)
    const [isEventLoaded, setIsEventLoaded] = useState(false)

    const [name, setName] = useState('')
    const [type, setType] = useState(false)
    const [capacity, setCapacity] = useState(1)
    const [price, setPrice] = useState(0)
    const [desc, setDesc] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [venueId, setVenueId] = useState()

    const [nameError, setNameError] = useState('')
    const [capacityError, setCapacityError] = useState('')
    const [priceError, setPriceError] = useState('')
    const [descError, setDescError] = useState('')
    const [startDateError, setStartDateError] = useState('')
    const [endDateError, setEndDateError] = useState('')

    const [eventInput,setEventInput] = useState(false)

    const removeEvent = eId => {
        csrfFetch(`/api/events/${eId}`, {method: 'DELETE'})
            .then(res => {
                if(res.status < 400){
                    window.alert('Successfully removed')
                    setEvents(events.filter(e => e.id !== eId))
                }
            })
            .catch(() => {
                window.alert('something went wrong')
            })
    }

    const handleSubmit = e => {
        e.preventDefault()
        if(!nameError.length && !capacityError && !priceError && !descError && !startDateError && !endDateError && venueId !== undefined){
            const body = {
                venueId,
                name,
                type: type ? 'Online' : 'In person',
                capacity: parseInt(capacity),
                price: price.toString(),
                description: desc,
                startDate,
                endDate
            }

            const url = `/api/groups/${groupId}/events`

            csrfFetch(url, {
                method: 'POST',
                body: JSON.stringify(body)
            })
            .then(res => {
                if(res.status < 400) {
                    // setIsVenueLoaded(false)
                    // setIsEventLoaded(false)
                    setName('')
                    setType(false)
                    setPrice(0)
                    setDesc('')
                    setStartDate('')
                    setEndDate('')
                    setVenueId()
                    setEventInput(false)
                    window.alert('Successfully added')
                    window.location.reload(false)
                }
            })
            .catch((e) => {
                window.alert('Something went wrong')
            })
        }
    }

    useEffect(() => {
        if(!groups.organized.includes(Number(groupId))) {
            window.alert(scripts[currLanguage].NotOrganizer)
            history.push('/home')
        }else{
            csrfFetch(`/api/groups/${groupId}/venues`)
                .then(res => {
                    if(res.status < 400) return res.json()
                })
                .then(res => {
                    if(!res.Venues.length){
                        window.alert(scripts[currLanguage].NeedVenues)
                        history.push(`/groups/${groupId}/settings`)
                    }else{
                        setVenues(res.Venues)
                        setIsVenueLoaded(true)
                    }
                })
                .catch((e) => {
                    window.alert('Something went wrong')
                    history.push('/home')
                })

            csrfFetch(`/api/groups/${groupId}/events`)
                .then(res => {
                    if(res.status < 400) return res.json()
                })
                .then(res => {
                    setEvents(res.Events)
                    setIsEventLoaded(true)
                })
                .catch(e => {
                    if(e.status === 404) setIsEventLoaded(true)
                })
        }
    }, [currLanguage, groupId])

    useEffect(() => {
        if(!name.length) setNameError(scripts[currLanguage].Required)
        else if(name.length < 5) setNameError(scripts[currLanguage].NameTooShort)
        else setNameError('')

        if(Number(capacity) <= 0 || ~~Number(capacity) !== Number(capacity) || isNaN(capacity))
            setCapacityError(scripts[currLanguage].CapacityInteger)
        else setCapacityError('')

        if(Number(price) < 0 || isNaN(price)) setPriceError(scripts[currLanguage].PriceError)
        else setPriceError('')

        if(!desc.length) setDescError(scripts[currLanguage].Required)
        else if(desc.length < 50) setDescError(scripts[currLanguage].DescError)
        else setDescError('')

        if(new Date(startDate).getTime() - new Date().getTime() < 0) setStartDateError(scripts[currLanguage].StartDateError)
        else setStartDateError('')

        if(new Date(endDate).getTime() - new Date(startDate).getTime() < 0) setEndDateError(scripts[currLanguage].EndDateError)
        else setEndDateError('')
    }, [name, capacity, price, desc, startDate, endDate, currLanguage])

    return (
        isVenueLoaded ?
        <div className={styles.container}>
            <h1 className={styles.eventSettingTitle}>{scripts[currLanguage].EventSettings}</h1>
            {
                isEventLoaded &&
                (!events.length ? <h2 className={styles.noEvents}>{scripts[currLanguage].NoEvent}</h2> :

                <div className={styles.eventContainer}>
                    {
                        events.map((event, i) =>
                        <>

                            <div key={i}>
                                <div className={styles.imgContainer} key={event.id}>
                                    <Link key={(3*(i+1)) + event.name + event.name} to={`/events/${event.id}`}>
                                    {
                                        !event.previewImage ? <Cats key={event.name + i + event.name + event.name  + event.startDate} width='100%' /> :
                                        <img src={event.previewImage} alt='event' key={event.name + i + event.name} onError={e => {e.target.src = brokenLink}} />
                                    }
                                    </Link>
                                </div>
                                <div className={styles.eventName} key={event.name + event.name + event.name + i}>
                                    <Link key={event.endDate + (70*(i+1) + event.startDate) + event.name} to={`/events/${event.id}`}>
                                        <div key={event.startDate + event.startDate + i + event.name} className={styles.eventTitle}><p>{event.name}</p></div>
                                        <div key={event.startDate + (20*(i+1)) + event.startDate + event.name} className={styles.eventLocation}>{`${event.Venue.city}, ${event.Venue.state}`}</div>
                                        <div key={event.endDate + (31*(i+1)) + event.name + event.startDate} className={styles.date}>{dateFormatConverter(event.startDate, currLanguage)}</div>
                                    </Link>
                                </div>
                                <div key={event.startDate + (131*(i+1)) + event.startDate + event.name + event.endDate} className={styles.removeButtonContainer}><span key={(271*(i+1)) + event.name} onClick={() => removeEvent(event.id)}>Remove</span></div>
                            </div>


                        </>
                        )
                    }
                </div>)
            }
            { eventInput ?
                <div className={styles.eventAdd} onClick={() => setEventInput(false)}>{scripts[currLanguage].CancelCreateEvent}</div> :
                <div className={styles.eventAdd} onClick={() => setEventInput(true)}>{scripts[currLanguage].CreateEvent}</div>
            }
            { eventInput &&
                <div className={styles.formContainer}>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <label htmlFor='name' className={styles.label}>{scripts[currLanguage].Name}</label>
                        <input
                            className={styles.input}
                            type='text'
                            id='name'
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                        <div className={styles.error}>{nameError}</div>
                        <label htmlFor='venue' className={styles.label}>{scripts[currLanguage].Venue}</label>
                        <select
                            className={styles.selectOption}
                            id='venue'
                            defaultValue=""
                            value={venueId}
                            onChange={e => setVenueId(e.target.value)}
                        >
                            <option value="" disabled>{scripts[currLanguage].ChooseOne}</option>
                            {
                                venues.map(v => <option key={v.id} value={v.id}>{`${v.address}, ${v.city}, ${v.state}`}</option>)
                            }
                        </select>
                        <div className={styles.error}></div>
                        <label className={styles.label}>{scripts[currLanguage].Type}</label>
                        <div className={styles.buttonContainer}>
                            <div className={type ? styles.chooseButton : `${styles.chooseButton} ${styles.chosen}`} onClick={() => setType(false)}>
                                {scripts[currLanguage].InPerson}
                            </div>
                            <div className={type ? `${styles.chooseButton} ${styles.chosen}` : styles.chooseButton } onClick={() => setType(true)}>
                                {scripts[currLanguage].Online}
                            </div>
                        </div>
                        <div className={styles.error}></div>
                        <label htmlFor='capacity' className={styles.label}>{scripts[currLanguage].Capacity}</label>
                        <input
                            className={styles.input}
                            type='number'
                            id='capacity'
                            value={capacity}
                            onChange={e => setCapacity(e.target.value)}
                        />
                        <div className={styles.error}>{capacityError}</div>
                        <label htmlFor='price' className={styles.label}>{scripts[currLanguage].Price}</label>
                        <input
                            className={styles.input}
                            type='number'
                            id='price'
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                        />
                        <div className={styles.error}>{priceError}</div>
                        <label htmlFor='desc' className={styles.label}>{scripts[currLanguage].Desc}</label>
                        <textarea
                            className={styles.descInput}
                            id='desc'
                            value={desc}
                            onChange={e => setDesc(e.target.value)}
                        />
                        <div className={styles.error}>{descError}</div>
                        <label htmlFor='startDateTime' className={styles.label}>{scripts[currLanguage].StartDate}</label>
                        <input
                            className={styles.datetime}
                            type='datetime-local'
                            id='startDateTime'
                            min={new Date().toISOString()}
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                        />
                        <div className={styles.error}>{startDateError}</div>
                        <label htmlFor='endDateTime' className={styles.label}>{scripts[currLanguage].EndDate}</label>
                        <input
                            className={styles.datetime}
                            type='datetime-local'
                            id='startDateTime'
                            min={startDate}
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                        />
                        <div className={styles.error}>{endDateError}</div>
                        <div></div>
                        <div>
                            <button type='submit' className={styles.submitButton}>{scripts[currLanguage].Submit}</button>
                        </div>
                    </form>
                </div>
            }
        </div>
        : 'Loading...'
    )
}

export default EventSettingBody

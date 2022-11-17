import { csrfFetch } from "../../../store/csrf"
import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import { useHistory, useParams, Link } from "react-router-dom"

import scripts from './scripts'
import styles from './groupsettingbody.module.css'
import brokenLink from '../../../assets/broken-link.webp'

const GroupSettingBody = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.session.user)
    const groups = useSelector(state => state.session.groups)
    const currLanguage = useSelector(state => state.language)
    const history = useHistory()
    const [isLoaded, setIsLoaded] = useState(false)
    const { groupId } = useParams()

    const [original, setOriginal] = useState({})

    const [name, setName] = useState('')
    const [desc, setDesc] = useState('')
    const [nameError, setNameError] = useState('')
    const [descError, setDescError] = useState('')

    const [online, setOnline] = useState(false)
    const [privateSet, setPrivateSet] = useState(false)

    const [modified, setModified] = useState(false)
    const [hasModified, setHasModified] = useState(false)

    const [city, setCity] = useState('')
    const [stateL, setStateL] = useState('')

    const [groupImages, setGroupImages] = useState([])
    const [groupImage, setGroupImage] = useState('')
    const [groupImageError, setGroupImageError] = useState('')
    const [preview, setPreview] = useState(true)

    const [venues, setVenues] = useState([])
    const [address, setAddress] = useState('')
    const [cityVenue, setCityVenue] = useState('')
    const [stateVenue, setStateVenue] = useState('')
    const [addressError, setAddressError] = useState('')
    const [cityVenueError, setCityVenueError] = useState('')
    const [stateVenueError, setStateVenueError] = useState('')

    const [venueInput, setVenueInput] = useState(false)
    const [groupImageInput, setGroupImageInput] = useState(false)

    const [createEvent, setCreateEvent] = useState()

    useEffect(() => {
        if(!groups.organized.includes(Number(groupId))){
            window.alert('You\'re not this group\'s organizer')
            history.goBack()
        }
    }, [user.id, groupId])

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
                setName(res.name)
                setDesc(res.about)
                setOnline(res.type === 'Online')
                setPrivateSet(res.private)
                setCity(res.city)
                setStateL(res.state)
                setGroupImages(res.GroupImages)
                setVenues(res.Venues)
                setCreateEvent(!!venues.length)
                setOriginal(res)
                setIsLoaded(true)
            })
    }, [groupId, history, venues.length])

    useEffect(() => {
        if(original.name === name && original.about === desc && original.private === privateSet && (original.type === 'Online') === online){
            setHasModified(false)
        }else setHasModified(true)
    }, [name, desc, privateSet, online, original])

    useEffect(() => {
        if(!name.length) setNameError(scripts[currLanguage].Required)
        else if(name.length < 5) setNameError(scripts[currLanguage].TryAdding)
        else setNameError('')

        if(!desc.length) setDescError(scripts[currLanguage].Required)
        else if(desc.length < 50) setDescError(scripts[currLanguage].PleaseWrite)
        else setDescError('')
    }, [name, desc, online, privateSet, currLanguage])

    useEffect(() => {
        const regex = new RegExp('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')
        if(!regex.test(groupImage)) setGroupImageError('Invalid URL')
        else setGroupImageError('')
    }, [groupImage, preview])

    useEffect(() => {
        if(!address.length) setAddressError(scripts[currLanguage].Required)
        else setAddressError('')

        if(!cityVenue.length) setCityVenueError(scripts[currLanguage].Required)
        else setCityVenueError('')

        if(!stateVenue.length) setStateVenueError(scripts[currLanguage].Required)
        else setStateVenueError('')
    }, [address, cityVenue, stateVenue, currLanguage])

    // const closeGroup = () => {
    //     dispatch(removeGroup(groupId))
    //         .then(() => {
    //             // window.alert('Successfully removed')
    //             history.push('/home')
    //         })
    //         .catch(() => {
    //             window.alert('Something went wrong')
    //         })
    // }

    const groupSave = () => {
        if(!nameError.length && !descError.length){
            const body = {
                name,
                about: desc,
                type: online ? 'Online' : 'In person',
                private: privateSet,
                city,
                state: stateL
            }

            const options = {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body)
            }

            const url = `/api/groups/${groupId}`

            csrfFetch(url, options)
                .then(res => {
                    if(res.status > 400) window.alert(scripts[currLanguage].Failed)
                    else {
                        window.alert(scripts[currLanguage].Success)
                        setModified(false)
                    }
                })
        }
    }

    const addGroupImage = () => {
        if(!groupImageError.length){
            const url = `/api/groups/${groupId}/images`
            const options = {
                method: 'POST',
                body: JSON.stringify({
                    url: groupImage,
                    preview: preview.toString()
                })
            }

            csrfFetch(url, options)
                .then(res => res.json())
                .then(res => {
                    setGroupImages([...groupImages, res])
                    setGroupImageInput(false)
                    setGroupImage('')
                    window.alert(scripts[currLanguage].Success)
                })
                .catch((e) => {
                    window.alert(scripts[currLanguage].Failed)
                    console.log(e)
                })
        }
    }

    const addVenue = () => {
        // https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=API_KEY
        if(!addressError.length && !cityVenueError && !stateVenueError){
            const url = encodeURI(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}, ${cityVenue}, ${stateVenue}&key=${process.env.REACT_APP_MAPS_API}`)

            fetch(url)
                .then(res => {
                    if(res.status === 'OK') {
                        const body = {
                            lat: res.results[0].geometry.location.lat,
                            lng: res.results[0].geometry.location.lng,
                        }

                        let addr = ''

                        res.results[0].address_components.forEach(d => {
                            switch(d.types[0]){
                                case 'street_number':
                                    addr += d.short_name + ' '
                                    break
                                case 'route':
                                    addr += d.short_name
                                    break
                                case 'locality':
                                    body.city = d.short_name
                                    break
                                case 'administrative_area_level_1':
                                    body.state = d.short_name
                                    break
                                default:
                                    break
                            }
                        })

                        body.address = addr

                        csrfFetch(`/api/groups/${groupId}/venues`, {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify(body)
                        })
                        .then(res => {
                            if(res.status < 400){
                                return res.json()
                            }
                            throw new Error()
                        })
                        .then(res => {
                            setVenues([...venues, res])
                            setVenueInput(false)
                            window.alert(scripts[currLanguage].Success)
                        })
                        .catch(() => {window.alert(scripts[currLanguage].Failed)})
                    }else throw new Error()
                })
                .catch(() => {window.alert(scripts[currLanguage].Failed)})
        }
    }

    const removeImage = (gId) => {
        csrfFetch(`/api/group-images/${gId}`, {method: 'DELETE'})
            .then(res => {
                if(res.status < 400) {
                    setGroupImages(groupImages.filter(img => img.id !== gId ))
                }else {
                    window.alert(scripts[currLanguage].Failed)
                }
            })
    }

    return (
        isLoaded ?
        <div className={styles.container}>
            <div className={styles.titleContainer}>
                <h1>{scripts[currLanguage].GroupSettings}</h1>
                <div className={styles.buttonContainer}>
                {modified ?
                    <>
                        <div className={hasModified ? styles.modify : `${styles.modify} ${styles.disabled}`} onClick={() => groupSave(true)}>
                            {scripts[currLanguage].Submit}
                        </div>
                        <div className={styles.modify} onClick={() => {
                            setName(original.name)
                            setDesc(original.about)
                            setPrivateSet(original.private)
                            setOnline(original.type === 'Online')

                            setModified(false)
                        }}>
                            {scripts[currLanguage].Cancel}
                        </div>
                        <div className={styles.removeGroup}>
                            <Link to={`/groups/${groupId}/close`}>
                                {scripts[currLanguage].CloseGroup}
                            </Link>
                        </div>
                    </>
                    :
                    <button className={styles.modify} onClick={() => setModified(true)}>
                        {scripts[currLanguage].Modify}
                    </button>
                }
                </div>
            </div>

            <div className={styles.inputContainer}>
                <div className={styles.name}>{scripts[currLanguage].Name}</div>
                <div>
                    {
                        modified ?
                            <input className={styles.nameInput} type='text' value={name} onChange={e => setName(e.target.value)}/> :
                            name
                    }
                </div>
                <div className={styles.error}>{modified && nameError}</div>
                <div className={styles.name}>{scripts[currLanguage].About}</div>
                <div>
                    {
                        modified ?
                            <textarea value={desc} onChange={e => setDesc(e.target.value)} /> :
                            desc
                    }
                </div>
                <div className={styles.error}>{modified && descError}</div>
                <div className={styles.name}>{scripts[currLanguage].PublicTitle}</div>
                <div>
                    {
                        modified ?
                        <>
                            <button className={privateSet ? styles.chooseOne : `${styles.chooseOne} ${styles.chosen}`} onClick={() => setPrivateSet(false)}>
                                {scripts[currLanguage].Public}
                            </button>
                            <button className={privateSet ? `${styles.chooseOne} ${styles.chosen}` : styles.chooseOne} onClick={() => setPrivateSet(true)}>
                                {scripts[currLanguage].Private}
                            </button>
                        </> :
                        privateSet ? scripts[currLanguage].Private : scripts[currLanguage].Public
                    }
                </div>
                <div></div>
                <div className={styles.name}>{scripts[currLanguage].Type}</div>
                <div>
                    {
                        modified ?
                        <>
                            <button className={online ? styles.chooseOne : `${styles.chooseOne} ${styles.chosen}`} onClick={() => setOnline(false)}>
                                {scripts[currLanguage].InPerson}
                            </button>
                            <button className={online ? `${styles.chooseOne} ${styles.chosen}` : styles.chooseOne} onClick={() => setOnline(true)}>
                                {scripts[currLanguage].Online}
                            </button>
                        </> :
                        online ? scripts[currLanguage].Online : scripts[currLanguage].InPerson
                    }
                </div>
                <div></div>
                <div className={styles.name}>{scripts[currLanguage].City}</div>
                <div>{city}</div>
                <div></div>
                <div className={styles.name}>{scripts[currLanguage].State}</div>
                <div>{stateL}</div>
                <div></div>
            </div>
            <div>
                <h2>{scripts[currLanguage].GroupImages}</h2>
                {!!groupImages.length &&
                    <div className={styles.groupImageContainer}>
                        {groupImages.map((image, i) => (
                            <div key={image.id} className={styles.imageContainer}>
                                <div key={image.url + image.id}>
                                    <img src={image.url} alt={image.url} key={i} onError={e => {e.target.src=brokenLink}}/>
                                </div>
                                <div key={image.id.toString() + i} className={styles.imageRemove} onClick={() => removeImage(image.id)}>{scripts[currLanguage].Remove}</div>
                            </div>
                        ))}
                    </div>
                }
                { groupImageInput &&
                    <div className={styles.imageInputContainer}>
                        <div>
                            <input type='url' value={groupImage} className={styles.imageInput} onChange={e => setGroupImage(e.target.value)} />
                        </div>
                        <button className={styles.add} onClick={addGroupImage}>{scripts[currLanguage].Add}</button>
                    </div>
                }
                { groupImageInput ?
                    <div className={styles.groupImageAdd} onClick={() => setGroupImageInput(false)}>{scripts[currLanguage].CancelAddImage}</div> :
                    <div className={styles.groupImageAdd} onClick={() => setGroupImageInput(true)}>{scripts[currLanguage].AddGroupImage}</div>
                }

            </div>
        </div>
        : 'Loading...'
    )
}

export default GroupSettingBody

import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { organizeGroup } from '../../../store/session'
import styles from './creategroup.module.css'
import scripts from './scripts'


const CreateGroupBody = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const currLanguage = useSelector(state => state.language)
    const user = useSelector(state => state.session.user)
    const maxNumGroupName = 60
    const [currentStep, setCurrentStep] = useState(1)
    const [latLng, setLatLng] = useState({})
    const [latLngDone, setLatLngDone] = useState(false)
    const [location, setLocation] = useState({})
    const [locationDone, setLocationDone] = useState(false)
    const [groupName, setGroupName] = useState('')
    const [groupNameError, setGroupNameError] = useState('')
    const [desc, setDesc] = useState('')
    const [descError, setDescError] = useState('')
    const [descClicked, setDescClicked] = useState(false)
    const [numChar, setNumChar] = useState(maxNumGroupName)
    const [groupNameClicked, setGroupNameClicked] = useState(false)
    const [isPrivate, setIsPrivate] = useState(false)
    const [isOnline, setIsOnline] = useState(false)
    // const [isLoaded, setIsLoaded] = useState(false)
    const maxStep = 4
    const savename = user.id + 'saved'

    useEffect(() => {
        const saved = localStorage.getItem(savename)

        if(saved){
            const savedInfo = JSON.parse(saved)

            setCurrentStep(savedInfo.currentStep)
            setLatLng(savedInfo.latLng)
            setLatLngDone(savedInfo.latLngDone)
            setLocation(savedInfo.location)
            setLocationDone(savedInfo.locationDone)
            setGroupName(savedInfo.groupName)
            setGroupNameError(savedInfo.groupNameError)
            setDesc(savedInfo.desc)
            setDescError(savedInfo.descError)
            setDescClicked(savedInfo.descClicked)
            setNumChar(savedInfo.numChar)
            setGroupNameClicked(savedInfo.groupNameClicked)
            setIsPrivate(savedInfo.isPrivate)
            setIsOnline(savedInfo.isOnline)
        }else {
            saveIntoLocalStorage()
            stepOne()
        }

    }, [])

    const saveIntoLocalStorage = () => {
        const local = {
            currentStep,
            latLng,
            latLngDone,
            location,
            locationDone,
            groupName,
            groupNameError,
            desc,
            descError,
            descClicked,
            numChar,
            groupNameClicked,
            isPrivate,
            isOnline,
        }

        localStorage.setItem(savename, JSON.stringify(local))
    }

    const stepOne = () => {
        if(latLng.lat === undefined){
            navigator.geolocation.getCurrentPosition((position) => {
                setLatLng({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                })
                setLatLngDone(true)
            }, () => {
                // when it fails, new york city's lat and lng would be set
                setLatLng({
                    lat: 40.730610,
                    lng: -73.935242
                })
                setLatLngDone(true)
            }, {timeout: 27000, enableHighAccuracy: true});
        }
    }

    useEffect(() => {
        if(latLngDone && !locationDone){
            const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latLng.lat},${latLng.lng}&key=${process.env.REACT_APP_MAPS_API}`
            fetch(url)
                .then(res => res.json())
                .then(res => {
                    // J3GH+XMG Scottsdale, AZ, USA
                    let [city, state, country] = res['plus_code']['compound_code'].split(', ')
                    city = city.split(' ').slice(1).join(' ')
                    setLocation({
                        city,
                        state,
                        country
                    })
                    setLocationDone(true)
                    saveIntoLocalStorage()
                })
        }
    }, [latLngDone, latLng.lat, latLng.lng, locationDone])

    useEffect(() => {
        if(!groupName.length) setGroupNameError(scripts[currLanguage].Required)
        else if(groupName.length < 5) setGroupNameError(scripts[currLanguage].TryAdding)
        else setGroupNameError('')

        setNumChar(maxNumGroupName - groupName.length)
    }, [groupName, currLanguage])

    useEffect(() => {
        if(!desc.length) setDescError(scripts[currLanguage].Required)
        else if(desc.length < 50) setDescError(scripts[currLanguage].PleaseWrite)
        else setDescError('')
    }, [desc, currLanguage])

    const next = () => {
        // console.log(currentStep)
        switch(currentStep){
            case 1:
                setCurrentStep(currentStep + 1)
                break
            case 2:
                if(!groupNameError.length && groupNameClicked) setCurrentStep(currentStep + 1)
                break
            case 3:
                if(!descError.length && descClicked) setCurrentStep(currentStep + 1)
                break
            case 4:
                submit()
                break
            default:
        }
    }

    const back = () => {
        if(currentStep > 1) setCurrentStep(currentStep - 1)
    }

    const groupNameInput = e => setGroupName(e.target.value)
    const descInput = e => setDesc(e.target.value)

    const submit = () => {
        const body = {
            name: groupName.length > 50 ? groupName.slice(0, 50) : groupName,
            about: desc,
            type: isOnline ? 'Online' : 'In person',
            private: isPrivate,
            city: location.city,
            state: location.state
        }

        dispatch(organizeGroup(body))
            .then(gId => {
                if(gId > -1) {
                    window.alert('Success')
                    localStorage.removeItem(savename)
                    history.push(`/groups/${gId}`)
                }else window.alert('Failed')
            })
    }

    const body = () => {
        saveIntoLocalStorage()
        switch(currentStep){
            case 1:
                return (
                    <div className={styles.body}>
                        <h1 style={{fontSize: '2rem'}}>{scripts[currLanguage].First}</h1>
                        <p>{scripts[currLanguage].MannamGroups}</p>
                        <div className={styles.location}>
                            <div className={styles.address}>{`${location.city}, ${location.state}, ${location.country}`}</div>
                            {/* <div className={styles.changeLocation}>{scripts[currLanguage].ChangeLocation}</div> */}
                        </div>
                    </div>
                )
            case 2:
                return (
                    <div className={styles.body}>
                        <h1 style={{fontSize: '2rem'}}>{scripts[currLanguage].WhatWill}</h1>
                        <p>{scripts[currLanguage].ChooseName}</p>
                        <div className={styles.groupName}>
                            <input
                                type='text'
                                name='groupName'
                                value={groupName}
                                onChange={groupNameInput}
                                onBlur={() => setGroupNameClicked(true)}
                                className={styles.groupNameInput}
                                autoComplete='off'
                            />
                            <div className={styles.numChar}>{numChar}</div>
                            <div className={styles.error}>
                                {groupNameClicked && `${groupNameError}`}
                            </div>
                        </div>
                    </div>
                )
            case 3:
                return (
                    <div className={styles.body}>
                        <h1 style={{fontSize: '2rem'}}>{scripts[currLanguage].NowDescribe}{` ${groupName}`}{scripts[currLanguage].WillBeAbout}</h1>
                        <p>{scripts[currLanguage].PeopleWill}</p>
                        <ol>
                            <li>{scripts[currLanguage].WhatPurpose}</li>
                            <li>{scripts[currLanguage].WhoShould}</li>
                            <li>{scripts[currLanguage].WhatWillYou}</li>
                        </ol>
                        <textarea
                            value={desc}
                            name='desc'
                            onChange={descInput}
                            onBlur={() => setDescClicked(true)}
                            placeholder={scripts[currLanguage].PleaseWrite}
                        />
                        <div className={styles.descError}>
                            {descClicked && `${descError}`}
                        </div>
                    </div>
                )
            case 4:
                return (
                    <div className={styles.body}>
                        <h1 style={{fontSize: '2rem'}}>{scripts[currLanguage].AlmostDone}</h1>
                        <div className={styles.chooseOne}>
                            <div id='public' className={!isPrivate ? styles.chosen : ''} onClick={() => setIsPrivate(false)}>
                                {scripts[currLanguage].Public}
                            </div>
                            <div id='private' className={isPrivate ? styles.chosen : ''} onClick={() => setIsPrivate(true)}>
                                {scripts[currLanguage].Private}
                            </div>
                        </div>
                        <div className={styles.chooseOne}>
                            <div id='inperson' className={!isOnline ? styles.chosen : ''} onClick={() => setIsOnline(false)}>
                                {scripts[currLanguage].InPerson}
                            </div>
                            <div id='online' className={isOnline ? styles.chosen : ''} onClick={() => setIsOnline(true)}>
                                {scripts[currLanguage].Online}
                            </div>
                        </div>
                    </div>
                )
            default:
                return null
        }
    }

    const progressBar = () => {
        const bars = []
        for(let i = 0; i < maxStep; i++)
            bars.push(<div key={i} className={i+1 <= currentStep ? styles.touched : styles.notTouched} />)

        return (
            <div className={styles.progressBarContainer}>
                {bars}
            </div>
        )
    }

    return (
        <div>
            {progressBar()}
            <div className={styles.step}>{`${scripts[currLanguage].Step} ${currentStep} ${scripts[currLanguage].Of} ${maxStep}`}</div>
            {locationDone ? body() : 'Loading...'}
            <div className={styles.bottomBarContainer}>
                <div className={styles.bottomBar}>
                    <div className={styles.buttonContainer}>
                        {currentStep !== 1 &&
                            <button className={styles.previousButton} onClick={back}>
                                {scripts[currLanguage].Back}
                            </button>
                        }
                    </div>
                    <div className={styles.buttonContainer}>
                        <button className={styles.nextButton} onClick={next}>
                            {currentStep < 4 ? scripts[currLanguage].Next : scripts[currLanguage].Submit}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default CreateGroupBody

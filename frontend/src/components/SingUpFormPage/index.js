import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { setModal } from '../../store/modal'
import ModalError from '../ModalError'
import { signUpUser } from '../../store/session'
import styles from './signUp.module.css'
import scripts from './scripts'
import closeIcon from '../../assets/x-symbol-svgrepo-com.svg'

const SignUpFormPage = ({ currState }) => {
    const dispatch = useDispatch()
    const currLanguage = useSelector(state => state.language)
    const [openSignUpModal, setOpenSignUpModal] = currState

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [inputClicked, setInputClicked] = useState({
        firstName: false,
        lastName: false,
        username: false,
        email: false,
        password: false,
    })
    const [firstNameError, setFirstNameError] = useState('')
    const [lastNameError, setLastNameError] = useState('')
    const [usernameError, setUsernameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const [signUpError, setSignUpError] = useState(false)

    const closeSignUp = () => {
        setOpenSignUpModal(false)
        dispatch(setModal(false))
    }

    const handleSubmit = e => {
        e.preventDefault()
        if(!firstNameError.length && !lastNameError.length && !usernameError.length && !passwordError.length && !emailError.length){
            const user = {
                firstName,
                lastName,
                username,
                email,
                password
            }

            dispatch(signUpUser(user))
                .then(res => {
                    if(res.ok) closeSignUp()
                    else {
                        setSignUpError(true)
                        setTimeout(() => {setSignUpError(false)}, 4000)
                    }
                })
        }
    }

    useEffect(() => {
        if(!firstName.length) setFirstNameError(scripts[currLanguage].FirstNameRequired)
        else setFirstNameError('')

        if(!lastName.length) setLastNameError(scripts[currLanguage].LastNameRequired)
        else setLastNameError('')

        if(!email.length) setEmailError(scripts[currLanguage].EmailRequired)
        else if(!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(email)) setEmailError(scripts[currLanguage].EmailHasInvalidFormat)
        else setEmailError('')

        if(username.length < 4) setUsernameError(scripts[currLanguage].UsernameRequired)
        else setUsernameError('')

        if(password.length < 6) setPasswordError(scripts[currLanguage].PasswordRequired)
        else setPasswordError('')
    }, [firstName, lastName, email, password, username, currLanguage])

    return (
        <>
            <div className={openSignUpModal ? `${styles.container} ${styles.containerVisible}` : styles.container} onClick={e => e.stopPropagation()}>
                <span className={styles.closeButton} onClick={closeSignUp}>
                    <img src={closeIcon} alt='close' width='14px' height='14px' />
                </span>
                <div className={styles.top}>
                    <h2 className={styles.title}>{scripts[currLanguage].Title}</h2>
                </div>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputForm}>
                        <label className={styles.label} htmlFor='firstName'>
                            {scripts[currLanguage].FirstName}
                        </label>
                        <input
                            type='text'
                            id='firstName'
                            value={firstName}
                            className={styles.input}
                            onChange={e => setFirstName(e.target.value)}
                            onBlur={() => setInputClicked({...inputClicked, firstName: true})}
                        />
                        <div className={`${styles.messageContainer} ${styles.errorMessage}`}>
                            {inputClicked.firstName && firstNameError}
                        </div>
                    </div>
                    <div className={styles.inputForm}>
                        <label className={styles.label} htmlFor='lastName'>
                            {scripts[currLanguage].LastName}
                        </label>
                        <input
                            type='text'
                            id='lastName'
                            value={lastName}
                            className={styles.input}
                            onChange={e => setLastName(e.target.value)}
                            onBlur={() => setInputClicked({...inputClicked, lastName: true})}
                        />

                        <div className={`${styles.messageContainer} ${styles.errorMessage}`}>
                            {inputClicked.lastName && lastNameError}
                        </div>
                    </div>
                    <div className={styles.inputForm}>
                        <label className={styles.label} htmlFor='username'>
                            {scripts[currLanguage].Username}
                        </label>
                        <input
                            type='text'
                            id='username'
                            value={username}
                            className={styles.input}
                            onChange={e => setUsername(e.target.value)}
                            onBlur={() => setInputClicked({...inputClicked, username: true})}
                        />

                        <div className={`${styles.messageContainer} ${styles.errorMessage}`}>
                            {inputClicked.username && usernameError}
                        </div>
                    </div>
                    <div className={styles.inputForm}>
                        <label className={styles.label} htmlFor='signup-email'>
                            {scripts[currLanguage].Email}
                        </label>
                        <input
                            type='email'
                            id='signup-email'
                            value={email}
                            className={styles.input}
                            onChange={e => setEmail(e.target.value)}
                            onBlur={() => setInputClicked({...inputClicked, email: true})}
                        />
                        <div className={inputClicked.email && !!emailError.length ? `${styles.messageContainer} ${styles.errorMessage}` : styles.messageContainer}>
                            {inputClicked.email && !!emailError.length ? emailError : scripts[currLanguage].EmailUse}
                        </div>
                    </div>
                    <div className={styles.inputForm}>
                        <label className={styles.label} htmlFor='signup-password'>
                            {scripts[currLanguage].Password}
                        </label>
                        <input
                            type='password'
                            id='signup-password'
                            value={password}
                            className={styles.input}
                            onChange={e => setPassword(e.target.value)}
                            onBlur={() => setInputClicked({...inputClicked, password: true})}
                        />
                        <div className={`${styles.messageContainer} ${styles.errorMessage}`}>
                            {inputClicked.password && !!passwordError.length && passwordError}
                        </div>
                    </div>
                    <button type='submit' className={styles.submitButton}>{scripts[currLanguage].SignUp}</button>
                </form>
                <div className={styles.policy}>{scripts[currLanguage].Policy}</div>
            </div>
            { signUpError && <ModalError message={scripts[currLanguage].SignUpError} />}
        </>
    )
}

export default SignUpFormPage

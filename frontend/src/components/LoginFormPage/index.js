import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { signInUser } from '../../store/session'
import { setModal } from '../../store/modal'
import ModalError from '../ModalError'
import scripts from './scripts'
import styles from './login.module.css'
import closeIcon from '../../assets/x-symbol-svgrepo-com.svg'
import logoImg from '../../assets/m_swarm_128x128.png'

const LoginFormPage = ({ currState }) => {
    const dispatch = useDispatch()
    const history = useHistory()
    const currLanguage = useSelector(state => state.language)
    const [openLoginModal, setOpenLoginModal] = currState
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailClicked, setEmailClicked] = useState(false)
    const [passwordClicked, setPasswordClicked] = useState(false)
    const [emailErrorMessage, setEmailErrorMessage] = useState('')
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
    const [unauthorized, setUnauthorized] = useState(false)

    const closeLogin = () => {
        setOpenLoginModal(false)
        dispatch(setModal(false))
    }

    useEffect(() => {
        let emailError = ''
        let passwordError = ''

        if(!email.length) emailError = scripts[currLanguage].EmailRequired
        else if(!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(email)) emailError = scripts[currLanguage].EmailHasInvalidFormat

        if(!password.length) passwordError = scripts[currLanguage].PasswordRequired
        setEmailErrorMessage(emailError)
        setPasswordErrorMessage(passwordError)
    }, [email, password, currLanguage])

    const demouserLogin = () => {
        const credential = {credential: "demo@user.io", password: "password"}
        logIn(credential)
    }

    const logIn = (credential) => {
        dispatch(signInUser(credential))
            .then(res => {
                if(res.ok){
                    const user = {
                        id: res.id,
                        username: res.username,
                        firstName: res.firstName,
                        lastName: res.lastName,
                        email: res.email
                    }

                    localStorage.setItem('userPersist', JSON.stringify(user))

                    setEmail('')
                    setPassword('')
                    setEmailClicked(false)
                    setPasswordClicked(false)
                    closeLogin()
                    history.push('/home')
                }else{
                    setUnauthorized(true)
                    setTimeout(() => {setUnauthorized(false)}, 4000)
                }
            })
    }

    // handling submit form
    const handleSubmit = (e) => {
        e.preventDefault()

        if(emailErrorMessage === '' && passwordErrorMessage === ''){
            logIn({ credential: email, password })
        }
    }

    return (
        <>
            <div className={openLoginModal ? `${styles.container} ${styles.containerVisible}` : styles.container} onClick={(e) => e.stopPropagation()}>
                <span className={styles.closeButton} onClick={closeLogin}>
                    <img src={closeIcon} alt='close' width='14px' height='14px' />
                </span>
                <div className={styles.top}>
                    <img src={logoImg} alt='logo' width='48px' height='48px' />
                    <h2 className={styles.title}>{scripts[currLanguage].LogIn}</h2>
                    {scripts[currLanguage].NotAMember}{" "}
                    {scripts[currLanguage].SignUp}
                </div>
                <form className={`${styles.stretch} ${styles.form}`} onSubmit={handleSubmit}>
                    <div className={styles.stretch}>
                        <label className={styles.label} htmlFor='email'>
                            {scripts[currLanguage].Email}
                        </label>
                    </div>
                    <div className={styles.stretch}>
                        <input
                            type='email'
                            id='email'
                            value={email}
                            className={`${styles.stretch} ${styles.input}`}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={() => setEmailClicked(true)}
                        />
                    </div>
                    <div className={`${styles.stretch} ${styles.error}`}>
                        {emailClicked && emailErrorMessage}
                    </div>
                    <div className={`${styles.stretch} ${styles.password}`}>
                        <div>
                            <label className={styles.label} htmlFor='password'>
                                {scripts[currLanguage].Password}
                            </label>
                        </div>
                        <div className={styles.forgotPassword}>
                            {scripts[currLanguage].ForgotPassword}
                        </div>
                    </div>
                    <div className={styles.stretch}>
                        <input
                            type='password'
                            id='password'
                            value={password}
                            className={`${styles.stretch} ${styles.input}`}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={() => setPasswordClicked(true)}
                        />
                    </div>
                    <div className={`${styles.stretch} ${styles.error}`}>
                        {passwordClicked && passwordErrorMessage}
                    </div>
                    <div className={styles.stretch}>
                        <button type='submit' className={styles.submitButton}>{scripts[currLanguage].LogIn}</button>
                    </div>
                </form>
                <div className={styles.stretch}>
                        <button className={styles.submitButton} onClick={demouserLogin}>{scripts[currLanguage].DemouserLogIn}</button>
                </div>
                {/* <div>
                    {scripts[currLanguage].IssuesWithLogIn}
                </div> */}
            </div>
            { unauthorized && <ModalError message={scripts[currLanguage].AuthError} />}
        </>
    )
}

export default LoginFormPage

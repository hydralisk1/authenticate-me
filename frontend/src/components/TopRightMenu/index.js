import { useState } from 'react'
import Cookies from 'js-cookie'
import { setLanguage } from '../../store/language'
import { setModal } from '../../store/modal'
import { useSelector, useDispatch } from 'react-redux'
import scripts from './scripts'
import styles from './topRight.module.css'
import globeIcon from '../../assets/globe-outline.svg'
import LoginFormPage from '../LoginFormPage'
import SignUpFormPage from '../SingUpFormPage'

const TopRightMenu = () => {
    const currLanguage = useSelector(state => state.language)
    const [showLanguages, setShowLanguages] = useState(false)
    const [openLoginModal, setOpenLoginModal] = useState(false)
    const [openSignUpModal, setOpenSignUpModal] = useState(false)
    const modal = useSelector(state => state.modal)

    const dispatch = useDispatch()

    const openLogin = () => {
        setOpenLoginModal(true)
        dispatch(setModal(true))
    }

    const closeModals = () => {
        setOpenLoginModal(false)
        setOpenSignUpModal(false)
        dispatch(setModal(false))
    }

    const openSignUp = () => {
        setOpenSignUpModal(true)
        dispatch(setModal(true))
    }

    return (
        <>
            <ul className={styles.rightMenu}>
                {/* language setting menu */}
                <li className={styles.icon} onClick={() => setShowLanguages(!showLanguages)}>
                    <img src={globeIcon} alt='language' width='18px' height='18px' />
                    {
                        showLanguages &&
                        <ul className={styles.languageSelect}>
                            <li onClick={() => {
                                if(currLanguage !== 'EN') {
                                    dispatch(setLanguage('EN'))
                                    Cookies.set('language', 'EN', { expires: 30 })
                                }
                            }}>English</li>
                            <li onClick={() => {
                                if(currLanguage !=='KR') {
                                    dispatch(setLanguage('KR'))
                                    Cookies.set('language', 'KR', { expires: 30 })
                                }
                            }}>한국어</li>
                        </ul>
                    }
                </li>
                <li onClick={() => setShowLanguages(!showLanguages)}>{scripts[currLanguage].Language}</li>
                {/* Sign In - should be modified after implementing home page for signed in users */}
                <li className={styles.sign} onClick={openLogin}>{scripts[currLanguage].LogIn}</li>

                {/* Sign Up menu */}
                <li className={styles.sign} onClick={openSignUp}>{scripts[currLanguage].SignUp}</li>
            </ul>
            <div style={{height: document.documentElement.scrollHeight}} className={modal ? `${styles.modal} ${styles.modalVisible}` : styles.modal} onClick={closeModals}>
                <LoginFormPage currState={[openLoginModal, setOpenLoginModal]} />
                <SignUpFormPage currState={[openSignUpModal, setOpenSignUpModal]} />
            </div>
        </>
    )
}

export default TopRightMenu

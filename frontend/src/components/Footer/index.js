import { useSelector } from 'react-redux'
// import { useState, useEffect } from 'react'
// import ModalError from '../ModalError'
import scripts from './scripts'
import styles from './footer.module.css'

const Footer = () => {
    // const isLoggedIn = useSelector(state => state.session.isLoggedIn)
    // const [isClicked, setIsClicked] = useState(false)
    const currLanguage = useSelector(state => state.language)

    // const underConstrution = () => {
    //     setIsClicked(true)
    // }

    // useEffect(() => {
    //     if(isClicked)
    //         setTimeout(() => {setIsClicked(false)}, 4000)
    // }, [isClicked])

    return (
        <>
            {/* { isClicked && <ModalError message={'Under Construction'} />} */}
            <div className={styles.container}>
                <div className={styles.upperContainer}>
                    <div className={styles.groupStart}>
                        {scripts[currLanguage].CreateGroup}
                    </div>
                    <div className={styles.footerMenu}>
                        <h2>Built by Joonil Kim</h2>
                        <h3 className={styles.contact}>You can contact me via below links</h3>
                        <div className={styles.contactContainer}>
                            <a href='mailto:bartholomaeuskim@gmail.com'>
                                <svg className={styles.svg} viewBox="0 0 8 6" xmlns="http://www.w3.org/2000/svg">
                                    <path d="m0 0h8v6h-8zm.75 .75v4.5h6.5v-4.5zM0 0l4 3 4-3v1l-4 3-4-3z" fill="#FFFFFF"/>
                                </svg>
                            </a>
                            <a target='_blank' rel="noreferrer" href='https://github.com/hydralisk1' style={{marginLeft: '1rem'}}>
                                <svg className={styles.svg} aria-hidden="true" class="octicon octicon-mark-github" height="36" version="1.1" viewBox="0 0 16 16" width="36">
                                    <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" fill="#FFFFFF"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.bottomContainer}>
                <ul className={styles.bottomMenu}>
                    <li>© 2022 Mannam</li>
                    {/* <li onClick={underConstrution}>{scripts[currLanguage].Terms}</li>
                    <li onClick={underConstrution}>{scripts[currLanguage].Privacy}</li> */}
                </ul>
            </div>
        </>
    )
}

export default Footer

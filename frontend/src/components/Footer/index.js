import { useSelector } from 'react-redux'
import scripts from './scripts'
import styles from './footer.module.css'

const Footer = () => {
    const isLoggedIn = useSelector(state => state.session.isLoggedIn)
    const currLanguage = useSelector(state => state.language)

    const logIn = () => {
        return null
    }

    const logOut = () => {
        return null
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.upperContainer}>
                    <div className={styles.groupStart}>
                        {scripts[currLanguage].CreateGroup}
                        <button className={styles.createGroup}>{scripts[currLanguage].GetStarted}</button>
                    </div>
                    <div className={styles.footerMenu}>
                        <ul className={styles.menu}>
                            <li>{scripts[currLanguage].YourAccount}</li>
                            {
                                isLoggedIn ?
                                    <li onClick={logOut}>{scripts[currLanguage].LogOut}</li> :
                                    <li onClick={logIn}>{scripts[currLanguage].LogIn}</li>
                            }
                            <li>{scripts[currLanguage].Help}</li>
                            <li>{scripts[currLanguage].BecomeAffiliate}</li>
                        </ul>
                        <ul className={styles.menu}>
                            <li>{scripts[currLanguage].Discover}</li>
                            <li>{scripts[currLanguage].Groups}</li>
                            <li>{scripts[currLanguage].Calendar}</li>
                            <li>{scripts[currLanguage].Topics}</li>
                            <li>{scripts[currLanguage].Cities}</li>
                            <li>{scripts[currLanguage].OnlineEvents}</li>
                            <li>{scripts[currLanguage].LocalGuides}</li>
                        </ul>
                        <ul className={styles.menu}>
                            <li>{scripts[currLanguage].Mannam}</li>
                            <li>{scripts[currLanguage].About}</li>
                            <li>{scripts[currLanguage].Blog}</li>
                            <li>{scripts[currLanguage].MannamPro}</li>
                            <li>{scripts[currLanguage].Careers}</li>
                            <li>{scripts[currLanguage].Apps}</li>
                            <li>{scripts[currLanguage].Podcast}</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className={styles.bottomContainer}>
                <ul className={styles.bottomMenu}>
                    <li>© 2022 Mannam</li>
                    <li>{scripts[currLanguage].Terms}</li>
                    <li>{scripts[currLanguage].Privacy}</li>
                </ul>
            </div>
        </>
    )
}

export default Footer

import ShowingEvents from './ShowingEvents'
import { useSelector } from 'react-redux'
import styles from './homepage.module.css'
import scripts from './scripts'

const HomePageLayout = () => {
    const user = useSelector(state => state.session.user)
    const currLanguage = useSelector(state => state.language)

    return (
        <main className={styles.container}>
            <div className={styles.sayHi}>
                {scripts[currLanguage].SayHi}{user.firstName}{" "}👋
            </div>
            <ShowingEvents />
        </main>
    )
}

export default HomePageLayout

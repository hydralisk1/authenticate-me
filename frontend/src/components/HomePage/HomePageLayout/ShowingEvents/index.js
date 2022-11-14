import { useSelector } from 'react-redux'
import styles from './showevents.module.css'
import scripts from './scripts'

const ShowingEvents = () => {
    const currLanguage = useSelector(state => state.language)
    return (
        <div className={styles.container}>
            <div><h2 className={styles.yourEvents}>{scripts[currLanguage].Events}</h2></div>
            <div classname={styles.subContainer}>
                <div className={styles.left}>
                    <div className={styles.calendar}></div>
                    <div className={styles.yourInterests}></div>
                </div>
                <div className={styles.right}></div>
            </div>
        </div>
    )
}

export default ShowingEvents

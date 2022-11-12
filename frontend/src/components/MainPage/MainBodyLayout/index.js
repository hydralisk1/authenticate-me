import { useSelector } from 'react-redux'
import onlineEvents from '../../../assets/online_events.svg'
import scripts from './scripts'
import styles from './mainBody.module.css'

const MainBodyLayout = () => {
    const currLanguage = useSelector(state => state.language)
    console.log(scripts)

    return (
        <div className={styles.container}>
            <div>
                <h1 className={styles.title}>{scripts[currLanguage].Title}</h1>
                <p className={styles.paragraph}>{scripts[currLanguage].Paragraph}</p>
            </div>
            <div>
                <img src={onlineEvents} alt='online events' />
            </div>
        </div>
    )
}

export default MainBodyLayout

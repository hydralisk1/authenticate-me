import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Logo from '../../Logo'
import SearchBar from './SearchBar'
import Profile from './Profile'
import styles from './topmenu.module.css'
import scripts from './scripts'

const TopMenuLayout = () => {
    const currLanguage = useSelector(state => state.language)

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.leftSide}>
                    <Logo />
                    <SearchBar />
                </div>
                <div className={styles.rightSide}>
                    <Link to='/groups/new'>
                        <span>
                            {scripts[currLanguage].StartNewGroup}
                        </span>
                    </Link>
                    <Profile />
                </div>
            </div>
        </header>
    )
}

export default TopMenuLayout

// import { Route } from 'react-router-dom'
import Logo from '../../Logo'
import SearchBar from './SearchBar'
import Profile from './Profile'
import styles from './topmenu.module.css'

const TopMenuLayout = () => {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.leftSide}>
                    <Logo />
                    <SearchBar />
                </div>
                <Profile />
            </div>
        </header>
    )
}

export default TopMenuLayout

import Logo from '../../Logo'
import styles from './top.module.css'
import TopRightMenu from '../../TopRightMenu'

const TopMenuLayout = () => {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Logo />
                <TopRightMenu />
            </div>
        </header>
    )
}

export default TopMenuLayout

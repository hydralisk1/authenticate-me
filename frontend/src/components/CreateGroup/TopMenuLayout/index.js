import { useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import scripts from "./scripts"
import styles from './topmenu.module.css'
import Logo from '../../Logo'

const TopMenuLayout = () => {
    const currLanguage = useSelector(state => state.language)
    const history = useHistory()

    const exit = () => {
        history.goBack()
    }

    return (
        <header className={styles.header}>
            <Logo />
            <span onClick={exit}>{scripts[currLanguage].Exit}</span>
        </header>
    )
}

export default TopMenuLayout

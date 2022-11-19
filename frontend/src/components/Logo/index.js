import { Link } from 'react-router-dom'
import logoImage from '../../assets/logo.svg'
import styles from './logo.module.css'

const Logo = () => {
    return (
        <div className={styles.logo}>
            <img src={logoImage} alt='logo' />
        </div>
    )
}

export default Logo

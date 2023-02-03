import logoImage from '../../assets/logo.svg'
import styles from './logo.module.css'

const Logo = () => {
    return (
        <div className={styles.logo}>
            <img src={logoImage} width='150' height='34' alt='logo' />
        </div>
    )
}

export default Logo

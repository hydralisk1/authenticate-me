import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import scripts from './scripts'
import styles from './profile.module.css'
import downArrorw from '../../../../assets/angle_down_icon.svg'
import upArrorw from '../../../../assets/angle_up_icon.svg'

const Profile = () => {
    const user = useSelector(state => state.session.user)
    const currLanguage = useSelector(state => state.language)
    const initial = user?.firstName[0]
    const [openProfileMenu, setOpenProfileMenu] = useState(false)

    return (
        <div className={styles.buttonContainer}>
            <button className={styles.profileButton} onClick={() => setOpenProfileMenu(!openProfileMenu)}>
                <div className={styles.profile}>{initial}</div>
                {openProfileMenu ?
                    <img src={upArrorw} alt='arrow' width='28px' height='18px' /> :
                    <img src={downArrorw} alt='arrow' width='28px' height='18px' />
                }
            </button>
            {openProfileMenu &&
                <div className={styles.menu}>
                    <ul>
                        <li>{scripts[currLanguage].YourEvents}</li>
                        <li><Link to='/groups'>{scripts[currLanguage].YourGroups}</Link></li>
                        <li>{scripts[currLanguage].ViewProfile}</li>
                        <li>{scripts[currLanguage].Settings}</li>
                        <li><Link to='/logout'>{scripts[currLanguage].LogOut}</Link></li>
                    </ul>
                </div>}
        </div>
    )
}

export default Profile

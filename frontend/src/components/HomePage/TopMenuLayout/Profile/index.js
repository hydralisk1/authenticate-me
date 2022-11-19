// import { useState, useEffect } from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import scripts from './scripts'
import styles from './profile.module.css'
import downArrorw from '../../../../assets/angle_down_icon.svg'
import upArrorw from '../../../../assets/angle_up_icon.svg'
// import ModalError from '../../../ModalError'

const Profile = () => {
    const user = useSelector(state => state.session.user)
    const currLanguage = useSelector(state => state.language)
    const initial = user?.firstName[0]
    const [openProfileMenu, setOpenProfileMenu] = useState(false)
    // const [isClicked, setIsClicked] = useState(false)

    // useEffect(() => {
    //     if(isClicked){
    //         setTimeout(() => {
    //             setIsClicked(false)
    //         }, 4000)
    //     }
    // }, [isClicked])

    // const underConstrution = () => {
    //     setIsClicked(true)
    // }

    return (
        <>
            {/* {isClicked && <ModalError message={'Under construction'} />} */}
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
                            {/* <li onClick={underConstrution}>{scripts[currLanguage].YourEvents}</li> */}
                            <li onClick={() => setOpenProfileMenu(false)}><Link to='/groups'>{scripts[currLanguage].YourGroups}</Link></li>
                            {/* <li onClick={underConstrution}>{scripts[currLanguage].ViewProfile}</li> */}
                            {/* <li onClick={underConstrution}>{scripts[currLanguage].Settings}</li> */}
                            <li onClick={() => setOpenProfileMenu(false)}><Link to='/logout'>{scripts[currLanguage].LogOut}</Link></li>
                        </ul>
                    </div>}
            </div>
        </>
    )
}

export default Profile

import { useEffect, useState } from 'react'
import styles from './error.module.css'

const ModalError = ({ message }) => {
    const [errorStyle, setErrorStyle] = useState(styles.error)

    useEffect(() => {
            setErrorStyle(`${styles.error} ${styles.visible}`)
            setTimeout(() => {
                setErrorStyle(styles.error)
            }, 3000)
    }, [])

    return (
        <div className={errorStyle} onClick={(e) => e.stopPropagation()}>{message}</div>
    )
}

export default ModalError

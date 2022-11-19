import { useState, useEffect } from 'react'
import catDead from '../../../../../assets/schrodingers-cat-0.webp'
import catAlive from '../../../../../assets/schrodingers-cat-1.webp'
import styles from './cat.module.css'

const Cats = ({ height, width, borderRadius }) => {
    const [state, setState] = useState()

    useEffect(() => {
        setState(!!Math.floor(Math.random() * 2))
    }, [])

    return <img className={styles.cat} style={{borderRadius: borderRadius || '4px'}} src={state ? catAlive : catDead} alt="Schrödinger's cat" width={width || 'auto'} height={height || 'auto'} />
}

export default Cats

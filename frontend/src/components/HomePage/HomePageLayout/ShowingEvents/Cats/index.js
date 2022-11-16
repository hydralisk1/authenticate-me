import { useState, useEffect } from 'react'
import catDead from '../../../../../assets/schrodingers-cat-0.webp'
import catAlive from '../../../../../assets/schrodingers-cat-1.webp'

const Cats = ({ width, borderRadius }) => {
    const [state, setState] = useState()

    useEffect(() => {
        setState(!!Math.floor(Math.random() * 2))
    }, [])

    return <img style={{borderRadius: borderRadius || '4px'}} src={state ? catAlive : catDead} alt="Schrödinger's cat" width={width || '168px'} />
}

export default Cats

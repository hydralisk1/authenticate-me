import { useRef, useEffect } from 'react'

const MapComponent = ({ lat, lng }) => {
    const ref = useRef()

    useEffect(() => {
        const map = new window.google.maps.Map(ref.current, {
            center: {lat, lng},
            zoom: 10,
            disableDefaultUI: true,
            gestureHandling: 'none',
        })

        new window.google.maps.Marker({
            position: {lat, lng},
            map,
            clickable: false
        })
    })

    return <div style={{minHeight: '200px'}} ref={ref} id='map' />
}

export default MapComponent

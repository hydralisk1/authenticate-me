import { Wrapper } from '@googlemaps/react-wrapper'
import MapComponent from './MapComponent'

const Maps = ({ lat, lng }) => {
    return (
        <Wrapper apiKey={process.env.REACT_APP_MAPS_API}>
            <MapComponent lat={lat} lng={lng} />
        </Wrapper>
    )
}

export default Maps

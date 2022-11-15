import { useParams } from "react-router-dom"
import TopMenuLayout from "../HomePage/TopMenuLayout"

const EventDetails = () => {
    const { eventId } = useParams()
    return (
        <div>
            <TopMenuLayout />
            <div>Link works {eventId}</div>
        </div>
    )
}

export default EventDetails

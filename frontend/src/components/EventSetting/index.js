import TopMenuLayout from "../HomePage/TopMenuLayout"
import EventSettingBody from './EventSettingBody'
import Footer from "../Footer"

const EventSetting = () => {
    return (
        <div>
            <TopMenuLayout />
            <div style={{minHeight: '400px'}}>
                <EventSettingBody />
            </div>
            <Footer />
        </div>
    )
}

export default EventSetting

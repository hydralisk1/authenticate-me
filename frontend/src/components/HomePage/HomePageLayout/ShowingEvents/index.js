import { useSelector } from 'react-redux'
import { useState } from 'react'
import styles from './showevents.module.css'
import scripts from './scripts'

const ShowingEvents = () => {
    const [shownMonth, setShownMonth] = useState(new Date())
    const currLanguage = useSelector(state => state.language)

    const changeMonth = (previous = false) => {
        const year = shownMonth.getFullYear()
        const month = previous ? shownMonth.getMonth() - 1 : shownMonth.getMonth() + 1

        setShownMonth(new Date(year, month, 1))
    }

    const calendar = (shownMonth) => {
        const year = shownMonth.getFullYear()
        const month = shownMonth.getMonth()
        // this month's first day
        // Sunday - Saturday : 0 - 6
        const firstDay = new Date(year, month, 1).getDay()

        const startDate = new Date(year, month, 1 - firstDay)
        const lastDate = new Date(year, month + 1, 1)

        const cnt = Math.ceil(((lastDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000) + 1) / 7) * 7

        const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

        const result = Array.from({length: cnt / 7}, () => [])

        for(let i = 0; i < cnt; i++)
            result[~~(i / 7)].push(new Date(year, month, 1 - firstDay + i))

        return (
            <div>
                <div className={styles.monthAndYear}>
                    <button className={styles.changeMonth} onClick={() => changeMonth(true)}>&lt;&lt;</button>
                    {months[month]}, {year}
                    <button className={styles.changeMonth} onClick={() => changeMonth(false)}>&gt;&gt;</button>
                </div>
                <table>
                    <thead>
                        <tr>
                            {days.map(day => <td key={day} className={styles.gray}>{day}</td>)}
                        </tr>
                    </thead>
                    <tbody>
                        {result.map(week =>
                            <tr key={week}>
                                {week.map(day =>
                                    <td key={day} className={day.getMonth() !== month ? styles.gray : new Date().getTime() - day.getTime() < 24 * 60 * 60 * 1000 && new Date().getTime() - day.getTime() >= 0 ? styles.today : ''}>{day.getDate()}</td>
                                )}
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.yourEventsContainer}><h2 className={styles.yourEvents}>{scripts[currLanguage].Events}</h2></div>
            <div className={styles.subContainer}>
                <div className={styles.left}>
                    <div className={styles.calendar}>
                        {calendar(shownMonth)}
                    </div>
                    <div className={styles.yourInterests}></div>
                </div>
                <div className={styles.right}></div>
            </div>
        </div>
    )
}

export default ShowingEvents

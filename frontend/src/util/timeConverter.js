import scripts from "./scripts"

export const dateFormatConverter = (dateString, currLanguage, shortForm = true) => {
    let resDateFormat = ""
    const [dateformat, time] = dateString.split('T')
    let [hour, minute] = time.split(':')
    let [year, month, date] = dateformat.split('-')
    month = Number(month) - 1
    const day = new Date(year, month, date).getDay()

    const DAY = shortForm ? 'Day' : 'DaysLong'
    const MONTH = shortForm ? 'Months' : 'MonthsLong'

    if(currLanguage === 'KR') resDateFormat += year + '년 ' + scripts[currLanguage][MONTH][month] + ' ' + Number(date) + '일 ' + scripts[currLanguage][DAY][day]
    else if(currLanguage === 'EN') resDateFormat += scripts[currLanguage][DAY][day] + ', ' + scripts[currLanguage][MONTH][month] + ' ' + Number(date) + ', ' + year
    // ·
    hour = Number(hour)
    const ampm = Number(hour) >= 12 ? 'PM' : 'AM'
    if(hour === 0) hour = 12
    else if(hour > 12) hour = Number(hour) - 12

    if(currLanguage !== 'EN' || shortForm)
        resDateFormat += ' · ' + Number(hour) + ':' + minute + ' ' + ampm
    else
        resDateFormat += ' at ' + Number(hour) + ':' + minute + ' ' + ampm


    return resDateFormat
}

/**
 * TimeUtilities.js
 *
 * Functions to generate the contents of the different TimePicker
 * barrels.
 */



/**
 * Create an array of localized weekday names, starting with today
 */
export const getWeekdayNames = (locale, format) => {
  let date       = new Date()
  const msInDay  = 24 * 60 * 60 * 1000

  const weekdays = Array(7).fill(0).map(() => {
    const weekday = date.toLocaleString(locale, format)
    date = new Date(date.getTime() + msInDay)
    return weekday
  })

  return weekdays
}



export const hours = Array(24).fill().map((_, index) => (
  (index < 10 ? "0"+index : index)
))



export const getMinutes = (everyNMinutes=5) => {
  const total = 60 / everyNMinutes

  const minutes = Array(total).fill().map((_, index) => {
    let value = index * everyNMinutes
    if (value < 10) {
      value = "0" + value
    }

    return value
  })

  return minutes
}
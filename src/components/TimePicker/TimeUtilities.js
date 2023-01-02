/**
 * TimeUtilities.js
 *
 * Functions to generate the contents of the different TimePicker
 * barrels.
 */



/**
 * Create an array of localized weekday names, starting with Sunday
 *
 * locale should be an ISO code such as "en-GB"
 * format should be { weekday: <"long"|"short"|"narrow"> }
 */
export const getWeekdayNames = (locale, format) => {
  let date       = new Date()
  const msInDay  = 24 * 60 * 60 * 1000

  const weekdays = []

  for ( let ii = 0; ii < 7; ii += 1 ) {
    const weekday = date.toLocaleString(locale, format)
    const index = date.getDay()
    weekdays[index] = weekday
    date = new Date(date.getTime() + msInDay)
  }

  return weekdays
}



export const hours = Array(24).fill().map((_, index) => (
  (index < 10 ? "0"+index : index)
))



export const getMinutes = (minutesInterval=5) => {
  if (!minutesInterval) {
    // The minutes display is not requested
    return ["nothing to see"]
  }

  const total = 60 / minutesInterval

  const minutes = Array(total).fill().map((_, index) => {
    let value = index * minutesInterval
    if (value < 10) {
      value = "0" + value
    }

    return value
  })

  return minutes
}
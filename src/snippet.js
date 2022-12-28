  // Place the weekday of `date` first
  const day = date.getDay() // 0 - 6
  const less = weekdays.slice(0, day)
  const more = weekdays.slice(day)
  const show = [ ...more, ...less]
/**
 * TimePicker.jsx
 *
 * Creates a set of rotating cylinders, with the days of the week,
 * the hours of the day, and minutes at 5-minute intervals.
 * Each cylinder iterates through all its items independently.
 */



import React, {
  useState,
  useEffect
} from 'react';

import { Cylinder } from './Cylinder'
import { getGradients } from './ColorUtilities'
import {
  getWeekdayNames,
  hours,
  getMinutes
 } from './TimeUtilities';


import zonesAndCodes from './ZonesAndCodes.json'


const TimePicker = (props) => {
  // We don't want to run the sanitization function on every
  // render, but we _do_ want to do this if a props value has
  // changed. We can handle this in two steps:

  // 1. Store props in a state variable
  const [ cleanProps, setCleanProps ] = useState(
    // A function passed to useState will run only once,
    // before the first render. Subsequently, React will
    // simply provide the current value of cleanProps.
    () => sanitize(props)
  )

  // 2. Set a useEffect to reset the state variable if any
  // props value changes. This will be called wastefully
  // immediately after the first render, but then it will wait
  // until an value changes before it fires again
  const reviewNewProps = () => {
    setCleanProps(sanitize(props))
  }
  const keys = [
    "bgColor",
    "date",
    "display",
    "faces",
    "fontSize",
    "hoverColor",
    "locale",
    "minutesInterval",
    "pressColor",
    "radius",
    "shadowColor",
    "spacing",
    "verbose",
    "weekAlign",
    "weekday"
  ]
  const dependencies = keys.map(prop => props[prop])
  useEffect(reviewNewProps, dependencies)

  const {
    onChange,        // callback function
    date,            // Date object (date, month, year ignored)
    timeZone,        // string such as "Europe/Moscow"
    locale,          // ISO code, such as "en"
    weekday,         // long, short, narrow
    weekAlign,       // left, center, right
    bgColor,         // color for barrel
    shadowColor,     // color for shadow
    faces,           // integer linear-gradient stopping points
    radius,          // numerical 'em' value
    spacing,         // number of items per cycle
    fontSize,        // CSS length
    display,         // array of barrels to show
    minutesInterval, // read from display[ { role: minutes, ... }]
    verbose,         // if true, log when default values are used
  } = cleanProps


  // Use the same technique to trigger updates when values change

  // Gradients
  const [ gradients, setGradients ] = useState(
    () => getGradients(bgColor, shadowColor, faces)
  )
  const setGradientColors = () => {
    const gradients = getGradients(bgColor, shadowColor, faces)
    setGradients(gradients)
  }
  useEffect(setGradientColors, [bgColor, shadowColor, faces])


  // Weekday names
  const [ weekdays, setWeekdays ] = useState(
    () => getWeekdayNames(locale, { weekday })
  )
  const setWeekdayNames = () => {
    const weekdayNames = getWeekdayNames(locale, { weekday })
    setWeekdays(weekdayNames)
  }
  useEffect(setWeekdayNames, [locale, weekday])


  // Minutes
  const [ minutes, setMinutes ] = useState(
    () => getMinutes(minutesInterval)
  )
  const setMinuteArray = () => {
    const minutes = getMinutes(minutesInterval)
    setMinutes(minutes)
  }
  useEffect(setMinuteArray, [minutesInterval])

  // timeChunks for offset
  const getTimeChunks = () => {
    const dateTime = date.getTime()

    const weekday = "long"
    const timeOptions = {
      hour: "2-digit",
      minute: "2-digit",
      timeZone
    }
    const dayOptions = {
      weekday,
      timeZone
    }
    // Use en-GB to get hour with 24-hour clock: 00:00 to 23:59
    const time = date.toLocaleString("en-GB", timeOptions)

    let [ hours, minutes ] = time.split(":")
    hours = Number(hours)
    minutes = Math.round(minutes / minutesInterval)
    // Tweak the actual date to correspond to the rounded value
    date.setMinutes(minutes * minutesInterval, 0, 0)

    let weekdays = date.toLocaleString(locale, dayOptions)
    const dayNames = getWeekdayNames(locale, { weekday })
    weekdays = dayNames.indexOf(weekdays)

    // Callback immediately, with the revised minutes
    if (date.getTime() !== dateTime){
      setTimeout(() => onChange(date), 0)
    }
    // NOTE: This may cause an infinite loop if the callback
    // re-renders the TimePicker component.

    return { weekdays, hours, minutes }
  }
  const [ timeChunks, setTimeChunks ] = useState(
    () => getTimeChunks()
  )
  useEffect(getTimeChunks, [date])


  // Rotate for testing!
  // const [ offset, setOffset ] = useState(0)

  // const cycle = () => {
  //   const newOffset = (offset + 0.1)
  //   setTimeout(() => {
  //     setOffset(newOffset)
  //   }, 100)
  // }
  // useEffect(cycle)


  const adjustTime = (role, value) => {
    switch (role) {
      case "weekdays":
        const dayShift = value - timeChunks.weekdays
        timeChunks.weekdays = value
        const newTime = date.getTime() + dayShift * 24 * 3600000
        date.setTime(newTime)
      break
      case "hours":
        date.setHours(value)
      break
      case "minutes":
        date.setMinutes(value *= minutesInterval, 0, 0)
    }

    setTimeout(() => onChange(new Date(date.getTime())), 0)
  }


  // Setup
  const sharedProps  = {
    adjustTime,
    radius,
    gradients,
    // offset, // only needed for testing
    spacing,
    fontSize,
    verbose
  }

  const cylinders = display.map(( props, index ) => {
    const { role } = props

    let items
    switch (role) {
      case "weekdays":
        items = weekdays
        props.textAlign = weekAlign
        break
      case "hours":
        items = hours
        break
      case "minutes":
        items = minutes
        break
      default:
    }

    return (
      <Cylinder
        key={role+index}
        {...sharedProps}
        {...props}
        items={items}
        offset={timeChunks[role]}
      />
    )
  })


  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center"
      }}
    >
      {cylinders}
    </div>
  );
}

export default TimePicker;


// UTILITIES // UTILITIES // UTILITIES // UTILITIES // UTILITIES //



const nearestDivisorOf60 = (number, verbose) => {
  if (verbose) {
    console.log(`TimePicker: ${number} is not an integer divisor of 60 minutes`)
  }

  number = parseInt(number, 10)
  if (!number || isNaN(number)) {
    return 1
  }

  number = Math.max(1, Math.min(number, 60))

  while (60 % number) {
    number--
  }
  if (verbose) {
    console.log(`            ${number} will be used instead`)
  }

  return number
}


/**
 *  sanitize(props)
 *  Apply default values as necessary. Some are treated elsewhere.
 */
const sanitize = (props) => {
  let {
    onChange,       // optional callback function
    date,           // Date object (date, month, year ignored)
    timeZone,       // string such as "Europe/Moscow"
    locale,         // ISO code, such as "en"
    weekday,        // long, short, narrow
    weekAlign,      // left, center, right
    display,        // array of barrels to show
    minutesInterval,// divisor of 60

    // // Sanitized in Cylinder.jsx
    // radius,      // numerical 'em' value
    // spacing,     // number of items per cycle
    // fontSize,    // CSS length

    // // Sanitized in ColorUtilities.js
    // bgColor,     // color for barrel
    // shadowColor, // color for shadow
    // hoverColor,  // color for hover hilite
    // pressColor,  // color for pressed hilite
    // faces,       // integer linear-gradient stopping points

    verbose         // if truthy, use of default values is logged
  } = props


  const defaultValues = {
    date: new Date(),
    timeZone: Intl && Intl.DateTimeFormat
           && Intl.DateTimeFormat().resolvedOptions().timeZone,
           // may be undefined
    locale: navigator.language,
    weekday: "long",
    display: [ "weekdays", "hours", "minutes" ],
    weekAlign: "center",
    minutesInterval: 1
  }

  // Acceptable values
  const roles = defaultValues.display
  const { timeZones, isoCodes } = zonesAndCodes
  const weekdayValues = ["long", "short", "narrow"]
  const alignments = ["left", "right", "center"]
  const allowedKeys = [
    "date",
    "timeZone",
    "role",
    "textAlign",
    "minutesInterval",
    "padding",
    "spacing",
    "verbose"
  ]


  if (typeof onChange !== "function") {
    console.log(`TimePicker
    You have created a TimePicker component without an onChange
    listener. The TimePicker will function perfectly but you
    will not be able to treat the selected time.`)
    onChange = () => {}
  }


  // date
  if ( typeof date === "object" && (date instanceof Date)) {
    // Clone the date, so that changes do not update in source
    date = new Date(date.getTime())

  } else {
    ({ date } = defaultValues)
    if (verbose) {
      console.log(`TimePicker: date set by default to now`)
    }
  }


  // timeZone
  if ( typeof timeZone !== "string"
    || timeZones.indexOf(timeZone) < 0
     ) {
    ({ timeZone } = defaultValues)
    if (verbose) {
      console.log(`TimePicker: timeZone set by default to "${timeZone}"`)
    }
  }


  // locale
  if ( typeof locale !== "string"
   || isoCodes.indexOf(locale.slice(0,2).toLowerCase()) < 0
     ) {
    ({ locale } = defaultValues)
    if (verbose) {
      console.log(`TimePicker: locale set by default to "${locale}"`)
    }
  }


  // weekday
  if ( typeof weekday !== "string") {
    ({ weekday } = defaultValues)
    if (verbose) {
      console.log(`TimePicker: weekday set by default to "${weekday}"`)
    }
  } else {
    weekday = weekday.toLowerCase()

    if (weekdayValues.indexOf(weekday) < 0) {
      ({ weekday } = defaultValues)
      if (verbose) {
        console.log(`TimePicker: weekday set by default to "${weekday}"`)
      }
    }
  }


  // Top level minutesInterval (needed even if no minutes are shown)
  if ( !minutesInterval || isNaN(minutesInterval)){
    ({ minutesInterval } = defaultValues)
  } else if (minutesInterval % 1 || 60 % minutesInterval) {
    minutesInterval = nearestDivisorOf60(minutesInterval, verbose)
  }


  // display / display / display / display / display / display //

  // Ensure display is an array
  if (!Array.isArray(display)) {
    ({ display } = defaultValues)
  }

  // Ensure display is an array of objects with valid roles
  display = display.map( item => {
    if (typeof item === "string") {
      item = item.toLowerCase()

      if (roles.indexOf(item) >= 0) {
        return { role: item }
      }

    } else if (typeof item === "object") {
      return item
    }

    return null
  }).filter( item => !!item )

  // Ensure only valid properties are present
  display = display.map( item => {
    item = {...item}

    let { role, minutesInterval: minInt, textAlign } = item

    // role must be valid, or entire object will be refused
    if (roles.indexOf(role) < 0) {
      return null
    }

    // use default value for minutesInterval, if minutes is invalid
    if (role === "minutes") {
      if (!minInt || isNaN(minInt)) {
        minInt = minutesInterval // already set to default

      } else if (minInt % 1 || 60 % minInt){
        minInt = nearestDivisorOf60(minInt, verbose)
      }

      // Promote to the top level of props, for useEffect
      minutesInterval = item.minutesInterval = minInt
    }

    if (role === "weekdays") {
      // Use props.weekAlign as default, but only if it is valid
      if (alignments.indexOf(weekAlign) < 0) {
        weekAlign = false
      }

      if ( typeof textAlign !== "string") {
        if (!weekAlign) {
          // Use the standard default...
          textAlign = defaultValues.weekAlign
          if (verbose) {
            console.log(`TimePicker: alignment for weekdays set by default to "${textAlign}"`)
          }
        } // ... otherwise use weekAlign

      } else {
        textAlign = textAlign.toLowerCase()

        if (alignments.indexOf(textAlign) < 0) {
          if (weekAlign) {
            textAlign = weekAlign

          } else {
            textAlign = defaultValues.weekAlign
            if (verbose) {
              console.log(`TimePicker: alignment for weekdays set by default to "${textAlign}"`)
            }
          }
        }
      }

      // Promote to top level of props, for useEffect
      weekAlign = item.textAlign = textAlign || weekAlign

    } else {
      // Use intelligent default for alignments
      if (alignments.indexOf(textAlign) < 0) {
        switch (role) {
          // case "weekdays":
          //   // already treated above
          //   break
          case "hours":
            item.textAlign = "right"
            break
          case "minutes":
            item.textAlign = "left"
            break
          default:
        }
      }
    }

    // NOTE: if padding is missing or invalid,
    //       the browser will ignore it

    // Remove keys that are not recognized
    Object.keys(item).forEach( key => {
      if (allowedKeys.indexOf(key) < 0) {
        delete item[key]
      }
    })

    return item

  }).filter( item => !!item )

  if (!display.length) {
    ({ display } = defaultValues)
  }

  props = {
    ...props,
    onChange,
    date,
    locale,
    weekday,
    weekAlign,
    display,
    minutesInterval
  }


  return props
}
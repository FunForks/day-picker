/**
 * TimePicker.jsx
 *
 * Creates a set of rotating cylinders, with the days of the week,
 * the hours of the day, and minutes at 5-minute intervals.
 * Each cylinder iterates through all its items independently.
 */



import React, {
  useState,
  useEffect,
  useRef,
} from 'react';



import { Cylinder } from './Cylinder'
import { getGradients } from './ColorUtilities'
import {
  getWeekdayNames,
  hours,
  getMinutes
 } from './TimeUtilities';




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
  const dependencies = Object.keys(props).map(prop => props[prop])  
  useEffect(reviewNewProps, dependencies)

  const {
    locale,       // ISO code, such as "en"
    weekday,      // long, short, narrow
    weekAlign,    // left, center, right
    bgColor,      // color for barrel
    shadowColor,  // color for shadow
    faces,        // integer linear-gradient stopping points
    radius,       // numerical 'em' value
    spacing,      // number of items per cycle
    fontSize,     // CSS length
    display,      // array of barrels to show
    everyNMinutes // read in from display[ { role: minutes, ... }]
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
    console.log("setWeekdayNames")
    const weekdayNames = getWeekdayNames(locale, { weekday })
    setWeekdays(weekdayNames)
  }
  useEffect(setWeekdayNames, [locale, weekday])


  // Minutes
  const [ minutes, setMinutes ] = useState(
    () => getMinutes(everyNMinutes)
  )
  const setMinuteArray = () => {
    const minutes = getMinutes(everyNMinutes)
    setMinutes(minutes)
  }
  useEffect(setMinuteArray, [everyNMinutes])


  // Optimize widths
  const [ barrelWidths, setBarrelWidths ] = useState([])
  const barrelRef = useRef()

  const setWidth = () => {
    const barrelDiv = barrelRef.current
    const barrels = Array.from(barrelDiv.children)
                         .filter( el => el.tagName === "DIV")

    const barrelWidths = barrels.reduce(( widths, barrel ) => {
      const items = Array.from(barrel.querySelectorAll("p"))
      const width = items.reduce(( max, element ) => {
        // Temporarily switch off the inline width, so that we can
        // get the actual width taken by the text.
        element.style.width = ""
        const scrollWidth = element.scrollWidth
        element.style.width = "100%"

        if (max < scrollWidth) {
          max = scrollWidth
        }
        return max
      }, 0)

      widths.push(`${width * 1.01}px`)
      return widths

    }, [])

    setBarrelWidths(barrelWidths)
  }
  useEffect(setWidth, [weekdays])


  // Rotate!
  const [ offset, setOffset ] = useState(0)

  const cycleThroughDays = () => {
    const newOffset = (offset + 0.1)

    setTimeout(() => {
      setOffset(newOffset)
    }, 100)
  }

  useEffect(cycleThroughDays)


  // Setup
  const sharedProps  = {
    radius,
    gradients,
    offset,
    spacing,
    fontSize
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
        // Fun: make hours turn backwards, override sharedProps
        props.offset = -sharedProps.offset
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
        width={barrelWidths[index]}
        items={items}
      />
    )
  })


  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center"
      }}
      ref={barrelRef}
    >
      {cylinders}
    </div>
  );
}

export default TimePicker;


// UTILITIES // UTILITIES // UTILITIES // UTILITIES // UTILITIES //

/**
 *  sanitize(props)
 *  Apply default values as necessary. Some are treated elsewhere.
 */
const sanitize = (props) => {
  let {
    locale,       // ISO code, such as "en"
    weekday,      // long, short, narrow
    weekAlign,    // left, center, right
    display,      // array of barrels to show
    everyNMinutes  //

    // // Sanitized in Cylinder.jsx
    // radius,      // numerical 'em' value
    // spacing,     // number of items per cycle
    // fontSize,    // CSS length

    // // Sanitized in ColorUtilities.js
    // bgColor,     // color for barrel
    // shadowColor, // color for shadow
    // faces,       // integer linear-gradient stopping points
  } = props
    

  const defaultValues = {
    locale: "en",
    weekday: "short",
    display: [ "weekdays", "hours", "minutes" ],
    weekAlign: "center",
    everyNMinutes: 1
  }

  // Acceptable values
  const roles = defaultValues.display
  const isoCodes = ["ab", "aa", "af", "ak", "sq", "am", "ar", "an", "hy", "as", "av", "ae", "ay", "az", "bm", "ba", "eu", "be", "bn", "bi", "bs", "br", "bg", "my", "ca", "ch", "ce", "ny", "zh", "cu", "cv", "kw", "co", "cr", "hr", "cs", "da", "dv", "nl", "dz", "en", "eo", "et", "ee", "fo", "fj", "fi", "fr", "fy", "ff", "gd", "gl", "lg", "ka", "de", "el", "kl", "gn", "gu", "ht", "ha", "he", "hz", "hi", "ho", "hu", "is", "io", "ig", "id", "ia", "ie", "iu", "ik", "ga", "it", "ja", "jv", "kn", "kr", "ks", "kk", "km", "ki", "rw", "ky", "kv", "kg", "ko", "kj", "ku", "lo", "la", "lv", "li", "ln", "lt", "lu", "lb", "mk", "mg", "ms", "ml", "mt", "gv", "mi", "mr", "mh", "mn", "na", "nv", "nd", "nr", "ng", "ne", "no", "nb", "nn", "Yi", "oc", "oj", "or", "om", "os", "pi", "ps", "fa", "pl", "pt", "pa", "qu", "ro", "rm", "rn", "ru", "se", "sm", "sg", "sa", "sc", "sr", "sn", "sd", "si", "sk", "sl", "so", "st", "es", "su", "sw", "ss", "sv", "tl", "ty", "tg", "ta", "tt", "te", "th", "bo", "ti", "to", "ts", "tn", "tr", "tk", "tw", "ug", "uk", "ur", "uz", "ve", "vi", "vo", "wa", "cy", "wo", "xh", "yi", "yo", "za", "zu"]
  const weekdayValues = ["long", "short", "narrow"]
  const alignments = ["left", "right", "center"]
  const allowedKeys = [
    "role",
    "textAlign",
    "everyNMinutes",
    "padding"
  ]
  

  // locale
  if ( typeof locale !== "string"
   || isoCodes.indexOf(locale.slice(0,2).toLowerCase()) < 0
     ) {
    ({ locale } = defaultValues)
    console.log(`TimePicker: locale set by default to "${locale}"`)
  }


  // weekday
  if ( typeof weekday !== "string") {
    ({ weekday } = defaultValues)
    console.log(`TimePicker: weekday set by default to "${weekday}"`)
  } else {
    weekday = weekday.toLowerCase()

    if (weekdayValues.indexOf(weekday) < 0) {
      ({ weekday } = defaultValues)
      console.log(`TimePicker: weekday set by default to "${weekday}"`)
    }
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

    let { role, everyNMinutes: everyN, textAlign } = item

    // role must be valid, or entire object will be refused
    if (roles.indexOf(role) < 0) {
      return null
    }
    
    // use default value for everyNMinutes, if minutes is invalid
    if (role === "minutes") {
      if (!everyNMinutes || isNaN(everyNMinutes) || 60 % everyNMinutes) {
        everyNMinutes = false
      }

      if (!everyN || isNaN(everyN) || 60 % everyN) {
        if (everyNMinutes) {
          everyN = everyNMinutes

        } else {
          everyN = defaultValues.everyNMinutes
          console.log(`TimePicker: everyNMinutes set by default to ${everyN}`)
        }
      }

      // Promote to the top level of props, for useEffect
      everyNMinutes = item.everyNMinutes = everyN
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
          console.log(`TimePicker: alignment for weekdays set by default to "${textAlign}"`)
        } // ... otherwise use weekAlign

      } else {
        textAlign = textAlign.toLowerCase()

        if (alignments.indexOf(textAlign) < 0) {
          if (weekAlign) {
            textAlign = weekAlign

          } else {
            textAlign = defaultValues.weekAlign
            console.log(`TimePicker: alignment for weekdays set by default to "${textAlign}"`)
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
    locale,
    weekday,
    weekAlign,
    display,
    everyNMinutes
  }
  

  return props
}
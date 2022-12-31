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



const TimePicker = ({
  locale,      // ISO code, such as "en"
  weekday,     // long, short, narrow
  weekAlign,   // left, center, right
  bgColor,     // color for barrel
  shadowColor, // color for shadow
  faces,       // integer linear-gradient stopping points
  radius,      // numerical 'em' value
  spacing,     // number of items per cycle
  fontSize,    // CSS length
  display      // array of barrels to show
}) => {
  // Apply default values as necessary.
  // However...
  // + bgColor and shadowColor defaults are treated in getGradient()
  // + radius and spacing defaults are treated in Cylinder

  const defaultValues = {
    locale: "en",
    weekday: "short",
    display: [ "weekdays", "hours", "minutes" ]
  }
  
  if (typeof locale !== "string" || locale === "undefined") {
    ({ locale } = defaultValues)
  }
  if (typeof weekday !== "string") {
    ({ weekday } = defaultValues)
  } else {
    weekday = weekday.toLowerCase()
    if (["long", "short", "narrow"].indexOf(weekday)) {
      ({ weekday } = defaultValues)
    }
  }
  if (Array.isArray(display)) {

  } else {
    display = defaultValues.display
  }

  display = display.map( item => {
    if (typeof item === "string") {
      return { role: item }
    } else if (typeof item === "object") {
      return item
    }
    return null
  }).filter( item => !!item )

  const roles = ["weekdays", "hours", "minutes"]
  const nMinutes = [1, 5, 10, 15]
  const allowedKeys = [
    "role",
    "padding",
    "textAlign",
    "everyNMinutes"
  ]
  const alignments = ["left", "right", "center"]

  display = display.map( item => {
    item = {...item}

    const { role, everyNMinutes, textAlign } = item

    if (roles.indexOf(role) < 0) {
      return null
    }
    
    if (role === "minutes") {
      if (nMinutes.indexOf(everyNMinutes) < 0) {
        item.everyNMinutes = 5
      }
    }

    if (alignments.indexOf(textAlign) < 0) {
      switch (role) {
        case "weekdays":
          item.textAlign = "center"
          break
        case "hours":
          item.textAlign = "right"
          break
        case "minutes":
          item.textAlign = "left"
          break
        default:
      }
    }

    Object.keys(item).forEach( key => {
      if (allowedKeys.indexOf(key) < 0) {
        delete item[key]
      }
    })

    return item
  
  }).filter( item => !!item )

  // Initialize... but run initialization functions only once...
  const [ skipInit, setSkipInit ] = useState(false)
  useEffect(() => setSkipInit(true), [])
    
  // const [ gradients, setGradients ] = useState(
  const [ gradients, setGradients ] = useState(
    getGradients(bgColor, shadowColor, faces, skipInit)
  )

  const [ weekdays, setWeekdays ] = useState(
    getWeekdayNames(locale, { weekday }, skipInit)
  )

  // ... unless something changes
  const setGradientColors = () => {
    const gradients = getGradients(bgColor, shadowColor, faces)
    setGradients(gradients)
  }
  useEffect(setGradientColors, [bgColor, shadowColor, faces])

  const setWeekdayNames = () => {
    const weekdayNames = getWeekdayNames(locale, { weekday })
    setWeekdays(weekdayNames)
  }
  useEffect(setWeekdayNames, [locale, weekday])


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
        props.offset = -sharedProps.offset
        break
      case "minutes":
        items = getMinutes(props.everyNMinutes)
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

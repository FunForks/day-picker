/**
 * App.jsx
 *
 * Creates a set of rotating cylinders, with the days of the week,
 * the hours of the day, and minutes at 5-minute intervals.
 * Each cylinder iterates through all its items independently.
 */



import React, { useState, useEffect, useRef } from 'react';

import { Cylinder } from './Cylinder'
import { gradients } from '../../api/gradients'



// <<< UTILITY CODE
const locale = "en" // "ar", "de", "en", "es", "fr", "ru", "zh"

/**
 * Create an array of localized weekday names, starting with today
 */
const weekdayNames = (locale, format) => {
  let date       = new Date()
  const msInDay  = 24 * 60 * 60 * 1000

  const weekdays = Array(7).fill(0).map(() => {
    const weekday = date.toLocaleString(locale, format)
    date = new Date(date.getTime() + msInDay)
    return weekday
  })

  return weekdays
}

const weekdays = weekdayNames(locale, { weekday: "long" })


const hours = Array(24).fill().map((_, index) => (
  (index < 10 ? "0"+index : index)
))

const minutes = Array(12).fill().map((_, index) => (
  (index < 2 ? "0"+index * 5 : index * 5)
))
// UTILITY CODE >>>



function App() {
  const [ offset, setOffset ] = useState(0)
  const [ barrelWidths, setBarrelWidths ] = useState([])
  const barrelRef = useRef()

  // <<< HARD-CODED
  const radius = 1.5  // "em"
  const spacing = 8.5 // must between 3 and (items.length - 1) * 2
  // Allow for ascenders and descenders
  const special = ["th"]
  const heightTweak = (special.indexOf(locale) < 0 ? 2.15 : 2.5)
  // + locale, above
  // HARD-CODED >>>


  // Rotate!
  const cycleThroughDays = () => {
    const newOffset = (offset + 0.1)
    setTimeout(() => {
      setOffset(newOffset)
    }, 100)
  }
  useEffect(cycleThroughDays)


  // Optimize weekdayWidth
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
  useEffect(setWidth, [])


  // Setup
  const sharedProps  = {
    radius,
    gradients,
    offset,
    spacing,
    heightTweak
  }

  const dayProps = {
    items: weekdays,
    textAlign: "right",
    padding: '0.25em'
  }

  const hourProps = {
    items: hours,
    textAlign: "right"
  }

  const minuteProps = {
    items: minutes,
    textAlign: "left"
  }


  return (
    <div
      style={{
        display: "flex",
      }}
      ref={barrelRef}
    >
      <Cylinder
        {...sharedProps}
        {...dayProps}
        width={barrelWidths[0]}
      />
      <Cylinder
        {...sharedProps}
        {...hourProps}
        width={barrelWidths[1]}
      />
      <span
        style={{
          height: `${radius * heightTweak}em`,
          display: "flex",
          alignItems: "center"
        }}
      >
        :
      </span>
      <Cylinder
        {...sharedProps}
        {...minuteProps}
        width={barrelWidths[2]}
      />
    </div>
  );
}


export default App;

/**
 * App.jsx
 * 
 * Creates the effect of a rotating cylinder, with the names of
 * the week on it.
 */

import React, { useState, useEffect } from 'react';

import { Cylinder } from './Cylinder'
import { gradients } from '../../api/gradients'



// <<< UTILITY CODE
const locale = "en" // try "de", "en", "es", "fr", "th", ...

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
  }).reverse()

  return weekdays
}

const weekdays = weekdayNames(locale, { weekday: "long" })


const hours = Array(24).fill().map((_, index) => (
  (index < 10 ? "0"+index : index)
)).reverse()

const minutes = Array(12).fill().map((_, index) => (
  (index < 2 ? "0"+index * 5 : index * 5)
)).reverse()
// UTILITY CODE >>>



function App() {
  const [ offset, setOffset ] = useState(0)
      
  const radius = 1.5 // "em"
  const spacing = 7 // 8.5


  // Rotate!
  const cycleThroughDays = () => {
    const newOffset = (offset + 0.05)
    setTimeout(() => setOffset(newOffset), 100)    
  }

  useEffect(cycleThroughDays)


  const sharedProps  = {
    radius,
    gradients,
    offset,
    spacing
  }

  const dayProps = {
    items: weekdays,
    width: "8em",
    textAlign: "right",
  }

  const hourProps = {
    items: hours,
    width: "1.5em",
    textAlign: "right"
  }

  const minuteProps = {
    items: minutes,
    width: "1.5em",
    textAlign: "left"
  }

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <Cylinder
        {...sharedProps}
        {...dayProps}
      />
      <Cylinder
        {...sharedProps}
        {...hourProps}
      />
      <span
        style={{
          height: `${radius * 2.4}em`,
          display: "flex",
          alignItems: "center"
        }}
      >
        :
      </span>
      <Cylinder
        {...sharedProps}
        {...minuteProps}
      />
    </div>
  );
}


export default App;

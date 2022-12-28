/**
 * App.jsx
 * 
 * Creates the effect of a rotating cylinder, with the names of
 * the week on it.
 */

import React, { useState, useEffect } from 'react';

// Import gradients for cylinder elements
import { cylinder } from './cylinder'
const { element, shadow } = cylinder


// <<< UTILITY CODE
const locale = "ru" // try "de", "en", "es", "fr", "th", ...

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
// UTILITY CODE >>>



function App() {
  const [ turn, setTurn ] = useState(0) 
  
  const radius = 1.5 // "em"
  const angle = Math.PI * 2 / 7 // split circle into 7 equal parts

  const days = weekdays.map((weekday, index ) => {
    const radians = (angle * index) + turn
    
    // Create a paragraph that will rotate around a point `radius`
    // behind its centre. The top of the paragraph is placed at
    // 50% of the parent, and then moved up 50% of its own height
    // by the translateX function. This centres it within its
    // parent.
    return (
      <p
        key={weekday}
        style={{
          position: "absolute",
          margin: 0,
          width: "100%",
          top: "50%",
          left: 0,

          transformOrigin: `0 50% ${radius}em`,
          transform: `
            translate(0, -50%)
            rotateX(${radians}rad)
          `,
          backfaceVisibility: "hidden",
          
          textAlign: "center"
        }}
      >
        {weekday}
      </p>
    )
  })


  // Rotate!
  const cycleThroughDays = () => {
    const turned = (turn + 0.05)
    setTimeout(() => setTurn(turned), 100)    
  }

  useEffect(cycleThroughDays)


  // The height of the cylinder div needs to be a bit more than
  // twice the radius used by the paragraphs, to allow for 
  // descenders (g, j, p, q, y). Hence 2.4 below.
  return (
    <div
      style={{
        "--height": `${radius * 2.4}em`,
        "--width": "8em",
        position: "relative"
      }}
    >

      {/* The cylinder... */}
      <div
        style={{
          position: "relative",
          width: "var(--width)",
          height: "var(--height)",
          background: element
        }}
      >
        {/* The rotating days */}
        {days}
      </div>

      {/* ... and its shadow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          width: "var(--width)",
          height: "var(--height)",
          background: shadow
        }}
      >
      </div>
    </div>
  );
}

export default App;

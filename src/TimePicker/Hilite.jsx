/**
 * Hilite.jsx
 *
 * Provides interaction and visual feedback for changing the
 * offset of a parent Cylinder
 */



import React, { useState } from 'react';


// Constants to control auto-scrolling
const START_AUTO = 1000
const ANIMATION  = START_AUTO * 0.8
const START_RATE = 500
const MIN_DELAY  = 100
const REDUCE_BY  = 0.8


let renders = 0

export const Hilite = ({
  edge,      // "top" | "bottom"
  width,     // CSS length
  gradients, // [<hilite gradient string>, <press gradient string>]
  offset,    // current offset of parent Cylinder
  setOffset  // function to update offset in parent Cylinder
}) => {
  const [ hover, setHover ] = useState(false)
  const [ pressed, setPressed ] = useState(false)

  const direction = edge === "top" ? -1 : 1
  let timeOut
  let rate

  // Event listener functions are trapped inside the initial
  // closure. The Hilite component will be re-rendered each time
  // the parent Cylinder's offset is updated, but the functions
  // that will handle the timeouts and the release event will
  // be those inside the render that was current when the
  // treatPress function was called.
  // closureOffset will remain accessible to that closure.
  let closureOffset = offset


  const treatHover = event => {
    setHover(event.type === "mouseenter")
  }


  const release = event => {
    setPressed(false)
    clearTimeout(timeOut)
    // Tidy up
    setTimeout(0)
    document.body.removeEventListener(event.type, release, false)
  }


  const treatPress = event => {
    // Visual feedback
    const type = event.type
    const pressed = type === "mousedown"
                 || type === "touchstart"
    const pressEnd = type === "mousedown" ? "mouseup" : "touchend"
    setPressed(pressed)

    // The mouseup may occur anywhere, even outside this
    // component, even outside this window. In the latter case,
    // no event will be received, so the Cylinder may keep
    // scrolling. In the former case, the scrolling will stop.
    document.body.addEventListener(pressEnd, release, false)

    // Action
    const autoScroll = () => {
      if (pressed && hover) {
        closureOffset += direction
        setOffset(closureOffset)
        rate = Math.max(rate * REDUCE_BY, MIN_DELAY)
        timeOut = setTimeout(autoScroll, rate)
      }
    }


    if (pressed) {
      closureOffset += direction
      setOffset(closureOffset)
      timeOut = setTimeout(autoScroll, START_AUTO)
      rate = START_RATE

    } else {
      clearTimeout(timeOut)
      setTimeout(0)
    }
  }


  const gradient = (() => {
    if (hover) {
      if (pressed) {
        return gradients[1]
      } else {
        return gradients[0]
      }
    }
  })()


  return (
    <div
      style={{
        position: "absolute",
        top: (edge === "top" ? "0" : "auto"),
        bottom: (edge === "top" ? "auto" : "0"),
        borderTopLeftRadius: (edge === "top" ? "0" : "0.5em"),
        borderTopRightRadius: (edge === "top" ? "0" : "0.5em"),
        borderBottomLeftRadius: (edge === "top" ? "0.5em" : "0"),
        borderBottomRightRadius: (edge === "top" ? "0.5em" : "0"),
        width,
        height: "calc(var(--height) * 0.25)",
        margin: "var(--margin",
        background: gradient
      }}
      onMouseEnter={treatHover}
      onMouseLeave={treatHover}
      onMouseDown={treatPress}
      onTouchStart={treatPress}
    />
  )
}
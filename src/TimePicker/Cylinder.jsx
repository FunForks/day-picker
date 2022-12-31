/**
 *
 */



import React, {
  useState,
  useEffect,
  forwardRef
} from 'react';




export const Cylinder = forwardRef((props, ref) => {
  // offset will change on a regular basis. There is no need
  // to sanitize all the props just for this. Treat it on its own...
  const [ offset, setOffset ] = useState(
    () => sanitizeOffset(props)
  )
  const reviewOffset = () => {
    setOffset(sanitizeOffset(props))
  }
  useEffect(reviewOffset, [props.offset])

  // ... and treat the other props separately
  const [ cleanProps, setCleanProps ] = useState(
    () => sanitizeOthers(props)
  )
  const keys = Object.keys(props)
  keys.splice(keys.indexOf("offset"), 1)
  const dependencies = keys.map(prop => props[prop])
  const reviewNewProps = () => {
    setCleanProps(sanitizeOthers(props))
  }
  useEffect(reviewNewProps, dependencies)
  // End of sanitization and useEffect treatment


  const {
    // essential
    items,     // array of strings to wrap around the cylinder
    // defaults provided
    spacing,   // floating-point number ≥ 2
    radius,    // CSS length, e.g.: 2em
    gradients, // { barrel: <linear gradient>, shadow: <also> }
    width,     // CSS length, e.g.: 29px (missing on first render)
    textAlign, // "left", "right", "center" (defaults to inherit)
    padding,   // CSS length
    fontSize   // CSS length, e.g.: 4vmin
  } = cleanProps


  const angle = Math.PI * 2 / spacing

  // Determine which chunk of items could be visible, and what
  // fraction to rotate them
  let fraction = ((offset + 1/2) % items.length) - 1/2
  const counter = Math.floor(fraction)

  // HACK
  // If `fraction` is simply set to the decimal part of itself, a
  // position will repeat when fraction moves between zero and
  // non-zero, and the value of counter changes by 1, altering
  // the contents of `seen`. To prevent this from happening,
  // `fraction` is scaled by 6.3 / spacing, which (empirically)
  // seems to give smooth results.
  fraction = (fraction - counter) * 6.3 / spacing

  // Obtain the relevant chunk
  const total = Math.ceil(spacing / 2) + 1
  const before = Math.floor(total / 2)
  const sliceOfPI = Math.PI * 2 - (before * Math.PI * 2 / spacing)

  let startSlice = counter - before
  const sliceEnd = startSlice + total

  let seen = []
  if (startSlice < 0) {
    // Add some items wrapped from the end
    seen = items.slice(startSlice)
    startSlice = 0
  }

  const first = items.slice(startSlice, sliceEnd)
  seen = [...seen, ...first]

  const more = total - seen.length
  if (more > 0) {
    // Add some items wrapped from the beginning
    seen = [...seen, ...items.slice(0, more)]
  }



  const content = seen.map(( item, index ) => {
    const radians = (angle * index) - fraction + sliceOfPI
    // Fix for backface-visibility not always working on iOS
    const hidden = ((radians / Math.PI + 1/2) % 2) > 1

    // Create a paragraph that will rotate around a point `radius`
    // behind its centre. The top of the paragraph is placed at
    // 50% of the parent, and then moved up 50% of its own height
    // by the translateX function. This centres it within its
    // parent.
    return (
      <p
        key={item+index}
        style={{
          position: "absolute",
          margin: 0,
          top: "50%",
          width: "100%",
          boxSizing: "border-box",
          whiteSpace: "nowrap",
          textAlign,
          fontSize,

          // Tweak for compatibility with Thai fonts
          padding: (padding || "0 0.1em"),

          transformOrigin: `0 50% ${radius}em`,
          transform: `
            translate(0, -50%)
            rotateX(${radians}rad)
          `,
          // backfaceVisibility: "hidden", // might fail on iOS
          visibility: `${hidden ? "hidden" : ""}`,
        }}
      >
        {item}
      </p>
    )
  })



  return (
    <div
      style={{
        "--height": `calc(${radius} * 2 * ${fontSize})`,
        "--margin": "0 0.05em",
        position: "relative",
        overflowY: "hidden" // hides ascenders and descenders
      }}
    >

      {/* The gradients... */}
      <div
        style={{
          position: "relative",
          width,
          height: "var(--height)",
          margin: "var(--margin",
          background: gradients.barrel,
        }}
        ref={ref}
      >
        {/* The rotating content */}
        {content}
      </div>

      {/* ... and its shadow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          width,
          height: "var(--height)",
          margin: "var(--margin",
          background: gradients.shadow
        }}
      >
      </div>
    </div>
  );
})




// UTILITIES // UTILITIES // UTILITIES // UTILITIES // UTILITIES //

const units = ["cm", "mm", "in", "pc", "pt", "px", "em", "ex", "ch", "rem", "vw", "vh", "vmin", "vmax"]
const regexString = units.reduce(( regex, unit ) => (
  `${regex}|${unit}`
))
const unitRegex = new RegExp(`^([0-9.]+)(${regexString})$`, "i")

const isValidCSSLength = (string) => {
  if (typeof string !== "string") {
    return false

  }

  const match = unitRegex.exec(string)

  if (match) {
    // The units are valid ....
    const number = match[1]
    if (number.indexOf(".") !== number.lastIndexOf(".")) {
      // ... but there is more than one decimal point
      return false

    } else if (number === ".") {
      // ... but there is no actual number
      return false
    }

  } else {
    // No valid units, or no number
    return false
  }

  return true
}



const sanitizeOffset = (props) => {
  let {
    items,  // array of strings to wrap around the cylinder
    offset  // positive floating-point number
  } = props

  const length = items.length

  if (isNaN(offset)) {
    offset = 0

  } else if (length > 1) {
    while (offset < 0) {
      // Work only with positive offsets
      offset += length
    }

  } else {
    // If there is only one item, don't let it rotate
    offset = 0
  }

  return offset
}



const sanitizeOthers = (props) => {
  let {
    items,       // array of strings to wrap around the cylinder
    spacing,     // floating-point number ≥ 2

    radius,      // CSS length, e.g.: 2em
    gradients,   // { barrel: <linear gradient>, shadow: <also> }
    fontSize,    // CSS length, e.g.: 4vmin

    // // The browser will tolerate invalid values for the following:
    // width,    // CSS length, e.g.: 29px (missing on first render)
    // textAlign,// "left", "right", "center" (defaults to inherit)
    // padding,  // CSS length
  } = props


  const defaultValues = {
    radius: 1,
    fontSize: "1em",
    items: ["items", "array", "of" ,"strings", "- missing -"],
    spacing: 8.5
  }
  // A spacing of just over 8 will show:
  // * a slither
  // * the previous value, squished but readable
  // * the current value, full size
  // * the next value, squished but readable
  // * a slither


  if (!Array.isArray(items) || !items.length) {
    items = defaultValues.items
    console.log(`Cylinder: items array missing, using placeholder`)
    spacing = 6

  } else {
    const length = items.length
    if (isNaN(spacing)) {
      spacing = Math.max(
        2, Math.min(defaultValues.spacing, length * 2)
      )
      console.log(`Cylinder: spacing set by default to ${spacing}`)

    } else if (length === 1) {
      // offset will be blocked at 0
      spacing = 2

    } else {
      spacing = Math.max(3, Math.min(spacing, length * 2))
    }
  }

  if (isNaN(radius) || radius < 1) {
    radius = defaultValues.radius
    console.log(`Cylinder: radius set by default to ${radius}`)
  }

  if (typeof gradients !== "object") {
    gradients = {}
    console.log(`Cylinder: no gradients. Default shading will be used`)
  }

  if (!isValidCSSLength(fontSize)) {
    fontSize = defaultValues.fontSize
    console.log(`Cylinder: fontSize set by default to ${fontSize}`)
  }

  props = {
    ...props,
    items,
    spacing,
    radius,
    gradients,
    fontSize
  }

  return props
}
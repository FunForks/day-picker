/**
 * Cylinder.jsx
 *
 * Creates the effect of a rotating cylinder, with the given items
 * wrapped around it, as if on a band.
 */



import React, { forwardRef} from 'react';



export const Cylinder = forwardRef(({
  // essential
  items,       // array of strings to wrap around the cylinder
  // defaults provided
  radius,      // CSS length, e.g.: 2em
  offset,      // floating-point number
  spacing,     // floating-point number ≥ 3
  gradients,   // { barrel: <linear gradient>, shadow: <also> }
  heightTweak, // 2.1 or greater, to allow for asc~ and descenders
               // (may depend on language and font)
  // optional
  width,       // CSS length, e.g.: 29px (missing on first render)
  textAlign,   // "left", "right", "center" (defaults to inherit)
  padding,     // CSS length
}, ref) => {

  // <<< Provide defaults
  if (!Array.isArray(items)) {
    items = ["items", "array", "of" ,"strings", "- missing -"]
  }
  if (isNaN(radius)) {
    radius = 1
  }
  if (isNaN(offset)) {
    offset = 0
  }
  if (isNaN(spacing)) {
    spacing = Math.max(7, Math.min(3, items.length))
  }
  if (!heightTweak) {
    heightTweak = 2
  }
  if (typeof gradients !== "object") {
    gradients = {}
  }
  // Provide defaults >>>


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


  // The height of the gradients div needs to be a bit more than
  // twice the radius used by the paragraphs, to allow for
  // descenders (g, j, p, q, y). Hence heightTweak below.
  return (
    <div
      style={{
        "--height": `${radius * heightTweak}em`,
        "--margin": "0 0.05em",
        position: "relative"
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

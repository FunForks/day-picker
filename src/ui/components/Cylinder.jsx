/**
 * App.jsx
 * 
 * Creates the effect of a rotating cylinder, with the names of
 * the week on it.
 */

import React from 'react';



export const Cylinder = ({
  items,
  radius,
  width,
  textAlign,
  gradients,
  offset,
  spacing
}) => {
  const angle = Math.PI * 2 / spacing
  const sliceOfPI = Math.PI * 2 - (6 * Math.PI / spacing)


  const first = items.slice(0,3)
  const last = items.slice(-4)
  const seen = [...last, ...first]

  const content = seen.map((item, index ) => {
    const radians = (angle * index) + offset + sliceOfPI
    // Fix for backface-visibility not always working on iOS
    const hidden = ((radians / Math.PI + 1/2) % 2) > 1
    
    // Create a paragraph that will rotate around a point `radius`
    // behind its centre. The top of the paragraph is placed at
    // 50% of the parent, and then moved up 50% of its own height
    // by the translateX function. This centres it within its
    // parent.
    return (
      <p
        key={item}
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
          // backfaceVisibility: "hidden", // might fail on iOS
          visibility: `${hidden ? "hidden" : ""}`,
          
          textAlign
        }}
      >
        {item}
      </p>
    )
  })


  // The height of the gradients div needs to be a bit more than
  // twice the radius used by the paragraphs, to allow for 
  // descenders (g, j, p, q, y). Hence 2.4 below.
  return (
    <div
      style={{
        "--height": `${radius * 2.4}em`,
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
          background: gradients.element
        }}
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
}

/**
 * cylinder.js
 * 
 * Calculates the background gradients needed to colour a div to
 * make it look like a cylinder, and for an barrel to place over
 * the top which will darken the content of the cylinder div in
 * a (somewhat) realistic way. This second barrel could be an
 * ::after pseudo-barrel for the cylinder div itself.
 */


export const gradients = (() => {
  let barrel = "0deg"
  let shadow = "0deg"
  
  // <<< HARD-CODED 
  // * R,G,B(,A) VALUES
  const mainMax  = [255, 0, 0]
  const shadowMax = [0,  0,   0, -255] // -ve > subtracted from 255
  // * "FACES" for half a cylinder
  const faces = 2 // more faces give a clearer cylinder
  // HARD-CODED >>>

  const angle = Math.PI / faces


  /**
   * getColor returns a string like "#rrggbb" or "#rrggbbaa",
   * where r, g, b, and a are hex digits
   */
  const getColor = (sin, colors) => {
    const hex = colors.reduce(( hex, value ) => {
      let decimal = Math.floor(sin * value)
      if (value < 0) {
        // used to make the shadow lighter in the centre
        decimal += 255
      }
      value = Number(decimal).toString(16)

      if (decimal < 15) {
        // pad with a zero to give the final hex the right length
        value = "0"+value
      }

      return hex + value
    }, "#")

    return hex
  }

  /**
   * getPercent returns values between 0.0 and 100.0
   */
  const getPercent = (cos, halfway) => {
    const percent = (halfway) 
    ? (50 + 50 * cos).toFixed(1)
    : (50 - 50 * cos).toFixed(1)

    return percent
  }


  /**
   * Iterate through the faces, calculating the color for each
   * section of the main barrel and the shadow
   */
  for ( let ii = 0; ii < faces; ii++ ) {
    const sin = Math.sin(angle * ii)
    const cos = Math.abs(Math.cos(angle * ii))

    const main = getColor(sin, mainMax)
    const dark = getColor(sin, shadowMax)
    
    const percent = getPercent(cos, (ii > faces / 2))

    barrel += ", " + main + " " + percent + "%"
    shadow += ", " + dark + " " + percent + "%"
  }

  return {
    barrel: `linear-gradient(${barrel}, #000000 100%)`,
    shadow: `linear-gradient(${shadow}, #000000ff 100%)`
  }
})()

// console.log("cylinder:", cylinder);

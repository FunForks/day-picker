/**
 * ColorUtilities.js
 *
 * Functions to convert a string color representation into an
 * object with the format:
 * { barrel: "linear-gradient(...)",
 *   shadow: "linear-gradient(...)"
 * }
 */



export const getGradients = (bgColor, shadowColor, hoverColor, pressColor, faces) => {
  // Apply defaults if necessary
  const defaultColors = {
    bg:     [128, 128, 128],
    shadow: [  0,   0,   0, 255],
    hover:  [512, 512, 512, 512],
    press:  [666, 666, 666, 444]
  }

  let mainMax
  let shadowMax
  let hoverMax
  let pressMax

  if (typeof bgColor === "string") {
    mainMax = colorToRGBArray(bgColor)
    if (!Math.max(...mainMax)) { // black
      mainMax = defaultColors.bg
    }
  } else {
    mainMax = defaultColors.bg
  }

  if (typeof shadowColor === "string") {
     shadowMax = colorToRGBArray(shadowColor)
    if (shadowMax.length !== 4 || !shadowMax[3]) {
      shadowMax = defaultColors.shadow
    }
  } else {
    shadowMax = defaultColors.shadow
  }

  if (typeof hoverColor === "string") {
    hoverMax = colorToRGBArray(hoverColor)
    if (hoverMax.length !== 4 || !hoverMax[3]) {
      hoverMax = defaultColors.hover
    }
  } else {
    hoverMax = defaultColors.hover
  }

  if (typeof pressColor === "string") {
    pressMax = colorToRGBArray(pressColor)
    if (pressMax.length !== 4 || !pressMax[3]) {
      pressMax = defaultColors.press
    }
  } else {
    pressMax = defaultColors.press
  }

  if (!faces || isNaN(faces)) {
    // Creates a very round look
    faces = 2
  } else {
    // Creates a flatter look
    faces = Math.max(2, Math.min(faces, 20))
  }

  const angle = Math.PI / faces

  // Initialize output strings
  let barrel   = "linear-gradient(0deg"
  let shadow   = "linear-gradient(0deg"
  let topLite  = "linear-gradient(0deg"
  let lowLite  = "linear-gradient(180deg"
  let topPress = "linear-gradient(0deg"
  let lowPress = "linear-gradient(180deg"

  /**
   * getColor returns a string like "#rrggbb" or "#rrggbbaa",
   * where r, g, b, and a are hex digits
   */
  const getColor = (sin, colors) => {
    const hex = colors.reduce(( hex, value, index ) => {
      let decimal = Math.floor(sin * value)
      if (index === 3) {
        // make the shadow more transparent in the centre
        decimal = 255 - decimal
      }
      value = Number(decimal).toString(16)

      if (decimal < 16) {
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

  faces = Math.max(2, Math.round(faces/4))

  for ( let ii = 0; ii < faces; ii++ ) {
    const turn = angle * ii / 4

    const sin = Math.sin(turn)
    const cos = Math.abs(Math.cos(turn))

    const hover = getColor(sin, hoverMax)
    const press = getColor(sin, pressMax)

    const percent = getPercent(cos, (ii > faces / 2))

    topLite  += ", " + hover + " " + percent + "%"
    lowLite  += ", " + hover + " " + percent + "%"
    topPress += ", " + press + " " + percent + "%"
    lowPress += ", " + press + " " + percent + "%"
  }

  return {
    barrel:   `${barrel},  #000000 100%)`,
    shadow:   `${shadow},  #000000ff 100%)`,
    topLite:  `${topLite}, #000000 100%)`,
    lowLite:  `${lowLite}, #000000ff 100%)`,
    topPress: `${topPress}, #000000 100%)`,
    lowPress: `${lowPress}, #000000ff 100%)`
  }
}



// COLOR FUNCTIONS // COLOR FUNCTIONS // COLOR FUNCTIONS //

export const colorToRGBArray = (colorString) => {
  const format = colorString.substring(0, 3).toLowerCase()
  if (format === "rgb") {
    return rgbToArray(colorString)
  } else if (format === "hsl" ) {
    return HSLtoRGB(colorString)
  } else {
    return hexToArray(colorString)
  }
}



export const hexToArray = (colorString) => {
  if (colorString[0] === "#") {
    colorString = colorString.slice(1)
  }

  let noAlpha = false
  switch (colorString.length) {
    case 4:
      // Double each hex digit
      colorString = colorString[0]+colorString[0]
                  + colorString[1]+colorString[1]
                  + colorString[2]+colorString[2]
                  + colorString[3]+colorString[3]
      break
    case 8:
      break
    case 3:
      // Double each hex digit
      colorString = colorString[0]+colorString[0]
                  + colorString[1]+colorString[1]
                  + colorString[2]+colorString[2]
      noAlpha = true
      break
    case 6:
      noAlpha = true
      break
    default:
      // Invalid hex length
      return [0, 0, 0, 0]
  }

  if (noAlpha) {
    // Add 100% opacity
    colorString += "00"
  }

  const hex = parseInt(colorString, 16) // 32-bit integer

  // >>> unsigned right shift
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Unsigned_right_shift
  //
  // & bitwise AND
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_AND
  const array = [
      hex >>> 24             // red
    ,(hex >>> 16) & 0x0000FF // green
    ,(hex >>>  8) & 0x00FF   // blue
    , hex         & 0xFF     // alpha
  ]

  if (noAlpha) {
    array.pop()
  }

  return array
}



export const rgbToArray = (color) => {
  const regex = /rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*(\d+))?\s*\)/

  const match = regex.exec(color)
  if (match) {
    return match.reduce(( array, current, index ) => {
      // Ignore match[0], the full matching string
      if (index) {
        // Capturing group
        const value = Number(current)
        // Positive integer by definition, but may be > 255
        array.push(Math.min(value, 255))
      }

      return array
    }, [])
  }

  return [0, 0, 0, 0]
}



export const HSLtoRGB = (colorString )=> {
  // "hsl(412.523,50%,40%)" <<< percentages
  // "412.523, 0.5, 0.4"    <<< ratios
  let rgb = [0, 0, 0]

  const regex = /(hsl\s*\(\s*)?([0-9.]+)\s*,\s*([0-9.]+)(%?)\s*,\s*([0-9.]+)(%?)\s*\)?/
  const match = regex.exec(colorString)

  if (match) {
    let h = parseFloat(match[2], 10)
    let s = parseFloat(match[3], 10)
    let l = parseFloat(match[5], 10)

    while (h > 360) {
      h -= 360
    }
    while (h < 0) {
      h += 360
    }
    if (match[4]) { // "%"
      s /= 100
    }
    s = Math.max(0, Math.min(s, 1))
    if (match[6]) { // "%"
      l /= 100
    }
    l = Math.max(0, Math.min(l, 1))

    rgb = hsl2rgb(h, s, l) // [<0.0-1.0>, <0.0-1.0>, <0.0-1.0>]
         .map(number => Math.round(number * 255))
  }

  return rgb
}



// https://stackoverflow.com/a/54014428/1927589
// input: h in [0,360] and s,v in [0,1]
// output: [r,g,b] in [0,255]
export const hsl2rgb = (h,s,l) => {
  let a=s*Math.min(l,1-l);
  let f= (n,k=(n+h/30)%12) => l - a*Math.max(Math.min(k-3,9-k,1),-1);
  return [f(0),f(8),f(4)]
}
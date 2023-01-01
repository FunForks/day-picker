/**
 * Selector.jsx
 */

const Selector = ({ attribute, options, value, setValue }) => {
  const treatChange = (event) => {
    let value = event.target.value

    if (!value || value === "undefined") {
      value = undefined

    } else if (Number(value) == value) {
      // Use an actual number, when possible
      value = Number(value)
    }

    console.log(`Setting ${attribute} value:`, value);

    setValue(value)
  }


  options = Object.entries(options).map( item => {
    let [ value, display ] = item
    const index = display.indexOf("*")
    const disabled = index >= 0
    if (disabled) {
      display = display.slice(0, index)
    }

    return (
      <option
        key={value}
        value={value}
        disabled={disabled}
        style={{
          fontSize: "inherit"
        }}
      >
        {display}
      </option>
    )
  })


  return (
    <label>
      <span
        style={{
          display: "block",
          color: "#999"
        }}
      >
        {attribute}:
      </span>
      <select
        value={value}
        onChange={treatChange}
        style={{
          backgroundColor: "#222",
          color: "#fff",
          borderColor: "#222"
        }}
      >
        {options}
      </select>
    </label>
  )
}

export default Selector
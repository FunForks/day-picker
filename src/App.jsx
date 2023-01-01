/**
 * App.jsx
 *
 * Creates a set of rotating Time Picker, with a set of selectors
 * for changing the initial settings
 */



import React, { useState, useEffect } from 'react';

import TimePicker from './TimePicker'


let renders = 0

function App() {
  console.log("App renders:", ++renders);


  const displays = {
    "days": "Days",
    "h&m": "Time",
    "custom": "Custom",
    "": "Default"
  }

  const locales = {
    "ar": "اللغة العربية",
    "de": "Deutsch",
    "en": "English",
    "fr": "Français",
    "ru": "Русский",
    "th": "ภาษาไทย",
    "zh": "中文",
    "": "Default"
  }

  const colors = {
    "#900": "Red",
    "#090": "Green",
    "#00f": "Blue",
    "#333": "Black",
    "#eee": "White",
    "": "Default"
  }

  const sizes = {
    "long": "Long",
    "short": "Short",
    "narrow": "Narrow",
    "": "Default"
  }

  const radii = {
    "1.0": "1",
    "1.25": "1.25",
    "1.5": "1.5",
    "2.0": "2",
    "3.0": "3",
    "": "Default"
  }

  const alignments = {
    "left": "Left",
    "center": "Center",
    "right": "Right",
    "": "Default"
  }

  const nMinutes = {
    1: "1m",
    2: "2m",
    3: "3m",
    4: "4m",
    5: "5m",
    6: "6m",
    10: "10m",
    12: "12m",
    15: "15m",
    20: "20m",
    30: "30m",
    60: "00",
    "": "Default"
  }

  const [ display, setDisplay ]     = useState("")
  const [ locale, setLocale ]       = useState("")
  const [ bgColor, setBgColor ]     = useState("")
  const [ weekday, setWeekday ]     = useState("")
  const [ radius, setRadius ]       = useState("")
  const [ weekAlign, setWeekAlign ] = useState("")
  const [ minutesInterval, setminutesInterval ] = useState("")

  const [ spacing, setSpacing ] = useState("")

  const [ fontSize, setFontSize ] = useState("9vmin")



  const items = (() => {
    switch (display) {
      case "days":
        return [
          {
            role: "weekdays",
            textAlign: weekAlign,
          }
        ]

      case "h&m":
        return [
          {
            role: "hours",
            textAlign: "right",
          },
          {
            role: "minutes",
            textAlign: "left",
            minutesInterval: minutesInterval
          }
        ]

      case "custom":
        return [
          {
            role: "hours",
            textAlign: "right",
            padding: "0 0 0 0.5em"
          },
          {
            role: "minutes",
            textAlign: "left",
            minutesInterval: minutesInterval,
            spacing: 10,
            padding: "0 0.25em 0 0"
          },{
            role: "weekdays",
            textAlign: (weekAlign || "left"),
            spacing: 5
          }
        ]

      default:
    }
  })()



  return (
    <>
      <TimePicker
        // Selectors
        locale={locale}
        bgColor={bgColor}
        weekday={weekday}
        weekAlign={weekAlign}
        minutesInterval={minutesInterval}
        // Sliders
        radius={radius}
        spacing={spacing}
        fontSize={fontSize}

        // Cylinders to show
        display={items}
      />

      <Toolbar
        children={[
          <Selector
            key="display"
            attribute="Display"
            options={displays}
            value={display}
            setValue={setDisplay}
          />,

          <Selector
            key="locales"
            attribute="Locale"
            options={locales}
            value={locale}
            setValue={setLocale}
          />,

          <Selector
            key="weekday"
            attribute="Weekdays"
            options={sizes}
            value={weekday}
            setValue={setWeekday}
          />,

          <Selector
            key="align"
            attribute="Align days"
            options={alignments}
            value={weekAlign}
            setValue={setWeekAlign}
          />,

          <Selector
            key="radius"
            attribute="Radius"
            options={radii}
            value={radius}
            setValue={setRadius}
          />,

          <Selector
            key="colors"
            attribute="Colour"
            options={colors}
            value={bgColor}
            setValue={setBgColor}
          />,

          <Selector
            key="precision"
            attribute="Precision"
            options={nMinutes}
            value={minutesInterval}
            setValue={setminutesInterval}
          />
        ]}
      />
    </>
  );
}

export default App;



const Toolbar = ({ children }) => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100vw",
        display: "flex",
        justifyContent: "space-around",
      }}
    >
      {children}
    </div>
  )
}



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
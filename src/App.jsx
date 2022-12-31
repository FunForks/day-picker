/**
 * App.jsx
 *
 * Creates a set of rotating Time Picker, with a set of selectors
 * for changing the initial settings
 */



import React, { useState } from 'react';

import TimePicker from './TimePicker'



function App() {
  const locales = {
    "ar": "اللغة العربية",
    "de": "Deutsch",
    "en": "English",
    "fr": "Français",
    "ru": "Русский",
    "th": "ภาษาไทย",
    "zh": "中文",
    undefined: "Default"
  }

  const colors = {
    "#900": "Red",
    "#090": "Green",
    "#00f": "Blue",
    "#333": "Black",
    "#eee": "White",
    undefined: "Default"
  }

  const sizes = {
    "long": "Long",
    "short": "Short",
    "narrow": "Narrow",
    undefined: "Default"
  }

  const radii = {
    "1.0": "1",
    "1.25": "1.25",
    "1.5": "1.5",
    "2.0": "2",
    "3.0": "3",
    undefined: "Default"
  }

  const alignments = {
    "left": "Left",
    "center": "Center",
    "right": "Right",
    undefined: "Default"
  }

  const nMinutes = {
    1: "1",
    5: "5",
    10: "10",
    15: "15"
  }


  const [ locale, setLocale ]       = useState("ru")
  const [ bgColor, setBgColor ]     = useState("#333")
  const [ weekday, setWeekday ]     = useState("long")
  const [ radius, setRadius ]       = useState(1.25)
  const [ weekAlign, setWeekAlign ] = useState("center")
  


  const display = [
    {
      role: "weekdays",
      textAlign: "right",
    },
    {
      role: "hours",
      textAlign: "right",
    },
    {
      role: "minutes",
      textAlign: "left",
      everyNMinutes: 5
    }
  ]


  return (
    <>
      <TimePicker
        locale={locale}
        bgColor={bgColor}
        weekday={weekday}
        weekAlign={weekAlign}
        radius={radius}

        spacing={7}
        fontSize="9vmin"
        display={display}
      />

      <Toolbar
        children={[
          <Selector
            key="locales"
            attribute="Locales"
            options={locales}
            value={locale}
            setValue={setLocale}
          />,

          <Selector
            key="weekday"
            attribute="Size"
            options={sizes}
            value={weekday}
            setValue={setWeekday}
          />,

          <Selector
            key="align"
            attribute="Align"
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
            attribute="Colours"
            options={colors}
            value={bgColor}
            setValue={setBgColor}
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
  options = Object.entries(options).map( item => {
    const [ value, display ] = item

    return (
      <option
        key={value}
        value={value}
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
          display: "block"
        }}
      >
        {attribute}:
      </span>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
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
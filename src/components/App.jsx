/**
 * App.jsx
 *
 * Creates a Time Picker, with a set of selectors
 * for changing the initial settings
 */



import React, { useState, useEffect } from 'react';

import TimePicker from './TimePicker'

import Toolbar from './Toolbar'
import Selector from './Toolbar/Selector'



function App() {
  // Settings
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
    "sr-Latn": "Srpski",
    "sr-Cyrl": "Cрпски",
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
    "1.00": "1",
    "1.25": "1.25",
    "1.50": "1.5",
    "2.00": "2",
    "3.00": "3",
    "":    "Default"
  }

  const alignments = {
    "left": "Left",
    "center": "Center",
    "right": "Right",
    "": "Default"
  }

  const nMinutes = {
    "1.00": "1m",
    "2.00": "2m",
    "3.00": "3m",
    "4.00": "4m",
    "5.00": "5m",
    "6.00": "6m",
    "7.00": "7m",
    "7.50": "7.5m",
    "10.00": "10m",
    "12.00": "12m",
    "15.00": "15m",
    "20.00": "20m",
    "30.00": "30m",
    "60.00": "00",
    "": "Default"
  }

  const [ display, setDisplay ]     = useState("")

  const [ locale, setLocale ]       = useState("")
  const [ bgColor, setBgColor ]     = useState("")
  const [ weekday, setWeekday ]     = useState("")
  const [ weekAlign, setWeekAlign ] = useState("")
  const [ minutesInterval, setminutesInterval ] = useState("")

  const [ radius, setRadius ]       = useState("")
  const [ spacing, setSpacing ]     = useState("")
  const [ fontSize, setFontSize ]   = useState("9vmin")



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


  // Input date and output listener
  const [ date, setDate ] = useState(new Date())

  let timeZone = Intl && Intl.DateTimeFormat
              && Intl.DateTimeFormat().resolvedOptions().timeZone

  const onChange = (newDate) => {
    if (newDate.getTime() !== date.getTime() ){
      setDate(newDate)
    }
  }

  // Preparing output string
  const isoCode = locale || navigator.language  
  const dayOptions = {
    weekday: "long",
    timeZone
  }
  const dayName = date.toLocaleString(isoCode, dayOptions)
  const dateString = date.toLocaleTimeString(isoCode, timeZone)

  timeZone = timeZone
           ? ` (${timeZone})`
           : ""

  const output = `${dayName} ${dateString}${timeZone}`


  return (
    <>
      <div
        style={{
          flex: 1
        }}
      >
        <TimePicker
          // I/O
          date={date}
          onChange={onChange}

          // Selectors
          locale={locale}
          bgColor={bgColor}
          weekday={weekday}
          weekAlign={weekAlign}

          // Sliders
          minutesInterval={minutesInterval}
          radius={radius}
          spacing={spacing}
          fontSize={fontSize}

          // Cylinders to show
          display={items}
          // Feedback during development
          // verbose ={true}
        />
        <p
          style={{textAlign: "center", fontSize: "4.5vmin"}}
        >
          {output}
        </p>
      </div>

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
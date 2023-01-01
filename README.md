# Day and Time Picker

Select a day of the week and a time of day (for a regular meeting, for example).

[Demo](https://funforks.github.io/day-picker)

## Input and output
Input a date object which represents the day of the week and the time (the actual date, month and year will be ignored). The value of the TimePicker will be a similar date object. The text of the TimePicker will be a localized string like "Wednesday 10:30".

## Visual customization
The Picker can be customized in a number of ways:
1. **locale**
   Use a two-character ISO language code, such as "ru" or "zh", to set the language for the weekday names. The default is "en".
2. **weekday**
   Use "long" (default), "short" or "narrow" to set the display of the weekday names. The result will be something like "Monday", "Mon" or "M". (Not all locales distinguish between "short" and "narrow").
3. **weekAlign**
   Set the alignment of the weekday names to "left", "center" (default) or "right"
4. **minutesInterval**
   This can be any divisor of 60:
   1 (default), 2, 3, 4, 5, 6, 10, 12, 15, 20, 30 or 60
   The minutes cylinder will use this interval between the displayed minute numbers. If 60 is used, the minutes will show simply "00", and this cannot be changed.
5. **bgColor**, **shadowColor**, **hoverColor** and **pressColor**
   Use a string color in any format (rgb, rgba, hex, hsl) to set the colors for the cylinders and the hilite that appears at the top and bottom of each cylinder, to allow you to change the value.
6. **fontSize**
   Use a valid CSS length, such as "2rem" or "16px" to define the
   size of the text and numbers. "1em" is used by default.
7. **radius**
   Use a number which will be used to multiply the fontSize to give the radius of the cylinders.
8. **spacing**
   Use a number greater than 2 to indicate how many items will appear on one circumference of a cylinder.
   This can be greater than the number of items to be shown. When displaying weekdays, 7 might seem an obvious number, but 8.5 will give a tiny sliver of the day before last and a tiny sliver of the day after tomorrow.
   It can be considerably less then the number of items to show. If you need to show 60 minutes in one circumference, you either need a big cylinder, or a tiny font. Instead, you can think of the items as being on a belt that runs between two pulleys: the visible cylinder and one hidden away in the back somewhere.

You can also show only weekdays, or only time, and you can put the cylinders in any order. You can provide different settings for each cylinder, using the **display** parameter:
```js
[
  {
    role: "hours",
    textAlign: "right",
    padding: "0 0 0 0.5em"
  },
  {
    role: "minutes",
    textAlign: "left",
    minutesInterval: 5,
    spacing: 10,
    padding: "0 0.25em 0 0"
  },{
    role: "weekdays",
    textAlign: "left",
    spacing: 5
  }
]
```


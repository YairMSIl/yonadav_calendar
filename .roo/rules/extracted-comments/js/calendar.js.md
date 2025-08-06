# Comments from js\calendar.js

# of lines = 134

### `calendar.js`

```
@file-overview This file contains the core calendar generation logic, including
fetching data from the Hebcal API and building the HTML for the calendar grid.
```

#### `hebrewDays = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"]`

```
@file-overview This file contains the core calendar generation logic, including
fetching data from the Hebcal API and building the HTML for the calendar grid.
```


#### `export async function generateCalendar({ toggleMarking, updateURLFromState })`

```
Generates the calendar grid based on a selected date range.
Fetches Hebrew dates and Torah portions from the Hebcal API.
@param {object} dependencies - Functions required by generateCalendar.
@param {Function} dependencies.applyMarksFromURL - Applies markings from URL parameters.
@param {Function} dependencies.updateCounter - Updates the UI counter for marked days.
@param {Function} dependencies.updateURLFromState - Updates the URL with the current calendar state.
@param {Function} dependencies.toggleMarking - Toggles the marking of a specific day.
```


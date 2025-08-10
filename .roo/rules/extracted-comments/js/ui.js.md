# Comments from js\ui.js

# of lines = 150

### `ui.js`

```
@file-overview This file contains UI interaction logic for the calendar,
including marking cells, filling squares, and resetting the view.
```

#### `export function updateCounter()`

```
@file-overview This file contains UI interaction logic for the calendar,
including marking cells, filling squares, and resetting the view.
```


#### `export function updateCellView(cell)`

```
Updates the visual representation of a single calendar cell based on its 'marking' dataset attribute.
Exported because it's needed by applyMarksFromURL in state.js.
@param {HTMLElement} cell The calendar cell element to update.
```


#### `export function toggleMarking(cell, updateURLFromState)`

```
Toggles the marking of a cell between blue, pink, and none.
@param {HTMLElement} cell The cell to mark.
@param {function} updateURLFromState Function to call to update the URL state.
```


#### `export function fillSquares(updateURLFromState)`

```
Fills the marked squares, changing dots to background colors.
@param {function} updateURLFromState Function to call to update the URL state.
```


#### `export function resetCalendar(updateURLFromState)`

```
Resets all markings from the calendar.
@param {function} updateURLFromState Function to call to update the URL state.
```


#### `export function applySplitDayView()`

```
Applies a split background to days that are at the boundary of two different colors.
```


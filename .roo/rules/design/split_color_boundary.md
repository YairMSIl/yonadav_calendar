# Design: Split-Color Day Boundaries

This document outlines the design for a new feature that visually indicates a color change between adjacent days by splitting the background color of the second day.

## 1. Feature Overview

The goal is to provide a clear visual cue when a block of color (e.g., "blue days") ends and another begins (e.g., "pink days"). This will be achieved by creating a vertical split in the background of the day where the change occurs. The user will be able to enable or disable this feature with a toggle switch.

## 2. Implementation Plan

This will be broken down into three main parts: adding the toggle switch to the HTML, creating the CSS for the split background effect, and finally, implementing the JavaScript logic to apply this effect.

### A. HTML Toggle Switch

A standard checkbox input styled as a toggle switch will be added next to the "איפוס" (Reset) button in `index.html`.

```html
<!-- To be added in index.html inside the .controls div -->
<div class="toggle-switch-container">
    <label for="split-day-toggle">הצג חצאי ימים</label>
    <label class="switch">
        <input type="checkbox" id="split-day-toggle" checked>
        <span class="slider round"></span>
    </label>
</div>
```

### B. CSS for Split Background

The split effect will be achieved using a `linear-gradient` background on a new CSS class, `.split-bg`. This will be added to `styles/main.css`. The gradient will be defined by CSS variables to respect the existing color theme.

```css
/* To be added to styles/main.css */
.calendar-cell.split-bg {
    background: linear-gradient(to right, var(--prev-color) 50%, var(--current-color) 50%);
}
```
Styles for the toggle switch itself will also be added.

### C. JavaScript Logic

1.  **Create `applySplitDayView()` in `js/ui.js`**:
    *   This new function will be the core of the feature.
    *   It will first check if the "split day" toggle is enabled.
    *   It will iterate through all day cells (`.calendar-cell[data-date]`).
    *   For each cell, it will find the previous day's cell.
    *   It will compare the `data-marking` attributes of the current and previous cells.
    *   If the markings represent different colors (e.g., `blue-bg` and `pink-bg`), it will:
        1.  Add the `.split-bg` class to the current cell.
        2.  Set two CSS custom properties on the cell's style: `--prev-color` and `--current-color`, using the color values from the theme (e.g., `var(--mark-blue-bg)`).

2.  **Integrate into the Application Flow**:
    *   The new `applySplitDayView` function needs to be called whenever the cell colors might change.
    *   It will be called from `fillSquares()` and `resetCalendar()` in `js/ui.js` after the main logic runs.
    *   It will also be called from `applyMarksFromURL()` in `js/state.js` to handle initial page load from a URL.
    *   An event listener will be added to the new toggle switch in `js/main.js` to re-run the logic when the user toggles the feature on or off.

### 4. Workflow Diagram

```mermaid
graph TD
    A[User Action: fillSquares, reset, page load, or toggle switch] --> B[Call applySplitDayView];
    B --> C{Is toggle enabled?};
    C -- No --> D[Exit Function];
    C -- Yes --> E[Iterate through calendar cells];
    E --> F{Is there a previous day?};
    F -- Yes --> G{Is previous day's color different?};
    G -- Yes --> H[Apply .split-bg class and CSS variables to current cell];
    G -- No --> E;
    F -- No --> E;
    H --> E;
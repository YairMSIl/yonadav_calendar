# Hebrew Date Display Fix

This document outlines the design to fix the display of Hebrew dates in the dynamic calendar, as requested in `todo.md`.

## 1. Problem

The current implementation displays the full Hebrew date string (e.g., "י״ב בֶּאֱלוּל תשפ״ה") on every calendar day. The user request is to refine this display:

*   The Hebrew month name (e.g., "אלול") should only appear on the first day of that Hebrew month (`hd: 1` in the API response).
*   The Hebrew day (e.g., "י״ב") should appear on every day.

The existing logic for extracting the Hebrew month name is brittle as it relies on string parsing of the `hebrew` field from the API response.

## 2. Solution

We will modify the `generateCalendar` function in `index.html` to use the structured `heDateParts` object provided by the Hebcal API. This provides reliable access to the day (`d`) and month (`m`) components.

### Implementation Plan

1.  **Update `generateCalendar` function:**
    *   Locate the section responsible for rendering the Hebrew date information.
    *   Remove the existing logic that parses the `hebrewDateInfo.hebrew` string to find the month.
    *   Remove the line that displays the full `hebrewDateInfo.hebrew` string.
    *   Add new logic that checks if `hebrewDateInfo.hd === 1`.
    *   If it is the first day of the Hebrew month, render the month name from `hebrewDateInfo.heDateParts.m` inside a `div` with the class `hebrew-month`.
    *   For every day, render the Hebrew day from `hebrewDateInfo.heDateParts.d` inside a `div` with the class `hebrew-date`.

### Code Example (Conceptual)

```javascript
// Inside generateCalendar's while loop...

if (hebrewDateInfo) {
    // ... (gregorian month logic)

    const hebrewDay = hebrewDateInfo.heDateParts.d;
    const isFirstOfHebrewMonth = hebrewDateInfo.hd === 1;

    // If it's the 1st of the Hebrew month, show the month name.
    if (isFirstOfHebrewMonth) {
        const hebrewMonth = hebrewDateInfo.heDateParts.m;
        cellHTML += `<div class="hebrew-month">${hebrewMonth}</div>`;
    }

    // Always show the Hebrew day.
    cellHTML += `<div class="hebrew-date">${hebrewDay}</div>`;
    
    // ... (events logic)
}
```

This approach is more robust and directly implements the user's requirement.

## 3. Workflow Diagram

The overall workflow remains the same as in `calendar_enhancements.md`. This is a display logic change within the `Generate Calendar` step.

```mermaid
graph TD
    subgraph Generate Calendar Step
        A[Loop through dates] --> B{Hebcal data exists?};
        B -- Yes --> C[Get heDateParts];
        C --> D{Is hd === 1?};
        D -- Yes --> E[Add Hebrew Month Name to HTML];
        E --> F[Add Hebrew Day to HTML];
        D -- No --> F;
        F --> G[Render Cell];
    end
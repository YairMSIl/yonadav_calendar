# Design: Hebcal Library Migration

This document outlines the plan to replace the Hebcal REST API with the `@hebcal/core` JavaScript library for a more robust, offline-first, and performant application. All calendar event data will be rendered in Hebrew.

## 1. Rationale

The current implementation relies on network requests to the Hebcal API, which introduces latency and fails without an internet connection. Migrating to the `@hebcal/core` library will:
-   Eliminate network dependency for calendar data generation.
-   Improve performance by performing calculations locally.
-   Enable full offline functionality.
-   Provide a more stable and maintainable solution for handling Hebrew dates and events.

## 2. Project Setup & Dependencies

1.  **Create `package.json`**: A `package.json` file will be created to manage project dependencies.
2.  **Install Libraries**: The following packages will be installed via npm:
    -   `@hebcal/core`: The core library for all calendar logic.
    -   `@hebcal/locales`: Provides the necessary Hebrew language translations.
3.  **Update `.gitignore`**: The `node_modules/` directory and `package-lock.json` will be added to the `.gitignore` file.

## 3. Code Implementation Plan

The primary changes will be confined to `js/calendar.js`, leaving the UI and state management logic untouched.

### What Stays the Same
-   **UI Logic (`js/ui.js`)**: Functions like `toggleMarking`, `fillSquares`, `resetCalendar`, and `updateCellView` will not be changed.
-   **State Management (`js/state.js`)**: URL-based state functions like `updateURLFromState` and `loadStateFromURL` will remain the same.
-   **HTML/CSS**: No changes are required in `index.html` or `styles/main.css`.

### What Will Change (`js/calendar.js`)

The `generateCalendar` function will be significantly refactored.

1.  **Imports**:
    -   Add `import { HebrewCalendar, HDate } from '@hebcal/core';`
    -   Add `import '@hebcal/locales';` to enable Hebrew language support.

2.  **Data Fetching Removal**:
    -   The entire `try...catch` block containing the `fetch` call to `https://www.hebcal.com/converter` will be removed.

3.  **Local Data Generation**:
    -   A new function or logic block will be created inside `generateCalendar`.
    -   It will determine the start and end years/months from the date pickers.
    -   It will call `HebrewCalendar.calendar()` for each required month, with options `{ locale: 'he', sedrot: true }`.
    -   The results from all calls will be collected into a single array of events.

4.  **Data Mapping**:
    -   The array of events will be processed into a `Map` object, where keys are Gregorian date strings (`YYYY-MM-DD`) and values are objects containing the `HDate` object and an array of event titles for that day.
    -   Parashat Shavua will be identified by its event category (`parashat`) and stored. All event titles will be retrieved using `event.render('he')`.

5.  **Rendering Logic Update**:
    -   The main `while` loop that builds the calendar cells will be modified to look up data from the new local `Map`.
    -   It will use the `HDate` object to render Hebrew dates correctly (`hdate.render('he')`).
    -   It will display the Hebrew event titles and Parashat Shavua found in the map for each day.

## 4. Workflow

```mermaid
graph TD
    subgraph Setup
        A[Create package.json] --> B[npm install @hebcal/core @hebcal/locales];
        B --> C[Update .gitignore];
    end

    subgraph "Refactor js/calendar.js"
        D[Import Hebcal modules] --> E[Remove API fetch logic];
        E --> F[Generate events locally with HebrewCalendar.calendar({ locale: 'he' })];
        F --> G[Create a Map of dates to events];
        G --> H[Update rendering loop to use the Map and HDate objects];
    end

    subgraph Testing
        I[Verify calendar generation]
        J[Verify Hebrew dates and events display correctly]
        K[Verify Parashat Shavua appears on Saturdays]
        L[Verify all other features (marking, state URLs) are unaffected]
    end

    Setup --> Refactor --> Testing
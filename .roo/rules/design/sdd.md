# System Design Document: Interactive Hebrew Calendar

## 1. System Architecture

The application is a client-side, single-page application (SPA) built with HTML, CSS, and modern JavaScript (ES6 modules). It is designed to be fully functional offline after the initial load.

### 1.1. File Structure

The application follows a modular structure to separate concerns:

```mermaid
graph TD
    subgraph root
        A[index.html]
        B[package.json]
        C[styles/]
        D[js/]
    end

    subgraph styles
        C1[main.css]
    end

    subgraph js
        D1[main.js (Entry Point)]
        D2[calendar.js (Calendar Logic)]
        D3[ui.js (UI Interactions)]
        D4[state.js (State Management)]
    end

    A -- links to --> C1
    A -- script src --> D1
    D1 -- imports --> D2
    D1 -- imports --> D3
    D1 -- imports --> D4
```

-   **`index.html`**: The main HTML file, containing the basic structure and linking to CSS and JS modules.
-   **`package.json`**: Manages project dependencies and scripts.
-   **`styles/main.css`**: Contains all styles, including light/dark themes and responsive design media queries.
-   **`js/main.js`**: The main entry point. It initializes the application, sets up event listeners, and orchestrates calls to other modules.
-   **`js/calendar.js`**: Handles the core logic of generating calendar data using the `@hebcal/core` library.
-   **`js/ui.js`**: Manages all direct DOM manipulations and UI-specific logic, such as marking cells and updating views.
-   **`js/state.js`**: Manages the application's state by encoding/decoding it into URL query parameters.

### 1.2. Data Flow & Core Technology

The application has transitioned from a Hebcal REST API-based approach to using the **`@hebcal/core`** JavaScript library. This eliminates network latency for core calendar functions and enables offline use.

```mermaid
graph TD
    subgraph "Calendar Generation"
        A[User selects date range] --> B[js/main.js captures event];
        B --> C[js/calendar.js#generateCalendar is called];
        C --> D[HebrewCalendar.calendar({locale: 'he'}) generates event data locally];
        D --> E[Data is mapped into a Map for quick lookups];
        E --> F[Loop through date range, building HTML for each cell];
        F --> G[js/ui.js updates the DOM with the new calendar grid];
    end
```

### 1.3. State Management

Application state (selected dates, markings) is managed via URL query parameters to ensure shareability and persistence on reload.

-   **URL Structure:** `index.html?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&marks=ENCODED_MARKS`
-   **On Load:** `js/state.js#loadStateFromURL` parses the URL and calls `js/calendar.js#generateCalendar` and `js/ui.js#applyMarksFromURL`.
-   **On Change:** `js/state.js#updateURLFromState` is called after any state-changing user action (e.g., changing dates, marking a cell) to update the URL via `history.pushState()`.

## 2. Key Features Implementation

### 2.1. UI/UX Features

-   **Dark Theme:** Implemented using CSS Custom Properties. A `@media (prefers-color-scheme: dark)` query toggles the color variable values.
-   **Mobile Responsiveness:** CSS media queries adjust the layout for tablet and mobile screen sizes, including stacking controls vertically and shortening day names.
-   **Split-Color Boundaries:** A toggle-controlled feature that applies a `linear-gradient` background to a day cell when its color marking differs from the previous day's. The logic resides in `js/ui.js#applySplitDayView`.

### 2.2. Development Environment

-   **Dependencies:** `package.json` manages dependencies like `@hebcal/core`, `browserify`, and `live-server`.
-   **Build Process:** The `npm run build` script uses `browserify` to bundle the ES6 modules into a single `dist/bundle.js` file for browser compatibility.
-   **Dev Server:** The `npm run dev` script runs `browserify` in watch mode and serves the `dist` directory with `live-server`, providing live-reloading for an efficient development workflow.

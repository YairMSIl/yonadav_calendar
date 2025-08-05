# Calendar Enhancements Design

This document outlines the plan to enhance the dynamic calendar application with several key features: fetching Hebrew dates and Torah portions from an external API, enabling state sharing via URL parameters, and improving the date display.

## 1. Dynamic Hebrew Dates & Parashat Shavua via API

### Problem
The current implementation uses a hardcoded JavaScript object (`hebrewCalendar2025`) to map Gregorian dates to Hebrew dates. This is static, limited to a specific year, difficult to maintain, and lacks information like the weekly Torah portion (Parashat Shavua).

### Solution
We will integrate a third-party API to fetch Hebrew calendar data dynamically. The proposed service is **Hebcal.com**, which offers a free JSON API perfect for this use case.

#### API Details
*   **Endpoint:** We will use the Hebcal converter endpoint.
*   **Request:** To get the data for a specific month, including the Torah portion, we can make a GET request like: `https://www.hebcal.com/converter?cfg=json&g2h=1&start=YYYY-MM-DD&end=YYYY-MM-DD&leyning=on`
*   **Response:** The API returns a JSON object containing an array of dates (`hdates`). Each object maps a Gregorian date to its Hebrew date components. For Saturdays, the response will also include a `leyning.parasha` field.

#### Implementation Plan
1.  Modify the `generateCalendar` function.
2.  Instead of looking up dates in a local object, it will construct a date range and make a `fetch` request to the Hebcal API with the `leyning=on` parameter.
3.  The response will be parsed, and the Hebrew dates and Parashat Shavua information will be stored in a temporary map for quick lookup while generating the calendar cells.
4.  Error handling will be added for failed API requests.

## 2. Stateful URLs for Sharing

### Problem
The user cannot share their customized calendar view (selected dates and markings). The state is lost on page reload.

### Solution
We will implement a system to encode the calendar's state into URL query parameters. This will make the application stateful and shareable.

#### URL Parameter Scheme
The URL will have the following structure:
`index.html?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&marks=ENCODED_MARKS`

*   `startDate`: The start of the selected date range.
*   `endDate`: The end of the selected date range.
*   `marks`: A string representing the markings for each day in the range, starting from `startDate`.
    *   `0`: No marking
    *   `1`: Blue marking
    *   `2`: Pink marking

**Example:** For a 5-day calendar starting on 2025-08-01 with the 3rd day blue and 4th day pink, the `marks` parameter would be `00120`.

#### Implementation Plan
1.  **On Load:**
    *   Create a new function, `loadStateFromURL`, to be called on `DOMContentLoaded`.
    *   This function will parse the URL query parameters.
    *   If parameters exist, it will set the values of the date pickers and trigger `generateCalendar`.
    *   After the calendar is generated, another function, `applyMarksFromURL`, will decode the `marks` parameter and apply the corresponding markings and colors to the cells.
2.  **On Change:**
    *   Create a function, `updateURLFromState`.
    *   This function will be called whenever a change occurs (e.g., after `generateCalendar`, `toggleMarking`).
    *   It will read the current state (date range, markings) and construct the query string.
    *   It will use `history.pushState()` to update the URL in the browser's address bar without reloading the page.

## 3. Enhanced Date Display

### Problem
The current calendar display is minimal. It doesn't show month names within the calendar grid or the weekly Torah portion, making it less informative.

### Solution
We will enhance the calendar display with the following information:

1.  **Gregorian & Hebrew Month Names:**
    *   The Gregorian month name (e.g., "August") will be displayed in the cell for the first day of each month.
    *   The Hebrew month name (e.g., "Elul") will be displayed in the cell for the first day of each Hebrew month.
    *   Both month names will also be displayed on the very first day of the generated calendar range.

2.  **Parashat Shavua:**
    *   The weekly Torah portion will be displayed on every Saturday, retrieved from the Hebcal API.

#### Implementation Plan
1.  **Modify `generateCalendar`:**
    *   Keep track of the previous day's Gregorian and Hebrew months to detect when a new month begins.
    *   When creating a calendar cell (`day-cell`):
        *   Check if the current day is the first day of the calendar range. If so, display both Gregorian and Hebrew month names.
        *   Check if the Gregorian month is different from the previous day's. If so, display the new Gregorian month name.
        *   Check if the Hebrew month is different from the previous day's. If so, display the new Hebrew month name.
        *   If the day is a Saturday, check for the `leyning.parasha` field in the API data for that date and display it.
2.  **Update CSS:** Add styles to accommodate the new text within the calendar cells, ensuring readability.

## Workflow Diagram

```mermaid
graph TD
    A[Page Load] --> B{URL has params?};
    B -- Yes --> C[Parse URL params];
    C --> D[Set Date Pickers];
    D --> E[Generate Calendar with API Data];
    E --> F[Apply Markings from URL];
    F --> G[Display Calendar];

    B -- No --> H[Use Default Dates];
    H --> E;

    G -- User Action --> I{Action Type?};
    I -- Change Date Range --> J[Generate Calendar];
    I -- Click Day --> K[Toggle Marking];
    I -- Click Reset --> L[Reset Calendar];

    J --> M[Update URL with State];
    K --> M;
    L --> M;
    M --> G;
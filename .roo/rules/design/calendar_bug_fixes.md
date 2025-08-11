# Design: Calendar Bug Fixes

This document outlines the plan to fix critical bugs related to Hebrew date display and event scheduling.

## 1. Problem Summary

The calendar currently has three main issues:
1.  Hebrew day-of-the-month is displayed as a number, not a Hebrew letter/string.
2.  Hebrew dates are missing entirely on days that do not have a special event.
3.  "Shabbat" and "Parashat" events are incorrectly appearing on Fridays instead of Saturdays.

## 2. Solution

The fix involves refactoring the `generateCalendar` function in `js/calendar.js` to address each issue directly.

### A. Correct Hebrew Date Rendering

The core of the problem is how Hebrew dates are fetched and rendered. We will implement two key changes:

1.  **Direct Date Conversion**: Instead of relying on the event list, we will iterate through the Gregorian date range and convert each day to its `HDate` equivalent directly. This ensures every single day has Hebrew date information available.
2.  **Correct Rendering Method**: We will use `hdate.renderGematriya()` to get the proper Hebrew string for the day of the month (e.g., "ט״ו").

### B. Correct Event Placement for Shabbat

The misplacement of Shabbat-related events is due to a missing configuration option in the `HebrewCalendar.calendar()` call.

1.  **Set Israel Location**: We will add the `il: true` option to the `HebrewCalendar.calendar()` call. This tells the library to use Israeli customs, which correctly places the Parashat Hashavua and other Shabbat events on Saturday.

## 3. Implementation Plan

The following changes will be made to `js/calendar.js`:

1.  **Modify `HebrewCalendar.calendar` call**:
    -   Add `il: true` to the options object.

2.  **Refactor the main `while` loop**:
    -   Inside the loop that iterates from `startDate` to `endDate`, create a new `HDate` object for the `currentDate` on every iteration.
    -   Remove the dependency on the `hebrewDatesMap` for displaying the date itself. The map will only be used for fetching events.
    -   Use the newly created `HDate` object to render the Hebrew day using `renderGematriya()`.
    -   The logic will be: `const hebrewDayString = new HDate(currentDate).renderGematriya().split(' ')[0];`

## 4. Workflow Diagram

```mermaid
graph TD
    subgraph Generate Calendar
        A[Start Loop: For each day in range] --> B[Create HDate for current day];
        B --> C[Render Hebrew Day from HDate];
        C --> D{Event exists for this day?};
        D -- Yes --> E[Render Event];
        D -- No --> F;
        E --> F[Append to Cell HTML];
        F --> G[End Loop];
    end

    subgraph Fetch Events
        H[Call HebrewCalendar.calendar] --> I[Add il: true option];
        I --> J[Populate Events Map];
    end

    Fetch_Events --> Generate_Calendar
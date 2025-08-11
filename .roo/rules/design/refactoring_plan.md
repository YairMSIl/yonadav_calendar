# Refactoring Plan: index.html

This document outlines the plan to refactor the monolithic `index.html` file into a modular structure with separate files for HTML, CSS, and JavaScript.

## 1. Problem

The current `index.html` file contains over 400 lines of code, mixing HTML structure, CSS styling, and complex JavaScript logic. This makes the codebase:
- Hard to read and navigate.
- Difficult to maintain and debug.
- Not scalable for future feature additions.

## 2. Solution

We will break down the file into a clear, component-based structure, separating concerns into dedicated files and directories.

### New File Structure

```mermaid
graph TD
    subgraph root
        A[index.html]
        B[styles/]
        C[js/]
    end

    subgraph styles
        B1[main.css]
    end

    subgraph js
        C1[main.js (entry point)]
        C2[calendar.js (core logic)]
        C3[ui.js (UI interactions)]
        C4[state.js (URL state management)]
    end

    A -- links to --> B1
    A -- links to --> C1
    C1 -- imports --> C2
    C1 -- imports --> C3
    C1 -- imports --> C4
```

### Implementation Plan

1.  **Create Directories:**
    - Create a `styles/` directory for CSS files.
    - Create a `js/` directory for JavaScript files.

2.  **Extract CSS:**
    - Create `styles/main.css`.
    - Move all CSS content from the `<style>` tag in `index.html` to `styles/main.css`.

3.  **Extract JavaScript:**
    - **`js/state.js`**: Move state and URL-related functions (`updateURLFromState`, `loadStateFromURL`, `applyMarksFromURL`).
    - **`js/ui.js`**: Move UI interaction functions (`updateCellView`, `toggleMarking`, `fillSquares`, `resetCalendar`, `updateCounter`).
    - **`js/calendar.js`**: Move the core `generateCalendar` function.
    - **`js/main.js`**: Create a new main script to act as the entry point. It will import functions from the other modules and set up the initial event listeners (`DOMContentLoaded`).

4.  **Update `index.html`:**
    - Remove the inline `<style>` and `<script>` blocks.
    - Add a `<link>` tag to reference `styles/main.css`.
    - Add a `<script>` tag with `type="module"` to reference `js/main.js`. This enables the use of ES6 modules.
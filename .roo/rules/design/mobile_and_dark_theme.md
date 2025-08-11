# Design Document: Mobile Responsiveness & Dark Theme

## 1. Objective

To refactor the application to be mobile-friendly and to introduce a dark theme, improving user experience across all devices and lighting conditions.

## 2. Dark Theme Implementation

We will use CSS Custom Properties (variables) to manage colors, allowing for an easy switch between light and dark modes. The theme will default to the user's system preference via the `prefers-color-scheme` media query.

### Strategy

1.  **Define Color Palettes:** Create two full color palettes as CSS variables in `styles/main.css`. One for light mode (within `:root`) and one for dark mode (within `@media (prefers-color-scheme: dark)`).
2.  **Refactor CSS:** Replace all hardcoded color values in `styles/main.css` with the appropriate CSS variables.

### Example CSS Structure

```css
/* styles/main.css */
:root {
  --bg-color: #f5f5f5;
  --fg-color: #2c3e50;
  --card-bg: white;
  --primary-accent: #3498db;
  /* ... and so on for all colors */
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: #121212;
    --fg-color: #e0e0e0;
    --card-bg: #1e1e1e;
    --primary-accent: #5dade2;
    /* ... */
  }
}

body {
  background-color: var(--bg-color);
  color: var(--fg-color);
}
```

## 3. Mobile Responsiveness (RWD)

We will use CSS Media Queries to adapt the layout for smaller screens. The `index.html` already contains the necessary viewport meta tag.

### Strategy

1.  **Breakpoints:** We will introduce two primary breakpoints:
    *   `max-width: 768px` (for tablets)
    *   `max-width: 480px` (for mobile phones)

2.  **Layout Adjustments:**
    *   **Main Container (`.calendar-container`):** Reduce padding and remove `max-width` on smaller screens to allow it to fill the width.
    *   **Controls & Inputs (`.date-range`, `.controls`):** On mobile, change `flex-direction` to `column` to stack the date pickers and buttons vertically.
    *   **Calendar Grid (`.calendar-grid`):**
        *   Reduce the `gap` between cells.
        *   Decrease `min-height` and `padding` of `.calendar-cell`.
        *   Decrease font sizes within the cells.
    *   **Day Headers (`.day-header`):** On mobile, shorten the day names (e.g., "א" for "ראשון") to save space. This will require a small JavaScript change in `calendar.js`.

## 4. Workflow Diagram

```mermaid
graph TD
    subgraph Initialization
        A[User visits page] --> B{Check prefers-color-scheme};
        B -- Dark --> C[Apply Dark Theme CSS Variables];
        B -- Light/Unset --> D[Apply Light Theme CSS Variables];
    end

    subgraph Layout Rendering
        E[Render HTML] --> F{Check screen width};
        F -- >768px --> G[Desktop Layout];
        F -- 480px to 768px --> H[Tablet Layout Adjustments];
        F -- <480px --> I[Mobile Layout Adjustments];
    end

    subgraph Implementation
        J[Create Git Branch]
        K[Implement CSS Variables for Theming]
        L[Implement Media Queries for Responsiveness]
        M[Modify JS for short day names]
        N[Test on multiple devices/emulators]
    end

    J --> K --> L --> M --> N
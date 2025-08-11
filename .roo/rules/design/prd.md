# Product Requirements Document: Interactive Hebrew Calendar

## 1. Overview

This document defines the requirements for the Interactive Hebrew Calendar, a web-based application designed to provide users with a dynamic, customizable, and shareable calendar that integrates Gregorian and Hebrew dates, along with relevant Jewish holidays and Torah portions. The application is intended for users who need to track and plan around the Hebrew calendar.

## 2. Target Audience

- Individuals planning events around the Jewish calendar.
- Students and educators studying Jewish texts and holidays.
- Anyone needing a clear, visual representation of the Hebrew and Gregorian calendars side-by-side.

## 3. Key Features & User Stories

### 3.1. Core Calendar Functionality
- **As a user, I want to see a dynamic calendar grid** so that I can view any date range I select.
- **As a user, I want to see both Gregorian and Hebrew dates** on each day so I can easily cross-reference them.
- **As a user, I want to see Jewish holidays and the weekly Torah portion (Parashat Hashavua)** displayed on the correct dates.
- **As a user, I want all calendar data to be displayed in Hebrew.**

### 3.2. Customization and Interaction
- **As a user, I want to mark or color-code specific days or date ranges** (e.g., with blue or pink) so that I can visually block out periods for planning purposes.
- **As a user, I want to see a visual indicator where one color block ends and another begins** (split-day view) so that I can clearly see the boundaries of my marked periods.
- **As a user, I want to be able to toggle the split-day view on and off** to suit my preference.
- **As a user, I want to easily reset all markings** to start over.

### 3.3. State Management and Sharing
- **As a user, I want to be able to share a link to my customized calendar view** (selected dates and markings) with others.
- **As a user, I want the calendar's state to be preserved when I reload the page** so I don't lose my work.

### 3.4. User Experience and Design
- **As a user, I want the application to have a clean, modern interface that is easy to use.**
- **As a user, I want the application to be fully responsive** so I can use it effectively on my desktop, tablet, or mobile phone.
- **As a user, I want the application to offer a dark theme** that automatically adapts to my system's preference for comfortable viewing in low-light conditions.

## 4. Non-Functional Requirements

- **Performance:** The application must be fast and responsive, generating calendar data locally without relying on network requests.
- **Offline Capability:** The core calendar functionality should work offline.
- **Maintainability:** The codebase must be well-structured, modular, and easy for developers to understand and extend.
- **Development Environment:** The project must include a local development server with live-reloading for efficient development and testing.

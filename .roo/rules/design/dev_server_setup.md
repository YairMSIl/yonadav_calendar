# Design: Local Development Server Setup

This document outlines the plan to add a local development server for easier testing.

## 1. Problem

The current `npm start` command using `node server.js` is not suitable for the new modular structure that uses ES6 imports. A more robust solution is needed that handles module bundling and provides a good developer experience with features like live reloading.

## 2. Solution

We will add a new `dev` script to `package.json` that uses `live-server` to serve the application. `live-server` is a simple development server with live reload capability.

### Implementation Plan

1.  **Install `live-server`**: Add `live-server` as a `devDependency` in `package.json`.
2.  **Add `dev` script**: Create a new `dev` script in the `scripts` section of `package.json`. This script will do two things in parallel:
    *   Run `browserify` in watch mode (`-w`) to automatically re-bundle `dist/bundle.js` whenever a file in the `js/` directory changes.
    *   Run `live-server` on the `dist` directory to serve the bundled application.
3.  **Update `build` script**: Modify the existing `build` script to ensure the `dist` directory is created before `browserify` runs.

### `package.json` Changes

```json
{
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "npm run dev",
    "build": "mkdir -p dist && browserify js/main.js -t babelify -o dist/bundle.js && copyfiles index.html \"styles/*\" dist",
    "dev": "npm run build && (browserify js/main.js -t babelify -o dist/bundle.js -w & live-server dist)",
    "deploy": "npm run build && gh-pages -d dist"
  },
  "devDependencies": {
    "@babel/core": "^7.28.0",
    "@babel/preset-env": "^7.28.0",
    "babelify": "^10.0.0",
    "browserify": "^17.0.1",
    "copyfiles": "^2.4.1",
    "live-server": "^1.2.2"
  }
}
```

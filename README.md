# Dynamic Hebrew Calendar

This is a web-based calendar application that displays Gregorian and Hebrew dates, along with Jewish holidays and weekly Torah portions. It is built with vanilla JavaScript and uses the `@hebcal/core` library for all calendar calculations, allowing it to work completely offline.

## Project Setup

To get started with this project, you first need to install the necessary dependencies.

```bash
npm install
```

## Development

### Local Testing

To run the application locally for testing and development, you can use the built-in web server.

```bash
npm start
```

This will start a server, and you can view the application by navigating to `http://localhost:8080` in your web browser.

## Build & Deployment

This project uses a build step to bundle all JavaScript files into a single, optimized file for production.

### Building the Project

To build the application, run the following command. This will create a `dist` directory containing the final `index.html`, `styles/`, and `bundle.js` files.

```bash
npm run build
```

### Deploying to GitHub Pages

A convenient script is included to handle both the build and deployment to GitHub Pages in one step.

To deploy the latest version of the application, simply run:

```bash
npm run deploy
```

This command will automatically build the project and push the contents of the `dist` directory to the `gh-pages` branch of your repository.
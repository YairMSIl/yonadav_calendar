/**
 * @file-overview This is the main entry point for the calendar application.
 * It imports all necessary modules, sets up event listeners, and orchestrates
 * the application flow.
 */

import { generateCalendar } from './calendar.js';
import { toggleMarking, fillSquares, resetCalendar, updateCellView, updateCounter } from './ui.js';
import { updateURLFromState, loadStateFromURL, applyMarksFromURL } from './state.js';

/**
 * Main function to initialize the application.
 */
async function main() {
    const initialMarks = loadStateFromURL();

    const dependencies = {
        toggleMarking,
        updateURLFromState,
        updateCounter,
        applyMarksFromURL,
        updateCellView
    };

    await generateCalendar(dependencies);

    if (initialMarks) {
        applyMarksFromURL(initialMarks, updateCellView);
    }
    updateCounter();
}

// --- Event Listeners ---

document.addEventListener('DOMContentLoaded', main);

document.getElementById('generate-calendar-btn').addEventListener('click', async () => {
    const dependencies = {
        toggleMarking,
        updateURLFromState,
        updateCounter,
        applyMarksFromURL,
        updateCellView
    };
    await generateCalendar(dependencies);
    const marks = new URLSearchParams(window.location.search).get('marks');
    if (marks) {
        applyMarksFromURL(marks, updateCellView);
    }
    updateCounter();
});

document.getElementById('fill-squares-btn').addEventListener('click', () => {
    fillSquares(updateURLFromState);
});

document.getElementById('reset-calendar-btn').addEventListener('click', () => {
    resetCalendar(updateURLFromState);
});
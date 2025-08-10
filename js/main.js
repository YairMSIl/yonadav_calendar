/**
 * @file-overview This is the main entry point for the calendar application.
 * It imports all necessary modules, sets up event listeners, and orchestrates
 * the application flow.
 */

import { generateCalendar } from './calendar.js';
import { updateURLFromState, loadStateFromURL, applyMarksFromURL } from './state.js';
import { toggleMarking, fillSquares, resetCalendar, updateCellView, updateCounter, applySplitDayView } from './ui.js';

async function main() {
    const dependencies = {
        toggleMarking,
        updateURLFromState,
        updateCellView,
        updateCounter
    };

    document.getElementById('generate-calendar-btn').addEventListener('click', () => generateCalendar(dependencies));
    document.getElementById('fill-squares-btn').addEventListener('click', () => fillSquares(updateURLFromState));
    document.getElementById('reset-calendar-btn').addEventListener('click', () => resetCalendar(updateURLFromState));

    const splitDayToggleBtn = document.getElementById('split-day-toggle-btn');
    if (splitDayToggleBtn) {
        splitDayToggleBtn.addEventListener('click', () => {
            splitDayToggleBtn.classList.toggle('active');
            applySplitDayView();
            updateURLFromState();
        });
    }

    const initialState = loadStateFromURL();
    if (initialState) {
        if (initialState.split) {
            splitDayToggleBtn.classList.add('active');
        }
        await generateCalendar(dependencies);
        applyMarksFromURL(initialState.marks, updateCellView);
        updateCounter();
        applySplitDayView(); // Apply view after everything is loaded
    } else {
        await generateCalendar(dependencies);
    }
}

document.addEventListener('DOMContentLoaded', main);
/**
 * @file-overview This file contains UI interaction logic for the calendar,
 * including marking cells, filling squares, and resetting the view.
 */

// Helper function to update the counts of marked cells.
export function updateCounter() {
    const cells = document.querySelectorAll('.calendar-cell[data-marking]');
    let blueCount = 0;
    let pinkCount = 0;
    cells.forEach(cell => {
        const marking = cell.dataset.marking;
        if (marking === 'blue' || marking === 'blue-bg') {
            blueCount++;
        } else if (marking === 'pink' || marking === 'pink-bg') {
            pinkCount++;
        }
    });
    document.getElementById('blueCount').textContent = blueCount;
    document.getElementById('pinkCount').textContent = pinkCount;
}

/**
 * Updates the visual representation of a single calendar cell based on its 'marking' dataset attribute.
 * Exported because it's needed by applyMarksFromURL in state.js.
 * @param {HTMLElement} cell The calendar cell element to update.
 */
export function updateCellView(cell) {
    const marking = cell.dataset.marking;
    const existingMarking = cell.querySelector('.marking');
    if (existingMarking) {
        existingMarking.remove();
    }
    cell.classList.remove('blue-bg', 'pink-bg');
    if (marking === 'blue' || marking === 'pink') {
        const markingElement = document.createElement('div');
        markingElement.className = `marking ${marking}-marking`;
        cell.appendChild(markingElement);
    } else if (marking === 'blue-bg') {
        cell.classList.add('blue-bg');
    } else if (marking === 'pink-bg') {
        cell.classList.add('pink-bg');
    }
}

/**
 * Toggles the marking of a cell between blue, pink, and none.
 * @param {HTMLElement} cell The cell to mark.
 * @param {function} updateURLFromState Function to call to update the URL state.
 */
export function toggleMarking(cell, updateURLFromState) {
    const currentMarking = cell.dataset.marking || '';
    let newMarking = '';
    switch (currentMarking) {
        case '':
            newMarking = 'blue';
            break;
        case 'blue':
        case 'blue-bg':
            newMarking = 'pink';
            break;
        case 'pink':
        case 'pink-bg':
            newMarking = '';
            break;
    }
    if (newMarking) {
        cell.dataset.marking = newMarking;
    } else {
        delete cell.dataset.marking;
    }
    updateCellView(cell);
    updateCounter();
    updateURLFromState();
}

/**
 * Fills the marked squares, changing dots to background colors.
 * @param {function} updateURLFromState Function to call to update the URL state.
 */
export function fillSquares(updateURLFromState) {
    const cells = document.querySelectorAll('.calendar-cell[data-marking]');
    cells.forEach(cell => {
        const marking = cell.dataset.marking;
        if (marking === 'blue') {
            cell.dataset.marking = 'blue-bg';
        } else if (marking === 'pink') {
            cell.dataset.marking = 'pink-bg';
        }
        updateCellView(cell);
    });
    updateCounter();
    updateURLFromState();
    applySplitDayView();
}

/**
 * Resets all markings from the calendar.
 * @param {function} updateURLFromState Function to call to update the URL state.
 */
export function resetCalendar(updateURLFromState) {
    const cells = document.querySelectorAll('.calendar-cell[data-marking]');
    cells.forEach(cell => {
        delete cell.dataset.marking;
        updateCellView(cell);
    });
    updateCounter();
    updateURLFromState();
    applySplitDayView();
}

/**
 * Applies a split background to days that are at the boundary of two different colors.
 */
export function applySplitDayView() {
    const toggleBtn = document.getElementById('split-day-toggle-btn');
    if (!toggleBtn) return;

    const cells = document.querySelectorAll('.calendar-cell[data-date]');
    const colorMap = {
        'blue-bg': 'var(--mark-blue-bg)',
        'pink-bg': 'var(--mark-pink-bg)'
    };

    cells.forEach(cell => {
        cell.classList.remove('split-bg');
        cell.style.removeProperty('--prev-color');
        cell.style.removeProperty('--current-color');
    });

    if (!toggleBtn.classList.contains('active')) {
        return;
    }

    for (let i = 0; i < cells.length; i++) {
        const currentCell = cells[i];
        const prevCell = i > 0 ? cells[i - 1] : null;

        if (prevCell) {
            const prevMarking = prevCell.dataset.marking;
            const currentMarking = currentCell.dataset.marking;

            if (prevMarking && currentMarking && prevMarking !== currentMarking && colorMap[prevMarking] && colorMap[currentMarking]) {
                currentCell.classList.add('split-bg');
                currentCell.style.setProperty('--prev-color', colorMap[prevMarking]);
                currentCell.style.setProperty('--current-color', colorMap[currentMarking]);
            }
        }
    }
}
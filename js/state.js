/**
 * @file-overview This file manages the application's state by interacting with the URL query parameters.
 * It handles loading the state from the URL on page load and updating the URL when the state changes.
 */

export function updateURLFromState() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const cells = document.querySelectorAll('.calendar-cell[data-date]');
    const marks = Array.from(cells).map(cell => {
        const marking = cell.dataset.marking;
        if (marking === 'blue') return '1';
        if (marking === 'pink') return '2';
        if (marking === 'blue-bg') return '3';
        if (marking === 'pink-bg') return '4';
        return '0';
    }).join('');
    const params = new URLSearchParams();
    params.set('startDate', startDate);
    params.set('endDate', endDate);
    params.set('marks', marks);
    history.replaceState({}, '', `?${params.toString()}`);
}

export function loadStateFromURL() {
    const params = new URLSearchParams(window.location.search);
    const startDate = params.get('startDate');
    const endDate = params.get('endDate');
    const marks = params.get('marks');
    if (startDate && endDate) {
        document.getElementById('startDate').value = startDate;
        document.getElementById('endDate').value = endDate;
        return marks || '';
    }
    return null;
}

export function applyMarksFromURL(marks, updateCellView) {
    if (!marks) return;
    const cells = document.querySelectorAll('.calendar-cell[data-date]');
    const markMapping = { '1': 'blue', '2': 'pink', '3': 'blue-bg', '4': 'pink-bg' };
    cells.forEach((cell, index) => {
        if (index < marks.length) {
            const markType = marks[index];
            if (markType !== '0') {
                cell.dataset.marking = markMapping[markType];
                updateCellView(cell);
            }
        }
    });
}
import { HebrewCalendar, HDate } from '@hebcal/core';
/**
 * @file-overview This file contains the core calendar generation logic, including
 * fetching data from the Hebcal API and building the HTML for the calendar grid.
 */

const hebrewDays = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
const hebrewDaysShort = ["א'", "ב'", "ג'", "ד'", "ה'", "ו'", "ש'"];

/**
 * Generates the calendar grid based on a selected date range.
 * Fetches Hebrew dates and Torah portions from the Hebcal API.
 * @param {object} dependencies - Functions required by generateCalendar.
 * @param {Function} dependencies.applyMarksFromURL - Applies markings from URL parameters.
 * @param {Function} dependencies.updateCounter - Updates the UI counter for marked days.
 * @param {Function} dependencies.updateURLFromState - Updates the URL with the current calendar state.
 * @param {Function} dependencies.toggleMarking - Toggles the marking of a specific day.
 */
export async function generateCalendar({ toggleMarking, updateURLFromState }) {
    const startDateInput = document.getElementById('startDate').value;
    const endDateInput = document.getElementById('endDate').value;
    const startDate = new Date(startDateInput);
    const endDate = new Date(endDateInput);

    if (startDate > endDate) {
        alert('תאריך ההתחלה חייב להיות לפני תאריך הסיום');
        return;
    }

    const hebrewDatesMap = new Map();
    const events = [];
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    const startMonth = startDate.getMonth() + 1;
    const endMonth = endDate.getMonth() + 1;

    for (let year = startYear; year <= endYear; year++) {
        const monthStart = (year === startYear) ? startMonth : 1;
        const monthEnd = (year === endYear) ? endMonth : 12;
        for (let month = monthStart; month <= monthEnd; month++) {
            const monthEvents = HebrewCalendar.calendar({
                locale: 'he',
                sedrot: true,
                year: year,
                month: month
            });
            events.push(...monthEvents);
        }
    }

    for (const event of events) {
        const eventDate = event.getDate().greg();
        const formattedDate = eventDate.toISOString().split('T')[0];
        if (!hebrewDatesMap.has(formattedDate)) {
            hebrewDatesMap.set(formattedDate, {
                hdate: event.getDate(),
                events: []
            });
        }
        hebrewDatesMap.get(formattedDate).events.push(event.render('he'));
    }

    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    const days = window.innerWidth < 480 ? hebrewDaysShort : hebrewDays;
    days.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'day-header';
        dayHeader.textContent = day;
        calendar.appendChild(dayHeader);
    });

    const currentDate = new Date(startDate);
    let currentWeekday = startDate.getDay();

    for (let i = 0; i < currentWeekday; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-cell';
        calendar.appendChild(emptyCell);
    }

    let prevGregorianMonth = -1;

    while (currentDate <= endDate) {
        const cell = document.createElement('div');
        cell.className = 'calendar-cell';
        const weekday = currentDate.getDay();
        if (weekday === 5 || weekday === 6) {
            cell.classList.add('weekend');
        }

        const formattedDate = currentDate.toISOString().split('T')[0];
        cell.dataset.date = formattedDate;

        const hebrewDateInfo = hebrewDatesMap.get(formattedDate);
        let cellHTML = `<div class="date">${currentDate.getDate()}</div>`;

        if (hebrewDateInfo) {
            const isFirstDayOfCalendar = currentDate.getTime() === startDate.getTime();
            const currentGregorianMonth = currentDate.getMonth();

            // Gregorian month display
            if (isFirstDayOfCalendar || currentGregorianMonth !== prevGregorianMonth) {
                const monthName = currentDate.toLocaleString('en-US', { month: 'long' });
                cellHTML += `<div class="gregorian-month">${monthName}</div>`;
            }

            // Hebrew date display logic
            const hebrewDay = hebrewDateInfo.hdate.getDate();
            const hebrewMonth = hebrewDateInfo.hdate.getMonthName('he');
            const isFirstOfHebrewMonth = hebrewDateInfo.hdate.getDate() === 1;

            if (isFirstDayOfCalendar) {
                cellHTML += `<div class="hebrew-month">${hebrewMonth}</div>`;
            } else if (isFirstOfHebrewMonth) {
                cellHTML += `<div class="hebrew-month">${hebrewMonth}</div>`;
            }

            // Always show the Hebrew day.
            cellHTML += `<div class="hebrew-date">${hebrewDay}</div>`;

            prevGregorianMonth = currentGregorianMonth;

            if (hebrewDateInfo.events && hebrewDateInfo.events.length > 0) {
                cellHTML += '<div class="events">';
                hebrewDateInfo.events.forEach(event => {
                    // Only show Parashat on Saturdays (weekday 6)
                    if (event.startsWith('Parashat') && weekday !== 6) {
                        return; // Skip this event
                    }
                    cellHTML += `<div>${event}</div>`;
                });
                cellHTML += '</div>';
            }
        }

        cell.innerHTML = cellHTML;
        cell.addEventListener('click', function() {
            toggleMarking(this, updateURLFromState);
        });
        calendar.appendChild(cell);
        currentDate.setDate(currentDate.getDate() + 1);
    }

}
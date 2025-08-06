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

    let hebcalData = {};
    try {
        const start = startDate.toISOString().split('T')[0];
        const end = endDate.toISOString().split('T')[0];
        const apiUrl = `https://www.hebcal.com/converter?cfg=json&g2h=1&start=${start}&end=${end}&leyning=on&s=on`;
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.hdates) {
            hebcalData = data.hdates;
        }

    } catch (error) {
        console.error("Error fetching Hebrew dates:", error);
        const calendar = document.getElementById('calendar');
        calendar.innerHTML = `<p style="color: red; text-align: center;">שגיאה בטעינת נתונים מהשרת. נסה שוב מאוחר יותר.</p>`;
        return;
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

        const hebrewDateInfo = hebcalData[formattedDate];
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
            const hebrewDay = hebrewDateInfo.heDateParts.d;
            const hebrewMonth = hebrewDateInfo.heDateParts.m;
            const isFirstOfHebrewMonth = hebrewDateInfo.hd === 1;

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
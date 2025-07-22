// js/main.js
// This file contains global functionalities like Dark Mode toggle
// and utility functions used across multiple pages.

document.addEventListener('DOMContentLoaded', () => {
    // --- Dark Mode Toggle ---
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        const currentTheme = localStorage.getItem('theme');

        if (currentTheme) {
            document.documentElement.setAttribute('data-theme', currentTheme);
        }

        darkModeToggle.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            if (theme === 'dark') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // --- Active Navigation Link ---
    const currentPath = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        } else if (currentPath === '' && link.getAttribute('href') === 'index.html') {
            // Handle index.html being root path
            link.classList.add('active');
        }
    });
});

/**
 * Displays a temporary status message (success, error, or generic).
 * @param {string} message - The message to display.
 * @param {'success'|'error'|'info'} type - Type of message for styling.
 * @param {string} elementId - ID of the HTML element to display the message in.
 * @param {number} duration - How long to display the message in milliseconds.
 */
function showStatusMessage(message, type = 'info', elementId = 'generationStatus', duration = 5000) {
    const statusElement = document.getElementById(elementId);
    if (!statusElement) {
        console.warn(`Status element with ID '${elementId}' not found.`);
        return;
    }

    statusElement.textContent = message;
    statusElement.className = `status-message ${type}-message`; // Reset classes and add type
    statusElement.style.display = 'block';

    setTimeout(() => {
        statusElement.style.display = 'none';
        statusElement.textContent = '';
    }, duration);
}

/**
 * Converts a time string (HH:MM) to minutes from midnight.
 * @param {string} timeStr - Time string like "08:00".
 * @returns {number} Minutes from midnight.
 */
function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

/**
 * Converts minutes from midnight to a time string (HH:MM).
 * @param {number} totalMinutes - Minutes from midnight.
 * @returns {string} Time string like "08:00".
 */
function minutesToTime(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

// Global object to hold all university data (in-memory cache)
// This will be populated from IndexedDB by data-storage.js
window.universityData = {
    professors: [],
    courses: [],
    classrooms: [],
    generatedSchedules: [], // This will hold the successfully generated schedule data
    generalSettings: {
        dailyStartTime: '08:00',
        dailyEndTime: '15:00',
        lectureDurationUnit: 60, // minutes
        breakDuration: 10,     // minutes
        workingDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday']
    }
};

// Global object for days mapping to display
window.DAYS_MAP = {
    'Sunday': 'الأحد',
    'Monday': 'الإثنين',
    'Tuesday': 'الثلاثاء',
    'Wednesday': 'الأربعاء',
    'Thursday': 'الخميس',
    'Friday': 'الجمعة',
    'Saturday': 'السبت'
};

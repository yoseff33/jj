// js/display.js
// Handles rendering of schedules on schedule.html and filtering logic.

document.addEventListener('DOMContentLoaded', () => {
    const scheduleViewType = document.getElementById('scheduleViewType');
    if (scheduleViewType) {
        scheduleViewType.addEventListener('change', toggleFilterDropdowns);
    }
});

/**
 * Toggles visibility of filter dropdowns based on selected view type.
 */
function toggleFilterDropdowns() {
    const viewType = document.getElementById('scheduleViewType').value;
    document.getElementById('professorSelectGroup').style.display = 'none';
    document.getElementById('sectionSelectGroup').style.display = 'none';
    document.getElementById('roomSelectGroup').style.display = 'none';

    if (viewType === 'professor') {
        document.getElementById('professorSelectGroup').style.display = 'flex';
    } else if (viewType === 'section') {
        document.getElementById('sectionSelectGroup').style.display = 'flex';
    } else if (viewType === 'room') {
        document.getElementById('roomSelectGroup').style.display = 'flex';
    }
}

/**
 * Populates the filter dropdowns (professors, sections, rooms) on schedule.html.
 */
async function populateScheduleFilters() {
    const professorFilter = document.getElementById('professorFilter');
    const sectionFilter = document.getElementById('sectionFilter');
    const roomFilter = document.getElementById('roomFilter');

    // Clear previous options
    professorFilter.innerHTML = '<option value="all">جميع المدرسين</option>';
    sectionFilter.innerHTML = '<option value="all">جميع الشعب</option>';
    roomFilter.innerHTML = '<option value="all">جميع الغرف</option>';

    // Populate Professors
    universityData.professors.forEach(prof => {
        const option = document.createElement('option');
        option.value = prof.id;
        option.textContent = prof.name;
        professorFilter.appendChild(option);
    });

    // Populate Sections (using a Set to avoid duplicates if course has multiple lectures)
    const uniqueSections = new Set();
    universityData.generatedSchedules.forEach(schedule => {
        uniqueSections.add(`${schedule.courseName} - شعبة ${schedule.section}`);
    });
    Array.from(uniqueSections).sort().forEach(sectionText => {
        const option = document.createElement('option');
        // Value format: "CourseName_SectionNum" (e.g., "الرياضيات_1") for easier filtering
        const [courseName, sectionNumText] = sectionText.split(' - شعبة ');
        const course = universityData.courses.find(c => c.name === courseName);
        if (course) {
             option.value = `${course.id}_${sectionNumText}`;
        } else {
             option.value = sectionText; // Fallback if course not found (shouldn't happen)
        }
        option.textContent = sectionText;
        sectionFilter.appendChild(option);
    });

    // Populate Rooms
    universityData.classrooms.forEach(room => {
        const option = document.createElement('option');
        option.value = room.id;
        option.textContent = room.name;
        roomFilter.appendChild(option);
    });

    toggleFilterDropdowns(); // Set initial visibility
}


/**
 * Renders the schedules based on selected filters.
 */
async function displaySchedules() {
    const scheduleOutput = document.getElementById('scheduleOutput');
    const noDataMessage = document.querySelector('.no-data-message');
    const conflictAlertsDiv = document.getElementById('conflictAlerts');
    scheduleOutput.innerHTML = ''; // Clear previous schedules
    conflictAlertsDiv.innerHTML = '';
    conflictAlertsDiv.style.display = 'none';

    const { generatedSchedules, professors, courses, classrooms, generalSettings } = universityData;

    if (!generatedSchedules || generatedSchedules.length === 0) {
        if (noDataMessage) noDataMessage.style.display = 'block';
        return;
    } else {
        if (noDataMessage) noDataMessage.style.display = 'none';
    }

    const viewType = document.getElementById('scheduleViewType').value;
    const professorFilterId = parseInt(document.getElementById('professorFilter').value);
    const sectionFilterValue = document.getElementById('sectionFilter').value; // e.g., "1_2" for course ID 1, section 2
    const roomFilterId = parseInt(document.getElementById('roomFilter').value);
    const searchText = document.getElementById('scheduleSearch').value.toLowerCase();

    let filteredSchedules = generatedSchedules.filter(entry => {
        const matchesProfessor = viewType === 'professor' && (isNaN(professorFilterId) || professorFilterId === entry.professorId || professorFilterId === 'all');
        const matchesSection = viewType === 'section' && (sectionFilterValue === 'all' || `${entry.courseId}_${entry.section}` === sectionFilterValue);
        const matchesRoom = viewType === 'room' && (isNaN(roomFilterId) || roomFilterId === entry.roomId || roomFilterId === 'all');

        const matchesSearch = searchText === '' ||
                              entry.courseName.toLowerCase().includes(searchText) ||
                              entry.professorName.toLowerCase().includes(searchText);

        if (viewType === 'professor') return matchesProfessor && matchesSearch;
        if (viewType === 'section') return matchesSection && matchesSearch;
        if (viewType === 'room') return matchesRoom && matchesSearch;
        // Default to showing all if no view type is selected (shouldn't happen with dropdowns)
        return matchesSearch;
    });

    // Group schedules by the selected view type
    let groupedSchedules = new Map(); // Key: professorId/sectionKey/roomId, Value: array of schedule entries

    if (viewType === 'professor') {
        if (isNaN(professorFilterId) || professorFilterId === 'all') {
            professors.forEach(prof => groupedSchedules.set(prof.id, []));
        } else {
            groupedSchedules.set(professorFilterId, []);
        }
        filteredSchedules.forEach(entry => {
            if (groupedSchedules.has(entry.professorId)) {
                groupedSchedules.get(entry.professorId).push(entry);
            }
        });
    } else if (viewType === 'section') {
        // Collect all unique section keys from filtered schedules
        const uniqueSectionKeys = new Set(filteredSchedules.map(s => `${s.courseId}_${s.section}`));
        uniqueSectionKeys.forEach(key => groupedSchedules.set(key, []));
        if (sectionFilterValue !== 'all') { // If a specific section is chosen, ensure it's in the map
            groupedSchedules.set(sectionFilterValue, []);
        }
        filteredSchedules.forEach(entry => {
            const key = `${entry.courseId}_${entry.section}`;
            if (groupedSchedules.has(key)) {
                groupedSchedules.get(key).push(entry);
            }
        });
    } else if (viewType === 'room') {
         if (isNaN(roomFilterId) || roomFilterId === 'all') {
            classrooms.forEach(room => groupedSchedules.set(room.id, []));
        } else {
            groupedSchedules.set(roomFilterId, []);
        }
        filteredSchedules.forEach(entry => {
            if (groupedSchedules.has(entry.roomId)) {
                groupedSchedules.get(entry.roomId).push(entry);
            }
        });
    }

    // Sort schedules within each group by day and time for display
    groupedSchedules.forEach(scheduleArray => {
        scheduleArray.sort((a, b) => {
            const daysOrder = generalSettings.workingDays;
            const dayA = daysOrder.indexOf(a.day);
            const dayB = daysOrder.indexOf(b.day);
            if (dayA !== dayB) return dayA - dayB;
            return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
        });
    });

    const dailyTimeSlots = getDailyTimeSlotsForDisplay(generalSettings);

    if (groupedSchedules.size === 0 || filteredSchedules.length === 0) {
        scheduleOutput.innerHTML = `<p class="no-data-message">لا توجد جداول مطابقة لمعايير البحث أو التصفية.</p>`;
        return;
    }

    // Render each group as a separate schedule table
    let totalProfHours = new Map(professors.map(p => [p.id, 0]));
    let totalRoomUsage = new Map(classrooms.map(r => [r.id, 0]));

    for (const [key, schedules] of groupedSchedules.entries()) {
        const wrapper = document.createElement('div');
        wrapper.className = 'schedule-table-wrapper';

        let title = '';
        if (viewType === 'professor') {
            title = professors.find(p => p.id === key)?.name || 'مدرس غير معروف';
            // Calculate total hours for this professor
            schedules.forEach(entry => {
                totalProfHours.set(entry.professorId, totalProfHours.get(entry.professorId) + (entry.duration / 60));
            });
        } else if (viewType === 'section') {
            const [courseId, sectionNum] = key.split('_');
            const course = courses.find(c => c.id === parseInt(courseId));
            title = `${course?.name || 'مقرر غير معروف'} - شعبة ${sectionNum}`;
        } else if (viewType === 'room') {
            title = classrooms.find(r => r.id === key)?.name || 'غرفة غير معروفة';
            schedules.forEach(entry => {
                 totalRoomUsage.set(entry.roomId, totalRoomUsage.get(entry.roomId) + entry.duration);
            });
        }

        wrapper.innerHTML = `<h3>جدول: ${title}</h3>`;
        const table = document.createElement('table');
        table.className = 'schedule-table';

        // Table Header
        let headerRow = '<tr><th>الوقت / اليوم</th>';
        generalSettings.workingDays.forEach(day => {
            headerRow += `<th>${window.DAYS_MAP[day]}</th>`;
        });
        headerRow += '</tr>';
        table.innerHTML += headerRow;

        // Table Body
        dailyTimeSlots.forEach(slot => {
            let row = `<tr><td>${minutesToTime(slot.start)} - ${minutesToTime(slot.end)}</td>`;
            generalSettings.workingDays.forEach(day => {
                const lecturesInSlot = schedules.filter(s =>
                    s.day === day &&
                    timeToMinutes(s.startTime) === slot.start &&
                    timeToMinutes(s.endTime) === slot.end
                );
                row += '<td>';
                if (lecturesInSlot.length > 0) {
                    lecturesInSlot.forEach(lecture => {
                        row += `<div class="schedule-entry" draggable="true" data-schedule-id="${lecture.id}">
                                    <strong>${lecture.courseName} - ش${lecture.section}</strong>
                                    <span>${lecture.professorName} - ${lecture.roomName}</span>
                                    <span class="schedule-entry-duration">${lecture.duration} دقيقة</span>
                                </div>`;
                    });
                }
                row += '</td>';
            });
            row += '</tr>';
            table.innerHTML += row;
        });

        wrapper.appendChild(table);
        
        // Add action buttons for individual schedule
        const actionButtonsDiv = document.createElement('div');
        actionButtonsDiv.className = 'schedule-action-buttons';
        actionButtonsDiv.innerHTML = `
            <button class="button primary-button print-schedule-button" data-print-target="schedule-table-wrapper">
                <i class="icon-print"></i> طباعة هذا الجدول
            </button>
            <button class="button secondary-button download-image-button" data-download-target="schedule-table-wrapper">
                <i class="icon-download"></i> تحميل كصورة
            </button>
        `;
        wrapper.appendChild(actionButtonsDiv);

        scheduleOutput.appendChild(wrapper);
    }

    // Display professor overload alerts
    const potentialConflicts = [];
    totalProfHours.forEach((hours, profId) => {
        const prof = professors.find(p => p.id === profId);
        if (prof && hours > prof.maxHours) {
            potentialConflicts.push(`المدرس ${prof.name} تجاوز الحد الأقصى لساعات التدريس: ${hours.toFixed(1)} ساعة (الحد الأقصى: ${prof.maxHours} ساعة).`);
        }
    });

    // You might also add alerts for room overuse or underuse
    // totalRoomUsage.forEach((usage, roomId) => { ... });

    if (potentialConflicts.length > 0) {
        conflictAlertsDiv.style.display = 'block';
        conflictAlertsDiv.innerHTML = '<h3>تنبيهات الجداول:</h3>';
        const ul = document.createElement('ul');
        potentialConflicts.forEach(msg => {
            const li = document.createElement('li');
            li.textContent = msg;
            ul.appendChild(li);
        });
        conflictAlertsDiv.appendChild(ul);
    }
    
    // Attach event listeners for print/download buttons after rendering
    attachScheduleActionListeners();
    // Re-attach drag & drop listeners if implemented (will be in utils.js or specific drag-drop.js)
    // attachDragAndDropListeners();
}

/**
 * Calculates time slots for display based on general settings.
 * @param {object} settings - The general settings object.
 * @returns {Array<object>} An array of time slot objects {start: minutes, end: minutes}.
 */
function getDailyTimeSlotsForDisplay(settings) {
    const slots = [];
    const startTimeMinutes = timeToMinutes(settings.dailyStartTime);
    const endTimeMinutes = timeToMinutes(settings.dailyEndTime);
    const lectureDuration = settings.lectureDurationUnit;
    const breakDuration = settings.breakDuration;

    let currentTime = startTimeMinutes;
    while (currentTime + lectureDuration <= endTimeMinutes) {
        slots.push({
            start: currentTime,
            end: currentTime + lectureDuration
        });
        currentTime += (lectureDuration + breakDuration);
    }
    return slots;
}


// Expose functions globally
window.populateScheduleFilters = populateScheduleFilters;
window.displaySchedules = displaySchedules;

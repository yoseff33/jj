// js/scheduling.js
// This file contains the core logic for generating the timetable.

/**
 * Generates and displays schedules based on current data and constraints.
 */
async function generateAndDisplaySchedules() {
    showStatusMessage('جاري توليد الجداول... قد يستغرق هذا بعض الوقت.', 'info', 'generationStatus', 10000);
    document.getElementById('generationErrors').style.display = 'none';
    document.getElementById('generationErrors').innerHTML = '';

    const { professors, courses, classrooms, generalSettings } = universityData;

    if (professors.length === 0 || courses.length === 0 || classrooms.length === 0) {
        showStatusMessage('يرجى إدخال بيانات كافية (مدرسين، مقررات، غرف دراسية) قبل توليد الجداول.', 'error', 'generationErrors');
        return;
    }

    const conflicts = [];
    const generatedSchedule = []; // Will store the final schedule entries

    // Prepare time slots based on general settings
    const startTimeMinutes = timeToMinutes(generalSettings.dailyStartTime);
    const endTimeMinutes = timeToMinutes(generalSettings.dailyEndTime);
    const lectureDuration = generalSettings.lectureDurationUnit;
    const breakDuration = generalSettings.breakDuration;

    // Helper to get all available time slots for a day
    const getDailyTimeSlots = () => {
        const slots = [];
        let currentTime = startTimeMinutes;
        while (currentTime + lectureDuration <= endTimeMinutes) {
            slots.push({
                start: currentTime,
                end: currentTime + lectureDuration
            });
            currentTime += (lectureDuration + breakDuration);
        }
        return slots;
    };

    const timeSlotsPerDay = getDailyTimeSlots();
    if (timeSlotsPerDay.length === 0) {
        showStatusMessage('إعدادات وقت البدء والانتهاء ومدة المحاضرة لا تسمح بتوليد أي فتحات زمنية. يرجى مراجعة الإعدادات العامة.', 'error', 'generationErrors');
        return;
    }


    // --- Scheduling State (Track availability) ---
    const professorAvailability = new Map(); // profId -> { day -> [availableTimeSlots] }
    const classroomAvailability = new Map(); // roomId -> { day -> [availableTimeSlots] }
    const sectionAvailability = new Map();    // courseId_sectionNum -> { day -> [availableTimeSlots] }
    const professorHoursUsed = new Map(professors.map(p => [p.id, 0])); // profId -> current hours

    // Initialize all availabilities
    professors.forEach(prof => {
        professorAvailability.set(prof.id, new Map());
        generalSettings.workingDays.forEach(day => {
            if (!prof.unavailableDays.includes(day)) {
                 professorAvailability.get(prof.id).set(day, [...timeSlotsPerDay]);
            }
        });
    });

    classrooms.forEach(room => {
        classroomAvailability.set(room.id, new Map());
        generalSettings.workingDays.forEach(day => {
            if (!room.unavailableDays.includes(day)) {
                classroomAvailability.get(room.id).set(day, [...timeSlotsPerDay]);
            }
        });
    });

    // Initialize sections (each course x section is a unique entity)
    courses.forEach(course => {
        for (let i = 1; i <= course.sections; i++) {
            const sectionKey = `${course.id}_${i}`;
            sectionAvailability.set(sectionKey, new Map());
            generalSettings.workingDays.forEach(day => {
                sectionAvailability.get(sectionKey).set(day, [...timeSlotsPerDay]);
            });
        }
    });

    // --- Core Scheduling Loop ---
    // Sort courses by number of lectures per week, then by sections (more complex courses first)
    const coursesToSchedule = [];
    courses.forEach(course => {
        for (let i = 1; i <= course.sections; i++) {
            for (let j = 0; j < course.lecturesPerWeek; j++) {
                coursesToSchedule.push({
                    courseId: course.id,
                    sectionNum: i,
                    lectureNum: j + 1 // To distinguish multiple lectures for the same section
                });
            }
        }
    });

    // A simple greedy approach for now: iterate through courses and try to place them.
    // A real-world scheduler would need a more sophisticated algorithm (e.g., constraint satisfaction, backtracking).
    let successCount = 0;
    let failedCount = 0;

    for (const lecture of coursesToSchedule) {
        const course = universityData.courses.find(c => c.id === lecture.courseId);
        let assigned = false;

        // Try to assign preferred professor first, otherwise any available
        const professorsToTry = course.preferredProfessorId
            ? [universityData.professors.find(p => p.id === course.preferredProfessorId), ...universityData.professors.filter(p => p.id !== course.preferredProfessorId)]
            : [...universityData.professors];

        // Shuffle days for better distribution (simple attempt)
        const shuffledDays = shuffleArray([...generalSettings.workingDays]);

        for (const prof of professorsToTry) {
            if (!prof) continue; // Skip if preferred professor not found

            // Check professor's max hours
            if (professorHoursUsed.get(prof.id) >= prof.maxHours) {
                // Conflicts.push(`المدرس ${prof.name} تجاوز الحد الأقصى لساعات التدريس.`); // This will be checked after assignment
                continue;
            }

            for (const day of shuffledDays) {
                // If professor or room is unavailable on this specific day, skip
                if (prof.unavailableDays.includes(day)) continue;

                const availableRoomsForType = classrooms.filter(room => {
                    const roomDayAvailability = classroomAvailability.get(room.id).get(day);
                    return !room.unavailableDays.includes(day) && (course.requiredRoomType === 'any' || room.type === course.requiredRoomType) && roomDayAvailability && roomDayAvailability.length > 0;
                });

                // Shuffle rooms for better distribution
                const shuffledRooms = shuffleArray(availableRoomsForType);

                for (const room of shuffledRooms) {
                    const profDaySlots = professorAvailability.get(prof.id).get(day);
                    const roomDaySlots = classroomAvailability.get(room.id).get(day);
                    const sectionDaySlots = sectionAvailability.get(`${course.id}_${lecture.sectionNum}`).get(day);

                    // Ensure all three entities (prof, room, section) have availability for this day
                    if (!profDaySlots || !roomDaySlots || !sectionDaySlots || profDaySlots.length === 0 || roomDaySlots.length === 0 || sectionDaySlots.length === 0) {
                        continue;
                    }

                    // Find common available slots
                    const commonSlots = timeSlotsPerDay.filter(slot =>
                        profDaySlots.some(s => s.start === slot.start) &&
                        roomDaySlots.some(s => s.start === slot.start) &&
                        sectionDaySlots.some(s => s.start === slot.start) &&
                        (prof.prefTime === 'any' || (prof.prefTime === 'morning' && slot.end <= timeToMinutes('12:00')) || (prof.prefTime === 'afternoon' && slot.start >= timeToMinutes('12:00')))
                    );

                    if (commonSlots.length > 0) {
                        // Pick the first available slot (could be optimized for even distribution)
                        const assignedSlot = commonSlots[0];

                        // Assign the lecture
                        generatedSchedule.push({
                            id: Date.now() + Math.random(), // Unique ID for each schedule entry
                            courseId: course.id,
                            courseName: course.name,
                            section: lecture.sectionNum,
                            professorId: prof.id,
                            professorName: prof.name,
                            roomId: room.id,
                            roomName: room.name,
                            day: day,
                            startTime: minutesToTime(assignedSlot.start),
                            endTime: minutesToTime(assignedSlot.end),
                            duration: course.duration // Actual duration for this lecture
                        });

                        // Update availability
                        const removeAssignedSlot = (slots) => slots.filter(s => s.start !== assignedSlot.start);
                        professorAvailability.get(prof.id).set(day, removeAssignedSlot(profDaySlots));
                        classroomAvailability.get(room.id).set(day, removeAssignedSlot(roomDaySlots));
                        sectionAvailability.get(`${course.id}_${lecture.sectionNum}`).set(day, removeAssignedSlot(sectionDaySlots));

                        // Update professor's hours used
                        professorHoursUsed.set(prof.id, professorHoursUsed.get(prof.id) + (course.duration / 60)); // Add hours

                        assigned = true;
                        successCount++;
                        break; // Move to next lecture
                    }
                }
                if (assigned) break; // Break from days loop
            }
            if (assigned) break; // Break from professors loop
        }

        if (!assigned) {
            failedCount++;
            conflicts.push(`فشل في جدولة المقرر: ${course.name} - شعبة ${lecture.sectionNum} (محاضرة ${lecture.lectureNum}). لا توجد فتحة زمنية مناسبة.`);
        }
    }

    // --- Post-Scheduling Conflict Checks (e.g., professor overloads) ---
    professors.forEach(prof => {
        const hoursUsed = professorHoursUsed.get(prof.id);
        if (hoursUsed > prof.maxHours) {
            conflicts.push(`تحذير: المدرس ${prof.name} تجاوز الحد الأقصى لساعات التدريس (${hoursUsed} ساعة، الحد الأقصى ${prof.maxHours} ساعة).`);
        }
    });

    // --- Save and Display Results ---
    await clearStore('generatedSchedules'); // Clear previous schedules
    for (const entry of generatedSchedule) {
        await addData('generatedSchedules', entry);
    }
    universityData.generatedSchedules = generatedSchedule; // Update in-memory cache

    if (conflicts.length > 0) {
        showStatusMessage('تم توليد الجداول مع بعض التعارضات/التحذيرات. يرجى مراجعة صفحة الجداول.', 'warning', 'generationStatus', 8000);
        document.getElementById('generationErrors').style.display = 'block';
        const conflictList = document.createElement('ul');
        conflicts.forEach(c => {
            const li = document.createElement('li');
            li.textContent = c;
            conflictList.appendChild(li);
        });
        document.getElementById('generationErrors').appendChild(conflictList);
    } else {
        showStatusMessage('تم توليد الجداول بنجاح ودون تعارضات!', 'success', 'generationStatus');
    }

    console.log('Final Generated Schedule:', generatedSchedule);
    console.log('Conflicts:', conflicts);

    // After generation, ideally, redirect or prompt to go to schedule page
    // window.location.href = 'schedule.html';
}

/**
 * Shuffles an array in place (Fisher-Yates algorithm).
 * @param {Array} array - The array to shuffle.
 * @returns {Array} The shuffled array.
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

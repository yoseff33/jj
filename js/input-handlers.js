// js/input-handlers.js
// Handles form submissions, data loading, editing, and deleting for input.html

document.addEventListener('DOMContentLoaded', () => {
    // Event Listeners for Forms
    const professorForm = document.getElementById('professorForm');
    if (professorForm) {
        professorForm.addEventListener('submit', handleProfessorSubmit);
        document.getElementById('clearProfessorForm').addEventListener('click', () => resetForm(professorForm));
    }

    const courseForm = document.getElementById('courseForm');
    if (courseForm) {
        courseForm.addEventListener('submit', handleCourseSubmit);
        document.getElementById('clearCourseForm').addEventListener('click', () => resetForm(courseForm));
    }

    const classroomForm = document.getElementById('classroomForm');
    if (classroomForm) {
        classroomForm.addEventListener('submit', handleClassroomSubmit);
        document.getElementById('clearClassroomForm').addEventListener('click', () => resetForm(classroomForm));
    }

    const generalSettingsForm = document.getElementById('generalSettingsForm');
    if (generalSettingsForm) {
        generalSettingsForm.addEventListener('submit', handleGeneralSettingsSubmit);
    }
});

// --- General Form Utility ---
function resetForm(form) {
    form.reset();
    form.querySelector('input[type="hidden"]').value = ''; // Clear ID for new entry
    form.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    // Re-populate coursePreferredProfessor if it exists, to ensure freshest list
    if (form.id === 'courseForm') {
        populateCoursePreferredProfessorSelect();
    }
    showStatusMessage('تم مسح النموذج.', 'info');
}

/**
 * Populates select dropdowns and lists on the input.html page.
 */
async function populateFormsAndLists() {
    // Populate Professor List
    const professorList = document.getElementById('professorList');
    if (professorList) {
        professorList.innerHTML = '';
        universityData.professors.forEach(prof => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${prof.name} (أقصى ساعات: ${prof.maxHours})</span>
                <div class="actions">
                    <button type="button" class="edit-button" data-id="${prof.id}" data-type="professor">تعديل</button>
                    <button type="button" class="delete-button" data-id="${prof.id}" data-type="professor">حذف</button>
                </div>
            `;
            professorList.appendChild(li);
        });
        attachEditDeleteListeners(professorList);
    }

    // Populate Course List and Professor Select
    const courseList = document.getElementById('courseList');
    if (courseList) {
        courseList.innerHTML = '';
        universityData.courses.forEach(course => {
            const preferredProf = universityData.professors.find(p => p.id === course.preferredProfessorId);
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${course.name} (${course.sections} شعب) - ${preferredProf ? preferredProf.name : 'لا يوجد مدرس مفضل'}</span>
                <div class="actions">
                    <button type="button" class="edit-button" data-id="${course.id}" data-type="course">تعديل</button>
                    <button type="button" class="delete-button" data-id="${course.id}" data-type="course">حذف</button>
                </div>
            `;
            courseList.appendChild(li);
        });
        attachEditDeleteListeners(courseList);
        populateCoursePreferredProfessorSelect();
    }

    // Populate Classroom List
    const classroomList = document.getElementById('classroomList');
    if (classroomList) {
        classroomList.innerHTML = '';
        universityData.classrooms.forEach(room => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${room.name} (السعة: ${room.capacity}, النوع: ${room.type})</span>
                <div class="actions">
                    <button type="button" class="edit-button" data-id="${room.id}" data-type="classroom">تعديل</button>
                    <button type="button" class="delete-button" data-id="${room.id}" data-type="classroom">حذف</button>
                </div>
            `;
            classroomList.appendChild(li);
        });
        attachEditDeleteListeners(classroomList);
    }
}

/**
 * Populates the "Preferred Professor" dropdown in the course form.
 */
function populateCoursePreferredProfessorSelect() {
    const select = document.getElementById('coursePreferredProfessor');
    if (!select) return;

    select.innerHTML = '<option value="">لا يوجد تفضيل</option>';
    universityData.professors.forEach(prof => {
        const option = document.createElement('option');
        option.value = prof.id;
        option.textContent = prof.name;
        select.appendChild(option);
    });
}

/**
 * Attaches event listeners for edit and delete buttons in data lists.
 * @param {HTMLElement} listElement - The UL element containing the list items.
 */
function attachEditDeleteListeners(listElement) {
    listElement.querySelectorAll('.edit-button').forEach(button => {
        button.onclick = () => editEntry(button.dataset.id, button.dataset.type);
    });
    listElement.querySelectorAll('.delete-button').forEach(button => {
        button.onclick = () => deleteEntry(button.dataset.id, button.dataset.type);
    });
}

/**
 * Loads general settings into the form and updates global settings.
 */
async function loadGeneralSettings() {
    const form = document.getElementById('generalSettingsForm');
    if (!form) return;

    const settings = universityData.generalSettings;
    if (settings) {
        document.getElementById('dailyStartTime').value = settings.dailyStartTime;
        document.getElementById('dailyEndTime').value = settings.dailyEndTime;
        document.getElementById('lectureDurationUnit').value = settings.lectureDurationUnit;
        document.getElementById('breakDuration').value = settings.breakDuration;

        document.querySelectorAll('input[name="workingDay"]').forEach(checkbox => {
            checkbox.checked = settings.workingDays.includes(checkbox.value);
        });
    }
}

// --- Handlers for Form Submissions ---

async function handleProfessorSubmit(event) {
    event.preventDefault();
    const id = document.getElementById('professorId').value;
    const name = document.getElementById('professorName').value;
    const maxHours = parseInt(document.getElementById('professorMaxHours').value);
    const prefTime = document.getElementById('professorPrefTime').value;
    const unavailableDays = Array.from(document.querySelectorAll('input[name="professorUnavailableDay"]:checked')).map(cb => cb.value);

    if (!name || isNaN(maxHours) || maxHours <= 0) {
        showStatusMessage('يرجى إدخال اسم المدرس والحد الأقصى لساعات التدريس بشكل صحيح.', 'error');
        return;
    }

    let professor = { name, maxHours, prefTime, unavailableDays };

    try {
        if (id) {
            professor.id = parseInt(id);
            await updateData('professors', professor);
            universityData.professors = universityData.professors.map(p => p.id === professor.id ? professor : p);
            showStatusMessage('تم تحديث بيانات المدرس بنجاح.', 'success');
        } else {
            const newId = await addData('professors', professor);
            professor.id = newId;
            universityData.professors.push(professor);
            showStatusMessage('تم إضافة المدرس بنجاح.', 'success');
        }
        resetForm(event.target);
        populateFormsAndLists(); // Refresh lists and selects
    } catch (e) {
        showStatusMessage('حدث خطأ أثناء حفظ بيانات المدرس.', 'error');
        console.error('Error saving professor:', e);
    }
}

async function handleCourseSubmit(event) {
    event.preventDefault();
    const id = document.getElementById('courseId').value;
    const name = document.getElementById('courseName').value;
    const code = document.getElementById('courseCode').value;
    const sections = parseInt(document.getElementById('courseSections').value);
    const duration = parseInt(document.getElementById('courseDuration').value);
    const lecturesPerWeek = parseInt(document.getElementById('courseLecturesPerWeek').value);
    const preferredProfessorId = parseInt(document.getElementById('coursePreferredProfessor').value) || null; // Use null if no selection
    const requiredRoomType = document.getElementById('courseRequiredRoomType').value;

    if (!name || isNaN(sections) || sections <= 0 || isNaN(duration) || duration <= 0 || isNaN(lecturesPerWeek) || lecturesPerWeek <= 0) {
        showStatusMessage('يرجى إدخال جميع بيانات المقرر بشكل صحيح (الاسم، عدد الشعب، المدة، عدد المحاضرات).', 'error');
        return;
    }

    let course = { name, code, sections, duration, lecturesPerWeek, preferredProfessorId, requiredRoomType };

    try {
        if (id) {
            course.id = parseInt(id);
            await updateData('courses', course);
            universityData.courses = universityData.courses.map(c => c.id === course.id ? course : c);
            showStatusMessage('تم تحديث بيانات المقرر بنجاح.', 'success');
        } else {
            const newId = await addData('courses', course);
            course.id = newId;
            universityData.courses.push(course);
            showStatusMessage('تم إضافة المقرر بنجاح.', 'success');
        }
        resetForm(event.target);
        populateFormsAndLists();
    } catch (e) {
        showStatusMessage('حدث خطأ أثناء حفظ بيانات المقرر.', 'error');
        console.error('Error saving course:', e);
    }
}

async function handleClassroomSubmit(event) {
    event.preventDefault();
    const id = document.getElementById('classroomId').value;
    const name = document.getElementById('classroomName').value;
    const capacity = parseInt(document.getElementById('classroomCapacity').value);
    const type = document.getElementById('classroomType').value;
    const unavailableDays = Array.from(document.querySelectorAll('input[name="classroomUnavailableDay"]:checked')).map(cb => cb.value);


    if (!name || isNaN(capacity) || capacity <= 0) {
        showStatusMessage('يرجى إدخال اسم الغرفة وسعتها بشكل صحيح.', 'error');
        return;
    }

    let classroom = { name, capacity, type, unavailableDays };

    try {
        if (id) {
            classroom.id = parseInt(id);
            await updateData('classrooms', classroom);
            universityData.classrooms = universityData.classrooms.map(r => r.id === classroom.id ? classroom : r);
            showStatusMessage('تم تحديث بيانات الغرفة الدراسية بنجاح.', 'success');
        } else {
            const newId = await addData('classrooms', classroom);
            classroom.id = newId;
            universityData.classrooms.push(classroom);
            showStatusMessage('تم إضافة الغرفة الدراسية بنجاح.', 'success');
        }
        resetForm(event.target);
        populateFormsAndLists();
    } catch (e) {
        showStatusMessage('حدث خطأ أثناء حفظ بيانات الغرفة الدراسية.', 'error');
        console.error('Error saving classroom:', e);
    }
}

async function handleGeneralSettingsSubmit(event) {
    event.preventDefault();

    const dailyStartTime = document.getElementById('dailyStartTime').value;
    const dailyEndTime = document.getElementById('dailyEndTime').value;
    const lectureDurationUnit = parseInt(document.getElementById('lectureDurationUnit').value);
    const breakDuration = parseInt(document.getElementById('breakDuration').value);
    const workingDays = Array.from(document.querySelectorAll('input[name="workingDay"]:checked')).map(cb => cb.value);

    if (!dailyStartTime || !dailyEndTime || isNaN(lectureDurationUnit) || lectureDurationUnit <= 0 || isNaN(breakDuration) || breakDuration < 0 || workingDays.length === 0) {
        showStatusMessage('يرجى إدخال جميع الإعدادات العامة بشكل صحيح.', 'error');
        return;
    }

    // A simple ID for the single general settings object
    const settingsId = 1;

    const newSettings = {
        id: settingsId, // Important for IndexedDB update
        dailyStartTime,
        dailyEndTime,
        lectureDurationUnit,
        breakDuration,
        workingDays
    };

    try {
        // Update global in-memory object
        universityData.generalSettings = newSettings;
        // Persist to IndexedDB
        await updateData('generalSettings', newSettings); // Using put() to update or add
        showStatusMessage('تم حفظ الإعدادات العامة بنجاح.', 'success');
        console.log('General settings saved:', newSettings);
    } catch (e) {
        showStatusMessage('حدث خطأ أثناء حفظ الإعدادات العامة.', 'error');
        console.error('Error saving general settings:', e);
    }
}

// --- Edit & Delete Functions ---

async function editEntry(id, type) {
    const parsedId = parseInt(id);
    let item;
    let form;

    if (type === 'professor') {
        item = universityData.professors.find(p => p.id === parsedId);
        form = document.getElementById('professorForm');
        document.getElementById('professorId').value = item.id;
        document.getElementById('professorName').value = item.name;
        document.getElementById('professorMaxHours').value = item.maxHours;
        document.getElementById('professorPrefTime').value = item.prefTime;
        document.querySelectorAll('input[name="professorUnavailableDay"]').forEach(cb => {
            cb.checked = item.unavailableDays.includes(cb.value);
        });
    } else if (type === 'course') {
        item = universityData.courses.find(c => c.id === parsedId);
        form = document.getElementById('courseForm');
        document.getElementById('courseId').value = item.id;
        document.getElementById('courseName').value = item.name;
        document.getElementById('courseCode').value = item.code || '';
        document.getElementById('courseSections').value = item.sections;
        document.getElementById('courseDuration').value = item.duration;
        document.getElementById('courseLecturesPerWeek').value = item.lecturesPerWeek;
        document.getElementById('courseRequiredRoomType').value = item.requiredRoomType;
        // Ensure professors are loaded before setting value
        await populateCoursePreferredProfessorSelect();
        document.getElementById('coursePreferredProfessor').value = item.preferredProfessorId || '';
    } else if (type === 'classroom') {
        item = universityData.classrooms.find(r => r.id === parsedId);
        form = document.getElementById('classroomForm');
        document.getElementById('classroomId').value = item.id;
        document.getElementById('classroomName').value = item.name;
        document.getElementById('classroomCapacity').value = item.capacity;
        document.getElementById('classroomType').value = item.type;
        document.querySelectorAll('input[name="classroomUnavailableDay"]').forEach(cb => {
            cb.checked = item.unavailableDays.includes(cb.value);
        });
    }

    if (item && form) {
        showStatusMessage(`جاري تعديل بيانات ${item.name}.`, 'info');
        // Switch to the correct tab if not already active
        const tabButton = document.querySelector(`.tab-button[data-tab="${type}s"]`);
        if (tabButton && !tabButton.classList.contains('active')) {
             tabButton.click();
        }
    } else {
        showStatusMessage('لم يتم العثور على البيانات للتعديل.', 'error');
        console.error(`Item not found for editing: ID ${id}, Type ${type}`);
    }
}

async function deleteEntry(id, type) {
    if (!confirm('هل أنت متأكد أنك تريد حذف هذا العنصر؟ قد يؤثر هذا على الجداول المولدة.')) {
        return;
    }

    const parsedId = parseInt(id);
    try {
        await deleteData(type + 's', parsedId); // 'professors', 'courses', etc.

        // Update in-memory data
        if (type === 'professor') {
            universityData.professors = universityData.professors.filter(p => p.id !== parsedId);
        } else if (type === 'course') {
            universityData.courses = universityData.courses.filter(c => c.id !== parsedId);
        } else if (type === 'classroom') {
            universityData.classrooms = universityData.classrooms.filter(r => r.id !== parsedId);
        }
        showStatusMessage('تم الحذف بنجاح.', 'success');
        populateFormsAndLists(); // Refresh the display
    } catch (e) {
        showStatusMessage('حدث خطأ أثناء الحذف.', 'error');
        console.error('Error deleting entry:', e);
    }
}

// Expose populateFormsAndLists to global scope
window.populateFormsAndLists = populateFormsAndLists;
window.loadGeneralSettings = loadGeneralSettings;

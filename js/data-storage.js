// js/data-storage.js
// Handles all interactions with IndexedDB for persistent storage.

const DB_NAME = 'UniversityScheduleDB';
const DB_VERSION = 1;
const STORES = ['professors', 'courses', 'classrooms', 'generalSettings', 'generatedSchedules'];

let db;

/**
 * Opens the IndexedDB database and sets up object stores if needed.
 * @returns {Promise<IDBDatabase>} A promise that resolves with the database object.
 */
function openDB() {
    return new Promise((resolve, reject) => {
        if (db) { // If DB is already open, return it
            resolve(db);
            return;
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const tempDb = event.target.result;
            STORES.forEach(storeName => {
                if (!tempDb.objectStoreNames.contains(storeName)) {
                    tempDb.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
                }
            });
            console.log('IndexedDB upgrade needed and complete.');
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            console.log('IndexedDB opened successfully.');
            resolve(db);
        };

        request.onerror = (event) => {
            console.error('IndexedDB error:', event.target.errorCode, event.target.error);
            reject(event.target.error);
        };
    });
}

/**
 * Adds data to an IndexedDB object store.
 * @param {string} storeName - The name of the object store.
 * @param {object} data - The data object to add. Must have an 'id' if not autoIncrement.
 * @returns {Promise<number>} A promise that resolves with the ID of the added object.
 */
async function addData(storeName, data) {
    const database = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.add(data);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => {
            console.error(`Error adding data to ${storeName}:`, request.error);
            reject(request.error);
        };
    });
}

/**
 * Retrieves all data from an IndexedDB object store.
 * @param {string} storeName - The name of the object store.
 * @returns {Promise<Array<object>>} A promise that resolves with an array of all objects.
 */
async function getAllData(storeName) {
    const database = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => {
            console.error(`Error getting all data from ${storeName}:`, request.error);
            reject(request.error);
        };
    });
}

/**
 * Updates data in an IndexedDB object store.
 * @param {string} storeName - The name of the object store.
 * @param {object} data - The data object to update (must contain the 'id').
 * @returns {Promise<object>} A promise that resolves with the updated object.
 */
async function updateData(storeName, data) {
    const database = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(data); // put() is used for both add and update (if key exists)

        request.onsuccess = () => resolve(data);
        request.onerror = () => {
            console.error(`Error updating data in ${storeName}:`, request.error);
            reject(request.error);
        };
    });
}

/**
 * Deletes data from an IndexedDB object store by ID.
 * @param {string} storeName - The name of the object store.
 * @param {number} id - The ID of the object to delete.
 * @returns {Promise<void>} A promise that resolves when the deletion is complete.
 */
async function deleteData(storeName, id) {
    const database = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => {
            console.error(`Error deleting data from ${storeName}:`, request.error);
            reject(request.error);
        };
    });
}

/**
 * Clears all data from a specified IndexedDB object store.
 * @param {string} storeName - The name of the object store to clear.
 * @returns {Promise<void>} A promise that resolves when the store is cleared.
 */
async function clearStore(storeName) {
    const database = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => {
            console.error(`Error clearing store ${storeName}:`, request.error);
            reject(request.error);
        };
    });
}

/**
 * Loads all data from IndexedDB into the global universityData object.
 * This should be called on application startup or page load.
 */
async function loadAllData() {
    try {
        await openDB(); // Ensure DB is open first

        universityData.professors = await getAllData('professors');
        universityData.courses = await getAllData('courses');
        universityData.classrooms = await getAllData('classrooms');
        universityData.generatedSchedules = await getAllData('generatedSchedules');

        const settings = await getAllData('generalSettings');
        if (settings.length > 0) {
            // Assuming only one settings object, take the first one
            universityData.generalSettings = settings[0];
        }

        console.log('All data loaded from IndexedDB:', universityData);
    } catch (error) {
        console.error('Failed to load all data from IndexedDB:', error);
        showStatusMessage('فشل تحميل البيانات من قاعدة البيانات المحلية.', 'error');
    }
}

// Expose functions globally for use in other JS files
window.addData = addData;
window.getAllData = getAllData;
window.updateData = updateData;
window.deleteData = deleteData;
window.clearStore = clearStore;
window.loadAllData = loadAllData;

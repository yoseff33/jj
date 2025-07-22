// js/utils.js
// Contains helper functions for printing, image export, etc.

/**
 * Attaches event listeners to print and download buttons on the schedule page.
 */
function attachScheduleActionListeners() {
    document.querySelectorAll('.print-schedule-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const targetSelector = event.target.dataset.printTarget;
            const targetElement = event.target.closest('.schedule-table-wrapper'); // Find the parent wrapper
            if (targetElement) {
                printElement(targetElement);
            } else {
                console.error('Print target element not found:', targetSelector);
                showStatusMessage('لا يمكن العثور على العنصر لطباعته.', 'error');
            }
        });
    });

    document.querySelectorAll('.download-image-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const targetSelector = event.target.dataset.downloadTarget;
            const targetElement = event.target.closest('.schedule-table-wrapper'); // Find the parent wrapper
            if (targetElement) {
                downloadElementAsImage(targetElement, 'جدول_جامعي.png');
            } else {
                console.error('Download target element not found:', targetSelector);
                showStatusMessage('لا يمكن العثور على العنصر لتصديره كصورة.', 'error');
            }
        });
    });
}

/**
 * Prints a specific HTML element.
 * @param {HTMLElement} element - The HTML element to print.
 */
function printElement(element) {
    const originalContent = document.body.innerHTML;
    const printContent = element.outerHTML;

    document.body.innerHTML = printContent;
    document.body.classList.add('print-mode'); // Add a class for print-specific CSS

    window.print();

    // Restore original content after printing
    document.body.innerHTML = originalContent;
    document.body.classList.remove('print-mode');
    // Re-attach event listeners on the restored DOM (crucial for single-page apps)
    if (window.location.pathname.endsWith('schedule.html')) {
        loadAllData().then(() => {
            loadGeneralSettings().then(() => {
                populateScheduleFilters().then(() => {
                    displaySchedules();
                });
            });
        });
    }
    showStatusMessage('تم إرسال الجدول إلى الطابعة.', 'info');
}

/**
 * Downloads a specific HTML element as an image (PNG).
 * Requires the html2canvas library. You'll need to include it in your HTML:
 * `<script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>`
 *
 * @param {HTMLElement} element - The HTML element to capture.
 * @param {string} filename - The desired filename for the downloaded image.
 */
function downloadElementAsImage(element, filename) {
    if (typeof html2canvas === 'undefined') {
        showStatusMessage('مكتبة html2canvas غير محملة. لا يمكن تصدير الصور. يرجى التأكد من إضافة السكربت في رأس الصفحة.', 'error', 'scheduleOutput', 8000);
        console.error('html2canvas library is not loaded. Cannot download as image.');
        return;
    }

    showStatusMessage('جاري إنشاء الصورة... قد يستغرق الأمر بعض الوقت.', 'info', 'scheduleOutput');

    html2canvas(element, {
        scale: 2, // Increase scale for better resolution
        logging: false,
        useCORS: true // Important if you have external resources (though shouldn't for this project)
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link); // Append to body to make it clickable
        link.click();
        document.body.removeChild(link); // Remove after click
        showStatusMessage('تم تحميل الصورة بنجاح.', 'success');
    }).catch(error => {
        console.error('Error generating image:', error);
        showStatusMessage('فشل في توليد الصورة. يرجى المحاولة مرة أخرى.', 'error');
    });
}

// Expose functions to the global scope
window.printElement = printElement;
window.downloadElementAsImage = downloadElementAsImage;
window.attachScheduleActionListeners = attachScheduleActionListeners;

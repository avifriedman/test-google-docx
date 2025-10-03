document.addEventListener('DOMContentLoaded', () => {

    /**
     * פונקציה לעדכון השעון הדיגיטלי
     */
    const updateClock = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        document.getElementById('current-time').textContent = `${hours}:${minutes}:${seconds}`;
    };

    /**
     * פונקציה ראשית לטעינת והצגת זמני התפילות
     */
    const loadAndDisplayPrayerTimes = async () => {
        const tableBody = document.getElementById('prayers-table').querySelector('tbody');
        const url = config.googleSheetUrl;

        // בדיקה אם הקישור הוגדר
        if (!url || url === "הדבק כאן את הקישור שלך") {
            tableBody.innerHTML = '<tr><td colspan="2">שגיאה: יש להגדיר את הקישור לגוגל שיטס בקובץ config.js</td></tr>';
            return;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('בעיה בגישה לקובץ הנתונים.');
            }
            
            const csvText = await response.text();
            const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
            
            if (lines.length <= 1) { // רק כותרות או ריק
                tableBody.innerHTML = '<tr><td colspan="2">אין זמנים להצגה. יש למלא את קובץ הגוגל שיטס.</td></tr>';
                return;
            }

            // ניקוי הטבלה לפני הוספת נתונים חדשים
            tableBody.innerHTML = '';

            // דילוג על שורת הכותרת (lines[0])
            for (let i = 1; i < lines.length; i++) {
                const [name, time] = lines[i].split(',');

                if (name && time) {
                    const row = document.createElement('tr');
                    const nameCell = document.createElement('td');
                    const timeCell = document.createElement('td');

                    nameCell.textContent = name.trim();
                    timeCell.textContent = time.trim();

                    row.appendChild(nameCell);
                    row.appendChild(timeCell);
                    tableBody.appendChild(row);
                }
            }

        } catch (error) {
            console.error('Error fetching or parsing data:', error);
            tableBody.innerHTML = `<tr><td colspan="2">שגיאה בטעינת הנתונים. בדוק את הקישור והחיבור לאינטרנט.</td></tr>`;
        }
    };

    // הרצת הפונקציות
    document.getElementById('synagogue-name').textContent = config.synagogueName;
    updateClock();
    setInterval(updateClock, 1000); // עדכון השעון כל שנייה

    loadAndDisplayPrayerTimes();
    setInterval(loadAndDisplayPrayerTimes, 60000); // רענון הנתונים מהגוגל שיטס כל דקה
});
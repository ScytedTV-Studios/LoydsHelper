const axios = require('axios');

async function createBackupIfNeeded() {
    try {
        const response = await axios.get('http://localhost:8000/seaside/data/online.json');
        const data = response.data;

        if (Array.isArray(data) && data.length > 0) {
            try {
                createBackup();
            } catch (backupError) {
                console.error('Error running createBackup:', backupError.message);
            }
        } else {
            // console.log('No contents in online.json. Skipping createBackup.');
        }
    } catch (error) {
        console.error('Error fetching online.json:', error.message);
    }
}

createBackupIfNeeded();
setInterval(createBackupIfNeeded, 1200000);
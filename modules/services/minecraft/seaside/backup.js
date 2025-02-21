const axios = require('axios');

async function createBackupIfNeeded() {
    try {
        const response = await axios.get('http://localhost:8000/seaside/data/online.json');
        const data = response.data;

        if (Array.isArray(data) && data.length > 0) {
            // console.log('Contents detected in online.json. Running createBackup...');
            createBackup();
        } else {
            // console.log('No contents in online.json. Skipping createBackup.');
        }
    } catch (error) {
        console.error('Error fetching online.json:', error.message);
    }
}

createBackupIfNeeded();
setInterval(createBackupIfNeeded, 1200000);
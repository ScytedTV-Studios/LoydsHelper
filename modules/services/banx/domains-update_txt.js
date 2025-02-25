const fs = require('fs');
const https = require('https');
const path = 'E:\\DiscordBots\\BanTwitter\\DOMAINS_SCAMS.txt';
const url = 'https://raw.githubusercontent.com/jarelllama/Scam-Blocklist/main/lists/wildcard_domains/scams.txt';

async function updateFile() {
    https.get(url, (res) => {
        let data = '';

        if (res.statusCode !== 200) {
            console.error(`Failed to fetch file. Status Code: ${res.statusCode}`);
            return;
        }

        res.on('data', chunk => data += chunk);
        res.on('end', () => {

            const cleanedData = data.split('\n').filter(line => !line.startsWith('#')).join('\n');
            
            fs.writeFile(path, cleanedData, 'utf8', (err) => {
                if (err) console.error('Error writing file:', err);
                else console.log('File updated successfully.');
            });
        });
    }).on('error', (err) => {
        console.error('Error fetching file:', err);
    });
}

updateFile();
setInterval(updateFile, 60 * 60 * 1000);
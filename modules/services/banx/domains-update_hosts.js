const fs = require('fs');
const https = require('https');

const sources = [
    { url: 'https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/fakenews-only/hosts', path: 'E:\\DiscordBots\\BanTwitter\\DOMAINS_FAKENEWS.txt' },
    { url: 'https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/gambling-only/hosts', path: 'E:\\DiscordBots\\BanTwitter\\DOMAINS_GAMBLING.txt' },
    { url: 'https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/porn-only/hosts', path: 'E:\\DiscordBots\\BanTwitter\\DOMAINS_NSFW.txt' },
    { url: 'https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/social-only/hosts', path: 'E:\\DiscordBots\\BanTwitter\\DOMAINS_SOCIAL.txt' }
];

function fetchAndCleanFile(url, filePath) {
    https.get(url, (res) => {
        let data = '';

        if (res.statusCode !== 200) {
            console.error(`Failed to fetch ${url}. Status Code: ${res.statusCode}`);
            return;
        }

        res.on('data', chunk => data += chunk);
        res.on('end', () => {

            const cleanedData = data
                .split('\n')
                .map(line => line.trim())
                .filter(line => line && !line.startsWith('#'))
                .map(line => line.replace(/^0\.0\.0\.0\s+/, ''))
                .join('\n');

            fs.writeFile(filePath, cleanedData, 'utf8', (err) => {
                if (err) console.error(`Error writing to ${filePath}:`, err);
                // else console.log(`Updated ${filePath}`);
            });
        });
    }).on('error', (err) => {
        console.error(`Error fetching ${url}:`, err);
    });
}

function updateAllFiles() {
    sources.forEach(({ url, path }) => fetchAndCleanFile(url, path));
}

updateAllFiles();
setInterval(updateAllFiles, 60 * 60 * 1000);
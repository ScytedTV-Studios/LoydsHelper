require('dotenv').config();
const axios = require('axios');

async function updateData() {
    try {
        const apiToken = process.env.SCYTEDTV_API;
        if (!apiToken) {
            console.error('[ERROR] SCYTEDTV_API token is missing in .env file.');
            return;
        }

        const headers = {
            Authorization: `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
        };

        const [tagsResponse, discordResponse] = await Promise.allSettled([
            axios.get('https://api.scyted.tv/v2/seaside/data/tags', { headers }),
            axios.get('https://api.scyted.tv/v2/seaside/connect/discord', { headers }),
        ]);

        if (tagsResponse.status === "rejected") {
            console.error("[ERROR] Failed to fetch tags:", tagsResponse.reason?.response?.data || tagsResponse.reason?.message);
            return;
        }
        if (discordResponse.status === "rejected") {
            console.error("[ERROR] Failed to fetch Discord data:", discordResponse.reason?.response?.data || discordResponse.reason?.message);
            return;
        }

        const tagsData = tagsResponse.value.data;
        const discordData = discordResponse.value.data;

        const tagUpdates = Object.entries(tagsData).map(async ([name, value]) => {
            try {
                await axios.post(`https://api.scyted.tv/v2/seaside/data/tags/${name}`, { [name]: value }, { headers });
                console.log(`[SUCCESS] Updated tags for: ${name}`);
            } catch (error) {
                console.error(`[ERROR] Failed to update tag ${name}:`, error.response?.data || error.message);
            }
        });

        const discordUpdates = Object.entries(discordData).map(async ([name, value]) => {
            try {
                await axios.post(`https://api.scyted.tv/v2/seaside/connect/discord/${name}`, { [name]: value }, { headers });
                console.log(`[SUCCESS] Updated Discord data for: ${name}`);
            } catch (error) {
                console.error(`[ERROR] Failed to update Discord data ${name}:`, error.response?.data || error.message);
            }
        });

        await Promise.allSettled([...tagUpdates, ...discordUpdates]);

    } catch (error) {
        console.error('[ERROR] Unexpected error updating data:', error.message);
    }
}

updateData();
setInterval(updateData, 20000);
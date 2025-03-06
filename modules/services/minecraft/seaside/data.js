require('dotenv').config();
const axios = require('axios');

async function updateData() {
    try {
        const apiToken = process.env.SCYTEDTV_API;
        if (!apiToken) {
            console.error('SCYTEDTV_API token is missing in .env file.');
            return;
        }

        const headers = {
            Authorization: `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
        };

        const tagsResponse = await axios.get('https://api.scyted.tv/v2/seaside/data/tags', { headers });
        const tagsData = tagsResponse.data;

        const discordResponse = await axios.get('https://api.scyted.tv/v2/seaside/connect/discord', { headers });
        const discordData = discordResponse.data;

        for (const name in tagsData) {
            if (tagsData.hasOwnProperty(name)) {
                const tagPayload = { [name]: tagsData[name] };

                await axios.post(`https://api.scyted.tv/v2/seaside/data/tags/${name}`, tagPayload, { headers });
                // console.log(`Updated tags for: ${name}`);
            }
        }

        for (const name in discordData) {
            if (discordData.hasOwnProperty(name)) {
                const discordPayload = { [name]: discordData[name] };

                await axios.post(`https://api.scyted.tv/v2/seaside/connect/discord/${name}`, discordPayload, { headers });
                // console.log(`Updated Discord data for: ${name}`);
            }
        }
    } catch (error) {
        console.error('Error updating data:', error.response ? error.response.data : error.message);
    }
}

updateData();
setInterval(updateData, 20000);
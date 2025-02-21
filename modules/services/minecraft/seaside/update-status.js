const axios = require('axios');

async function updateServerStatus() {
    const STATUS_CHANNEL_ID = '1324833840254029956';
    const PLAYERS_CHANNEL_ID = '1324833840254029957';
    const API_URL = 'https://api.mcstatus.io/v2/status/bedrock/147.185.221.16:45366';
    try {
        const response = await axios.get(API_URL);
        const isOnline = response.data.online;
        const playersOnline = isOnline && response.data.players ? response.data.players.online : 0;
        const playersMax = isOnline && response.data.players ? response.data.players.max : 0;

        const statusChannel = await client.channels.fetch(STATUS_CHANNEL_ID);
        const playersChannel = await client.channels.fetch(PLAYERS_CHANNEL_ID);

        if (statusChannel && statusChannel.isVoiceBased()) {
            const currentStatusName = statusChannel.name;
            const onlineName = 'Status: Online 🟢';
            const offlineName = 'Status: Offline 🔴';

            if (isOnline && currentStatusName !== onlineName) {
                await statusChannel.setName(onlineName);
                // console.log('Status updated to: Online 🟢');
            } else if (!isOnline && currentStatusName !== offlineName) {
                await statusChannel.setName(offlineName);
                // console.log('Status updated to: Offline 🔴');
            } else {
                // console.log('No update needed for status channel.');
            }
        } else {
            console.error('Status channel not found or is not a voice channel.');
        }

        if (playersChannel && playersChannel.isVoiceBased()) {
            const currentPlayersName = playersChannel.name;
            const playersName = `Players: ${playersOnline}/${playersMax}`;

            if (currentPlayersName !== playersName) {
                await playersChannel.setName(playersName);
                // console.log(`Players updated to: ${playersName}`);
            } else {
                // console.log('No update needed for players channel.');
            }
        } else {
            console.error('Players channel not found or is not a voice channel.');
        }
    } catch (error) {
        console.error('Error fetching server status:', error.message);
    }
}

setInterval(updateServerStatus, 10 * 1000);
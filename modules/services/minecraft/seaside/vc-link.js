require("dotenv").config();
const fs = require("fs");
const { ChannelType, PermissionsBitField } = require("discord.js");
const axios = require('axios');

const VC_VOICE_CHANNEL_ID = "1324833840463609917";
const VC_CATEGORY_ACTIVE_ID = "1324833840463609915";
const VC_CATEGORY_ARCHIVE_ID = "1324833841738940489";
const VC_MAX_CHANNELS = 30;
const VC_COOLDOWN_TIME_MS = 3 * 60 * 1000;
const VC_CHECK_INTERVAL_MS = 5000;
const VC_VOICE_CHANNELS_FILE = './config/seasideVoiceChannels.json';
const VC_USER_COOLDOWN_MS = 3000;
const userCooldowns = new Map();
const recentJoins = new Set();

async function fetchJsonVc(url) {
    try {
        const response = await fetch(url);
        return response.json();
    } catch (error) {
        console.error('Error:', error);
    }
}

function saveVoiceChannels(data) {
    try {
        fs.writeFileSync(VC_VOICE_CHANNELS_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

function loadVoiceChannels() {
    try {
        if (!fs.existsSync(VC_VOICE_CHANNELS_FILE)) {
            saveVoiceChannels([]);
        }
        return JSON.parse(fs.readFileSync(VC_VOICE_CHANNELS_FILE));
    } catch (error) {
        console.error('Error:', error);
    }
}

async function handleUserJoin(member) {
    try {
        if (recentJoins.has(member.id)) {
            return;
        }

        if (userCooldowns.has(member.id) && Date.now() < userCooldowns.get(member.id)) {
            return;
        }

        const discordData = await fetchJsonVc('http://localhost:8000/seaside/connect/discord.json');
        const onlineUsers = await fetchJsonVc('http://localhost:8000/seaside/data/online.json');
        const partyData = await fetchJsonVc('http://localhost:8000/seaside/scoreboards/party.json');

        const userId = member.id;
        const userEntry = Object.values(discordData).find(entry => entry.userId === userId);

        if (!userEntry || !onlineUsers.includes(userEntry.username)) {
            await member.voice.setDeaf(true);
            return;
        }

        // await member.voice.setDeaf(false);
        const username = userEntry.username;
        const partyId = partyData[username] || 0;

        if (partyId === 0) {
            return;
        }

        const voiceChannels = loadVoiceChannels();

        let channelData = voiceChannels.find(c => c.partyId === partyId && c.inUse);

        if (!channelData) {
            channelData = voiceChannels.find(c => !c.inUse && Date.now() > c.cooldownTime);

            if (!channelData) {
                if (voiceChannels.filter(c => c.inUse).length >= VC_MAX_CHANNELS) {
                    member.send("There are currently no voice channels available, please wait.");
                    return;
                }

                const guild = client.guilds.cache.get(process.env.SEASIDE_SERVER_ID);
                const newChannel = await guild.channels.create({
                    name: `🔊┃Party #${partyId}`,
                    type: ChannelType.GuildVoice,
                    parent: VC_CATEGORY_ACTIVE_ID,
                    permissionOverwrites: [
                        {
                            id: guild.roles.everyone.id,
                            deny: [PermissionsBitField.Flags.Connect],
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        },
                    ],
                });

                channelData = {
                    id: newChannel.id,
                    inUse: true,
                    partyId,
                    cooldownTime: 0,
                };

                voiceChannels.push(channelData);
                saveVoiceChannels(voiceChannels);
            } else {

                const channel = await client.channels.fetch(channelData.id);
                await channel.edit({
                    name: `🔊┃Party #${partyId}`,
                    parent: VC_CATEGORY_ACTIVE_ID,
                    permissionOverwrites: [
                        {
                            id: channel.guild.roles.everyone.id,
                            deny: [PermissionsBitField.Flags.Connect],
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        },
                    ],
                });
                channelData.inUse = true;
                channelData.partyId = partyId;
                saveVoiceChannels(voiceChannels);
            }
        }

        const voiceChannel = await client.channels.fetch(channelData.id);
        await member.voice.setChannel(voiceChannel);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function checkVoiceChannelUsers() {
    try {
        const guild = client.guilds.cache.get(process.env.SEASIDE_SERVER_ID);
        const stagingChannel = await guild.channels.fetch(VC_VOICE_CHANNEL_ID);
        const members = stagingChannel.members;
        const discordData = await fetchJsonVc('http://localhost:8000/seaside/connect/discord.json');
        const onlineUsers = await fetchJsonVc('http://localhost:8000/seaside/data/online.json');
        const partyData = await fetchJsonVc('http://localhost:8000/seaside/scoreboards/party.json');

        members.forEach(async member => {
            if (recentJoins.has(member.id)) {
                return;
            }
            await handleUserJoin(member);
        });

        const voiceChannels = loadVoiceChannels();
        for (const channelData of voiceChannels) {
            if (channelData.inUse) {
                const channel = await client.channels.fetch(channelData.id);
                for (const [memberId, member] of channel.members) {
                    const userEntry = Object.values(discordData).find(entry => entry.userId === memberId);
                    if (!userEntry) {
                        await moveToStagingChannel(member);
                        continue;
                    }
                    const username = userEntry.username;
                    const currentPartyId = partyData[username] || 0;
                    if (currentPartyId !== channelData.partyId) {
                        await moveToStagingChannel(member);
                    }
                }
            }
        }
        saveVoiceChannels(voiceChannels);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function moveToStagingChannel(member) {
    try {
        if (userCooldowns.has(member.id) && Date.now() < userCooldowns.get(member.id)) {
            return;
        }
        await member.voice.setChannel(VC_VOICE_CHANNEL_ID);
        // await member.voice.setDeaf(true);
        userCooldowns.set(member.id, Date.now() + VC_USER_COOLDOWN_MS);
        recentJoins.add(member.id);
        setTimeout(() => recentJoins.delete(member.id), VC_USER_COOLDOWN_MS);
    } catch (error) {
        console.error('Error:', error);
    }
}

client.on('voiceStateUpdate', async (oldState, newState) => {
    try {
        if (newState.channelId === VC_VOICE_CHANNEL_ID) {
            recentJoins.add(newState.member.id);
            setTimeout(() => recentJoins.delete(newState.member.id), VC_USER_COOLDOWN_MS);
            await handleUserJoin(newState.member);
        }

        const voiceChannels = loadVoiceChannels();
        for (const channelData of voiceChannels) {
            if (channelData.inUse) {
                const channel = await client.channels.fetch(channelData.id);
                if (channel.members.size === 0) {
                    await channel.edit({
                        parent: VC_CATEGORY_ARCHIVE_ID,
                        permissionOverwrites: [{
                            id: channel.guild.roles.everyone.id,
                            deny: [PermissionsBitField.Flags.ViewChannel],
                        }],
                    });
                    channelData.inUse = false;
                    channelData.partyId = 0;
                    channelData.cooldownTime = Date.now() + VC_COOLDOWN_TIME_MS;
                }
            }
        }
        saveVoiceChannels(voiceChannels);
    } catch (error) {
        console.error('Error:', error);
    }
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    try {
        const targetChannelId = "1324833840463609917";
        if (newState.channelId === targetChannelId) {
            if (!newState.member.voice.deaf) {
                try {
                    await newState.member.voice.setDeaf(true);
                    // console.log(`${newState.member.user.tag} has been deafened in the target channel.`);
                } catch (error) {
                    console.error(`Failed to deafen ${newState.member.user.tag}:`, error);
                }
            }
        } else {
            if (oldState.channelId === targetChannelId && newState.channelId !== targetChannelId) {
                if (newState.member.voice.deaf) {
                    try {
                        await newState.member.voice.setDeaf(false);
                        // console.log(`${newState.member.user.tag} has been undeafened.`);
                    } catch (error) {
                        console.error(`Failed to undeafen ${newState.member.user.tag}:`, error);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

async function resetInvalidParties() {
    try {
        const onlineUsers = await fetchJsonVc('http://localhost:8000/seaside/data/online.json');
        const partyData = await fetchJsonVc('http://localhost:8000/seaside/scoreboards/party.json');

        for (const [username, partyId] of Object.entries(partyData)) {
            if (partyId > 0 && !onlineUsers.includes(username)) {
                partyData[username] = 0;
            }
        }

        await fetch('http://localhost:8000/seaside/scoreboards/party.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(partyData, null, 2),
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

client.once('ready', async () => {
    const voiceChannels = loadVoiceChannels();
    voiceChannels.forEach(async channelData => {
        if (channelData.inUse) {
            const channel = await client.channels.fetch(channelData.id);
            for (const [memberId, member] of channel.members) {
                await moveToStagingChannel(member);
            }
            channelData.inUse = false;
            channelData.partyId = 0;
            channelData.cooldownTime = Date.now() + VC_COOLDOWN_TIME_MS;
        }
    });
    saveVoiceChannels(voiceChannels);

    setInterval(checkVoiceChannelUsers, VC_CHECK_INTERVAL_MS);
    setInterval(resetInvalidParties, VC_CHECK_INTERVAL_MS);

    try {
        const response = await axios.get('http://localhost:8000/seaside/scoreboards/party.json');
        const scoreboard = response.data;

        const updatedScoreboard = Object.fromEntries(
            Object.keys(scoreboard).map(key => [key, 0])
        );

        await axios.post('http://localhost:8000/seaside/scoreboards/party.json', updatedScoreboard, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // console.log('Scoreboard updated successfully!');
    } catch (error) {
        console.error('Error updating the scoreboard:', error);
    }

});
require("dotenv").config();
const { EmbedBuilder } = require("discord.js");
const axios = require("axios");

const SERVER_ID = "1237187833324638209";
const API_URL = `https://api.scyted.tv/v2/loydshelper/userinfo/statuses/${SERVER_ID}`;

const ROLES = {
    1: "1344817016149639208",
    2: "1344759285590134784",
    3: "1344757365802668195",
    4: "1344819923284660255",
    5: "1344819919669170337",
};

const ONLINE_THRESHOLDS = {
    1: 10800 * 1000,
    2: 43200 * 1000,
    3: 86400 * 1000,
    4: 259200 * 1000,
    5: 604800 * 1000,
};

const ANNOUNCE_CHANNEL_ID = "1344824659727614045";
let onlineUsers = {};

const getTimestamp = () => Math.floor(Date.now() / 1000);

async function fetchStatusCache() {
    try {
        const response = await axios.get(API_URL, {
            headers: { Authorization: `Bearer ${process.env.SCYTEDTV_API}` },
        });

        if (response.status === 200) {
            onlineUsers = response.data;
            return true;
        }
    } catch (error) {
        console.error("Error fetching status cache:", error.message);
    }
    return false;
}

async function updateStatus(userId, status) {
    const timestamp = status === "offline" ? null : getTimestamp();

    try {
        let updatedData = { ...onlineUsers, [userId]: { status, timestamp } };

        await axios.post(API_URL, updatedData, {
            headers: { Authorization: `Bearer ${process.env.SCYTEDTV_API}` },
        });

        onlineUsers = updatedData;
        return true;
    } catch (error) {
        console.error(`Failed to update status for ${userId}:`, error.message);
    }
    return false;
}

async function removeUserFromStatus(userId) {
    try {
        const { [userId]: removedUser, ...updatedData } = onlineUsers;

        await axios.post(API_URL, updatedData, {
            headers: { Authorization: `Bearer ${process.env.SCYTEDTV_API}` },
        });

        onlineUsers = updatedData;
        return true;
    } catch (error) {
        console.error(`Failed to remove ${userId} from status data:`, error.message);
    }
    return false;
}

async function updateRoles(member) {
    const userId = member.id;
    const guild = member.guild;
    const announceChannel = guild.channels.cache.get(ANNOUNCE_CHANNEL_ID);

    if (!onlineUsers[userId] || onlineUsers[userId].timestamp === null) {
        let highestBadge = null;

        for (const [tier, roleId] of Object.entries(ROLES)) {
            if (member.roles.cache.has(roleId)) {
                highestBadge = ROLES[tier];
                if (await removeUserFromStatus(userId)) {
                    await member.roles.remove(roleId).catch(console.error);
                } else {
                    return;
                }
            }
        }

        if (highestBadge && announceChannel) {
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setDescription(
                    `<:crossmark:1330976664535961753> <@${userId}> has lost the <@&${highestBadge}> badge.`
                );

            await announceChannel.send({ embeds: [embed] }).catch(console.error);
        }

        return;
    }

    const timeOnline = (getTimestamp() - onlineUsers[userId].timestamp) * 1000;
    let newlyAssignedBadge = null;

    for (const [tierStr, requiredTime] of Object.entries(ONLINE_THRESHOLDS)) {
        const tier = parseInt(tierStr);
        const roleId = ROLES[tier];

        if (!roleId) continue;

        if (timeOnline >= requiredTime) {
            if (!member.roles.cache.has(roleId)) {
                if (await updateStatus(userId, "online")) {
                    await member.roles.add(roleId).catch(console.error);
                    newlyAssignedBadge = tier;
                } else {
                    return;
                }
            }
        } else {
            if (member.roles.cache.has(roleId)) {
                if (await updateStatus(userId, "offline")) {
                    await member.roles.remove(roleId).catch(console.error);
                } else {
                    return;
                }
            }
        }
    }

    if (newlyAssignedBadge && announceChannel) {
        const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`<:checkmark:1330976666016550932> <@${userId}> has been awarded the <@&${ROLES[newlyAssignedBadge]}> badge!`);

        await announceChannel.send({ embeds: [embed] }).catch(console.error);
    }
}

client.on("presenceUpdate", async (oldPresence, newPresence) => {
    if (!presenceUpdateEnabled) return;
    if (!newPresence.member || newPresence.guild.id !== SERVER_ID) return;

    const userId = newPresence.userId;
    const newStatus = newPresence.status;

    if (oldPresence && oldPresence.status === newStatus) return;

    if (newStatus !== "offline" && (!onlineUsers[userId] || onlineUsers[userId].timestamp === null)) {
        if (!(await updateStatus(userId, newStatus))) return;
    }

    if (newStatus === "offline" && onlineUsers[userId] && onlineUsers[userId].timestamp !== null) {
        if (!(await removeUserFromStatus(userId))) return;
    }

    await updateRoles(newPresence.member);
});

async function ready() {
    if (!(await fetchStatusCache())) return;

    const guild = await client.guilds.fetch(SERVER_ID);
    const members = await guild.members.fetch();

    let onlineUsersToAdd = {};
    let currentlyOnline = new Set();

    members.forEach((member) => {
        if (member.presence && member.presence.status !== "offline") {
            currentlyOnline.add(member.id);
            if (!onlineUsers.hasOwnProperty(member.id)) {
                onlineUsersToAdd[member.id] = {
                    status: member.presence.status,
                    timestamp: getTimestamp(),
                };
            }
        }
    });

    try {
        const response = await axios.get(API_URL, {
            headers: { Authorization: `Bearer ${process.env.SCYTEDTV_API}` },
        });

        let existingData = response.status === 200 ? response.data : {};

        let usersToRemove = Object.keys(existingData).filter(userId => !currentlyOnline.has(userId));

        if (usersToRemove.length > 0) {
            usersToRemove.forEach(userId => delete existingData[userId]);
            if (!(await axios.post(API_URL, existingData, { headers: { Authorization: `Bearer ${process.env.SCYTEDTV_API}` } }))) return;
        }

        if (Object.keys(onlineUsersToAdd).length > 0) {
            const chunks = chunkObject(onlineUsersToAdd, 500);
            for (let i = 0; i < chunks.length; i++) {
                const updatedData = { ...existingData, ...chunks[i] };

                if (!(await axios.post(API_URL, updatedData, { headers: { Authorization: `Bearer ${process.env.SCYTEDTV_API}` } }))) return;

                onlineUsers = updatedData;

                if (i < chunks.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }
    } catch (error) {
        console.error("Error updating online user list:", error.message);
    }

    checkAndAssignRoles();
    setInterval(checkAndAssignRoles, 60000);
}

let presenceUpdateEnabled = false;
setTimeout(() => { presenceUpdateEnabled = true; }, 15000);
setTimeout(ready, 5000);
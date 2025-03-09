require("dotenv").config();
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = "./config/info/tgr-statuses.json";

const SERVER_ID = "1237187833324638209";

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
let writeQueue = Promise.resolve();

const getTimestamp = () => Math.floor(Date.now() / 1000);

async function fetchStatusCache() {
    try {
        if (fs.existsSync(path)) {
            const data = fs.readFileSync(path, "utf8");
            onlineUsers = JSON.parse(data);
        }
    } catch (error) {
        console.error("Error fetching status cache:", error.message);
    }
}

async function queueWriteToFile() {
    writeQueue = writeQueue.then(async () => {
        try {
            fs.writeFileSync(path, JSON.stringify(onlineUsers, null, 2), "utf8");
        } catch (error) {
            console.error("Failed to write to JSON file:", error.message);
        }
    });
}

async function updateStatus(userId, status) {
    const timestamp = status === "offline" ? null : getTimestamp();
    onlineUsers[userId] = { status, timestamp };
    await queueWriteToFile();
}

async function removeUserFromStatus(userId) {
    delete onlineUsers[userId];
    await queueWriteToFile();
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
                await member.roles.remove(roleId).catch(console.error);
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
                await member.roles.add(roleId).catch(console.error);
                newlyAssignedBadge = tier;
            }
        } else {
            if (member.roles.cache.has(roleId)) {
                await member.roles.remove(roleId).catch(console.error);
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
    if (newPresence.member.user.bot) return;

    const userId = newPresence.userId;
    const newStatus = newPresence.status;

    if (oldPresence && oldPresence.status === newStatus) return;

    if (newStatus !== "offline" && (!onlineUsers[userId] || onlineUsers[userId].timestamp === null)) {
        await updateStatus(userId, newStatus);
    }

    if (newStatus === "offline" && onlineUsers[userId] && onlineUsers[userId].timestamp !== null) {
        await removeUserFromStatus(userId);
    }

    await updateRoles(newPresence.member);
});

async function ready() {
    await fetchStatusCache();
    await checkAndAssignRoles();
    setInterval(checkAndAssignRoles, 60000);
}

async function checkAndAssignRoles() {
    const guild = await client.guilds.fetch(SERVER_ID);
    const members = await guild.members.fetch();
    members.forEach((member) => updateRoles(member));
}

let presenceUpdateEnabled = false;
setTimeout(() => { presenceUpdateEnabled = true; }, 15000);

setTimeout(ready, 5000);
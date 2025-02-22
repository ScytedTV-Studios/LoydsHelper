const roleMappings = {
    displayRoleDeveloper: '1324833838865846340',
    displayRoleHelper: '1324833838865846339',
    displayRoleYouTuber: '1324833838865846338',
    displayRoleStreamer: '1324833838865846337',
    displayRolePlus: '1324833838815248473',
    displayRoleVIP: '1324833838815248472',
    displayRoleTester: '1324833838815248471',
    hasRoleMember: '1324833838815248470',
    hasRoleHelper: '1324833838815248466'
};

const noTagsRoleId = '1324833838815248468';
const notConnectedRoleId = '1324833838815248469';

const updateRoles = async () => {
    try {
        const connectResponse = await fetch('http://localhost:8000/seaside/connect/discord.json');
        const connectData = await connectResponse.json();

        const tagsResponse = await fetch('http://localhost:8000/seaside/data/tags.json');
        const tagsData = await tagsResponse.json();

        const connectedUserIds = new Set(Object.values(connectData).map(user => user.userId));

        const guild = await client.guilds.fetch('1324833838815248464');
        const members = await guild.members.fetch();

        for (const member of members.values()) {

            if (member.user.bot) {
                continue;
            }

            const discordUserId = member.id;
            const user = Object.values(connectData).find(user => user.userId === discordUserId);

            if (user) {
                const minecraftUsername = user.username;
                const userTags = tagsData[minecraftUsername] || [];

                if (member.nickname !== minecraftUsername) {
                    await member.setNickname(minecraftUsername).catch(console.error);
                    // console.log(`Set nickname of ${discordUserId} to ${minecraftUsername}`);
                }

                let hasAnyTag = false;

                for (const [tag, roleId] of Object.entries(roleMappings)) {
                    const hasTag = userTags.includes(tag);
                    const hasRole = member.roles.cache.has(roleId);

                    if (hasTag) hasAnyTag = true;

                    if (hasTag && !hasRole) {
                        await member.roles.add(roleId).catch(console.error);
                        // console.log(`Added role ${roleId} to user ${discordUserId}`);
                    }

                    if (!hasTag && hasRole) {
                        await member.roles.remove(roleId).catch(console.error);
                        // console.log(`Removed role ${roleId} from user ${discordUserId}`);
                    }
                }

                if (!hasAnyTag) {
                    if (!member.roles.cache.has(noTagsRoleId)) {
                        await member.roles.add(noTagsRoleId).catch(console.error);
                        // console.log(`Added no-tags role ${noTagsRoleId} to user ${discordUserId}`);
                    }
                } else {

                    if (member.roles.cache.has(noTagsRoleId)) {
                        await member.roles.remove(noTagsRoleId).catch(console.error);
                        // console.log(`Removed no-tags role ${noTagsRoleId} from user ${discordUserId}`);
                    }
                }

                if (member.roles.cache.has(notConnectedRoleId)) {
                    await member.roles.remove(notConnectedRoleId).catch(console.error);
                    // console.log(`Removed not-connected role ${notConnectedRoleId} from user ${discordUserId}`);
                }

            } else {

                if (member.nickname) {
                    await member.setNickname(null).catch(console.error);
                    // console.log(`Reset nickname of ${discordUserId}`);
                }

                for (const roleId of Object.values(roleMappings)) {
                    if (member.roles.cache.has(roleId)) {
                        await member.roles.remove(roleId).catch(console.error);
                        // console.log(`Removed role ${roleId} from user ${discordUserId} (no connected Minecraft account)`);
                    }
                }

                if (!member.roles.cache.has(notConnectedRoleId)) {
                    await member.roles.add(notConnectedRoleId).catch(console.error);
                    // console.log(`Added not-connected role ${notConnectedRoleId} to user ${discordUserId}`);
                }

                if (member.roles.cache.has(noTagsRoleId)) {
                    await member.roles.remove(noTagsRoleId).catch(console.error);
                    // console.log(`Removed no-tags role ${noTagsRoleId} from user ${discordUserId}`);
                }
            }
        }
    } catch (error) {
        console.error('Error updating roles and nicknames:', error);
    }
};

setInterval(updateRoles, 3000);
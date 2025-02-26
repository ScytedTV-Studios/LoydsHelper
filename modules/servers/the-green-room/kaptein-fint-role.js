const { EmbedBuilder } = require('discord.js');

const allowedUsers = ['852572302590607361', '676018788810096661'];
const allowedServer = '1237187833324638209';
const roleId = '1249070768633938072';

client.on('messageCreate', async (message) => {
    if (!message.guild || message.guild.id !== allowedServer) return;
    if (!message.content.startsWith('!name ')) return;
    if (!allowedUsers.includes(message.author.id)) return;

    const newName = message.content.slice(6).trim();
    const role = await message.guild.roles.fetch(roleId).catch(() => null);

    if (!role) {
        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('Red')
                    .setDescription('<:crossmark:1330976664535961753> `Role not found.`')
            ]
        });
    }

    const restrictedNames = [
        'Owner', 'Admin', 'Moderator', 'Helper', 
        'Event Organizer', 'Dropout Official', 'The Green Room'
    ];

    if (restrictedNames.some(word => newName.toLowerCase().includes(word.toLowerCase()))) {
        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('Red')
                    .setDescription('<:crossmark:1330976664535961753> `That name is restricted.`')
            ]
        });
    }

    try {
        await role.setName(newName);
        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('Green')
                    .setDescription(`<:checkmark:1330976666016550932> Role name changed to \`${newName}\`.`)
            ]
        });
    } catch (error) {
        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('Red')
                    .setDescription(`<:crossmark:1330976664535961753> \`Error changing role name: ${error.message}\``)
            ]
        });
    }
});

client.on('messageCreate', async (message) => {
    if (!message.guild || message.guild.id !== allowedServer) return;
    if (!message.content.startsWith('!color ')) return;
    if (!allowedUsers.includes(message.author.id)) return;

    const args = message.content.slice(7).trim();
    const role = await message.guild.roles.fetch(roleId).catch(() => null);

    if (!role) {
        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('Red')
                    .setDescription('<:crossmark:1330976664535961753> `Role not found.`')
            ]
        });
    }

    if (args.toLowerCase() === 'reset') {
        try {
            await role.setColor(`#000000`);
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Green')
                        .setDescription('<:checkmark:1330976666016550932> Color reset to `default`.')
                ]
            });
        } catch (error) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`<:crossmark:1330976664535961753> \`Error resetting color: ${error.message}\``)
                ]
            });
        }
    }

    let hexColor = args.replace(/^#/, '').toUpperCase();
    if (!/^([0-9A-F]{6})$/i.test(hexColor)) {
        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('Red')
                    .setDescription('<:crossmark:1330976664535961753> `Invalid hex code.`')
            ]
        });
    }

    try {
        await role.setColor(`#${hexColor}`);
        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('Green')
                    .setDescription(`<:checkmark:1330976666016550932> Color changed to \`#${hexColor}\`.`)
            ]
        });
    } catch (error) {
        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('Red')
                    .setDescription(`<:crossmark:1330976664535961753> \`Error changing color: ${error.message}\``)
            ]
        });
    }
});

client.on('messageCreate', async (message) => {
    if (!message.guild || message.guild.id !== allowedServer) return;
    if (!message.content.startsWith('!colour ')) return;
    if (!allowedUsers.includes(message.author.id)) return;

    const args = message.content.slice(7).trim();
    const role = await message.guild.roles.fetch(roleId).catch(() => null);

    if (!role) {
        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('Red')
                    .setDescription('<:crossmark:1330976664535961753> `Role not found.`')
            ]
        });
    }

    if (args.toLowerCase() === 'reset') {
        try {
            await role.setColor(`#000000`);
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Green')
                        .setDescription('<:checkmark:1330976666016550932> Colour reset to `default`.')
                ]
            });
        } catch (error) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`<:crossmark:1330976664535961753> \`Error resetting colour: ${error.message}\``)
                ]
            });
        }
    }

    let hexColor = args.replace(/^#/, '').toUpperCase();
    if (!/^([0-9A-F]{6})$/i.test(hexColor)) {
        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('Red')
                    .setDescription('<:crossmark:1330976664535961753> `Invalid hex code.`')
            ]
        });
    }

    try {
        await role.setColor(`#${hexColor}`);
        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('Green')
                    .setDescription(`<:checkmark:1330976666016550932> Colour changed to \`#${hexColor}\`.`)
            ]
        });
    } catch (error) {
        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('Red')
                    .setDescription(`<:crossmark:1330976664535961753> \`Error changing colour: ${error.message}\``)
            ]
        });
    }
});

client.on('messageCreate', async (message) => {
    if (!message.guild || message.guild.id !== allowedServer) return;
    if (!message.content.startsWith('!kulær ')) return;
    if (!allowedUsers.includes(message.author.id)) return;

    const args = message.content.slice(7).trim();
    const role = await message.guild.roles.fetch(roleId).catch(() => null);

    if (!role) {
        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('Red')
                    .setDescription('<:crossmark:1330976664535961753> `Role not found.`')
            ]
        });
    }

    if (args.toLowerCase() === 'reset') {
        try {
            await role.setColor(`#000000`);
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Green')
                        .setDescription('<:checkmark:1330976666016550932> Kulær reset to `default`.')
                ]
            });
        } catch (error) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`<:crossmark:1330976664535961753> \`Error resetting kulær: ${error.message}\``)
                ]
            });
        }
    }

    let hexColor = args.replace(/^#/, '').toUpperCase();
    if (!/^([0-9A-F]{6})$/i.test(hexColor)) {
        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('Red')
                    .setDescription('<:crossmark:1330976664535961753> `Invalid hex code.`')
            ]
        });
    }

    try {
        await role.setColor(`#${hexColor}`);
        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('Green')
                    .setDescription(`<:checkmark:1330976666016550932> Kulær changed to \`#${hexColor}\`.`)
            ]
        });
    } catch (error) {
        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('Red')
                    .setDescription(`<:crossmark:1330976664535961753> \`Error changing kulær: ${error.message}\``)
            ]
        });
    }
});
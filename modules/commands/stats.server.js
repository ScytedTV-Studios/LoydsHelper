const { EmbedBuilder, Events, InteractionCreate } = require('discord.js');

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === 'stats' && options.getSubcommand() === 'server') {
        await interaction.deferReply();
        const exampleEmbed = new EmbedBuilder()
            .setColor('#CCCCFF')
            .setTitle('Server Stats')
            .setDescription(`Take a look at this server's stats\n\n**Owner:** <@${interaction.guild.ownerId}>\n\n**Members:** \`${interaction.guild.memberCount}\`\n**Emojis:** \`${interaction.guild.emojis.cache.size}\`\n**Roles:** \`${interaction.guild.roles.cache.size}\``)
            // .addFields(
            //     { name: 'Owner', value: `The owner of this server is <@${interaction.guild.ownerId}>`, inline: true },
            //     { name: 'Member Count', value: `This server has ${interaction.guild.memberCount} members`, inline: true },
            //     { name: 'Emoji Count', value: `This server has ${interaction.guild.emojis.cache.size} emojis`, inline: true },
            //     { name: 'Roles Count', value: `This server has ${interaction.guild.roles.cache.size} roles`, inline: true }
            // )
            .setThumbnail(interaction.guild.iconURL())
            .setFooter({ text: interaction.guild.name })
            .setTimestamp();

        await interaction.editReply({ embeds: [exampleEmbed] });
    }
});

client.on('messageCreate', async (message) => {
    if (message.content === '!stats') {
        message.channel.sendTyping();
        const { guild } = message;
        if (!guild) return;

        await guild.members.fetch();

        const serverName = guild.name;
        const serverID = guild.id;
        const serverRegion = guild.preferredLocale || 'Unknown';
        const serverOwner = await guild.fetchOwner();
        const serverCreationDate = `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`;
        const bannerURL = guild.bannerURL({ size: 1024 }) || null;
        const totalMembers = guild.memberCount;
        const totalChannels = guild.channels.cache.size;
        const totalRoles = guild.roles.cache.size;
        const totalEmojis = guild.emojis.cache.size;
        const totalBoosts = guild.premiumSubscriptionCount;


        const statsEmbed = new EmbedBuilder()
            .setColor('#CCCCFF')
            .setTitle(`Server Stats`)
            .setDescription(`**Name:** \`${serverName}\` (\`${serverRegion}\`)\n**Server ID:** \`${serverID}\`\n**Owner:** <@${serverOwner.id}> (\`${serverOwner.id}\`)\n\n**Created:** ${serverCreationDate}`)
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addFields(
                { name: 'Members', value: `${totalMembers}`, inline: true },
                { name: 'Channels', value: `${totalChannels}`, inline: true },
                { name: 'Roles', value: `${totalRoles}`, inline: true }
            )
            .setFooter({ text: `${serverName} (${guild.id})` })
            .setTimestamp();

        if (guild.description) {
            statsEmbed.addFields({ name: 'Server Description', value: guild.description, inline: false });
        }

        if (guild.emojis.cache.size > 0) {
            statsEmbed.addFields({ name: 'Emojis', value: `${guild.emojis.cache.size}`, inline: true });
        }

        if (guild.premiumSubscriptionCount > 0) {
            statsEmbed.addFields({ name: 'Boosts', value: `${guild.premiumSubscriptionCount}`, inline: true });
        }

        if (bannerURL) statsEmbed.setImage(bannerURL);

        message.channel.send({ embeds: [statsEmbed] });
    }
});
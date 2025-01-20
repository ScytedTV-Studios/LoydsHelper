const { EmbedBuilder } = require('discord.js');

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === 'stats' && options.getSubcommand() === 'server') {
        await interaction.deferReply();
        const { guild } = interaction;
        if (!guild) return;

        await interaction.guild.members.fetch();

        const serverName = interaction.guild.name;
        const serverID = interaction.guild.id;
        const serverRegion = interaction.guild.preferredLocale || 'Unknown';
        const serverOwner = await interaction.guild.fetchOwner();
        const serverCreationDate = `<t:${Math.floor(interaction.guild.createdTimestamp / 1000)}:F>`;
        const bannerURL = interaction.guild.bannerURL({ size: 1024 }) || null;
        const totalMembers = interaction.guild.memberCount;
        const totalChannels = interaction.guild.channels.cache.size;
        const totalRoles = interaction.guild.roles.cache.size;


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

        if (interaction.guild.emojis.cache.size > 0) {
            statsEmbed.addFields({ name: 'Emojis', value: `${interaction.guild.emojis.cache.size}`, inline: true });
        }

        if (interaction.guild.premiumSubscriptionCount > 0) {
            statsEmbed.addFields({ name: 'Boosts', value: `${interaction.guild.premiumSubscriptionCount}`, inline: true });
        }

        if (interaction.guild.description) {
            statsEmbed.addFields({ name: 'Server Description', value: interaction.guild.description, inline: false });
        }

        if (bannerURL) statsEmbed.setImage(bannerURL);

        await interaction.editReply({ embeds: [statsEmbed] });
    }
});
const { EmbedBuilder } = require('discord.js');

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === 'stats' && options.getSubcommand() === 'members') {
        await interaction.deferReply();
        const { guild } = interaction;
        if (!guild) return;

        await interaction.guild.members.fetch();

        const serverName = interaction.guild.name;
        const totalMembers = interaction.guild.memberCount;
        const bots = interaction.guild.members.cache.filter(m => m.user.bot).size;
        const humans = totalMembers - bots;
        const totalBoosts = interaction.guild.premiumSubscriptionCount || 0;
        const boostLevel = interaction.guild.premiumTier || 'None';


        const statsEmbed = new EmbedBuilder()
            .setColor('#CCCCFF')
            .setTitle(`Server Member Stats`)
            .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
            .addFields(
                { name: 'Total Members', value: `${totalMembers}`, inline: true },
                { name: 'Humans', value: `${humans}`, inline: true },
                { name: 'Bots', value: `${bots}`, inline: true },
                { name: 'Total Boosts', value: `${totalBoosts}`, inline: true },
                { name: 'Boost Level', value: `${boostLevel}`, inline: true }
            )
            .setFooter({ text: `${serverName} (${guild.id})` })
            .setTimestamp();

        await interaction.editReply({ embeds: [statsEmbed] });
    }
});

client.on('messageCreate', async (message) => {
    if (message.content === '!stats') {
        message.channel.sendTyping();
        const { guild } = message;
        if (!guild) return;

        await guild.members.fetch();

        // Fetch all members for accurate stats
        await guild.members.fetch();

        // Collect member stats
        const totalMembers = guild.memberCount;
        const onlineMembers = guild.members.cache.filter(m => m.presence?.status === 'online').size;
        const offlineMembers = totalMembers - onlineMembers;
        const bots = guild.members.cache.filter(m => m.user.bot).size;
        const humans = totalMembers - bots;
        const totalBoosts = guild.premiumSubscriptionCount || 0;
        const boostLevel = guild.premiumTier || 'None';

        // Create embed
        const statsEmbed = new EmbedBuilder()
            .setColor('#5865F2') // Discord blurple color
            .setTitle(`${guild.name} Member Stats`)
            .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
            .addFields(
                { name: 'Total Members', value: `${totalMembers}`, inline: true },
                { name: 'Online Members', value: `${onlineMembers}`, inline: true },
                { name: 'Offline Members', value: `${offlineMembers}`, inline: true },
                { name: 'Humans', value: `${humans}`, inline: true },
                { name: 'Bots', value: `${bots}`, inline: true },
                { name: 'Total Boosts', value: `${totalBoosts}`, inline: true },
                { name: 'Boost Level', value: `${boostLevel}`, inline: true }
            )
            .setTimestamp();

        // Send the embed
        message.channel.send({ embeds: [statsEmbed] });
    }
});
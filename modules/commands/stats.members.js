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
            .setColor('Green')
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
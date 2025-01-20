const { EmbedBuilder } = require('discord.js');

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === 'stats' && options.getSubcommand() === 'boosts') {
        await interaction.deferReply();
        const { guild } = interaction;
        if (!guild) return;

        await interaction.guild.members.fetch();

        const serverName = interaction.guild.name;
        const boostCount = interaction.guild.premiumSubscriptionCount;
        const boostLevel = interaction.guild.premiumTier;
        const boosters = interaction.guild.members.cache.filter(member => member.premiumSince);
        const numberOfBoosters = boosters.size;

        let boostProgress = 'N/A';
        if (boostLevel === 1) {
            boostProgress = `${boostCount} / 30`;
        } else if (boostLevel === 2) {
            boostProgress = `${boostCount - 30} / 60`;
        } else if (boostLevel === 3) {
            boostProgress = `${boostCount - 90} / 100`;
        }

        const statsEmbed = new EmbedBuilder()
            .setColor('#CCCCFF')
            .setTitle(`Server Boost Stats`)
            .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
            .addFields(
                { name: 'Boost Count', value: `${boostCount}`, inline: true },
                { name: 'Boost Level', value: `Level ${boostLevel}`, inline: true },
                { name: 'Boost Progress', value: boostProgress, inline: true },
                { name: 'Number of Boosters', value: `${numberOfBoosters}`, inline: true }
            )
            .setFooter({ text: `${serverName} (${guild.id})` })
            .setTimestamp();

        await interaction.editReply({ embeds: [statsEmbed] });
    }
});
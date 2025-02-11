const { EmbedBuilder } = require('discord.js');

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === 'stats' && options.getSubcommand() === 'emojis') {
        await interaction.deferReply();
        const { guild } = interaction;
        if (!guild) return;

        await interaction.guild.emojis.fetch();
        await interaction.guild.stickers.fetch();

        const serverName = interaction.guild.name;
        const totalEmojis = interaction.guild.emojis.cache.size;
        const staticEmojis = interaction.guild.emojis.cache.filter(e => !e.animated).size;
        const animatedEmojis = interaction.guild.emojis.cache.filter(e => e.animated).size;
        const totalStickers = interaction.guild.stickers.cache.size;

        const statsEmbed = new EmbedBuilder()
            .setColor('Green')
            .setTitle(`Server Emoji Stats`)
            .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
            .addFields(
                { name: 'Total Emojis', value: `${totalEmojis}`, inline: true },
                { name: 'Static Emojis', value: `${staticEmojis}`, inline: true },
                { name: 'Animated Emojis', value: `${animatedEmojis}`, inline: true },
                { name: 'Total Stickers', value: `${totalStickers}`, inline: true }
            )
            .setFooter({ text: `${serverName} (${guild.id})` })
            .setTimestamp();

        await interaction.editReply({ embeds: [statsEmbed] });
    }
});
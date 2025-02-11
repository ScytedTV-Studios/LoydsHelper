const { EmbedBuilder } = require('discord.js');

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === 'stats' && options.getSubcommand() === 'channels') {
        await interaction.deferReply();
        const { guild } = interaction;
        if (!guild) return;

        await interaction.guild.members.fetch();

        const serverName = interaction.guild.name;
        const totalChannels = interaction.guild.channels.cache.size;
        const textChannels = interaction.guild.channels.cache.filter(ch => ch.type === 0).size;
        const voiceChannels = interaction.guild.channels.cache.filter(ch => ch.type === 2).size;
        const categories = interaction.guild.channels.cache.filter(ch => ch.type === 4).size;
        const announcementChannels = interaction.guild.channels.cache.filter(ch => ch.type === 5).size;
        const stageChannels = interaction.guild.channels.cache.filter(ch => ch.type === 13).size;
        const activeThreads = interaction.guild.channels.cache.filter(ch => [10, 11, 12].includes(ch.type)).size;


        const statsEmbed = new EmbedBuilder()
            .setColor('Green')
            .setTitle(`Server Channel Stats`)
            .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
            .addFields(
                { name: 'Total Channels', value: `${totalChannels}`, inline: true },
                { name: 'Text Channels', value: `${textChannels}`, inline: true },
                { name: 'Voice Channels', value: `${voiceChannels}`, inline: true },
                { name: 'Categories', value: `${categories}`, inline: true },
                { name: 'Announcement Channels', value: `${announcementChannels}`, inline: true },
                { name: 'Stage Channels', value: `${stageChannels}`, inline: true },
                { name: 'Active Threads', value: `${activeThreads}`, inline: true }
            )
            .setFooter({ text: `${serverName} (${guild.id})` })
            .setTimestamp();

        await interaction.editReply({ embeds: [statsEmbed] });
    }
});
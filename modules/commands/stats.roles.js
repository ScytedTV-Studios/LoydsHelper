const { EmbedBuilder, PermissionsBitField } = require('discord.js');

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === 'stats' && options.getSubcommand() === 'roles') {
        await interaction.deferReply();
        const { guild } = interaction;
        if (!guild) return;

        await interaction.guild.members.fetch();

        const serverName = interaction.guild.name;
        const allRoles = guild.roles.cache;
        const totalRoles = allRoles.size - 1;
        const highestRole = allRoles.filter(role => role.id !== guild.id).sort((a, b) => b.position - a.position).first();
        const adminRoles = allRoles.filter(role => role.permissions.has(PermissionsBitField.Flags.Administrator));
        const roleMentions = allRoles.filter(role => role.id !== guild.id)
            .sort((a, b) => b.position - a.position)
            .map(role => `<@&${role.id}>`)
            .join(' ') || 'None';

        const statsEmbed = new EmbedBuilder()
            .setColor('#CCCCFF')
            .setTitle(`Server Member Stats`)
            .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
            .addFields(
                { name: 'Total Custom Roles', value: `${totalRoles}`, inline: true },
                { name: 'Highest Role', value: `<@&${highestRole.id}>`, inline: true },
                { name: 'Administrator Roles', value: `${adminRoles.size}`, inline: true },
                { name: 'All Roles', value: roleMentions || 'None' }
            )
            .setFooter({ text: `${serverName} (${guild.id})` })
            .setTimestamp();

        await interaction.editReply({ embeds: [statsEmbed] });
    }
});
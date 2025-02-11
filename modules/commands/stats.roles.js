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
        const topRoles = allRoles.filter(role => role.id !== guild.id)
            .sort((a, b) => b.position - a.position)
            .first(30);

        const roleMentions = topRoles.map(role => `<@&${role.id}>`).join(' ');
        const additionalRoles = totalRoles > 30 ? 'and more...' : '';

        const statsEmbed = new EmbedBuilder()
            .setColor('Green')
            .setTitle(`Server Role Stats`)
            .setDescription(`${roleMentions} ${additionalRoles}` || 'None')
            .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
            .addFields(
                { name: 'Total Custom Roles', value: `${totalRoles}`, inline: true },
                { name: 'Highest Role', value: `${highestRole.name}`, inline: true },
                { name: 'Administrator Roles', value: `${adminRoles.size}`, inline: true }
            )
            .setFooter({ text: `${serverName} (${guild.id})` })
            .setTimestamp();

        await interaction.editReply({ embeds: [statsEmbed] });
    }
});
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand() || interaction.commandName !== 'kick') return;

    await interaction.deferReply();

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
        const embed = new EmbedBuilder()
            .setColor('Red')
            .setDescription('<:crossmark:1330976664535961753> `You do not have permission to use this command.`');
        return interaction.editReply({ embeds: [embed], ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = interaction.guild.members.cache.get(user.id);

    if (user.id === interaction.user.id) {
        const embed = new EmbedBuilder()
            .setColor('Red')
            .setDescription('<:crossmark:1330976664535961753> `You cannot kick yourself.`');
        return interaction.editReply({ embeds: [embed], ephemeral: true });
    }

    if (user.id === interaction.guild.ownerId) {
        const embed = new EmbedBuilder()
            .setColor('Red')
            .setDescription('<:crossmark:1330976664535961753> `You cannot kick the server owner.`');
        return interaction.editReply({ embeds: [embed], ephemeral: true });
    }

    if (user.id === client.user.id) {
        const embed = new EmbedBuilder()
            .setColor('Red')
            .setDescription('<:crossmark:1330976664535961753> `You cannot kick me.`');
        return interaction.editReply({ embeds: [embed], ephemeral: true });
    }

    if (!member) {
        const embed = new EmbedBuilder()
            .setColor('Red')
            .setDescription('<:crossmark:1330976664535961753> `User not found in this server.`');
        return interaction.editReply({ embeds: [embed], ephemeral: true });
    }

    try {
        await member.kick(reason);

        const embed = new EmbedBuilder()
            .setColor('Green')
            .setDescription(`<:checkmark:1330976666016550932> \`${reason}\` <@${user.id}> has been kicked.`);
        await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        console.error(error);
        const embed = new EmbedBuilder()
            .setColor('Red')
            .setDescription('<:crossmark:1330976664535961753> `Failed to kick the user. Please check my permissions.`');
        await interaction.editReply({ embeds: [embed], ephemeral: true });
    }
});
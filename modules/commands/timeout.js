const { PermissionsBitField, EmbedBuilder } = require('discord.js');

function parseTimeoutTime(timeString) {
    const timeRegex = /(\d+)([smhd])/g;
    let totalSeconds = 0;

    let match;
    while ((match = timeRegex.exec(timeString)) !== null) {
        const amount = parseInt(match[1], 10);
        const unit = match[2];

        switch (unit) {
            case 's':
                totalSeconds += amount;
                break;
            case 'm':
                totalSeconds += amount * 60;
                break;
            case 'h':
                totalSeconds += amount * 3600;
                break;
            case 'd':
                totalSeconds += amount * 86400;
                break;
        }
    }

    return totalSeconds;
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand() || interaction.commandName !== 'timeout') return;

    await interaction.deferReply();

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
        const embed = new EmbedBuilder()
            .setColor('Red')
            .setDescription('<:crossmark:1330976664535961753> `You do not have permission to use this command.`');
        return interaction.editReply({ embeds: [embed], ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const timeString = interaction.options.getString('time');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = interaction.guild.members.cache.get(user.id);

    if (user.id === interaction.user.id) {
        const embed = new EmbedBuilder()
            .setColor('Red')
            .setDescription('<:crossmark:1330976664535961753> `You cannot timeout yourself.`');
        return interaction.editReply({ embeds: [embed], ephemeral: true });
    }

    if (user.id === interaction.guild.ownerId) {
        const embed = new EmbedBuilder()
            .setColor('Red')
            .setDescription('<:crossmark:1330976664535961753> `You cannot timeout the server owner.`');
        return interaction.editReply({ embeds: [embed], ephemeral: true });
    }

    if (user.id === client.user.id) {
        const embed = new EmbedBuilder()
            .setColor('Red')
            .setDescription('<:crossmark:1330976664535961753> `You cannot timeout me.`');
        return interaction.editReply({ embeds: [embed], ephemeral: true });
    }

    if (!member) {
        const embed = new EmbedBuilder()
            .setColor('Red')
            .setDescription('<:crossmark:1330976664535961753> `User not found in this server.`');
        return interaction.editReply({ embeds: [embed], ephemeral: true });
    }

    let totalTimeoutSeconds;
    try {
        totalTimeoutSeconds = parseTimeoutTime(timeString);
    } catch (error) {
        const embed = new EmbedBuilder()
            .setColor('Red')
            .setDescription('<:crossmark:1330976664535961753> `Invalid time format. Please use a valid combination of s, m, h, d.`');
        return interaction.editReply({ embeds: [embed], ephemeral: true });
    }

    if (totalTimeoutSeconds <= 0) {
        const embed = new EmbedBuilder()
            .setColor('Red')
            .setDescription('<:crossmark:1330976664535961753> `Timeout duration must be greater than zero.`');
        return interaction.editReply({ embeds: [embed], ephemeral: true });
    }

    try {
        await member.timeout(totalTimeoutSeconds * 1000, reason);

        const embed = new EmbedBuilder()
            .setColor('Green')
            .setDescription(`<:checkmark:1330976666016550932> \`${reason}\` <@${user.id}> has been timed out for ${timeString}.`);
        await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        console.error(error);
        const embed = new EmbedBuilder()
            .setColor('Red')
            .setDescription('<:crossmark:1330976664535961753> `Failed to apply timeout. Please check my permissions.`');
        await interaction.editReply({ embeds: [embed], ephemeral: true });
    }
});
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'remove') {
        if (interaction.options.getSubcommand() === 'timeout') {

            await interaction.deferReply();

            const user = interaction.options.getUser('user');
            const member = interaction.guild.members.cache.get(user.id);

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setDescription('<:crossmark:1330976664535961753> `You do not have permission to use this command.`');
                return interaction.editReply({ embeds: [embed], ephemeral: true });
            }

            if (!member) {
                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setDescription('<:crossmark:1330976664535961753> `User not found in this server.`');
                return interaction.editReply({ embeds: [embed], ephemeral: true });
            }

            if (!member.isCommunicationDisabled()) {
                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setDescription('<:crossmark:1330976664535961753> `This user is not currently timed out.`');
                return interaction.editReply({ embeds: [embed], ephemeral: true });
            }

            try {
                await member.timeout(null, 'Timeout removed by a moderator.');

                const embed = new EmbedBuilder()
                    .setColor('Green')
                    .setDescription(`<:checkmark:1330976666016550932> <@${user.id}> no longer has a timeout.`);
                await interaction.editReply({ embeds: [embed] });
            } catch (error) {
                console.error(error);
                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setDescription('<:crossmark:1330976664535961753> `Failed to remove timeout. Please check my permissions or role hierarchy.`');
                await interaction.editReply({ embeds: [embed], ephemeral: true });
            }
        }
    }
});
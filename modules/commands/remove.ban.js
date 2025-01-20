const { PermissionsBitField, EmbedBuilder } = require('discord.js');

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'remove') {
        if (interaction.options.getSubcommand() === 'ban') {

            await interaction.deferReply();

            const userId = interaction.options.getString('user');
            const guild = interaction.guild;

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setDescription('<:crossmark:1330976664535961753> `You do not have permission to use this command.`');
                return interaction.editReply({ embeds: [embed], ephemeral: true });
            }

            try {
                const bannedUsers = await guild.bans.fetch();
                const bannedUser = bannedUsers.get(userId);

                if (!bannedUser) {
                    const embed = new EmbedBuilder()
                        .setColor('Red')
                        .setDescription('<:crossmark:1330976664535961753> `This user is not banned.`');
                    return interaction.editReply({ embeds: [embed], ephemeral: true });
                }

                // Remove the ban
                await guild.bans.remove(userId);

                const embed = new EmbedBuilder()
                    .setColor('Green')
                    .setDescription(`<:checkmark:1330976666016550932> <@${userId}> has been unbanned.`);
                return interaction.editReply({ embeds: [embed] });
            } catch (error) {
                console.error(error);
                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setDescription('<:crossmark:1330976664535961753> `An error occurred while trying to remove the ban.`');
                return interaction.editReply({ embeds: [embed], ephemeral: true });
            }
        }
    }
});
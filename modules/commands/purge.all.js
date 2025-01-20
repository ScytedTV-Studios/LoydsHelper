const { PermissionsBitField, EmbedBuilder } = require('discord.js');

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'purge') {
        if (interaction.options.getSubcommand() === 'all') {

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setDescription('<:crossmark:1330976664535961753> `You do not have permission to use this command.`');
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const count = interaction.options.getInteger('count') || 100;

            if (count < 1 || count > 100) {
                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setDescription('<:crossmark:1330976664535961753> `You must provide a number between 1 and 100 for the count.`');
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            try {
                const messages = await interaction.channel.messages.fetch({ limit: count });
                await interaction.channel.bulkDelete(messages);

                const embed = new EmbedBuilder()
                    .setColor('Green')
                    .setDescription(`<:checkmark:1330976666016550932> \`Successfully purged ${messages.size} messages.\``);
                const reply = await interaction.reply({ embeds: [embed] });

                setTimeout(async () => {
                    await reply.delete();
                }, 3000);

            } catch (error) {
                console.error(error);
                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setDescription('<:crossmark:1330976664535961753> `An error occurred while purging messages.`');
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
        }
    }
});
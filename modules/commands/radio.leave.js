const { EmbedBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
require('dotenv').config();

const activeChannels = new Map();

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'radio' && interaction.options.getSubcommand() === 'leave') {
        const connection = getVoiceConnection(interaction.guild.id);
        if (!connection) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription('<:crossmark:1330976664535961753> `I am not in a voice channel.`')
                ]
            });
        }

        // Get the voice channel object using the channel ID
        const voiceChannel = interaction.guild.channels.cache.get(connection.joinConfig.channelId);
        if (!voiceChannel) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription('<:crossmark:1330976664535961753> `Could not find the voice channel.`')
                ]
            });
        }

        connection.destroy();
        activeChannels.delete(interaction.guild.id);

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor('Green')
                    .setDescription(`<:checkmark:1330976666016550932> \`Left #${voiceChannel.name}\``)
            ]
        });
    }
});
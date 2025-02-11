const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'radio' && interaction.options.getSubcommand() === 'now-playing') {
        try {
            const response = await axios.get('https://api.scyted.tv/v2/radio/current.json', {
                headers: { Authorization: `Bearer ${process.env.SCYTEDTV_API}` }
            });

            const data = response.data;

            if (!data || Object.keys(data).length === 0) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setDescription('<:crossmark:1330976664535961753> `No song is currently playing.`')
                    ]
                });
            }

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Green')
                        .setDescription(`<:checkmark:1330976666016550932> \`${data.title}\` by \`${data.artist}\``)
                ]
            });

        } catch (error) {
            console.error('Error fetching now playing data:', error);
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription('<:crossmark:1330976664535961753> `An error occurred while fetching the now playing data.`')
                ],
                ephemeral: true
            });
        }
    }
});
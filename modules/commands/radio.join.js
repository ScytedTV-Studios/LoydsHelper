const { EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection, NoSubscriberBehavior } = require('@discordjs/voice');
const axios = require('axios');
require('dotenv').config();

const activeChannels = new Map();
const volumeLevels = new Map();

function playStream(connection, guildId) {
    const player = createAudioPlayer({
        behaviors: { noSubscriber: NoSubscriberBehavior.Play }
    });

    const resource = createAudioResource('https://assets.scyted.tv/stream', {
        inlineVolume: true
    });

    const defaultVolume = 0.5;
    resource.volume.setVolume(defaultVolume);
    volumeLevels.set(guildId, defaultVolume);

    player.play(resource);
    connection.subscribe(player);

    activeChannels.set(guildId, { connection, player, resource });
}

async function checkRadioStatus() {
    try {
        const response = await axios.get('https://api.scyted.tv/v2/radio/current.json', {
            headers: { Authorization: `Bearer ${process.env.SCYTEDTV_API}` }
        });

        if (response.data.warning === 'Radio Offline') {
            // console.log('Radio is offline. Disconnecting all voice channels.');

            for (const [guildId, channelInfo] of activeChannels.entries()) {
                const connection = getVoiceConnection(guildId);
                if (connection) {
                    connection.destroy();
                    activeChannels.delete(guildId);
                    volumeLevels.delete(guildId);

                    channelInfo.textChannel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor('Red')
                                .setDescription(`<:crossmark:1330976664535961753> \`Disconnected from #${channelInfo.voiceChannel.name} (Radio Offline).\``)
                        ]
                    });
                }
            }
        }
    } catch (error) {
        console.error('Error checking radio status:', error);
    }
}

async function checkEmptyVoiceChannels() {
    for (const [guildId, channelInfo] of activeChannels.entries()) {
        const connection = getVoiceConnection(guildId);
        if (!connection) continue;

        const voiceChannel = channelInfo.voiceChannel;
        const channel = await voiceChannel.fetch();
        if (channel.members.size === 1) {
            // console.log(`Bot alone in ${channel.name}, disconnecting...`);

            connection.destroy();
            activeChannels.delete(guildId);
            volumeLevels.delete(guildId);

            channelInfo.textChannel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`<:crossmark:1330976664535961753> \`Disconnected from #${channel.name} (Voice channel empty).\``)
                ]
            });
        }
    }
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'radio' && interaction.options.getSubcommand() === 'join') {
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription('<:crossmark:1330976664535961753> `You need to be in a voice channel to use this command.`')
                ]
            });
        }

        try {
            const response = await axios.get('https://api.scyted.tv/v2/radio/current.json', {
                headers: { Authorization: `Bearer ${process.env.SCYTEDTV_API}` }
            });

            if (response.data.warning === 'Radio Offline') {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setDescription('<:crossmark:1330976664535961753> `The radio is currently offline.`')
                    ]
                });
            }

            const botPermissions = voiceChannel.permissionsFor(client.user);
            if (!botPermissions.has('Connect') || !botPermissions.has('Speak')) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setDescription('<:crossmark:1330976664535961753> `I do not have permission to join or speak in this voice channel.`')
                    ]
                });
            }

            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator
            });

            playStream(connection, voiceChannel.guild.id);

            activeChannels.set(voiceChannel.guild.id, {
                voiceChannel,
                textChannel: interaction.channel
            });

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Green')
                        .setDescription(`<:checkmark:1330976666016550932> \`Joined #${voiceChannel.name}\``)
                ]
            });

        } catch (error) {
            console.error(error);
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription('<:crossmark:1330976664535961753> `An error occurred while trying to join.`')
                ]
            });
        }
    }
});

setInterval(checkRadioStatus, 10000);
setInterval(checkEmptyVoiceChannels, 10000);
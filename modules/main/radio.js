// const { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus } = require('@discordjs/voice');
// const fs = require('fs');

// const voiceChannelsConfig = JSON.parse(fs.readFileSync('./config/join-vc.json', 'utf8')).voiceChannels;
// const streamURL = "http://localhost:9999/stream";

// async function joinAndPlayStream() {
//     for (const { guildID, channelID } of voiceChannelsConfig) {
//       const guild = client.guilds.cache.get(guildID);
//       if (!guild) {
//         console.error(`Guild not found for ID: ${guildID}`);
//         continue;
//       }
  
//       const channel = guild.channels.cache.get(channelID);
//       if (!channel) {
//         console.error(`Voice Channel not found for ID: ${channelID}`);
//         continue;
//       }
  
//       const connection = joinVoiceChannel({
//         channelId: channel.id,
//         guildId: guild.id,
//         adapterCreator: guild.voiceAdapterCreator,
//       });
  
//       connection.on(VoiceConnectionStatus.Ready, () => {
//         console.log(`The bot has connected to the voice channel: ${channelID}`);
  
//         const player = createAudioPlayer();

//         const resource = createAudioResource(streamURL, {
//           inputType: null,
//         });

//         player.play(resource);
  
//         connection.subscribe(player);
  
//         player.on('stateChange', (oldState, newState) => {
//           if (newState.status === 'playing') {
//             console.log('The stream is playing!');
//           }
//         });
  
//         player.on('idle', () => {
//           console.log('Stream ended.');
//           connection.disconnect();
//         });
//       });
  
//       connection.on(VoiceConnectionStatus.Disconnected, () => {
//         console.log(`Disconnected from the voice channel: ${channelID}`);
//       });
//     }
//   }

// setTimeout(joinAndPlayStream, 5000);
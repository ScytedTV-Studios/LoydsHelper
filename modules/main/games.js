const fs = require('fs');
const path = require('path');

client.on('messageCreate', (message) => {

  const configPath = path.join(process.cwd(), 'modules', 'config', 'free-games.json');
  let channelsList;

  try {
    channelsList = JSON.parse(fs.readFileSync(configPath)).channels;
  } catch (error) {
    console.error("Error reading the config file:", error);
    return; 
  }

  const sourceChannelId = '1273705139584110672';

  if (message.channel.id !== sourceChannelId) return;

  const payload = {};

  if (message.content) {
    payload.content = message.content;
  }

  if (message.embeds.length > 0) {
    payload.embeds = message.embeds;
  }

  channelsList.forEach(channelId => {
    const targetChannel = client.channels.cache.get(channelId);
    if (targetChannel) {
      targetChannel.send(payload).catch(err => console.error(`Could not send message to channel ${channelId}:`, err));
    } else {
      console.warn(`Channel with ID ${channelId} not found.`);
    }
  });
});

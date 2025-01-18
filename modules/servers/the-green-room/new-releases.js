const fs = require('fs');
const csv = require('csv-parser');

const { EmbedBuilder } = require('discord.js');

const csvFilePath = './modules/config/show-pings.csv';
const rolePings = new Map();
const linkOnlyChannelIds = ['1238005967967223878', '1237204540210544701'];

// Load the CSV file into a Map
fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    rolePings.set(row.show, row.roleId);
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });

client.on('messageCreate', async (message) => {
  const sourceChannelId = '1255683489139789965';
  const targetChannelId = '1237916344675209296';

  if (message.channel.id === sourceChannelId) {
    const targetChannel = client.channels.cache.get(targetChannelId);

    if (targetChannel || linkOnlyChannelIds) {
      const embed = message.embeds[0];
      const link = embed?.url || '';

      let contentToSend = '';
      let roleToPing = '';
      if (embed) {
        const seriesField = embed.fields.find(field => field.name === 'Series');
        const series = seriesField ? seriesField.value : '';
        const title = embed.title || '';

        if (series) {
          contentToSend += `**${series}:** `;
          // Check for partial matches in rolePings
          for (const [show, roleId] of rolePings) {
            if (title.includes(show) || series.includes(show)) {
              roleToPing = `<@&${roleId}>`;
              break; // Use the first matching role
            }
          }
        }
        if (title) {
          contentToSend += `${title}\n`;
        }
      }
      if (link) {
        contentToSend += `${link} `;
      }
      contentToSend += roleToPing;

      if (targetChannel) {
        const sentMessage = await targetChannel.send({
          content: contentToSend,
          embeds: []
        });

        // React with a "❤️"
        await sentMessage.crosspost();
        await sentMessage.react('❤️');
      }

      // Send the link message to the link-only channels if permissions allow
      const linkMessage = `**Open this link and HOLD!** \n${link}`;
      for (const linkOnlyChannelId of linkOnlyChannelIds) {
        const linkOnlyChannel = client.channels.cache.get(linkOnlyChannelId);
        if (linkOnlyChannel && linkOnlyChannel.permissionsFor(client.user).has(Permissions.FLAGS.SEND_MESSAGES)) {
          await linkOnlyChannel.send(linkMessage);
        }
      }
    }
  }
});
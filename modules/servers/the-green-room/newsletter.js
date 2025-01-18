client.on('messageCreate', async (message) => {
    const sourceChannelId = '1255683509763313767';
    const targetChannelId = '1237919086906708039';
    const roleIdToPing = '1261534850545094748';
  
    if (message.channel.id === sourceChannelId) {
      const targetChannel = client.channels.cache.get(targetChannelId);
      if (targetChannel) {
        let contentToSend = `<@&1237874872659742811> `;
  
        if (message.content) {
          contentToSend += message.content;
        }
  
        await targetChannel.send({
          content: contentToSend,
          embeds: message.embeds.length > 0 ? message.embeds : []
        });
      }
    }
  });
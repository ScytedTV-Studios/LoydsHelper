const { EmbedBuilder } = require('discord.js');

client.on('messageCreate', async message => {

    if (message.content.toLowerCase() === '!sync') {
        try {

          await message.delete();
  
          const embedMessage1 = new EmbedBuilder()
            .setColor('#FFFF00')
            .setDescription(`### How does this work?\n1. Everyone loads up the video link and [\`sync timer\`](https://www.scyted.tv/events/).\n2. Once the timer for the live discussion hits \`0h 0m 0s\`, everyone should unpause the video.\n3. Once at \`0h 0m 0s\`, the timer will start to count up and should match your current timestamp on the video.\n-# We don't start right as the video releases to give time for people to load it and get ready.`);
  
          const embedMessage2 = new EmbedBuilder()
            .setColor('#FFFF00')
            .setDescription(`**Sync Timer: https://www.scyted.tv/events/**`);
  
          await message.channel.send({ embeds: [embedMessage1, embedMessage2] });
  
        } catch (error) {
          console.error('Error sending thread information:', error);
          message.channel.send('Error sending sync information. Please try again later.');
        }
      }
  });
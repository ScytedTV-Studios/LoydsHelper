const { EmbedBuilder } = require('discord.js');

client.on('messageCreate', async message => {

    if (message.content.toLowerCase() === '!greenroom guidelines') {

      if (message.member.roles.cache.has('1237188255481597962')) {
        try {

          await message.delete();
  
          const currentTime = Math.floor(Date.now() / 1000);
  
          const embedMessage1 = new EmbedBuilder()
            .setColor('#FEEA3B')
            .setImage('https://cdn.scyted.tv/dropout/the-green-room/the-green-room-banner.jpg')
  
          const embedMessage2 = new EmbedBuilder()
            .setColor('#FEEA3B')
            .setImage('https://cdn.scyted.tv/website-assets/website/empty.png')
            .setDescription('## Guidelines\n- When Talking about newly aired content, __please make sure to add spoilers__ to your message for the first __48 Hours__ after it has aired.\n- Use your common sense and resepct others. I feel like I can trust the Dropout community to be decent to each other.');
  
          const embedMessage3 = new EmbedBuilder()
            .setColor('#FEEA3B')
            .setDescription(`**Updated:** <t:${currentTime}:R>`);
  
          await message.channel.send({ embeds: [embedMessage1] });
          await message.channel.send({ embeds: [embedMessage2] });
          const reactMessage = await message.channel.send({ embeds: [embedMessage3] });
  
          reactMessage.react('👍');
  
        } catch (error) {
          console.error('Error sending thread information:', error);
          message.channel.send('Error sending thread information. Please try again later.');
        }
      } else {
        message.channel.send('You do not have permission to run this command.');
      }
    }
  });
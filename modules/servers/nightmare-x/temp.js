const { EmbedBuilder } = require('discord.js');

client.on('messageCreate', async message => {

    if (message.content.toLowerCase() === '!nx temp') {

      if (message.member.roles.cache.has('1170039571480850472')) {
        try {

          await message.delete();

          const currentTime = Math.floor(Date.now() / 1000);
  
          const embedMessage1 = new EmbedBuilder()
            .setColor('#0026ff')
            .setImage('https://cdn.scyted.tv/website-assets/website/empty.png')
            .setDescription('# NX Alliances & Opps\nThese are all of NX\'s offical Alliances and Opps.');
  
          const embedMessage2 = new EmbedBuilder()
            .setColor('#00ff00')
            .setImage('https://cdn.scyted.tv/website-assets/website/empty.png')
            .setDescription('```Alliances```');
            
          const embedMessage3 = new EmbedBuilder()
            .setColor('#ff0000')
            .setImage('https://cdn.scyted.tv/website-assets/website/empty.png')
            .setDescription('```Opps```');
  
          const embedMessage4 = new EmbedBuilder()
            .setColor('#0026ff')
            .setDescription(`**Updated:** <t:${currentTime}:R>`);
  
          await message.channel.send({ embeds: [embedMessage1] });
          await message.channel.send({ embeds: [embedMessage2] });
          await message.channel.send({ embeds: [embedMessage3] });
          const reactMessage = await message.channel.send({ embeds: [embedMessage4] });
  
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
const { EmbedBuilder } = require('discord.js');

client.on('messageCreate', async message => {

    if (message.content.toLowerCase() === '!threads') {

      if (message.member.roles.cache.has('1237188255481597962')) {
        try {

          await message.delete();
  
          const currentTime = Math.floor(Date.now() / 1000);
  
          const embedMessage1 = new EmbedBuilder()
            .setColor('#FEEA3B')
            .setImage('https://cdn.scyted.tv/website-assets/website/empty.png')
            .setDescription('## Dimension 20\n- https://discord.com/channels/1237187833324638209/1237886608058093589\n- https://discord.com/channels/1237187833324638209/1237891739780382730\n- https://discord.com/channels/1237187833324638209/1237892035692728431\n- https://discord.com/channels/1237187833324638209/1237892645578346575\n- https://discord.com/channels/1237187833324638209/1237893056351699057\n- https://discord.com/channels/1237187833324638209/1237894359542927461\n- https://discord.com/channels/1237187833324638209/1237894582520250508\n- https://discord.com/channels/1237187833324638209/1237894765131993108\n- https://discord.com/channels/1237187833324638209/1237894998075113482\n- https://discord.com/channels/1237187833324638209/1237895308357140501\n- https://discord.com/channels/1237187833324638209/1237895506403790958\n- https://discord.com/channels/1237187833324638209/1237895733328478240\n- https://discord.com/channels/1237187833324638209/1237895922722144277\n- https://discord.com/channels/1237187833324638209/1237896106894164018\n- https://discord.com/channels/1237187833324638209/1237896266655076494\n- https://discord.com/channels/1237187833324638209/1237896487841562735\n- https://discord.com/channels/1237187833324638209/1237896660877574234\n- https://discord.com/channels/1237187833324638209/1237896821855227904');
  
          const embedMessage2 = new EmbedBuilder()
            .setColor('#FEEA3B')
            .setImage('https://cdn.scyted.tv/website-assets/website/empty.png')
            .setDescription('## Curently Airing\n- https://discord.com/channels/1237187833324638209/1237899821860261989\n- https://discord.com/channels/1237187833324638209/1237901423279079464\n- https://discord.com/channels/1237187833324638209/1237901105145446520\n- https://discord.com/channels/1237187833324638209/1237900657499832421\n- https://discord.com/channels/1237187833324638209/1237900417531121797');
  
          const embedMessage3 = new EmbedBuilder()
            .setColor('#FEEA3B')
            .setImage('https://cdn.scyted.tv/website-assets/website/empty.png')
            .setDescription('## Dropout Originals\n- https://discord.com/channels/1237187833324638209/1237900210277978252');
  
          const embedMessage4 = new EmbedBuilder()
            .setColor('#FEEA3B')
            .setImage('https://cdn.scyted.tv/website-assets/website/empty.png')
            .setDescription('## Coming Soon\n- https://discord.com/channels/1237187833324638209/1237900801846804603\n- https://discord.com/channels/1237187833324638209/1237899550186803272');
  
          const embedMessage5 = new EmbedBuilder()
            .setColor('#FEEA3B')
            .setImage('https://cdn.scyted.tv/website-assets/website/empty.png')
            .setDescription('## Other Dropout Originals\n- https://discord.com/channels/1237187833324638209/1240708348270088323\n- https://discord.com/channels/1237187833324638209/1244652583772094474\n- https://discord.com/channels/1237187833324638209/1244652931702329385');
  
          const embedMessage6 = new EmbedBuilder()
            .setColor('#FEEA3B')
            .setImage('https://cdn.scyted.tv/website-assets/website/empty.png')
            .setDescription('## Old CollegeHumor\n- https://discord.com/channels/1237187833324638209/1242196848475901982');
  
          const embedMessage7 = new EmbedBuilder()
            .setColor('#FEEA3B')
            .setDescription(`**Updated:** <t:${currentTime}:R>`);
  
          await message.channel.send({ embeds: [embedMessage1] });
          await message.channel.send({ embeds: [embedMessage2] });
          await message.channel.send({ embeds: [embedMessage3] });
          await message.channel.send({ embeds: [embedMessage4] });
          await message.channel.send({ embeds: [embedMessage5] });
          await message.channel.send({ embeds: [embedMessage6] });
          await message.channel.send({ embeds: [embedMessage7] });
  
        } catch (error) {
          console.error('Error sending thread information:', error);
          message.channel.send('Error sending thread information. Please try again later.');
        }
      } else {
        message.channel.send('You do not have permission to run this command.');
      }
    }
  });

  client.on('messageCreate', async message => {

    if (message.content.toLowerCase() === '!threads d20') {

      if (message.member.roles.cache.has('1237188255481597962')) {
        try {

          await message.delete();
  
          const currentTime = Math.floor(Date.now() / 1000);
  
          const embedMessage1 = new EmbedBuilder()
            .setColor('#FEEA3B')
            .setImage('https://cdn.scyted.tv/website-assets/website/empty.png')
            .setDescription('## Dimension 20\n- https://discord.com/channels/1237187833324638209/1237886608058093589\n- https://discord.com/channels/1237187833324638209/1237891739780382730\n- https://discord.com/channels/1237187833324638209/1237892035692728431\n- https://discord.com/channels/1237187833324638209/1237892645578346575\n- https://discord.com/channels/1237187833324638209/1237893056351699057\n- https://discord.com/channels/1237187833324638209/1237894359542927461\n- https://discord.com/channels/1237187833324638209/1237894582520250508\n- https://discord.com/channels/1237187833324638209/1237894765131993108\n- https://discord.com/channels/1237187833324638209/1237894998075113482\n- https://discord.com/channels/1237187833324638209/1237895308357140501\n- https://discord.com/channels/1237187833324638209/1237895506403790958\n- https://discord.com/channels/1237187833324638209/1237895733328478240\n- https://discord.com/channels/1237187833324638209/1237895922722144277\n- https://discord.com/channels/1237187833324638209/1237896106894164018\n- https://discord.com/channels/1237187833324638209/1237896266655076494\n- https://discord.com/channels/1237187833324638209/1237896487841562735\n- https://discord.com/channels/1237187833324638209/1237896660877574234\n- https://discord.com/channels/1237187833324638209/1237896821855227904');
  
          const embedMessage2 = new EmbedBuilder()
            .setColor('#FEEA3B')
            .setDescription(`**Updated:** <t:${currentTime}:R>`);
  
          await message.channel.send({ embeds: [embedMessage1, embedMessage2] });
  
        } catch (error) {
          console.error('Error sending thread information:', error);
          message.channel.send('Error sending thread information. Please try again later.');
        }
      } else {
        message.channel.send('You do not have permission to run this command.');
      }
    }
  });
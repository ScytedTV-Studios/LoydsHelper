const { EmbedBuilder } = require('discord.js');

client.on('messageCreate', async message => {
    if (message.content.toLowerCase() === '!new trailer' && !message.author.bot) {

      if (!message.member.roles.cache.has('1237188255481597962')) {
        return message.channel.send("*Only moderators have access to this command.*");
      }

      const channel = message.guild.channels.cache.get('1237916344675209296');
      if (!channel) return console.error('*Channel not found!*');

      const questions = [
        '**Name of the trailer:**',
        '**Trailer URL:**',
        '**Live Event:**'
      ];

      const answers = {};

      const filter = m => !m.author.bot && m.author.id === message.author.id;

      for (const question of questions) {
        const questionEmbed = new EmbedBuilder()
          .setDescription(question)
          .setColor('#FEEA3B');

        await message.channel.send({ embeds: [questionEmbed] });
        const collected = await message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });
        const answer = collected.first().content.trim();
        answers[question] = answer;
      }

      const showName = answers['**Name of the trailer:**'];
      const trailerURL = answers['**Trailer URL:**'];
      const liveEvent = answers['**Live Event:**'].toLowerCase();

      const trailerMessage = await channel.send(`**New Trailer:** ${showName}\n${trailerURL} <@&1237940743801278556>`);

      await trailerMessage.crosspost();
      await trailerMessage.react('❤️');
      await message.channel.send(`The trailer announcement was posted in <#${channel.id}>!`);

      if (liveEvent === 'yes') {
        const liveEventEmbed = new MessageEmbed()
          .setDescription('**Join the <#1238005967967223878>!**')
          .setColor('#FEEA3B');

        await channel.send({ embeds: [liveEventEmbed] });
      }
    } if (message.content.toLowerCase() === '!new release' && !message.author.bot) {

      if (!message.member.roles.cache.has('1237188255481597962')) {
        return message.channel.send("*Only moderators have access to this command.*");
      }

      const channel = message.guild.channels.cache.get('1237916344675209296'); 
      if (!channel) return console.error('*Channel not found!*');

      const questions = [
        '**Name of the show:**',
        '**Video Title:**',
        '**Video URL:**',
        '**Ping Role ID:**',
        '**Live Event:**'
      ];

      const answers = {};

      const filter = m => !m.author.bot && m.author.id === message.author.id;

      for (const question of questions) {
        const questionEmbed = new MessageEmbed()
          .setDescription(question)
          .setColor('#FEEA3B');

        await message.channel.send({ embeds: [questionEmbed] });
        const collected = await message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });
        const answer = collected.first().content.trim();
        answers[question] = answer;
      }

      const showName = answers['**Name of the show:**'];
      const videoTitle = answers['**Video Title:**']
      const videoURL = answers['**Video URL:**'];
      const pingRoleID = answers['**Ping Role ID:**'];
      const liveEvent = answers['**Live Event:**'].toLowerCase();

      const videoMessage = await channel.send(`**${showName}:** ${videoTitle}\n${videoURL} <@&${pingRoleID}>`);

      await videoMessage.crosspost();
      await videoMessage.react('❤️');
      await message.channel.send(`The new release announcement was posted in <#${channel.id}>!`);

      if (liveEvent === 'yes') {
        const liveEventEmbed = new MessageEmbed()
          .setDescription('**Join the <#1238005967967223878>!**')
          .setColor('#FEEA3B');

        await channel.send({ embeds: [liveEventEmbed] });
      }
    }
  });
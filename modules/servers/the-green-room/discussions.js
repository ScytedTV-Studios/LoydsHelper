const { PermissionsBitField, EmbedBuilder } = require('discord.js');

client.on('messageCreate', async message => {
  if (message.content.toLowerCase().startsWith('!discussion open') && message.member.roles.cache.has('1237874872659742811')) {
    try {
      const channel = message.channel;

      const args = message.content.match(/"([^"]*)"/g);

      if (args === null) {
        await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
          [PermissionsBitField.Flags.SendMessages]: true
        });

        await message.delete();

        const embedMessage = new EmbedBuilder()
          .setColor('#00FF00')
          .setDescription('**<:check:1239354102467792947> Live Discussion Open!**');

        await channel.send({ embeds: [embedMessage] });
      } else {
        const parsedArgs = args.map(arg => arg.slice(1, -1));
        const roleId = parsedArgs[0];
        const showName = parsedArgs[1];
        const bannerImage = parsedArgs[2];
        const eventUrl = parsedArgs[3];
        const timeString = parsedArgs[4];

        const [time, modifier] = timeString.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === 'PM' && hours !== 12) {
          hours += 12;
        }
        if (modifier === 'AM' && hours === 12) {
          hours = 0;
        }

        const today = new Date();
        today.setHours(hours);
        today.setMinutes(minutes);
        today.setSeconds(0);
        today.setMilliseconds(0);
        const startTime = Math.floor(today.getTime() / 1000);

        const mainMessageContent = `**Live Discussion:** ${showName}\n__Countdown__: ${eventUrl}\n__Starting__: <t:${startTime}:f>`;

        const mainMessage = await channel.send({ content: mainMessageContent });

        await channel.send(bannerImage);

        const mainMessageLink = await channel.messages.fetch(mainMessage.id);
        mainMessageLink.suppressEmbeds(true);

        await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
          [PermissionsBitField.Flags.SendMessages]: true
        });

        await message.delete();

        const embedMessage = new EmbedBuilder()
          .setColor('#00FF00')
          .setDescription('<:checkmark:1330976666016550932> `Live Discussion Open!`');

        await channel.send({ embeds: [embedMessage] });

        await mainMessage.pin();

        const countdownEmbed1 = new EmbedBuilder()
          .setColor('#FFFF00')
          .setDescription(`### How does this work?\n1. Everyone loads up the video link and [\`sync timer\`](https://www.scyted.tv/events/).\n2. Once the timer for the live discussion hits \`0h 0m 0s\`, everyone should unpause the video.\n3. Once at \`0h 0m 0s\`, the timer will start to count up and should match your current timestamp on the video.\n-# We don't start right as the video releases to give time for people to load it and get ready.`);

        const countdownEmbed2 = new EmbedBuilder()
          .setColor('#FFFF00')
          .setDescription(`**Sync Timer: ${eventUrl}**`);

        const countdownEmbed3 = new EmbedBuilder()
          .setColor('#FFFF00')
          .setDescription(`-# To bring this information up again, use \`!sync\`.`);

        await channel.send({ embeds: [countdownEmbed1] });
        await channel.send({ embeds: [countdownEmbed2] });
        await channel.send({ embeds: [countdownEmbed3] });
      }
    } catch (error) {
      console.error('Error sending discussion message:', error);
      const embed = new EmbedBuilder()
        .setColor('Red')
        .setDescription('<:crossmark:1330976664535961753> `Error sending discussion message. Please check your input and try again.`');
      // message.channel.send('Error sending discussion message. Please check your input and try again.');
      channel.send({ embeds: [embed] });
    }
  }
});

client.on('messageCreate', async message => {
  if (message.content.toLowerCase().startsWith('!discussion close') && message.member.roles.cache.has('1237874872659742811')) {
    try {
      const channel = message.channel;

      const everyoneRole = message.guild.roles.everyone;
      const permissions = channel.permissionOverwrites.cache.get(everyoneRole.id);
      if (permissions && !permissions.allow.has(PermissionsBitField.Flags.SendMessages) && permissions.deny.has(PermissionsBitField.Flags.SendMessages)) {
        await message.delete();
        return;
      }

      await channel.permissionOverwrites.edit(everyoneRole, {
        [PermissionsBitField.Flags.SendMessages]: false
      });

      const pinnedMessages = await channel.messages.fetchPinned();

      await Promise.all(pinnedMessages.map(async pinnedMessage => {
        await pinnedMessage.unpin();
      }));

      await message.delete();

      const closeEmbed = new EmbedBuilder()
        .setColor('Red')
        .setDescription('<:crossmark:1330976664535961753> `Live Discussion Closed!`');

      await channel.send({ embeds: [closeEmbed] });

      const args = message.content.match(/"([^"]*)"/);
      if (args) {
        const link = args[1];

        const linkEmbed = new EmbedBuilder()
          .setDescription(`Continue this discussion in: ${link}`)
          .setColor('#FFFF00');

        await channel.send({ embeds: [linkEmbed] });
      }
    } catch (error) {
      console.error('Error closing discussion:', error);
      message.channel.send('Error closing discussion. Please try again later.');
    }
  }
});

client.on('messageCreate', async message => {
  if (message.content.toLowerCase().startsWith('!discussion new') && message.member.roles.cache.has('1237874872659742811')) {
    try {
      const channel = message.channel;

      const args = message.content.match(/"([^"]*)"/g);

      if (args === null || args.length < 6) {
        await message.channel.send('Invalid arguments. Please ensure all required arguments are provided.');
        return;
      }

      await message.delete();

      const parsedArgs = args.map(arg => arg.slice(1, -1));
      const dateString = parsedArgs[0];
      const startTimeString = parsedArgs[1];
      const endTimeString = parsedArgs[2];
      const showName = parsedArgs[3];
      const bannerImage = parsedArgs[4];
      const eventUrl = parsedArgs[5];

      const eventDate = new Date(dateString);
      if (isNaN(eventDate)) {
        await message.channel.send('Invalid date format. Please use "Month Day, Year" format.');
        return;
      }

      const parseTime = (timeString, date) => {
        const [time, modifier] = timeString.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === 'PM' && hours !== 12) {
          hours += 12;
        }
        if (modifier === 'AM' && hours === 12) {
          hours = 0;
        }
        date.setHours(hours);
        date.setMinutes(minutes);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date;
      };

      const startTime = Math.floor(parseTime(startTimeString, new Date(eventDate)).getTime() / 1000);
      const endTime = Math.floor(parseTime(endTimeString, new Date(eventDate)).getTime() / 1000);

      const mainMessageContent = `**Next Live Discussion:** ${showName}`;

      const mainMessage = await channel.send({ content: mainMessageContent });

      await channel.send(bannerImage);

      const mainMessageLink = await channel.messages.fetch(mainMessage.id);
      mainMessageLink.suppressEmbeds(true);

      const countdownEmbed1 = new EmbedBuilder()
        .setColor('#FFFF00')
        .setDescription(`**Channel Opens:** <t:${startTime}:f>\n**Everyone Unpauses:** <t:${endTime}:f>`);

      const countdownEmbed2 = new EmbedBuilder()
        .setColor('#FFFF00')
        .setDescription(`**Sync Timer: ${eventUrl}**`);

      await channel.send({ embeds: [countdownEmbed1] });
      await channel.send({ embeds: [countdownEmbed2] });

    } catch (error) {
      console.error('Error sending discussion message:', error);
      message.channel.send('Error sending discussion message. Please check your input and try again.');
    }
  }
});
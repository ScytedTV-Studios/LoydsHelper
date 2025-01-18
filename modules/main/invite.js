client.on('messageCreate', async message => {

    if (message.author.id !== '852572302590607361') return;

    const args = message.content.split(' ');
    const command = args.shift().toLowerCase();

    if (command === '!invite') {

      const channelID = args[0];

      if (!channelID) {
        return message.channel.send('Please provide a channel ID!');
      }

      const channel = message.guild.channels.cache.get(channelID);

      if (!channel) {
        return message.channel.send('Channel not found!');
      }

      try {
        const invite = await channel.createInvite({ maxAge: 0 }); 
        message.channel.send(`Invite created: ${invite.url}`);
      } catch (error) {
        console.error('Error creating invite:', error);
        message.channel.send('Error creating invite. Please try again later.');
      }
    }
  });
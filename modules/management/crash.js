client.on('messageCreate', async message => {
    const USER_IDS = ['852572302590607361', '1147308835808235581'];

    client.user.setPresence({
      status: 'idle',
      activities: [
        {
          name: 'Restarting...',
          type: 4,
        },
      ],
    });

    if (USER_IDS.includes(message.author.id) && message.content === '!crash') {

      console.log('Crash command received. The bot will crash now.');

      throw new Error('Intentional crash for testing purposes!');
    }
  });
client.on('messageCreate', async (message) => {

    if (message.author.id !== '852572302590607361' || !message.content.startsWith('!compare')) {
      return;
    }
  
    const args = message.content.split(' ');
    if (args.length !== 3) {
      message.channel.send('**Usage:** `!compare <Server ID 1> <Server ID 2>`');
      return;
    }
  
    const serverId1 = args[1];
    const serverId2 = args[2];
  
    try {
      const guild1 = await client.guilds.fetch(serverId1);
      const guild2 = await client.guilds.fetch(serverId2);
  
      const memberCount1 = guild1.memberCount;
      const memberCount2 = guild2.memberCount;
  
      const guild1Members = await guild1.members.fetch();
      const guild2Members = await guild2.members.fetch();
  
      const uniqueUsers = new Set([...guild1Members.keys(), ...guild2Members.keys()]);
  
      const totalMemberCount = memberCount1 + memberCount2;
      const uniqueMemberCount = uniqueUsers.size;
  
      message.channel.send(
        `## Server Comparison\n` +
        `${guild1.name}: \`${memberCount1} Members\`\n` +
        `${guild2.name}: \`${memberCount2} Members\`\n\n` +
        `Total Combined: \`${totalMemberCount} Members\`\n` +
        `Total Unique Combined: \`${uniqueMemberCount} Members\``
      );
    } catch (error) {
      console.error('Error fetching server data:', error);
      message.channel.send('There was an error fetching the server information. Please check the server IDs.');
    }
  });
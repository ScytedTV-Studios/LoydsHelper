const { ActivityType } = require('discord.js');

const statuses = [
  () => {
    const serverCount = client.guilds.cache.size;
    return { name: `${serverCount} servers`, type: ActivityType.Watching };
  },
  () => {
    const userCount = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
    return { name: `${userCount} users`, type: ActivityType.Listening };
  },
];
  
  let statusIndex = 0;
  function updateStatus() {
    if (client.user) {
      const status = statuses[statusIndex]();
      client.user.setPresence({
        status: 'online',
        activities: [{ name: status.name, type: status.type }],
      });
      statusIndex = (statusIndex + 1) % statuses.length;
    } else {
      console.warn('Client user is not ready yet.');
    }
  }

setInterval(updateStatus, 30000);
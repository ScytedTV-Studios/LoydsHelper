const { ActivityType } = require('discord.js');

const statuses = [
    () => ({ name: `${client.guilds.cache.size} servers`, type: ActivityType.Watching }),
    () => ({ name: `${client.users.cache.size} users`, type: ActivityType.Listening }),
  ];
  
let statusIndex = 0;
function updateStatus() {
  if (client.user) {
    const status = statuses[statusIndex]();
    client.user.setActivity(status.name, { type: status.type });
    statusIndex = (statusIndex + 1) % statuses.length;
  } else {
    console.warn('Client user is not ready yet.');
  }
}

setInterval(updateStatus, 10000);
const fs = require('fs');
const path = require('path');

const FIRST_SERVER_ID = '1237190825935372378';
const FIRST_ROLE_ID = '1237218783899160648';
const SECOND_SERVER_ID = '1237187833324638209';
const SECOND_ROLE_ID = '1237187983950614618';
const LIVE_ROLE_ID = '1311105195899355158';

setInterval(async () => {

  const dropoutCast = loadJSONFile('dropout-cast.json');
  const dropoutLiveMembers = loadJSONFile('dropout-live-members.json');

  try {

    const firstServer = await client.guilds.fetch(FIRST_SERVER_ID);
    const secondServer = await client.guilds.fetch(SECOND_SERVER_ID);

    await assignRoles(firstServer, FIRST_ROLE_ID, dropoutCast);
    await assignRoles(secondServer, SECOND_ROLE_ID, dropoutCast);

    await assignLiveRole(secondServer, LIVE_ROLE_ID, dropoutLiveMembers);

  } catch (error) {

  }
}, 10000);

function loadJSONFile(filePath) {
  try {
    const data = fs.readFileSync(path.join(process.cwd(), 'config', filePath), 'utf8');
    return JSON.parse(data).members;
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return [];
  }
}

async function assignRoles(server, roleId, memberList) {
  try {
    const members = await server.members.fetch();
    members.forEach(member => {
      if (memberList.includes(member.id)) {

        if (!member.roles.cache.has(roleId)) {
          member.roles.add(roleId)
            .then(() => console.log(`Assigned role to ${member.user.tag} in ${server.name}`))
            .catch(console.error);
        }
      }
    });
  } catch (error) {
    console.error(`Error processing server ${server.name}:`, error);
  }
}

async function assignLiveRole(server, roleId, liveMemberList) {
  try {
    const members = await server.members.fetch();
    members.forEach(member => {
      if (liveMemberList.includes(member.id)) {

        if (!member.roles.cache.has(roleId)) {
          member.roles.add(roleId)
            .then(() => console.log(`Assigned LIVE role to ${member.user.tag} in ${server.name}`))
            .catch(console.error);
        }
      }
    });
  } catch (error) {
    console.error(`Error processing server ${server.name} for LIVE role:`, error);
  }
}
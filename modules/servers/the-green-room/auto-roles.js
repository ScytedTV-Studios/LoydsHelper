const fs = require('fs');
const path = require('path');

const FIRST_SERVER_ID = '1237190825935372378';
const FIRST_ROLE_ID = '1237218783899160648';
const SECOND_SERVER_ID = '1237187833324638209';
const SECOND_ROLE_ID = '1237187983950614618';
const LIVE_ROLE_ID = '1311105195899355158';

setInterval(async () => {

  // Reload the JSON files each time the check runs
  const dropoutCast = loadJSONFile('dropout-cast.json');
  const dropoutLiveMembers = loadJSONFile('dropout-live-members.json');

  try {
    // Get the servers (guilds)
    const firstServer = await client.guilds.fetch(FIRST_SERVER_ID);
    const secondServer = await client.guilds.fetch(SECOND_SERVER_ID);

    // Process members in both servers
    await assignRoles(firstServer, FIRST_ROLE_ID, dropoutCast);
    await assignRoles(secondServer, SECOND_ROLE_ID, dropoutCast);

    // Additional check for members in dropout-live-members.json
    await assignLiveRole(secondServer, LIVE_ROLE_ID, dropoutLiveMembers);

    // console.log('Role assignment check complete.');
  } catch (error) {
    // console.error('Error during periodic role assignment check:', error);
  }
}, 10000);

// Helper function to load JSON files dynamically
function loadJSONFile(filePath) {
  try {
    const data = fs.readFileSync(path.join(process.cwd(), 'modules/config', filePath), 'utf8');
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
        // Check if the member already has the role
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

// New function to assign the LIVE role based on dropout-live-members.json
async function assignLiveRole(server, roleId, liveMemberList) {
  try {
    const members = await server.members.fetch();
    members.forEach(member => {
      if (liveMemberList.includes(member.id)) {
        // Check if the member already has the LIVE role
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
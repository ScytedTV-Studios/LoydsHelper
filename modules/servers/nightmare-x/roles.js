const { PermissionsBitField, EmbedBuilder } = require('discord.js');

client.on('messageCreate', async message => {

    if (message.content.toLowerCase() === '!nx roles') {

      if (message.member.roles.cache.has('1293108785086468166')) {
        try {

          await message.delete();
  
          const currentTime = Math.floor(Date.now() / 1000);
  
          const embedMessage1 = new EmbedBuilder()
            .setColor('#0026ff')
            .setImage('https://cdn.scyted.tv/website-assets/website/empty.png')
            .setDescription('# NX Clan Role Promotion Form\nThink you\'ve earned a promotion in the NX Clan? Fill out this form to apply for a new role. Whether you\'re aiming for Co-Owner, Moderator, or a specific fighter group, make your case here. We want to know about your activity, contributions, and dedication to the clan. Be honest and detailed—this is your chance to show why you deserve to move up!');
  
          const embedMessage2 = new EmbedBuilder()
            .setColor('#0026ff')
            .setImage('https://cdn.scyted.tv/website-assets/website/empty.png')
            .setDescription('## Role Info:\n- **Primary Fighter:** The elite fighters of the clan—best of the best. This group takes on the toughest challenges and represents NX at the highest level.\n- **Secondary Fighter:** Skilled members in the middle tier. They\'re reliable and solid in combat, often backing up the Primary Fighters.\n- **Alternative Fighter:** Laid-back fighters who may not be the strongest, but still contribute to the clan\'s efforts when needed.\n- **Moderator:** Helps manage the Discord server, enforce rules, and keep things running smoothly.\n- **Co-Owner:** Works closely with leadership to make important decisions and help guide the clan\'s future.\n- **Clan Recruiter:** Responsible for finding and inviting new members to join the NX Clan, ensuring they meet the requirements.\n- **Roster Manager:** Organizes and updates the clan roster, making sure everyone is assigned to the right roles and teams.\n- **Discord Server Admin:** Oversees the server setup, roles, permissions, and handles any technical issues.\n- **Team A & Team B:** Mini teams within the clan that are randomly assigned to members for certain events, competitions, or practice matches.\n### Apply Here: https://forms.gle/CCqpjSw7zWyjUtVE9');  
  
          const embedMessage3 = new EmbedBuilder()
            .setColor('#0026ff')
            .setDescription(`**Updated:** <t:${currentTime}:R>`);
  
          await message.channel.send({ embeds: [embedMessage1] });
          await message.channel.send({ embeds: [embedMessage2] });
          const reactMessage = await message.channel.send({ embeds: [embedMessage3] });
  
          reactMessage.react('👍');
  
        } catch (error) {
          console.error('Error sending thread information:', error);
          message.channel.send('Error sending thread information. Please try again later.');
        }
      } else {
        message.channel.send('You do not have permission to run this command.');
      }
    }
  });
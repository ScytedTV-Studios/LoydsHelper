client.on('guildMemberAdd', async member => {

    const welcomedMembers = new Set();

    try {

      if (member.guild.id !== '1293108785065234529') return;

      const systemChannel = member.guild.systemChannel;
      if (!systemChannel) return console.error('System channel not found!');

      if (welcomedMembers.has(member.id)) {
        return console.log("Member has already been welcomed.");
      }

      const welcomeEmbed = new EmbedBuilder()
        .setDescription(`Hey ${member}!👋 Welcome to the NX Clan!☣️\n\n💬 Introduce yourself and let us know what you're all about.\n\n📜 Make sure to check out the membership requirements! Knowing the rules helps everyone enjoy their time here.\n\n🔔 Stay updated on news and events! We'll keep you informed about what's happening in the clan.\n\nHappy to have you with us—let's get stomping`)
        .setColor('#0026ff')
        .setImage('https://images-ext-1.discordapp.net/external/oj9oeQgeE6MSQbQt3hYX1G0YL8Xqqb9eH2yFVE3B-hY/https/media1.tenor.com/m/Mbc80hBd4moAAAAC/welcome-discord.gif');

      const welcomeButton = new MessageButton()
        .setCustomId(member.id) 
        .setLabel('Welcome')
        .setStyle('PRIMARY');

      const row = new MessageActionRow().addComponents(welcomeButton);

      const welcomeMessage = await systemChannel.send({ embeds: [welcomeEmbed], components: [row] });

      welcomedMembers.add(member.id); 

      const usersClicked = new Set(); 

      const filter = i => i.customId === member.id; 

      const collector = welcomeMessage.createMessageComponentCollector({ filter, time: 3600000 }); 

      collector.on('collect', async interaction => {
        try {
          interaction.deferUpdate(); 
          console.log(`Button clicked by: ${interaction.user.tag}`);
          if (usersClicked.has(interaction.user.id)) return; 
          const welcomeMessage = `**${interaction.user}** welcomes you, ${member}!`;
          await systemChannel.send(welcomeMessage);
          usersClicked.add(interaction.user.id); 
        } catch (error) {
          console.error('Error processing button click:', error);
        }
      });

      setTimeout(() => {
        row.components.forEach(button => {
          button.setDisabled(true);
        });
        welcomeMessage.edit({ components: [row] });
        collector.stop();
      }, 3600000);
    } catch (error) {
      console.error('Error handling guildMemberAdd event:', error);
    }
  });
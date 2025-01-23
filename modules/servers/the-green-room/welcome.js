client.on('guildMemberAdd', async member => {

    const welcomedMembers = new Set();

    try {

      if (member.guild.id !== '1237187833324638209') return;

      const systemChannel = '1238493497036898354';
      if (!systemChannel) return console.error('System channel not found!');

      if (welcomedMembers.has(member.id)) {
        return console.log("Member has already been welcomed.");
      }

      const welcomeEmbed = new EmbedBuilder()
        .setDescription(`${member} just joined the server, welcome!`)
        .setColor('#FEEA3B');

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

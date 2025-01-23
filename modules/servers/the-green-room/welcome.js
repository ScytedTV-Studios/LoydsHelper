const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

client.on('guildMemberAdd', async (member) => {
  const welcomedMembers = new Set();

  try {
    if (member.guild.id !== '1237187833324638209') return;

    const systemChannel = member.guild.systemChannel;
    if (!systemChannel) return console.error('System channel not found!');

    if (welcomedMembers.has(member.id)) {
      return console.log('Member has already been welcomed.');
    }

    const welcomeEmbed = new EmbedBuilder()
      .setDescription(`${member} just joined the server, welcome!`)
      .setColor('#FEEA3B');

    const welcomeButton = new ButtonBuilder()
      .setCustomId(member.id)
      .setLabel('Welcome')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(welcomeButton);

    const welcomeMessage = await systemChannel.send({ embeds: [welcomeEmbed], components: [row] });

    welcomedMembers.add(member.id);

    const usersClicked = new Set();

    const filter = (interaction) => interaction.customId === member.id;

    const collector = welcomeMessage.createMessageComponentCollector({ filter, time: 3600000 });

    collector.on('collect', async (interaction) => {
      try {
        await interaction.deferUpdate();
        console.log(`Button clicked by: ${interaction.user.tag}`);
        if (usersClicked.has(interaction.user.id)) return;

        const welcomeMessageText = `**${interaction.user}** welcomes you, ${member}!`;
        await systemChannel.send(welcomeMessageText);
        usersClicked.add(interaction.user.id);
      } catch (error) {
        console.error('Error processing button click:', error);
      }
    });

    setTimeout(async () => {
      row.components.forEach((button) => button.setDisabled(true));
      await welcomeMessage.edit({ components: [row] });
      collector.stop();
    }, 3600000);
  } catch (error) {
    console.error('Error handling guildMemberAdd event:', error);
  }
});
const { EmbedBuilder } = require('discord.js');

const ownerId = "852572302590607361";

client.on('messageCreate', async (message) => {
    // Check if the message starts with the command and is sent by the owner
    if (message.content.startsWith('!embed') && message.author.id === ownerId) {
      // Delete the message containing the command
      message.delete();
  
      // Send embeds
      const embed = new EmbedBuilder()
        .setDescription("Empty embed.")
        .setColor('#FFEA00');
  
      // Send the embeds to the same channel
      await message.channel.send({ embeds: [embed] });
    } if (message.content.startsWith('!scytedtv-shows') && message.author.id === ownerId) {
      // Delete the message containing the command
      message.delete();
  
      // Send embeds
      const embed1 = new EmbedBuilder()
        .setImage('https://cdn.scyted.tv/website-assets/website/shows.jpg')
        .setColor('#FFEA00');
  
      const embed2 = new EmbedBuilder()
        .setTitle('Ink & Ideals')
        .setURL('https://www.scyted.tv/show/ink-and-ideals')
        .setDescription('Ink & Ideals is a philosophical video essay series about pop culture and anime.')
        .addFields(
          { name: 'Channel', value: '[Ink & Ideals](https://www.youtube.com/@inkandideals)', inline: true },
          { name: 'Seasons', value: '[Season 1](https://www.youtube.com/playlist?list=PL5irix3qFbXPNNdVPnbiANEVBVyls9mzg)\n[Season 2](https://www.youtube.com/playlist?list=PL5irix3qFbXNgUiw1_f2OT_MOEt2HypoR)', inline: true },
        )
        .setImage('https://cdn.scyted.tv/website-assets/show-banners/ink-and-ideals.jpg')
        .setColor('#FFEA00');
  
      const embed3 = new EmbedBuilder()
        .setTitle('ScytedTV News')
        .setURL('https://www.scyted.tv/show/scytedtv-news')
        .setDescription('A regular news show about pop culture and topics we find interesting!')
        .addFields(
          { name: 'Channel', value: '[ScytedTV News](https://www.youtube.com/@scytedtvnews)', inline: true },
          { name: 'Seasons', value: '[Season 1](https://www.youtube.com/playlist?list=PL5irix3qFbXNy6-PttkNPjkINJ0K5uqCg)', inline: true },
        )
        .setImage('https://cdn.scyted.tv/website-assets/show-banners/scytedtv-news.jpg')
        .setColor('#FFEA00');
  
      const embed4 = new EmbedBuilder()
        .setTitle('Inside Mind')
        .setURL('https://www.scyted.tv/show/inside-mind')
        .setDescription('Join Loyd Osborne on "Inside Mind" as he explores mental health and existential topics through candid conversations with experts and real people, creating a safe space for vulnerability. Dive into the complexities of the human mind, confront uncomfortable truths, and find practical insights for personal growth.')
        .addFields(
          { name: 'Channel', value: '[Inside Mind](https://www.youtube.com/@insidemindscytedtv)', inline: true },
          { name: 'Seasons', value: '[Season 1](https://www.youtube.com/playlist?list=PL5irix3qFbXPtqBIvatO-m4RWqANi0xVV)', inline: true },
        )
        .setImage('https://cdn.scyted.tv/website-assets/show-banners/inside-mind.jpg')
        .setColor('#FFEA00');
  
      const embed5 = new EmbedBuilder()
        .setTitle('Milo\'s Life')
        .setURL('https://www.scyted.tv/show/milos-life')
        .setDescription('Milo is the dog of Camie, one of ScytedTV\'s editors. Camie has dedicated a part of her life to helping us share the life of her dog, Milo. Throughout this next year (and maybe more), you will be seeing weekly update videos about Milo\'s life and what he\'s been up to.')
        .addFields(
          { name: 'Channel', value: '[Milo\'s Life](https://www.youtube.com/@miloslifestv)', inline: true },
          { name: 'Seasons', value: '[Season 1](https://www.youtube.com/playlist?list=PLGyDiHCrWI7EFd0SI00uFtxEqPPdaM6IY)', inline: true },
        )
        .setImage('https://cdn.scyted.tv/website-assets/show-banners/milos-life.jpg')
        .setColor('#FFEA00');
  
      const embed6 = new EmbedBuilder()
        .setTitle('Clever Remarks')
        .setURL('https://www.scyted.tv/show/clever-remarks')
        .setDescription('The Game Show where we answer some of the world\'s silliest questions.')
        .addFields(
          { name: 'Channel', value: '[Clever Remarks](https://www.youtube.com/@cleverremarks)', inline: true },
          { name: 'Seasons', value: '[Season 1](https://www.youtube.com/playlist?list=PLYdXesedYII5q5Bc1O-OFsBV8LU-3uepK)\n[Making of Season 1](https://www.youtube.com/playlist?list=PLYdXesedYII7hL-QT3Xvj9U5ZEyGSAH7T)', inline: true },
        )
        .setImage('https://cdn.scyted.tv/website-assets/show-banners/clever-remarks.jpg')
        .setColor('#FFEA00');
  
      // Send the embeds to the same channel
      await message.channel.send({ embeds: [embed1, embed2, embed3, embed4, embed5, embed6] });
    } if (message.content.startsWith('!scytedtv-social') && message.author.id === ownerId) {
      // Delete the message containing the command
      message.delete();
  
      // Send embeds
      const embed1 = new EmbedBuilder()
        .setImage('https://cdn.scyted.tv/website-assets/website/social-media.jpg')
        .setColor('#FFEA00');
  
      const embed2 = new EmbedBuilder()
        .setTitle('YouTube')
        .setURL('https://youtube.com/@scytedtv')
        .addFields(
          { name: 'Official', value: '[ScytedTV Studios](https://www.youtube.com/@scytedtv)\n[ScytedTV Podcasts](https://www.youtube.com/@scytedtvpodcasts)\n[ScytedTV Gaming](https://www.youtube.com/@scytedtvgaming)\n[ScytedTV Creators](https://www.youtube.com/@stvcreators)', inline: true },
          { name: 'Shows', value: '[Clever Remarks](https://www.youtube.com/@cleverremarks)\n[Milo\'s Life](https://www.youtube.com/@miloslifestv)\n[Inside Mind](https://www.youtube.com/@insidemindscytedtv)\n[ScytedTV News](https://www.youtube.com/@scytedtvnews)\n[Ink & Ideals](https://www.youtube.com/@inkandideals)', inline: true },
        )
        .setImage('https://cdn.scyted.tv/website-assets/website/youtube.png')
        .setColor('#FFEA00');
  
      const embed3 = new EmbedBuilder()
        .setTitle('Twitter (X)')
        .setURL('https://twitter.com/scytedtv')
        .addFields(
          { name: 'Official', value: '[ScytedTV Studios](https://twitter.com/scytedtv)\n[ScytedTV Creators](https://twitter.com/stvcreators)', inline: true },
          { name: 'Shows', value: '[Clever Remarks](https://twitter.com/cleverremarkstv)\n[Milo\'s Life](https://twitter.com/miloslifestv)\n[ScytedTV News](https://twitter.com/scytedtvnews)', inline: true },
        )
        .setImage('https://cdn.scyted.tv/website-assets/website/twitter.jpg')
        .setColor('#FFEA00');
  
      const embed4 = new EmbedBuilder()
        .setTitle('Instagram')
        .setURL('https://instagram.com/scytedtv')
        .addFields(
          { name: 'Official', value: '[ScytedTV Studios](https://instagram.com/scytedtv)\n[ScytedTV Creators](https://instagram.com/stvcreators)', inline: true },
          { name: 'Shows', value: '[Clever Remarks](https://instagram.com/cleverremarksstv)\n[Milo\'s Life](https://instagram.com/miloslifestv)\n[ScytedTV News](https://instagram.com/scytedtvnews)', inline: true },
        )
        .setImage('https://cdn.scyted.tv/website-assets/website/instagram.jpg')
        .setColor('#FFEA00');
  
      const embed5 = new EmbedBuilder()
        .setTitle('TikTok')
        .setURL('https://tiktok.com/@scytedtv')
        .addFields(
          { name: 'Official', value: '[ScytedTV Studios](https://tiktok.com/@scytedtv)', inline: true },
          { name: 'Shows', value: '[Clever Remarks](https://tiktok.com/@cleverremarksstv)\n[Milo\'s Life](https://tiktok.com/@miloslifestv)\n[ScytedTV News](https://tiktok.com/@scytedtvnews)', inline: true },
        )
        .setImage('https://cdn.scyted.tv/website-assets/website/tiktok.png')
        .setColor('#FFEA00');
  
  
      // Send the embeds to the same channel
      await message.channel.send({ embeds: [embed1, embed2, embed3, embed4, embed5] });
  
    } if (message.content.startsWith('!scytedtv-info') && message.author.id === ownerId) {
      // Delete the message containing the command
      message.delete();
  
      // Send embeds
      const embed1 = new EmbedBuilder()
        .setImage('https://cdn.scyted.tv/website-assets/website/scytedtv.jpg')
        .setColor('#FFEA00');
  
      const embed2 = new EmbedBuilder()
        .setImage('https://cdn.scyted.tv/website-assets/website/empty.png')
        .setDescription(`# Welcome to ScytedTV Studios!\n> ScytedTV Studios takes pride in bringing forward like-minded individuals to create something everyone can be proud of. As a viewer, you can experience our comedic content and explore new ideas that you've never seen before. We are consistently working on something new that is out of our comfort zones, so that we can impress you. Keep an eye out as new content from ScytedTV comes every week!`)
        .setColor('#FFEA00');
  
      const embed3 = new EmbedBuilder()
        .setImage('https://cdn.scyted.tv/website-assets/website/empty.png')
        .setDescription(`*For some more helpful information and links, check out our <id:guide> located at the top of the channel list. If you have any addtional questions, don't hesistate to reach out to one of us!*`)
        .setColor('#FFEA00');
  
      // Send the embeds to the same channel
      await message.channel.send({ embeds: [embed1, embed2, embed3] });
    } if (message.content.startsWith('!scytedtv-resources') && message.author.id === ownerId) {
      // Delete the message containing the command
      message.delete();
  
      // Send embeds
      const embed1 = new EmbedBuilder()
        .setImage('https://cdn.scyted.tv/website-assets/resource-portal/banner.jpg')
        .setColor('#FFEA00');
  
      const embed2 = new EmbedBuilder()
        .setTitle('ScytedTV Resources')
        .setURL('https://www.scyted.tv/resources/')
        .setDescription(`ScytedTV Resources is our one-stop-shop for free resources, information, and projects. Check it out here: [scyted.tv/resources](https://www.scyted.tv/resources/)`)
        .setImage('https://cdn.scyted.tv/website-assets/website/empty.png')
        .setColor('#FFEA00');
  
      const embed3 = new EmbedBuilder()
        .setDescription(`**Here are some of our currently available resources:**`)
        .addFields(
          { name: 'ScytedTV Dev', value: '[Heart Collectors](https://www.scyted.tv/resources/heart-collectors/)\n[Levlr](https://www.scyted.tv/resources/levlr/)', inline: true },
          { name: 'Outside ScytedTV', value: '[JuJu\'s Better Wynncraft](https://www.scyted.tv/resources/jujus-better-wynncraft/)\n[JBW Archive](https://www.scyted.tv/resources/jbw-archive/)\n[JBW Beta](https://www.scyted.tv/resources/jbw-beta/)\n', inline: true },
        )
        .setImage('https://cdn.scyted.tv/website-assets/website/empty.png')
        .setColor('#FFEA00');
  
      const embed4 = new EmbedBuilder()
        .setDescription(`*If you have some ideas for resources, please DM <@852572302590607361>. Additionally, if you have a project that you would like to share on our resource portal, let <@852572302590607361> know. This can be anything from Minecraft Modpacks, download pages for projects, or a place for people to get information on how to do something. Just let Loyd know and we might be able to make it happen!*`)
        .setImage('https://cdn.scyted.tv/website-assets/website/empty.png')
        .setColor('#FFEA00');
  
      // Send the embeds to the same channel
      await message.channel.send({ embeds: [embed1, embed2, embed3, embed4] });
    } if (message.content.startsWith('!scytedtv-level-requirement') && message.author.id === ownerId) {
      // Delete the message containing the command
      message.delete();
  
      const embed1 = new EmbedBuilder()
        .setImage('https://cdn.scyted.tv/website-assets/website/empty.png')
        .setDescription(`# Level Requirements\nCertain things require certain levels to access and use, below is a list of all of those things.`)
        .setColor('#FFEA00');
  
      const embed2 = new EmbedBuilder()
        .setImage('https://cdn.scyted.tv/website-assets/website/empty.png')
        .setTitle('Channels')
        .setDescription(`**Level:** Level 2 | <@&1169671866135355422>\n**Channels:**\n- <#1152078555166015578>\n- <#1147308595071942790>\n- <#1174219506663575604>`)
        .setColor('#FFEA00');
  
      // Send the embeds to the same channel
      await message.channel.send({ embeds: [embed1, embed2] });
    } if (message.content.startsWith('!greenroom-channel-access') && message.author.id === ownerId) {
      // Delete the message containing the command
      message.delete();
  
      const embed1 = new EmbedBuilder()
        .setImage('https://cdn.scyted.tv/website-assets/website/empty.png')
        .setDescription(`## Channel Access\nTo make sure that you aren't getting pinged and possibly spammed by members of this server, I have set up a system that allows you to enable and disable your access to any public channels. By default, you have access to these channels, but you can react to this message with the following reactions to remove your access. To get your access back, remove your reaction.\n\n- \`💬 | Text Channels\`\n- \`🔊 | Voice Channels\``)
        .setColor('#FEEA3B');
  
      // Send the embeds to the same channel
      await message.channel.send({ embeds: [embed1] });
    } if (message.content.startsWith('!greenroom-welcome') && message.author.id === ownerId) {
      // Delete the message containing the command
      message.delete();
  
      // Get the current time in epoch format
      const currentTime = Math.floor(Date.now() / 1000);
  
      const embed1 = new EmbedBuilder()
        .setColor('#FEEA3B')
        .setImage('https://cdn.scyted.tv/dropout/the-green-room/the-green-room-banner.jpg')
  
      const embed2 = new EmbedBuilder()
        .setImage('https://cdn.scyted.tv/website-assets/website/empty.png')
        .setDescription(`## Welcome to The Green Room!\nThe Green Room is intended to be a community server for all things Dropout, with spaces to discuss all Dropout shows. Not only that, but a place for you to meet new friends who enjoy the same things you do.\n\n*Find more information in <id:guide> and pick up roles and channels in <id:browse>!*\n\n**Read about the chatting guidelines in <#1245137634855227513>.**`)
        .setColor('#FEEA3B');
  
      const embed3 = new EmbedBuilder()
        .setColor('#FEEA3B')
        .setDescription(`**Updated:** <t:${currentTime}:R>`);
  
      // Send the embeds to the same channel
      await message.channel.send({ embeds: [embed1] });
      await message.channel.send({ embeds: [embed2] });
      const reactMessage = await message.channel.send({ embeds: [embed3] });
  
      reactMessage.react('👍');
  
    } if (message.content.startsWith('!greenroom-arg-links') && message.author.id === ownerId) {
      // Delete the message containing the command
      message.delete();
  
      const embed1 = new EmbedBuilder()
        .setImage('https://gc.scyted.tv/assets/images/meta.jpg')
        .setColor('#FEEA3B');
  
      const embed2 = new EmbedBuilder()
        .setImage('https://cdn.scyted.tv/website-assets/website/empty.png')
        .setDescription(`## Important Links\n- Game Changer Season 6 ARG Master: [docs.google.com](https://docs.google.com/document/d/1zzbWI-VPp14iuTDez5BHD4SwAoPFML-Id1S-0EEaK-E/)\n- Game Changer Fan Theories Blog: [gc.scyted.tv](https://gc.scyted.tv/)\n\n**If you would like to invite your friends directly to this discussion, invite them using this link:** https://discord.gg/acHAyDkDgc`)
        // .setFooter('Game Changer Fan Theories', 'https://cdn.scyted.tv/website-assets/website/gc-favicon.png')
        .setColor('#FEEA3B');
  
      // Send the embeds to the same channel
      await message.channel.send({ embeds: [embed1, embed2] });
    } if (message.content.startsWith('!greenroom-arg-intro') && message.author.id === ownerId) {
      // Delete the message containing the command
      message.delete();
  
      const embed1 = new EmbedBuilder()
        .setImage('https://gc.scyted.tv/assets/images/meta.jpg')
        .setColor('#FEEA3B');
  
      const embed2 = new EmbedBuilder()
        .setImage('https://cdn.scyted.tv/website-assets/website/empty.png')
        .setDescription(`## ARG Good Etiquette\nAs a reminder for people who haven't participated in ARGs before (even if this isn't one lol) there's some Etiquette that needs to be established:\n- **Never share private info**\n- Stick to publicly available Info\n- Do not call/email/mail private business or individuals, unless confirmed 100% to be part of the ARG\n- Assume whatever you found isn't part of the ARG unless you have solid evidence otherwise\n- Don't be a dick to people or organizations`)
        // .setFooter('Game Changer Fan Theories', 'https://cdn.scyted.tv/website-assets/website/gc-favicon.png')
        .setColor('#FEEA3B');
  
      const embed3 = new EmbedBuilder()
        .setImage('https://cdn.scyted.tv/website-assets/website/empty.png')
        .setDescription(`**The following groups, Discords, people, etc. are confirmed to not be involved in this. Please do not contact/annoy them!**\n- ScytedTV and/or Loyd Osborne\n- The server at the link __discord/invite/imsorry__`)
        // .setFooter('Game Changer Fan Theories', 'https://cdn.scyted.tv/website-assets/website/gc-favicon.png')
        .setColor('#FEEA3B');
  
      const embed4 = new EmbedBuilder()
        .setImage('https://cdn.scyted.tv/website-assets/website/empty.png')
        .setDescription(`## Important Links\n- Game Changer Season 6 ARG Master: [docs.google.com](https://docs.google.com/document/d/1zzbWI-VPp14iuTDez5BHD4SwAoPFML-Id1S-0EEaK-E/)\n- Game Changer Fan Theories Blog: [gc.scyted.tv](https://gc.scyted.tv/)\n\n**If you would like to invite your friends directly to this discussion, invite them using this link:** https://discord.gg/acHAyDkDgc`)
        // .setFooter('Game Changer Fan Theories', 'https://cdn.scyted.tv/website-assets/website/gc-favicon.png')
        .setColor('#FEEA3B');
  
      // Send the embeds to the same channel
      await message.channel.send({ embeds: [embed1, embed2, embed3, embed4] });
    }
  });
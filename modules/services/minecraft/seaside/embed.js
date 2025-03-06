const { EmbedBuilder } = require("discord.js");

client.on('messageCreate', async (message) => {

    if (message.author.id === '852572302590607361' && message.content.toLowerCase() === '!seaside embed') {

        const embed = new EmbedBuilder()
            .setColor('#79c10f')
            .setDescription(`-# Empty Embed`);

        await message.channel.send({ embeds: [embed] });
        await message.delete();
    }
});
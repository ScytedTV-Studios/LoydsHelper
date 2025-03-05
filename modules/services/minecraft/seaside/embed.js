const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

client.on('messageCreate', async (message) => {
    try {
        if (message.author.id === '852572302590607361' && message.content.toLowerCase() === '!seaside embed') {

            const embed = new EmbedBuilder()
                .setColor('#79c10f')
                .setDescription(`-# Empty Embed`);

            await message.channel.send({ embeds: [embed] });

            if (message.guild && message.guild.members.me.permissions.has("ManageMessages")) {
                await message.delete();
            } else {
                console.warn(`[WARNING] Bot does not have permission to delete messages in ${message.channel.name}.`);
            }
        }
    } catch (error) {
        console.error("[ERROR] Failed to process '!seaside embed' command:", error);
    }
});
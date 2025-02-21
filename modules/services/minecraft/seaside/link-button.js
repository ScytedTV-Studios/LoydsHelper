const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const path = require("path");

client.on('interactionCreate', async (interaction) => {

    if (interaction.isButton() && interaction.customId === 'link_button') {
        if (interaction.channel.id === '1324833840254029959' && interaction.message.id === '1342596840108982282') {

            const modal = new ModalBuilder()
                .setCustomId('link_modal')
                .setTitle('Minecraft Account Connection')
                .addComponents(
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId('minecraft_code')
                            .setLabel('Minecraft Code')
                            .setStyle(TextInputStyle.Short)
                            .setPlaceholder('Enter your Minecraft connection PIN here')
                            .setRequired(true)
                    )
                );

            await interaction.showModal(modal);
        }
    }

    if (interaction.isModalSubmit() && interaction.customId === 'link_modal') {
        const code = interaction.fields.getTextInputValue('minecraft_code').trim().toUpperCase();

        try {
            const response = await fetch('http://localhost:8000/seaside/connect/discord.json');
            const data = await response.json();
            const user = Object.values(data).find((user) => user.code === code);

            if (user) {

                const existingLink = Object.values(data).find((user) => user.userId === interaction.user.id);

                if (existingLink) {

                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setDescription(`<:crossmark:1330976664535961753> Your Discord account is already connected to \`${existingLink.username}\`.`);
                
                await interaction.reply({ embeds: [embed], ephemeral: true });
                } else if (!user.userId) {

                    user.userId = interaction.user.id;

                    await fetch('http://localhost:8000/seaside/connect/discord.json', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });

                    const embed = new EmbedBuilder()
                        .setColor('Green')
                        .setDescription(`<:checkmark:1330976666016550932> Your Minecraft account \`${user.username}\` has been successfully linked!`);
    
                    await interaction.reply({ embeds: [embed], ephemeral: true });

                } else {

                    const embed = new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`<:crossmark:1330976664535961753> \`This code is already linked to a Discord user!\``);
                
                    await interaction.reply({ embeds: [embed], ephemeral: true });
                }
            } else {
                const embed = new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`<:crossmark:1330976664535961753> \`Invalid code. Please check and try again.\``);
                
                await interaction.reply({ embeds: [embed], ephemeral: true });
            }
        } catch (error) {
            console.error('Error validating or updating the code:', error);

            const embed = new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`<:crossmark:1330976664535961753> \`There was an error while processing your request. Please try again later.\``);
                
                await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
});

client.on('messageCreate', async (message) => {

    if (message.author.id === '852572302590607361' && message.content.toLowerCase() === '!seaside discord') {

        const imagePath = 'attachment://title.png';

        const imageEmbed = new EmbedBuilder()
            .setColor('#79c10f')
            .setImage(imagePath);

        await message.channel.send({
            embeds: [imageEmbed],
            files: [path.resolve('E:\\CDN\\simplynetwork\\seaside\\title.png')]
        });

        const embed = new EmbedBuilder()
            .setColor('#79c10f')
            .setDescription(
                `Welcome to the official SeasideMC Discord server! Here you can keep up-to-date with SeasideMC updates and news, and chat with other SeasideMC players!\n\n**:link: Linking your Minecraft account (required to chat)**\n\nYou'll need to link your Minecraft account to be able to send messages on our Discord server. Linking your account is easy, just follow the steps below:\n\n1. Connect to the SeasideMC server.\n\n2. Once you're connected, type the command \`!discord\` in chat, on the Minecraft server.\n\n3. You will receive a PIN code in the chat. Simply click the \`Link\` button on this message and enter the code.\n\n**Until you've completed the above steps you won't be able to send messages. Your displayed role will match your in-game selected role.**\n\n-# These steps do not apply to TikTok viewers who do not have access to the server.`
            )

        const linkButton = new ButtonBuilder()
            .setCustomId('link_button')
            .setLabel('Link')
            .setStyle(ButtonStyle.Success);

        const actionRow = new ActionRowBuilder().addComponents(linkButton);

        await message.channel.send({
            embeds: [embed],
            components: [actionRow]
        });
        await message.delete();
    }
});
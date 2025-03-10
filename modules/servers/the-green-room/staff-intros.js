const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');

const introChannelID = '1317678221587906610';
const dataPath = path.resolve('./config/staff-intros.json');
const rolesPath = path.resolve('./config/staff-roles.json');

let intros = fs.existsSync(dataPath) ? JSON.parse(fs.readFileSync(dataPath, 'utf8')) : {};
const roleHierarchy = fs.existsSync(rolesPath) ? JSON.parse(fs.readFileSync(rolesPath, 'utf8')) : [];

function saveIntros() {
    fs.writeFileSync(dataPath, JSON.stringify(intros, null, 2));
}

function getHighestRole(member) {
    const memberRoles = member.roles.cache.map((role) => role.id);
    for (const roleId of roleHierarchy) {
        if (memberRoles.includes(roleId)) {
            const role = member.roles.cache.get(roleId);
            return role ? role.name : null;
        }
    }
    return null;
}

client.on('messageCreate', async (message) => {
    if (client.id !== "1147308835808235581") return;
    if (message.channel.id !== introChannelID) return;

    if (message.content === '!intro create') {
        await message.delete();
        const userID = message.author.id;

        if (intros[userID]) {
            return message.author.send('```You have already created an introduction.\nUse the "📝" button on your intro to edit it.``````If this is incorrect or you\'re encountering problems, please DM @loydosborne.```');
        }

        const member = await message.guild.members.fetch(userID);
        const highestRole = getHighestRole(member);

        const nickname = member.nickname || message.author.username;

        const embed = new EmbedBuilder()
            .setColor('#feea3b')
            .setAuthor({ name: `${nickname} • ${highestRole || 'No Role'}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
            .setDescription('```Click "📝" to edit your introduction.```')
            .setTimestamp();

        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('edit_intro')
                .setLabel('📝')
                .setStyle(ButtonStyle.Primary)
        );

        const sentMessage = await message.channel.send({ embeds: [embed], components: [button] });

        intros[userID] = {
            messageID: sentMessage.id,
            intro: '```Click "📝" to edit your introduction.```',
            buttons: [
                { label: '', url: '' },
                { label: '', url: '' }
            ]
        };

        saveIntros();
    } else if (message.content === '!intro delete') {
        await message.delete();
        const userID = message.author.id;

        if (!intros[userID]) {
            return message.author.send('```You don\'t have an introduction message.\nCreate one by using "!intro create"``````If this is incorrect or you\'re encountering problems, please DM @loydosborne.```');
        }

        const channel = await client.channels.fetch(introChannelID);
        const introMessage = await channel.messages.fetch(intros[userID].messageID);
        if (introMessage) await introMessage.delete();

        delete intros[userID];
        saveIntros();

        return message.author.send('```Your introduction has been deleted.```');
    } else if (message.content === '!intro') {
        await message.delete();
        return message.author.send('```INTRODUCTIONS``````!intro create | Create your introduction.``````!intro delete | Delete your introduction.```');
    }
});

client.on('interactionCreate', async (interaction) => {
    if (client.id !== "1147308835808235581") return;
    if (interaction.isButton() && interaction.customId === 'edit_intro') {
        const userID = interaction.user.id;
        const introData = intros[userID];

        if (!introData || interaction.message.id !== introData.messageID) {
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setDescription('<:crossmark:1330976664535961753> `You are not allowed to edit this introduction.`');
            return interaction.reply({ embeds: [embed], ephemeral: true});
            // return interaction.reply({ content: 'You are not allowed to edit this introduction.', ephemeral: true });
        }

        const modal = new ModalBuilder()
            .setCustomId('edit_intro_modal')
            .setTitle('Edit Your Introduction');

        const introInput = new TextInputBuilder()
            .setCustomId('intro_input')
            .setLabel('Your Introduction')
            .setStyle(TextInputStyle.Paragraph)
            .setValue(introData.intro);

            const button1Label = new TextInputBuilder()
            .setCustomId('button1_label')
            .setLabel('Button 1 Label (Optional)')
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
            .setValue(introData.buttons[0]?.label || '');

        const button1URL = new TextInputBuilder()
            .setCustomId('button1_url')
            .setLabel('Button 1 URL (Optional)')
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
            .setValue(introData.buttons[0]?.url || '');

        const button2Label = new TextInputBuilder()
            .setCustomId('button2_label')
            .setLabel('Button 2 Label (Optional)')
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
            .setValue(introData.buttons[1]?.label || '');

        const button2URL = new TextInputBuilder()
            .setCustomId('button2_url')
            .setLabel('Button 2 URL (Optional)')
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
            .setValue(introData.buttons[1]?.url || '');

        modal.addComponents(
            new ActionRowBuilder().addComponents(introInput),
            new ActionRowBuilder().addComponents(button1Label),
            new ActionRowBuilder().addComponents(button1URL),
            new ActionRowBuilder().addComponents(button2Label),
            new ActionRowBuilder().addComponents(button2URL)
        );

        await interaction.showModal(modal);
    }
});

client.on('interactionCreate', async (interaction) => {
    if (client.id !== "1147308835808235581") return;
    if (interaction.isModalSubmit() && interaction.customId === 'edit_intro_modal') {
        const userID = interaction.user.id;
        const newIntro = interaction.fields.getTextInputValue('intro_input');

        const button1Label = interaction.fields.getTextInputValue('button1_label');
        const button1URL = interaction.fields.getTextInputValue('button1_url');

        const button2Label = interaction.fields.getTextInputValue('button2_label');
        const button2URL = interaction.fields.getTextInputValue('button2_url');

        const channel = await client.channels.fetch(introChannelID);
        const message = await channel.messages.fetch(intros[userID].messageID);

        const member = await message.guild.members.fetch(userID);
        const highestRole = getHighestRole(member);

        const updatedEmbed = new EmbedBuilder()
            .setColor('#feea3b')
            .setAuthor({ name: `${message.author.nickname || message.author.displayName} • ${highestRole || 'No Role'}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .setDescription(newIntro)
            .setTimestamp();

        const buttons = new ActionRowBuilder();

        if (button1Label && button1URL) {
            buttons.addComponents(
                new ButtonBuilder()
                    .setLabel(button1Label)
                    .setStyle(ButtonStyle.Link)
                    .setURL(button1URL)
            );
        }

        if (button2Label && button2URL) {
            buttons.addComponents(
                new ButtonBuilder()
                    .setLabel(button2Label)
                    .setStyle(ButtonStyle.Link)
                    .setURL(button2URL)
            );
        }

        buttons.addComponents(
            new ButtonBuilder()
                .setCustomId('edit_intro')
                .setLabel('📝')
                .setStyle(ButtonStyle.Primary)
        );

        await message.edit({ embeds: [updatedEmbed], components: [buttons] });
        await interaction.reply({ content: 'Your introduction has been updated!', ephemeral: true });

        intros[userID] = {
            messageID: message.id,
            intro: newIntro,
            buttons: [
                { label: button1Label, url: button1URL },
                { label: button2Label, url: button2URL }
            ]
        };

        saveIntros();
    }
});

client.on('guildMemberUpdate', async (oldMember, newMember) => {
    if (client.id !== "1147308835808235581") return;
    if (oldMember.roles.cache.size === newMember.roles.cache.size) return;

    const userID = newMember.id;
    if (!intros[userID]) return;

    const channel = await client.channels.fetch(introChannelID);
    const message = await channel.messages.fetch(intros[userID].messageID);

    const highestRole = getHighestRole(newMember);

    const embed = new EmbedBuilder(message.embeds[0])
        .setAuthor({ name: `${newMember.displayName} • ${highestRole || 'No Role'}`, iconURL: newMember.displayAvatarURL({ dynamic: true }) })
        .setThumbnail(newMember.displayAvatarURL({ dynamic: true }));

    await message.edit({ embeds: [embed] });
});
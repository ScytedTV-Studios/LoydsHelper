const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const alliancesFilePath = path.join(process.cwd(), 'modules', 'config', 'nx-alliances.json');

function readAlliancesFile() {
    const data = fs.readFileSync(alliancesFilePath);
    return JSON.parse(data);
}

function writeAlliancesFile(data) {
    fs.writeFileSync(alliancesFilePath, JSON.stringify(data, null, 2));
}

async function updateAllianceEmbed(channel) {
    const alliances = readAlliancesFile();
    const allianceIds = alliances.Alliance;

    const description = `### Alliances\n${allianceIds.map(id => `- 🔒 ${id}`).join('\n')}`;
    
    const embedMessage = new EmbedBuilder()
        .setColor('#00ff00')
        .setImage('https://cdn.scyted.tv/website-assets/website/empty.png')
        .setDescription(description);

    const allianceMessage = await channel.messages.fetch('1330178504444346379');
    await allianceMessage.edit({ embeds: [embedMessage] });
}

async function updateOppsEmbed(channel) {
    const alliances = readAlliancesFile();
    const oppsIds = alliances.Opps;

    const description = `### Opps\n${oppsIds.map(id => `- ❌ ${id}`).join('\n')}`;

    const embedMessage = new EmbedBuilder()
        .setColor('#ff0000')
        .setImage('https://cdn.scyted.tv/website-assets/website/empty.png')
        .setDescription(description);

    const oppsMessage = await channel.messages.fetch('1330178506063351822');
    await oppsMessage.edit({ embeds: [embedMessage] });
}

async function updateLastUpdatedEmbed(channel, currentTime) {

    const embedMessage = new EmbedBuilder()
        .setColor('#0026ff')
        .setDescription(`**Updated:** <t:${currentTime}:R>`);

    const updatedMessage = await channel.messages.fetch('1330178508323950723');
    await updatedMessage.edit({ embeds: [embedMessage] });
}

async function addToSection(message, section, id) {
    let alliances = readAlliancesFile();

    if (!alliances[section].includes(id)) {
        alliances[section].push(id);
        writeAlliancesFile(alliances);
        const responseMessage = await message.channel.send(`${id} added to ${section} successfully.`);

        const channel = await client.channels.fetch('1330178454267625544');

        if (section === 'Alliance') {
            await updateAllianceEmbed(channel);
        } else if (section === 'Opps') {
            await updateOppsEmbed(channel);
        }

        const currentTime = Math.floor(Date.now() / 1000);
        await updateLastUpdatedEmbed(channel, currentTime);

        setTimeout(() => {
            message.delete().catch(console.error);
            responseMessage.delete().catch(console.error);
        }, 3000);
    } else {
        const responseMessage = await message.channel.send(`${id} is already in ${section}.`);
        setTimeout(() => {
            message.delete().catch(console.error);
            responseMessage.delete().catch(console.error);
        }, 3000);
    }
}

async function removeFromSection(message, section, id) {
    let alliances = readAlliancesFile();

    if (alliances[section].includes(id)) {
        alliances[section] = alliances[section].filter(existingId => existingId !== id);
        writeAlliancesFile(alliances);
        const responseMessage = await message.channel.send(`${id} removed from ${section} successfully.`);

        const channel = await client.channels.fetch('1330178454267625544');

        if (section === 'Alliance') {
            await updateAllianceEmbed(channel);
        } else if (section === 'Opps') {
            await updateOppsEmbed(channel);
        }

        const currentTime = Math.floor(Date.now() / 1000);
        await updateLastUpdatedEmbed(channel, currentTime);

        setTimeout(() => {
            message.delete().catch(console.error);
            responseMessage.delete().catch(console.error);
        }, 3000);
    } else {
        const responseMessage = await message.channel.send(`${id} is not in ${section}.`);
        setTimeout(() => {
            message.delete().catch(console.error);
            responseMessage.delete().catch(console.error);
        }, 3000);
    }
}

client.on('messageCreate', async (message) => {
    if (message.channel.id !== '1330178454267625544') return;

    if (message.content.startsWith('!')) {
        const args = message.content.slice(1).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        const subCommand = args[0];
        const id = args[1];

        if (command === 'alliance' || command === 'opps') {

            if (!id) {
                return message.channel.send('Please provide a valid ID.');
            }

            let section = command.charAt(0).toUpperCase() + command.slice(1);

            if (subCommand === 'add') {
                await addToSection(message, section, id);
            } else if (subCommand === 'remove') {
                await removeFromSection(message, section, id);
            } else {
                const responseMessage = await message.channel.send('Invalid subcommand. Use "add" or "remove".');
                setTimeout(() => {
                    message.delete().catch(console.error);
                    responseMessage.delete().catch(console.error);
                }, 250);
            }
        }
    }
});
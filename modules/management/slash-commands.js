
const { REST, Routes } = require('discord.js');
const dotenv = require('dotenv');

const commands = [
    {
        name: 'stats',
        description: 'Statistics',
        options: [
            {
                name: 'server',
                description: 'Server statistics',
                type: 1
            },
            {
                name: 'members',
                description: 'Server member statistics',
                type: 1
            }
        ]
    }
];

async function pushSlashCommandsGlobally() {

    const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands }
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}

setTimeout(async () => {
    await pushSlashCommandsGlobally();
}, 5000);
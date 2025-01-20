
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
            },
            {
                name: 'channels',
                description: 'Server channel statistics',
                type: 1
            },
            {
                name: 'roles',
                description: 'Server role statistics',
                type: 1
            },
            {
                name: 'emojis',
                description: 'Server emoji statistics',
                type: 1
            },
            {
                name: 'boosts',
                description: 'Server boost statistics',
                type: 1
            }
        ]
    },
    {
        "name": "ban",
        "description": "Ban a user from the server",
        "options": [
            {
                "type": 6,
                "name": "user",
                "description": "The user to ban",
                "required": true
            },
            {
                "type": 3,
                "name": "reason",
                "description": "Reason for the ban",
                "required": false
            }
        ]
    },
    {
        "name": "kick",
        "description": "Kick a user from the server",
        "options": [
            {
                "name": "user",
                "description": "The user to kick",
                "type": 6,
                "required": true
            },
            {
                "name": "reason",
                "description": "The reason for the kick",
                "type": 3,
                "required": false
            }
        ]
    },
    {
        "name": "timeout",
        "description": "Timeout a user for a specified duration",
        "options": [
            {
                "name": "user",
                "description": "The user to timeout",
                "type": 6,
                "required": true
            },
            {
                "name": "time",
                "description": "The duration of the timeout",
                "type": 3,
                "required": true
            },
            {
                "name": "reason",
                "description": "The reason for the timeout",
                "type": 3,
                "required": false
            }
        ]
    },
    {
        "name": "remove",
        "description": "Remove various restrictions from a user",
        "options": [
            {
                "name": "timeout",
                "description": "Remove a timeout from a user",
                "type": 1, 
                "options": [
                    {
                        "name": "user",
                        "description": "The user to remove the timeout from",
                        "type": 6,
                        "required": true
                    }
                ]
            },
            {
                "name": "ban",
                "description": "Remove a ban from a user by user ID",
                "type": 1, 
                "options": [
                    {
                        "name": "user",
                        "description": "The user ID to remove the ban from",
                        "type": 3,
                        "required": true
                    }
                ]
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
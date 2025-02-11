const { REST, Routes } = require('discord.js');
const fs = require("fs");

const TIME_ZONES = [
    { name: "Pacific Standard Time (UTC-8)", value: "UTC-8" },
    { name: "Mountain Standard Time (UTC-7)", value: "UTC-7" },
    { name: "Central Standard Time (UTC-6)", value: "UTC-6" },
    { name: "Eastern Standard Time (UTC-5)", value: "UTC-5" },
    { name: "Greenwich Mean Time (UTC+0)", value: "UTC+0" },
    { name: "Central European Time (UTC+1)", value: "UTC+1" },
    { name: "Eastern European Time (UTC+2)", value: "UTC+2" },
    { name: "India Standard Time (UTC+5:30)", value: "UTC+5:30" },
    { name: "China Standard Time (UTC+8)", value: "UTC+8" },
    { name: "Japan Standard Time (UTC+9)", value: "UTC+9" },
    { name: "Australian Eastern Time (UTC+10)", value: "UTC+10" },
    { name: "New Zealand Time (UTC+12)", value: "UTC+12" },
];

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
    },
    {
        "name": "purge",
        "description": "Purge messages from a channel",
        "options": [
            {
                "name": "all",
                "description": "Purge a specific number of messages from the channel",
                "type": 1,
                "options": [
                    {
                        "name": "count",
                        "description": "The number of messages to purge",
                        "type": 4,
                        "required": false
                    }
                ]
            }
        ]
    },
    {
        name: "bluesky",
        description: "Manage bluesky interactions",
        options: [
            {
                name: "schedule",
                type: 1,
                description: "Schedule a Bluesky post | bot admin only",
                options: [
                    {
                        name: "username",
                        description: "Select the Bluesky username",
                        type: 3,
                        required: true,
                        choices: getUsernames().map((username) => ({
                            name: username,
                            value: username,
                        })),
                    },
                    {
                        name: "date",
                        description: "Enter the date (e.g., January 27, 2025)",
                        type: 3,
                        required: true,
                    },
                    {
                        name: "time",
                        description: "Enter the time (e.g., 11:15 AM)",
                        type: 3,
                        required: true,
                    },
                    {
                        name: "time_zone",
                        description: "Select the time zone",
                        type: 3,
                        required: true,
                        choices: TIME_ZONES.map((tz) => ({
                            name: tz.name,
                            value: tz.value,
                        })),
                    },
                    {
                        name: "text",
                        description: "Enter the text for the post",
                        type: 3,
                        required: true,
                    },
                    {
                        name: "attachment",
                        description: "Enter the URL for an image attachment (optional)",
                        type: 3,
                        required: false,
                    },
                ],
            },
        ],
    },
    {
        name: 'radio',
        description: 'Radio system commands',
        options: [
            {
                name: 'join',
                description: 'Join the voice channel if the radio is online.',
                type: 1
            },
            {
                name: 'leave',
                description: 'Leave the voice channel.',
                type: 1
            },
            {
                name: 'now-playing',
                description: 'Check the currently playing song on the radio.',
                type: 1
            }
        ]
    },
    {
        name: "game",
        description: "Play a game",
        options: [
            {
                name: "tic-tac-toe",
                description: "Play Tic-Tac-Toe with another user",
                type: 1,
                options: [
                    {
                        name: "user",
                        description: "The user you want to play against",
                        type: 6,
                        required: true
                    }
                ]
            }
        ]
    }
];

function getUsernames() {
    const filePath = './config/bluesky-scheduled-posts.json';
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const json = JSON.parse(data);
        return json.usernames || [];
    } catch (err) {
        console.error('Error reading usernames from JSON file:', err);
        return [];
    }
}

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
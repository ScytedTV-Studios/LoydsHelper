const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const modulesDir = path.resolve('./modules');

// Map to track loaded modules and their listeners
const loadedModules = new Map();

// Function to load and execute raw JavaScript code
const loadModule = (filePath) => {
    try {
        // Read and execute the file's code
        const code = fs.readFileSync(filePath, 'utf-8');
        const moduleFunction = new Function('client', 'require', 'console', code);

        // Unload existing module if already loaded
        unloadModule(filePath);

        // Set up tracking for listeners
        const listeners = [];
        const trackingClient = new Proxy(client, {
            get(target, prop) {
                if (prop === 'on') {
                    return (event, listener) => {
                        listeners.push({ event, listener });
                        return target.on(event, listener);
                    };
                }
                return target[prop];
            },
        });

        // Execute the code with the injected dependencies
        moduleFunction(trackingClient, require, console);

        // Store listeners in the map
        loadedModules.set(filePath, listeners);
        console.log(`Module loaded: ${filePath}`);
    } catch (err) {
        console.error(`Error loading module ${filePath}:`, err);
    }
};

// Function to unload a module
const unloadModule = (filePath) => {
    if (loadedModules.has(filePath)) {
        const listeners = loadedModules.get(filePath);
        for (const { event, listener } of listeners) {
            client.removeListener(event, listener);
        }
        loadedModules.delete(filePath);
        console.log(`Module unloaded: ${filePath}`);
    }
};

// Watch the modules directory and subdirectories
const watcher = chokidar.watch(modulesDir, {
    persistent: true,
    ignoreInitial: false,
    depth: Infinity, // Watch all subdirectories
    awaitWriteFinish: true,
});

watcher
    .on('add', (filePath) => {
        if (filePath.endsWith('.js')) {
            loadModule(filePath);
        }
    })
    .on('change', (filePath) => {
        if (filePath.endsWith('.js')) {
            console.log(`Module updated: ${filePath}`);
            loadModule(filePath);
        }
    })
    .on('unlink', (filePath) => {
        if (filePath.endsWith('.js')) {
            console.log(`Module removed: ${filePath}`);
            unloadModule(filePath);
        }
    });

// Login the bot
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.BOT_TOKEN);
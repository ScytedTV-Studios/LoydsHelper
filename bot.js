const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
});
const modulesDir = path.resolve('./modules');

const loadedModules = new Map();

const loadModule = (filePath) => {
    try {
        const code = fs.readFileSync(filePath, 'utf-8');
        const moduleFunction = new Function('client', 'require', 'console', code);

        unloadModule(filePath);

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

        moduleFunction(trackingClient, require, console);

        loadedModules.set(filePath, listeners);
        console.log(`Module loaded: ${filePath}`);
    } catch (err) {
        console.error(`Error loading module ${filePath}:`, err);
    }
};

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

const watcher = chokidar.watch(modulesDir, {
    persistent: true,
    ignoreInitial: false,
    depth: Infinity,
    awaitWriteFinish: true,
});

watcher
    .on('add', (filePath) => {
        if (filePath.endsWith('.js')) {
            loadModule(filePath);
        }

          if (client.user) {
            client.user.setPresence({
                status: 'idle',
                activities: [
                  {
                    name: 'Updating...',
                    type: 4,
                  },
                ],
              });
          } else {
            return;
          }

    })
    .on('change', (filePath) => {
        if (filePath.endsWith('.js')) {
            console.log(`Module updated: ${filePath}`);
            loadModule(filePath);

            if (client.user) {
                client.user.setPresence({
                    status: 'idle',
                    activities: [
                      {
                        name: 'Updating...',
                        type: 4,
                      },
                    ],
                  });
              } else {
                return;
              }

        }
    })
    .on('unlink', (filePath) => {
        if (filePath.endsWith('.js')) {
            console.log(`Module removed: ${filePath}`);
            unloadModule(filePath);
            
            if (client.user) {
                client.user.setPresence({
                    status: 'idle',
                    activities: [
                      {
                        name: 'Updating...',
                        type: 4,
                      },
                    ],
                  });
              } else {
                return;
              }

        }
    });

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    client.user.setPresence({
        status: 'idle',
        activities: [
          {
            name: 'Starting...',
            type: 4,
          },
        ],
      });

});

client.login(process.env.BOT_TOKEN);
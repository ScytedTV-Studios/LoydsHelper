## Loyd's Helper

A work-in-progress Discord bot that is meant to handle both server-specific functions, as well as global modules that can be enabled or disabled per-server.

**How does it work?**

Using a modular approach, we can implement new features effortlessly and instantaniously without needing to restart the bot (for most cases). This allows for easy updates and bug fixes.

The way we manage to do this is by having the bot automatically monitor the "./modules" sub-directory for any added, removed, or updated js files. Once a module has been added or removed, it is either loaded or unloaded into the bot. When a module is updated, it is unloaded, then reloaded again.

**API Usage:**

Loyd's Helper uses the ScytedTV Studios API ([api.scyted.tv](https://api.scyted.tv/)) to privately store information behind an authentication barrier. This way, any information stored by the bot on users (such as their bot settings, game & activities stats, etc.) is only available to the bot and the individual user. Some APIs are public, but that is for things like leaderboards, etc. that are available publically via the ScytedTV API by requesting an API key ([more info](https://github.com/ScytedTV-Studios/API/blob/main/Credentials.md)).

## To-Do List:

These are global features I plan to add to the bot over time that will work in all servers who have them enabled.

**Utilities:**
- [x] Server Statistics
- [ ] User Statistics
- [ ] Module Mangement
- [ ] Ticketing
- [ ] Mod Mail
- [ ] Polls
- [ ] Giveaways
- [ ] Leveling (Global and Per-Server)
- [ ] Role Mangement
- [ ] Discord/Calendar Event Syncing
- [ ] Temporary Voice & Text Channels
- [ ] Moderation & Automod
- [ ] Automatic Slow Mode
- [ ] Audit Logging
- [ ] Welcome Messages
- [ ] Reminders
- [ ] Sticky Messages
- [ ] Advanced Verification
- [ ] Raid Protection

**Games & Activities:**
- [ ] Economy
- [ ] Item Collecting
- [ ] Counting Channels
- [ ] Trivia
- [ ] Business Tycoon
- [ ] Fishing, Farming & Mining
- [ ] Tic Tac Toe
- [ ] Would You Rather
- [ ] Truth or Dare

**Other:**
- [ ] Website Dashboard
- [ ] Enabling & Disabling Bot Modules
- [ ] Game Stats
 <!-- - [ ] Minecraft Java: Hypixel
 - [ ] Minecraft Bedrock: The Hive
 - [ ] Xbox Achievements
 - [ ] Playstation Achievements
 - [ ] Steam Profile Stats
 - [ ] Minecraft Bedrock: Realms -->
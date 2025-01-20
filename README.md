## Loyd's Helper

A work-in-progress Discord bot that is meant to handle both server-specific functions, as well as global modules that can be enabled or disabled per-server.

**How does it work?**

Using a modular approach, we can implement new features effortlessly and instantaniously without needing to restart the bot (for most cases). This allows for easy updates and bug fixes.

The way we manage to do this is by having the bot automatically monitor the "./modules" sub-directory for any added, removed, or updated js files. Once a module has been added or removed, it is either loaded or unloaded into the bot. When a module is updated, it is unloaded, then reloaded again.

## To-Do List:

These are global features I plan to add to the bot over time that will work in all servers.

**Utilities:**
- [ ] Ticketing
- [ ] Mod Mail
- [ ] Polls
- [ ] Giveaways
- [ ] Leveling (Global and Per-Server)
- [ ] Server & User Stats
- [ ] Role Mangement
- [ ] Discord/Calendar Event Syncing
- [ ] Temporary Voice & Text Channels
- [ ] Moderation & Automod
- [ ] Automatic Slow Mode
- [ ] Audit Logging
- [ ] Welcome Messages

**Games & Activities:**
- [ ] Economy
- [ ] Item Collecting

**Other:**
- [ ] Website Dashboard
- [ ] Enabling & Disabling Bot Modules
const { EmbedBuilder } = require("discord.js");
const axios = require("axios");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
require("dotenv").config();
dayjs.extend(utc);
dayjs.extend(timezone);

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand() || interaction.commandName !== "bluesky") return;

    await interaction.deferReply();

    const subcommand = interaction.options.getSubcommand();
    if (subcommand === "schedule") {
        const userID = interaction.user.id;
        if (userID !== "852572302590607361") {
            const embed = new EmbedBuilder()
                .setDescription("<:crossmark:1330976664535961753> `You do not have permission to use this command.`")
                .setColor("Red");
            return await interaction.editReply({ embeds: [embed] });
        }

        const username = interaction.options.getString("username");
        const date = interaction.options.getString("date");
        const time = interaction.options.getString("time");
        const timeZone = interaction.options.getString("time_zone");
        const text = interaction.options.getString("text");
        const attachment = interaction.options.getString("attachment");

        const usernameEnvKey = username.replace(/\./g, "_").toUpperCase();

        const post = {
            username,
            date,
            time,
            timeZone,
            text,
            attachment,
            posted: false,
        };

        const scheduleURL = `https://api.scyted.tv/v2/loydshelper/bluesky/${process.env[`${usernameEnvKey}_BSKY_USERNAME`]}/schedule.json`;

        try {
            const existingSchedule = await axios.get(scheduleURL, {
                headers: { Authorization: `Bearer ${process.env.SCYTEDTV_API}` },
            });

            const updatedSchedule = Array.isArray(existingSchedule.data)
                ? [...existingSchedule.data, post]
                : [post];

            await axios.post(scheduleURL, updatedSchedule, {
                headers: { Authorization: `Bearer ${process.env.SCYTEDTV_API}` },
            });

            const embed = new EmbedBuilder()
                .setDescription(`<:checkmark:1330976666016550932> \`Bluesky post scheduled successfully.\``)
                .setColor("Green");

            const embedInfo = new EmbedBuilder()
                .setDescription(`\`\`\`${text}\`\`\`\`${date}\` at \`${time}\` (\`${timeZone}\`)`)
                .setColor("Green");

            if (attachment) {
                embedInfo.setImage(attachment);
            }

            await interaction.editReply({ embeds: [embed, embedInfo] });
        } catch (error) {
            console.error("Error updating schedule:", error.response?.data || error.message);

            const embed = new EmbedBuilder()
                .setDescription(`<:crossmark:1330976664535961753> \`Failed to schedule the post. Please try again later.\`\n\`\`\`ERROR:\n${error.message}\`\`\``)
                .setColor("Red");

            await interaction.editReply({ embeds: [embed] });
        }
    }
});
const { EmbedBuilder } = require('discord.js');
require("dotenv").config();

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName, member, options } = interaction;
    
    if (commandName === "seaside" && options.getSubcommand() === 'reset') {
        await interaction.deferReply();

        const ADMIN_ROLE_ID = "1324833838865846341";
        // const ADMIN_ROLE_ID = "1170039571480850472";

        if (!member.roles.cache.has(ADMIN_ROLE_ID)) {

            const embed = new EmbedBuilder()
                .setColor('Red')
                .setDescription('<:crossmark:1330976664535961753> `You do not have permission to use this command.`');
                
            await interaction.editReply({ embeds: [embed], ephemeral: true });
            return;
        }

        const code = interaction.options.getString("code").toUpperCase();
        await resetUser(interaction, code);
    }
});

const resetUser = async (interaction, code) => {
    const url = "http://localhost:8000/seaside/connect/discord.json";

    try {
        const response = await fetch(url);
        const data = await response.json();

        let userToRemove = null;
        let minecraftUsername = null;

        for (const [username, userInfo] of Object.entries(data)) {
            if (userInfo.code === code) {
                userToRemove = username;
                minecraftUsername = userInfo.username;
                break;
            }
        }

        if (!userToRemove) {
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setDescription(`<:crossmark:1330976664535961753> \`No user found with the code "${code}".\``);
                
            await interaction.editReply({ embeds: [embed], ephemeral: true });
            return;
        }

        delete data[userToRemove];

        await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const embed = new EmbedBuilder()
            .setColor('Green')
            .setDescription(`<:checkmark:1330976666016550932> \`${minecraftUsername}\` has been reset, please regenerate a new code.\nFollow the instructions in <#1324833840254029959> to get started.`);
    
        await interaction.editReply({ embeds: [embed], ephemeral: false });
    } catch (error) {
        console.error("Error resetting user:", error);

        const embed = new EmbedBuilder()
            .setColor('Red')
            .setDescription('<:crossmark:1330976664535961753> `An error occurred while resetting the user.`');
                
        await interaction.editReply({ embeds: [embed], ephemeral: true });
    }
};
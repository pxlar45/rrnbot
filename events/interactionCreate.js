const { InteractionType } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (command) {
                try {
                    await command.execute(interaction, client);
                } catch (e) {
                    console.error(e)
                }
            }
        }

        if (interaction.isButton() && interaction.customId === 'bannedVehicleList') {
            // Send the Google Docs link when the button is clicked
            await interaction.reply({
                content: 'https://docs.google.com/spreadsheets/d/1dweIGDpbgV9P1XxpUplVw84iMcn3kG6PfgTGoMtGQeo/edit?usp=sharing',
                ephemeral: true  // Only the user who clicked the button will see this message
            });
        }
    },
};
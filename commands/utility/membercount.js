const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('membercount')
        .setDescription('Displays the number of members in the server'),
    
    async execute(interaction) {
        const guild = interaction.guild;
        const memberCount = guild.memberCount;

        const embed = new EmbedBuilder()
            .setTitle('Member Count')
            .setDescription(`${memberCount} members`)
            .setColor('#3498db');

        await interaction.reply({
            embeds: [embed],
            ephemeral: false // Only visible to the user who invoked the command
        });
    }
};

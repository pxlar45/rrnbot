const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const os = require('os');
const process = require('process');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('Displays information about the bot.'),
    async execute(interaction) {
        // Fetch bot information
        const botName = interaction.client.user.username;
        const nodeVersion = process.version;
        const uptime = formatUptime(process.uptime());

        // Create the embed
        const botInfoEmbed = new EmbedBuilder()
            .setTitle('Bot Information')
            .addFields(
                { name: 'Bot Name', value: botName, inline: true },
                { name: 'Node Version', value: nodeVersion, inline: true },
                { name: 'Version', value: 'v1', inline: true },
                { name: 'Uptime', value: uptime, inline: true },
                { name: 'Developer', value: '<@1132738644927582321>', inline: true }
            )
            .setThumbnail("https://media.discordapp.net/attachments/1287421172732137563/1288459439577370696/GGRRN.png?ex=66f542dc&is=66f3f15c&hm=0bb8c853f8dd683db4581ca7091cdca5bc810f75879288e63592cd5e3859a322&=&format=webp&quality=lossless")
            .setColor('#f3eeee');

        // Send the embed
        await interaction.reply({ embeds: [botInfoEmbed] });
    },
};

// Function to format the bot's uptime
function formatUptime(seconds) {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const secs = Math.floor(seconds % 60);
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
}

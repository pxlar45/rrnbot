const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('911')
        .setDescription('Report an emergency')
        .addStringOption(option =>
            option.setName('service')
                .setDescription('Select the service to report to')
                .setRequired(true)
                .addChoices(
                    { name: 'Fire', value: 'fire' },
                    { name: 'Police', value: 'police' },
                    { name: 'Medical', value: 'medical' },
                    { name: 'All', value: 'all' } // Added 'All' option
                ))
        .addStringOption(option =>
            option.setName('location')
                .setDescription('Provide a detailed location of the emergency')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('details')
                .setDescription('Additional details about the emergency')
                .setRequired(true)),

    async execute(interaction) {
        const service = interaction.options.getString('service');
        const location = interaction.options.getString('location');
        const details = interaction.options.getString('details');
        const caller = interaction.user; // Get caller information

        const embed = new EmbedBuilder()
            .setTitle('911 Call')
            .setColor('#6994f3')
            .setThumbnail(caller.displayAvatarURL({ dynamic: true })) // Set caller's PFP as thumbnail
            .addFields(
                { name: 'Caller', value: `<@${caller.id}>`, inline: false }, // Mention caller
                { name: 'Service', value: service, inline: false },
                { name: 'Location', value: location, inline: false },
                { name: 'Details', value: details, inline: false }
            )
            .setFooter({ text: '911 call', iconURL: 'https://cdn.discordapp.com/emojis/1289026742425489418.webp?size=96&quality=lossless' }); // Replace with your icon URL

        // Send the report to a specific channel and ping the specified user
        const reportChannel = interaction.client.channels.cache.get('1293288736834064486'); // Replace with your channel ID
        const pingUser = '<@&1289113948250968134>'; // User ID to ping
        await reportChannel.send({ content: `${pingUser}`, embeds: [embed] });

        // Acknowledge the interaction with a reply
        await interaction.reply({ content: 'Your emergency report has been submitted.'});
    }
};

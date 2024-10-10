const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Make the bot say a message')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message for the bot to say')
                .setRequired(true)),
    
    async execute(interaction) {
        // Check if the user has the staff role
        const staffRoleId = '1287409293448052776';
        const logChannelId = '1288200489501986836'; // Log channel ID

        if (!interaction.member.roles.cache.has(staffRoleId)) {
            await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
            return;
        }

        const message = interaction.options.getString('message');

        // Ensure the message doesn't exceed Discord's character limit
        if (message.length > 2000) {
            await interaction.reply({ content: 'Your message is too long! Please keep it under 2000 characters.', ephemeral: true });
            return;
        }

        // Send the message to the channel
        await interaction.channel.send({ content: message, allowedMentions: { parse: ['everyone', 'roles', 'users'] } });

        // Acknowledge the interaction with an ephemeral reply
        await interaction.reply({ content: 'Message Sent!', ephemeral: true });

        // Log the command execution as an embed
        const logChannel = interaction.guild.channels.cache.get(logChannelId);
        if (logChannel) {
            const logEmbed = new EmbedBuilder()
                .setTitle('Command Executed')
                .setDescription(`The \`/say\` command was executed.`)
                .addFields(
                    { name: 'Executed by', value: `${interaction.user.tag}`, inline: true },
                    { name: 'User ID', value: `${interaction.user.id}`, inline: true },
                    { name: 'Message Content', value: message, inline: false }, // Changed to inline: false to avoid length issues
                    { name: 'Channel', value: `${interaction.channel.name}`, inline: true }
                )
                .setColor('#3498db')
                .setTimestamp();

            logChannel.send({ embeds: [logEmbed] });
        }
    }
};

const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, EmbedBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');
const moment = require('moment'); // Moment.js to format the date

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user and notify them.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to ban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for banning the user')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('evidence')
                .setDescription('Evidence for banning the user')
                .setRequired(true)),

    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        const targetUser = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason');
        const evidence = interaction.options.getString('evidence') || 'No evidence provided.';

        const guild = interaction.guild;
        const member = guild.members.cache.get(targetUser.id);

        const currentDate = moment().format('MMMM Do YYYY, h:mm:ss a');

        const banDmEmbed = new EmbedBuilder()
            .setTitle('You Have Been Banned')
            .setDescription(`You have been banned from **${guild.name}** by ${interaction.user.tag}.`)
            .addFields(
                { name: 'Reason', value: reason, inline: true },
                { name: 'Evidence', value: evidence, inline: true },
                { name: 'Date', value: currentDate, inline: true }
            )
            .setColor(0xFF0000) // Red color for ban
            .setFooter({ text: 'If you believe this was a mistake, please contact the staff.' })
            .setTimestamp();

        // Try to send a DM to the user before banning
        try {
            await targetUser.send({ embeds: [banDmEmbed] });
        } catch (error) {
            console.log(`Could not send DM to ${targetUser.tag}.`);
        }

        // Ban the user
        try {
            await member.ban({ reason: reason });
            await interaction.reply({ content: `${targetUser.username} has been banned for: ${reason}`, ephemeral: false });
        } catch (error) {
            return interaction.reply({ content: `Failed to ban ${targetUser.username}.`, ephemeral: false });
        }

        // Log the ban in a specific channel
        const logEmbed = new EmbedBuilder()
            .setTitle('User Banned')
            .addFields(
                { name: 'User', value: `${targetUser.tag}`, inline: true },
                { name: 'Reason', value: reason, inline: true },
                { name: 'Evidence', value: evidence, inline: true },
                { name: 'Banned by', value: `${interaction.user.tag}`, inline: true },
                { name: 'Date', value: currentDate, inline: true }
            )
            .setColor(0xFF0000)
            .setTimestamp();

        const logChannel = guild.channels.cache.get('1288200489501986836');
        if (logChannel) {
            logChannel.send({ embeds: [logEmbed] });
        }
    },
};

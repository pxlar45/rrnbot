const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, EmbedBuilder, PermissionsBitField } = require('discord.js');
const moment = require('moment'); // Moment.js to format the date

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user from the server and notify them.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to kick')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for kicking the user')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('proof')
                .setDescription('Proof or evidence for kicking the user (e.g., a link or text)')
                .setRequired(false)),

    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        // Check if the user has the MUTE_MEMBERS permission
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const targetUser = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason');
        const proof = interaction.options.getString('proof') || 'No proof provided.';
        const guild = interaction.guild;
        const member = guild.members.cache.get(targetUser.id);

        const currentDate = moment().format('MMMM Do YYYY, h:mm:ss a');

        const kickDmEmbed = new EmbedBuilder()
            .setTitle('You Have Been Kicked')
            .setDescription(`You have been kicked from **${guild.name}** by ${interaction.user.tag}.`)
            .addFields(
                { name: 'Reason', value: reason, inline: true },
                { name: 'Proof', value: proof, inline: true },
                { name: 'Date', value: currentDate, inline: true }
            )
            .setColor(0xFFA500) // Orange color for kick
            .setFooter({ text: 'If you believe this was a mistake, please contact the staff.' })
            .setTimestamp();

        // Try to send a DM to the user before kicking
        try {
            await targetUser.send({ embeds: [kickDmEmbed] });
        } catch (error) {
            console.log(`Could not send DM to ${targetUser.tag}.`);
        }

        // Kick the user
        try {
            await member.kick(reason);
            await interaction.reply({ content: `${targetUser.username} has been kicked for: ${reason}`, ephemeral: false });
        } catch (error) {
            return interaction.reply({ content: `Failed to kick ${targetUser.username}.`, ephemeral: false });
        }

        // Log the kick in a specific channel
        const logEmbed = new EmbedBuilder()
            .setTitle('User Kicked')
            .addFields(
                { name: 'User', value: `${targetUser.tag}`, inline: true },
                { name: 'Reason', value: reason, inline: true },
                { name: 'Proof', value: proof, inline: true },
                { name: 'Kicked by', value: `${interaction.user.tag}`, inline: true },
                { name: 'Date', value: currentDate, inline: true }
            )
            .setColor(0xFFA500)
            .setTimestamp();

        const logChannel = guild.channels.cache.get('1288200489501986836');
        if (logChannel) {
            logChannel.send({ embeds: [logEmbed] });
        }
    },
};

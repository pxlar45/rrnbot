const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');

const licensesDirPath = path.join(__dirname, '../../data/licenses');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('license')
        .setDescription('Set the license status for a specific user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user whose license status you want to set.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('status')
                .setDescription('The license status (valid or not valid)')
                .setRequired(true)
                .addChoices(
                    { name: 'Valid', value: 'valid' },
                    { name: 'Not Valid', value: 'not_valid' })),

    async execute(interaction) {
        const allowedRoleIds = ['1287409312750108743', '1287409293448052776'];
        const hasAdminRole = interaction.member.roles.cache.some(role => allowedRoleIds.includes(role.id));

        if (!hasAdminRole) {
            const embed = new EmbedBuilder()
                .setTitle('Permission Denied')
                .setDescription('You do not have permission to set the license status.')
                .setColor('#a3c0fd');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const status = interaction.options.getString('status');
        const userId = user.id;
        const filePath = path.join(licensesDirPath, `${userId}.json`);

        if (!fs.existsSync(licensesDirPath)) {
            fs.mkdirSync(licensesDirPath, { recursive: true });
        }

        const licenseData = { status, date: new Date() };
        fs.writeFileSync(filePath, JSON.stringify([licenseData], null, 2), 'utf8');

        await interaction.reply({ content: `License status for <@${userId}> has been set to ${status}.`, ephemeral: true });
    },
};

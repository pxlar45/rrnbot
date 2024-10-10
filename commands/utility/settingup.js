const { SlashCommandBuilder, ActionRowBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('settingup')
        .setDescription('Gives setting up msg'),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const staffRoleId = '1287409293448052776'; // Replace with your actual staff role ID

        if (!interaction.member.roles.cache.has(staffRoleId)) {
          await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
          return;
        }

        const message = "*Setting up! Staff, Boosters, Emergency Services & Content Creators may now join!*";

        await interaction.channel.send(message);

        await interaction.editReply({ content: 'Setting up message sent.' });
    },
};

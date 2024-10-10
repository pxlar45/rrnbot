const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Delete a specified number of messages in the channel')
        .addIntegerOption(option =>
            option.setName('number')
                .setDescription('The number of messages to delete')
                .setRequired(true)),
    async execute(interaction) {
        // Check if the user has the staff role
        const staffRoleId = '1287409293448052776';
        if (!interaction.member.roles.cache.has(staffRoleId)) {
            await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
            return;
        }

        const number = interaction.options.getInteger('number');

        // Ensure the number is between 1 and 100
        if (number < 1 || number > 100) {
            await interaction.reply({ content: 'You need to input a number between 1 and 100.', ephemeral: true });
            return;
        }

        try {
            // Bulk delete the specified number of messages
            await interaction.channel.bulkDelete(number, true);
            await interaction.reply({ content: `Successfully deleted ${number} messages.`, ephemeral: true });
        } catch (error) {
            console.error('Error deleting messages:', error);
            await interaction.reply({ content: 'There was an error trying to purge messages in this channel.', ephemeral: true });
        }
    }
};

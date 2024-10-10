const { Permissions, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionsBitField } = require('discord.js');
const ticketinteraction = require('../../events/ticketinteraction');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-ticket')
        .setDescription('Create a ticket')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    async execute(interaction) {

        await interaction.reply({ content: 'Setting up ticket system...', ephemeral: true });

        const image = "https://media.discordapp.net/attachments/1261462831220658196/1288963547509948530/RRN_ticket_support.png?ex=66f71859&is=66f5c6d9&hm=8a5485e512a41ebc48090deac4eef3b38f36c558f20d01be1c4a117f3c78743e&=&format=webp&quality=lossless";

        const embed = new EmbedBuilder()
            .setTitle('RRN | Server Support')
            .setDescription(`First of all, choose the proper category from the dropdown below in order to open a support ticket. Please be patient as the support team may be solving other requests. Frivolous tickets will have disciplinary actions. Once opened, further instructions will be given regarding the ticket.
                
                **__Important Information:__**
                - Avoid Fake Tickets: Sending fake or useless tickets will result in a server mute and a strike.
                - Requesting Server Assets: Any requests for server assets will result in a warning, and your request will be denied immediately.`)
            .setColor(0x5de0e6)
            .setFooter({
                text: 'Roblox Roleplay Network',
                iconURL: 'https://cdn.discordapp.com/emojis/1288204791847325812.webp?size=96&quality=lossless'
            });

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('ticket_select')
            .setPlaceholder('Select an option')
            .addOptions([
                {
                    label: 'Staff Report',
                    description: 'Report a staff member.',
                    value: 'staff_report',
                },
                {
                    label: 'Civilian Report',
                    description: 'Report a civilian.',
                    value: 'civ_report',
                },
                {
                    label: 'General Support',
                    description: 'Get general support.',
                    value: 'general_support',
                },
            ]);

        const row = new ActionRowBuilder()
            .addComponents(selectMenu);

        await interaction.channel.send({ embeds: [embed], components: [row], files: [image] });

        await interaction.editReply({ content: 'Ticket system setup complete!', ephemeral: true });
    },
};

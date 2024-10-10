const { Events, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const transcriptDir = './transcripts';
if (!fs.existsSync(transcriptDir)) {
    fs.mkdirSync(transcriptDir, { recursive: true });
}

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        const logChannelId = '1288200489501986836'; // Log channel ID
        const logChannel = interaction.guild.channels.cache.get(logChannelId);

        try {
            // Handle String Select Menus
            if (interaction.isStringSelectMenu()) {
                if (interaction.customId === 'ticket_select') {
                    await interaction.deferReply({ ephemeral: true });
                    const selectedOption = interaction.values[0];
                    let ticketChannel;
                    let ticketDescription = '';

                    const generalStaffRoleId = '1287409291447242785'; 
                    const staffReportRoleId = '1287409285105451102'; 

                    const generalStaffRole = interaction.guild.roles.cache.get(generalStaffRoleId);
                    const staffReportRole = interaction.guild.roles.cache.get(staffReportRoleId);

                    if (!generalStaffRole || !staffReportRole) {
                        throw new Error(`One of the roles with IDs ${generalStaffRoleId} or ${staffReportRoleId} not found`);
                    }

                    const categoryID = '1288203903984210044'; 
                    const openTime = Math.floor(Date.now() / 1000);

                    ticketChannel = await interaction.guild.channels.create({
                        name: `${selectedOption}-${interaction.user.username}`,
                        type: ChannelType.GuildText,
                        parent: categoryID,
                        topic: `Created by: ${interaction.user.id} | Opened at: ${openTime}`,
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionsBitField.Flags.ViewChannel],
                            },
                            {
                                id: interaction.user.id,
                                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                            },
                            {
                                id: selectedOption === 'staff_report' ? staffReportRole.id : generalStaffRole.id,
                                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                            },
                        ],
                    });

                    ticketDescription = `Thank you for submitting a ${selectedOption.replace('_', ' ')} ticket. Our staff team will reach back to you shortly.`;

                    const ticketEmbed = new EmbedBuilder()
                        .setTitle('RRN | Server Support')
                        .setDescription(ticketDescription)
                        .setColor(0x2B2D31);

                    const claimButton = new ButtonBuilder()
                        .setCustomId('claim_ticket')
                        .setLabel('🙋‍♂️ Claim Ticket')
                        .setStyle(ButtonStyle.Primary);

                    const closeButton = new ButtonBuilder()
                        .setCustomId('close_ticket')
                        .setLabel('🔒 Close Ticket')
                        .setStyle(ButtonStyle.Danger);

                    const buttonRow = new ActionRowBuilder()
                        .addComponents(claimButton, closeButton);

                    await ticketChannel.send({ 
                        content: `${interaction.user}, <@&${selectedOption === 'staff_report' ? staffReportRoleId : generalStaffRoleId}>`, 
                        embeds: [ticketEmbed], 
                        components: [buttonRow] 
                    });

                    if (logChannel) {
                        const logEmbed = new EmbedBuilder()
                            .setTitle('Ticket Created')
                            .setDescription(`Ticket created by ${interaction.user} (${interaction.user.id})`)
                            .addFields(
                                { name: 'Ticket Type', value: selectedOption },
                                { name: 'Ticket Channel', value: ticketChannel ? ticketChannel.toString() : 'Unknown' },
                                { name: 'Open Time', value: `<t:${openTime}:f>` }
                            )
                            .setColor(0x2B2D31);
                        await logChannel.send({ embeds: [logEmbed] });
                    }

                    await interaction.editReply({ content: `Ticket created: ${ticketChannel}` });
                }
            }

            // Handle Buttons
            else if (interaction.isButton()) {
                const channelTopic = interaction.channel.topic || '';
                const openTimeStr = channelTopic.split(' | ')[1]?.split('Opened at: ')[1];
                const openTime = openTimeStr ? parseInt(openTimeStr) : Math.floor(Date.now() / 1000); 
                const closeTime = Math.floor(Date.now() / 1000);

                if (interaction.customId === 'claim_ticket') {
                    const staffRoleId = '1287409291447242785'; 
                    const staffReportRoleId = '1287409285105451102'; 

                    const roleToCheck = interaction.channel.name.startsWith('staff-report') ? staffReportRoleId : staffRoleId;

                    if (!interaction.member.roles.cache.has(roleToCheck)) {
                        if (!interaction.replied) {
                            await interaction.reply({ content: 'You do not have permission to claim this ticket.', ephemeral: true });
                        }
                        return;
                    }

                    const existingClaim = interaction.channel.permissionOverwrites.cache.find(perm => perm.id === interaction.user.id);
                    if (existingClaim) {
                        if (!interaction.replied) {
                            await interaction.reply({ content: 'This ticket has already been claimed.', ephemeral: true });
                        }
                        return;
                    }

                    await interaction.channel.permissionOverwrites.edit(interaction.user.id, { 
                        ViewChannel: true, 
                        SendMessages: true 
                    });

                    await interaction.channel.permissionOverwrites.edit(roleToCheck, { 
                        ViewChannel: false, 
                        SendMessages: false 
                    });

                    const claimButton = new ButtonBuilder()
                        .setCustomId('claim_ticket')
                        .setLabel('🙋‍♂️ Claim Ticket')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true);

                    const buttonRow = new ActionRowBuilder()
                        .addComponents(claimButton, interaction.message.components[0].components.find(button => button.customId === 'close_ticket'));
                    
                    await interaction.update({ components: [buttonRow] });

                    if (!interaction.replied) {
                        await interaction.reply({ content: `Ticket claimed by ${interaction.user}.`, ephemeral: false });
                    }

                    if (logChannel) {
                        const logEmbed = new EmbedBuilder()
                            .setTitle('Ticket Claimed')
                            .setDescription(`Ticket claimed by ${interaction.user} (${interaction.user.id})`)
                            .addFields(
                                { name: 'Ticket Channel', value: interaction.channel ? interaction.channel.toString() : 'Unknown' },
                                { name: 'Claim Time', value: `<t:${Math.floor(Date.now() / 1000)}:f>` }
                            )
                            .setColor(0x2B2D31);
                        await logChannel.send({ embeds: [logEmbed] });
                    }
                }

                if (interaction.customId === 'close_ticket') {
                    const ticketCloseEmbed = new EmbedBuilder()
                        .setTitle('RRN | Ticket Closed')
                        .setDescription(`This ticket is now closed. The ticket creator will be notified once the ticket is permanently closed.`)
                        .addFields(
                            { name: 'Ticket Open time', value: `<t:${openTime}:f>` }, 
                            { name: 'Ticket Close time', value: `<t:${closeTime}:f>` }
                        )
                        .setColor(0x2B2D31);

                    const closeButton = new ButtonBuilder()
                        .setCustomId('close_ticket_final')
                        .setLabel('🔒 Final Close')
                        .setStyle(ButtonStyle.Danger);

                    const reopenButton = new ButtonBuilder()
                        .setCustomId('reopen_ticket')
                        .setLabel('🔄 Reopen')
                        .setStyle(ButtonStyle.Secondary);

                    const transcriptButton = new ButtonBuilder()
                        .setCustomId('transcript_ticket')
                        .setLabel('📝 Transcript')
                        .setStyle(ButtonStyle.Secondary);

                    const buttonRow = new ActionRowBuilder()
                        .addComponents(closeButton, reopenButton, transcriptButton);

                    await interaction.channel.send({ 
                        embeds: [ticketCloseEmbed], 
                        components: [buttonRow] 
                    });

                    if (!interaction.replied) {
                        await interaction.reply({ content: 'The ticket has been closed. It will be permanently closed once you click "Final Close".', ephemeral: true });
                    }

                    if (logChannel) {
                        const logEmbed = new EmbedBuilder()
                            .setTitle('Ticket Closed')
                            .setDescription(`Ticket closed by ${interaction.user} (${interaction.user.id})`)
                            .addFields(
                                { name: 'Ticket Channel', value: interaction.channel ? interaction.channel.toString() : 'Unknown' },
                                { name: 'Close Time', value: `<t:${Math.floor(Date.now() / 1000)}:f>` }
                            )
                            .setColor(0x2B2D31);
                        await logChannel.send({ embeds: [logEmbed] });
                    }
                }

                if (interaction.customId === 'reopen_ticket') {
                    const staffReportRoleId = '1287409291447242785';
                    const generalStaffRoleId = '1287409285105451102';
                    const roleToCheck = interaction.channel.name.startsWith('staff-report') ? staffReportRoleId : generalStaffRoleId;
                    
                    await interaction.channel.permissionOverwrites.edit(roleToCheck, { 
                        ViewChannel: true, 
                        SendMessages: true 
                    });

                    const reopenEmbed = new EmbedBuilder()
                        .setTitle('RRN | Ticket Reopened')
                        .setDescription(`This ticket has been reopened by ${interaction.user}.`)
                        .setColor(0x2B2D31);

                    const reopenButton = new ButtonBuilder()
                        .setCustomId('reopen_ticket')
                        .setLabel('🔄 Reopen')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true);

                    const closeButton = new ButtonBuilder()
                        .setCustomId('close_ticket')
                        .setLabel('🔒 Close Ticket')
                        .setStyle(ButtonStyle.Danger);

                    const buttonRow = new ActionRowBuilder()
                        .addComponents(closeButton, reopenButton);

                    await interaction.update({ 
                        embeds: [reopenEmbed], 
                        components: [buttonRow] 
                    });

                    if (logChannel) {
                        const logEmbed = new EmbedBuilder()
                            .setTitle('Ticket Reopened')
                            .setDescription(`Ticket reopened by ${interaction.user} (${interaction.user.id})`)
                            .addFields(
                                { name: 'Ticket Channel', value: interaction.channel ? interaction.channel.toString() : 'Unknown' },
                                { name: 'Reopen Time', value: `<t:${Math.floor(Date.now() / 1000)}:f>` }
                            )
                            .setColor(0x2B2D31);
                        await logChannel.send({ embeds: [logEmbed] });
                    }
                }

                if (interaction.customId === 'close_ticket_final') {
                    const messages = await interaction.channel.messages.fetch();
                    const transcriptPath = path.join(transcriptDir, `${interaction.channel.id}.html`);

                    let transcriptContent = `
                        <html>
                        <head>
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                    background-color: #2B2D31;
                                    color: #C7C9CB;
                                }
                                .message {
                                    padding: 10px;
                                    border-bottom: 1px solid #3E4042;
                                }
                                .message-author {
                                    font-weight: bold;
                                    color: #43B581;
                                }
                                .message-time {
                                    font-size: 0.9em;
                                    color: #72767D;
                                }
                                .message-content {
                                    margin-top: 5px;
                                }
                            </style>
                        </head>
                        <body>
                            <h1>Transcript for ${interaction.channel.name}</h1>
                            <h2>Channel ID: ${interaction.channel.id}</h2>
                            <h3>Server: ${interaction.guild.name}</h3>
                    `;

                    messages.forEach(msg => {
                        transcriptContent += `
                            <div class="message">
                                <div class="message-author">${msg.author.username}#${msg.author.discriminator}</div>
                                <div class="message-time">${msg.createdAt.toUTCString()}</div>
                                <div class="message-content">${msg.content}</div>
                            </div>
                        `;
                    });

                    transcriptContent += `
                        </body>
                        </html>
                    `;

                    fs.writeFileSync(transcriptPath, transcriptContent);

                    const transcriptAttachment = new AttachmentBuilder(transcriptPath);

                    const finalCloseEmbed = new EmbedBuilder()
                        .setTitle('RRN | Ticket Permanently Closed')
                        .setDescription('This ticket has been permanently closed.')
                        .setColor(0x2B2D31);

                    await interaction.channel.send({ 
                        embeds: [finalCloseEmbed], 
                        files: [transcriptAttachment] 
                    });

                    await interaction.channel.delete();

                    if (logChannel) {
                        const logEmbed = new EmbedBuilder()
                            .setTitle('Ticket Permanently Closed')
                            .setDescription(`Ticket permanently closed by ${interaction.user} (${interaction.user.id})`)
                            .addFields(
                                { name: 'Ticket Channel', value: interaction.channel ? interaction.channel.toString() : 'Unknown' },
                                { name: 'Close Time', value: `<t:${Math.floor(Date.now() / 1000)}:f>` }
                            )
                            .setColor(0x2B2D31);
                        await logChannel.send({ 
                            embeds: [logEmbed],
                            files: [transcriptAttachment]
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Error handling interaction:', error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error processing your request.', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error processing your request.', ephemeral: true });
            }
        }
    },
};

const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cancel')
        .setDescription('Sends a cancel embed embed')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers)
        .addStringOption(option =>  // Change to String for reasons
            option.setName('reason')
                .setDescription('The reason for cancelling the session')
                .setRequired(true)),
    async execute(interaction) {
        const reason = interaction.options.getString('reason'); // Changed to 'reason' here
        const user = interaction.user;

        const embed = new EmbedBuilder()
            .setTitle('Session Cancellation Notice')
            .setDescription(`Dear Members,

We regret to inform you that <@${user.id}> has decided to cancel their session. We, the RRN staff team, sincerely apologize for any inconvenience this may cause.

**Reason for Cancellation:** ${reason}

We appreciate your understanding and patience in this matter. Should you have any further questions or concerns, please feel free to reach out to us. We look forward to seeing you in future sessions.

Warm regards,
The RRN Staff Team`)
            .setImage("https://media.discordapp.net/attachments/1261462831220658196/1288963604493766749/RRN_1.png?ex=66f71867&is=66f5c6e7&hm=653784670237e604384b15a0f48911f6d6ebdf0f130affcc87e6e5dc24347971&=&format=webp&quality=lossless")
            .setColor(`#f3ca9a`)
            .setFooter({
                text: 'Roblox Roleplay Network',
                iconURL: 'https://cdn.discordapp.com/emojis/1288204791847325812.webp?size=96&quality=lossless'
            });

        const message = await interaction.channel.send({
            embeds: [embed]
        });

        await message.react('😭');

        const newEmbed = new EmbedBuilder()
            .setTitle("Session Cancellation")
            .setDescription(`<@${user.id}> has canceled their session in <#${interaction.channel.id}>.
                **Reason:** ${reason}`)
            .setColor(`#f3ca9a`)
            .setFooter({
                text: 'Roblox Roleplay Network',
                iconURL: 'https://cdn.discordapp.com/emojis/1288204791847325812.webp?size=96&quality=lossless'
            });

        const targetChannel = await interaction.client.channels.fetch('1288200489501986836');
        await targetChannel.send({ embeds: [newEmbed] });

        await interaction.reply({ content: `The session has been canceled successfully.`, ephemeral: true });
    },
};

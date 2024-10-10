const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('staff-fast')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .setDescription('Gives staff fastpass embed.'),
    async execute(interaction) {

        const embed1 = new EmbedBuilder()
            .setTitle('Welcome to the Staff Fastpass Channel!')
            .setDescription(`Thank you for your interest in becoming a part of our server staff team. This channel is designed to streamline the process for those looking to join our dedicated staff. Before you proceed with your application, please ensure that you meet all the necessary requirements and adhere to the specified format below.

Application Format:

Please provide the following information in your application. Ensure that all fields are filled out accurately to avoid delays in processing your fastpass request.

User: [Your Discord Username]
Server Name: [Name of the server you are representing]
Roles: [List the roles you currently hold within the server]
Proof: [Provide evidence or screenshots that support your application, such as admin panels, role management screenshots, etc.]
Roblox Profile: [Link to your Roblox profile]
Requirements:

To qualify for a staff fastpass, your server must meet the following criteria:

Server Type: Your server must be one of the following roleplay servers:

Greenville
Southwest Florida
ERLC
Server Size: Your server must have a minimum of 100 members.

Application Process:

Submit Your Application: Follow the format above and post your application in this channel.
Review: Our team will review your submission to ensure all requirements are met.
Follow-Up: We will reach out if we need additional information or if your application has been approved.
Important Notes:

Please double-check that all information is correct and complete before submitting your application.
Incomplete or incorrectly formatted applications may lead to delays or disqualification.
Ensure that your proof is clear and verifiable to facilitate a smooth review process.
Thank you for your cooperation and understanding. We look forward to potentially welcoming you to our team and working together to enhance our community!

If you have any questions or need further assistance, feel free to ask!


`)
.setThumbnail("https://cdn.discordapp.com/attachments/1288495922707435532/1288896058642010183/rrn_logo_2.png?ex=66f6d97e&is=66f587fe&hm=4a65a7a4df732976172c5ac38b2eada4aedf2030a9956bc6ee3800a1520c05c3&")
.setColor(`#f3ca9a`);
        

        await interaction.reply({ content: 'Command Sent Below.', ephemeral: true });

        async function sendEmbedMessages() {
            await interaction.channel.send({ embeds: [embed1] });
        }

        try {
            await sendEmbedMessages();
        } catch (error) {
            console.error('Error sending embed messages:', error);
        }
    },
};

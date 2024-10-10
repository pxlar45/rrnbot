const { 
    SlashCommandBuilder, 
    ChatInputCommandInteraction, 
    Client, 
    ActionRowBuilder, 
    StringSelectMenuBuilder, 
    StringSelectMenuOptionBuilder,  // Add this import
    ButtonBuilder, 
    ButtonStyle, 
    EmbedBuilder, 
    ModalBuilder, 
    PermissionFlagsBits, 
    TextInputBuilder, 
    TextInputStyle, 
    RoleSelectMenuBuilder, 
    ChannelSelectMenuBuilder, 
    ChannelType, 
    PermissionsBitField 
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('staffinfo')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .setDescription('Staff Information'),
    async execute(interaction) {

        const embed1 = new EmbedBuilder()
            .setTitle('Staff Information')
            .setImage("https://media.discordapp.net/attachments/1261462831220658196/1288966342820757565/RRN_4.png?ex=66f71af3&is=66f5c973&hm=67656080569ae156d4a5bc2d86a66c1c257d28ea045e33acfa56f2025dffac48&=&format=webp&quality=lossless")
            .setDescription(`> Welcome to RRN Staff Team. This channel will provide all the information you will need to understand about hosting, commands and more.
                
                in <#1287503020510154802> you must click on the dropdown below and read all of the information provided.`)
                .setColor('#fa7878');

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('sfembed')
            .setPlaceholder('Select an option')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Qouta')
                    .setDescription('Qouta')
                    .setValue('qouta'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Staff Information')
                    .setDescription('Information for the staff.')
                    .setValue('sf'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Commands')
                    .setDescription('Session Commands')
                    .setValue('sc'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Staff Handbook')
                    .setDescription('Link to staff handbook.')
                    .setValue('sh'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Staff Database')
                    .setDescription('Link to staff database.')
                    .setValue('sd'),
            );

        const row = new ActionRowBuilder().addComponents(selectMenu);

        await interaction.reply({ content: 'Command Sent Below.', ephemeral: true });

        async function sendEmbedMessages() {
            await interaction.channel.send({ embeds: [embed1], components: [row] });
        }

        try {
            await sendEmbedMessages();
        } catch (error) {
            console.error('Error sending embed messages:', error);
        }
    },
};

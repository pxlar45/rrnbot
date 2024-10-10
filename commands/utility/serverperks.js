const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverperks')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .setDescription('Server Perks command.'),
    async execute(interaction) {

        const embed1 = new EmbedBuilder()
            .setTitle('Server Perks')
            .setImage("https://media.discordapp.net/attachments/1261462831220658196/1288966034505863262/RRN_3.png?ex=66f71aaa&is=66f5c92a&hm=876a434abc42d69b4f8d562aac8f4902045efa26110cd4991f895bb3f49c07f2&=&format=webp&quality=lossless")
            .setDescription(`Welcome to the server perks channel. This is where you would get information about getting EA,UBVE,BVE and more. Just know to get these you can boost the server or buy the pass on [Roblox](https://www.roblox.com/home). If you have anything to ask about the server perks or would like to buy it. You can head over to <#1287394490289492061> to get your roles after buying.`)
            .setColor('#1D4DDE');
            
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('sp')
            .setPlaceholder('Select an option')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Nitro Boosting')
                    .setDescription('What you get from Nitro Boosting')
                    .setValue('nb'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Robux')
                    .setDescription('What you get from buying our passes off roblox.')
                    .setValue('rb'),
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

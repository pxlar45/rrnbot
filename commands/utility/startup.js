const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('startup')
        .setDescription('Sends a startup embed')
        .addIntegerOption(option =>
            option.setName('reactions')
                .setDescription('Amount of reactions for the session to occur')
                .setRequired(true)),
    async execute(interaction) {
        const reactions = interaction.options.getInteger('reactions');
        const user = interaction.user;
        const staffRoleId = '1287409293448052776'; // Only users with this role can execute the command
        
              // Check if the user has the required role
              if (!interaction.member.roles.cache.has(staffRoleId)) {
                // If the user doesn't have the required role, reply with a permission error
                return await interaction.reply({ content: 'You do not have permission to execute this command.', ephemeral: true });
              }
        

        const embed = new EmbedBuilder()
            .setTitle('RRN | Session Startup')
            .setDescription(`<@${interaction.user.id}> is initiating a roleplay session. Please ensure you have reviewed the server information available in <#1287392096612778078>.

Before participating, make sure your vehicle is properly registered. To register your vehicle, use the /register command in <#1287393911148646523>.

This session will commence once this message receives ${reactions} or more reactions.`)
            .setImage("https://media.discordapp.net/attachments/1261462831220658196/1288963604153892914/RRN_2.png?ex=66ffaa27&is=66fe58a7&hm=5939787ae8616e71cc5056c92d5cb26555ead526d2da98cca7a393e1b2558822&=&format=webp&quality=lossless")
            .setColor(`#f3ca9a`)
            .setFooter({
                text: 'Roblox Roleplay Network',
                iconURL: 'https://cdn.discordapp.com/emojis/1288204791847325812.webp?size=96&quality=lossless'
            });

        // Create the "Banned Vehicle List" button (Primary)
        const bannedVehicleButton = new ButtonBuilder()
            .setCustomId('bannedVehicleList')
            .setLabel('Banned Vehicle List')
            .setStyle(ButtonStyle.Primary);

        // Create action row to hold the button
        const row = new ActionRowBuilder()
            .addComponents(bannedVehicleButton);

        const message = await interaction.channel.send({
            content: '@everyone',
            embeds: [embed],
            components: [row]  // Add the primary button to the message
        });

        await message.react('✅');

        // Handle reactions and session startup
        const reactionFilter = (reaction, user) => reaction.emoji.name === '✅';
        const reactionCollector = message.createReactionCollector({ filter: reactionFilter, time: 86400000 });

        reactionCollector.on('collect', (reaction) => {
            console.log(`Collected ${reaction.count} reactions`);
            if (reaction.count >= reactions) {
                const settingUpEmbed = new EmbedBuilder()
                    .setDescription('Setting up!');

                interaction.channel.send({ embeds: [settingUpEmbed] });
                reactionCollector.stop();
            }
        });

        reactionCollector.on('end', collected => {
            console.log(`Collector ended. Total reactions: ${collected.size}`);
        });

        await interaction.reply({ content: `You have initiated a session successfully.` });
    },
};
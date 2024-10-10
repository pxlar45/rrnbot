const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('release')
    .setDescription('This will release your session')
    .addStringOption(option =>
      option.setName('peacetime')
        .setDescription('Peacetime status')
        .setRequired(true)
        .addChoices(
          { name: 'On', value: 'On' },
          { name: 'Strict', value: 'Strict' },
          { name: 'Off', value: 'Off' }
        ))
    .addStringOption(option =>
      option.setName('frp-speeds')
        .setDescription('FRP-Speeds status')
        .setRequired(true)
        .addChoices(
          { name: '75 MPH', value: '75 MPH' },
          { name: '80 MPH', value: '80 MPH' },
          { name: '90 MPH', value: '90 MPH' }
        ))
    .addStringOption(option =>
      option.setName('drifting-status')
        .setDescription('Drifting status')
        .setRequired(true)
        .addChoices(
          { name: 'On', value: 'On' },
          { name: 'Corners Only', value: 'Corners Only' },
          { name: 'Off', value: 'Off' }
        ))
    .addStringOption(option =>
      option.setName('link')
        .setDescription('Session link')
        .setRequired(true)),
  async execute(interaction) {
    const peacetime = interaction.options.getString('peacetime');
    const frpSpeeds = interaction.options.getString('frp-speeds');
    const driftingStatus = interaction.options.getString('drifting-status');
    const link = interaction.options.getString('link');
    const staffRoleId = '1287409293448052776'; // Only users with this role can execute the command
        
    // Check if the user has the required role
    if (!interaction.member.roles.cache.has(staffRoleId)) {
      // If the user doesn't have the required role, reply with a permission error
      return await interaction.reply({ content: 'You do not have permission to execute this command.', ephemeral: true });
    }

    
    const embed = new EmbedBuilder()
      .setTitle('Roblox Roleplay Network | Session Released')
      .setDescription(`The session has now been released! Ensure to abide by all civilian information rules and stay updated on banned vehicles. All information about the session is listed down below.
                
Make sure to register your vehicles in the ⁠commands channel, to register use the command /register, to unregister use the command /unregister and go over civilian information!
\n\n**__Session Information__**\n\nHost: ${interaction.user}\nPeacetime: ${peacetime}\nFRP-Speeds: ${frpSpeeds}\nDrifting Status: ${driftingStatus}`)
      .setColor('#3498db')
      .setImage('https://media.discordapp.net/attachments/1261462831220658196/1288963546922618890/RRN_session_release.png?ex=66f71859&is=66f5c6d9&hm=167545ca1c8d4a03dbaee440005ae0b7c2545f43316c9940a486bb7fd8f34db8&=&format=webp&quality=lossless')
      .setFooter({
        text: 'Roblox Roleplay Network',
        iconURL: 'https://cdn.discordapp.com/emojis/1288204791847325812.webp?size=96&quality=lossless'
      })
      .setTimestamp();

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('session_link')
          .setLabel('Session Link')
          .setStyle(ButtonStyle.Primary)
      );

            // Log the command execution as an embed
            const logChannelId = '1288200489501986836'; // Replace with your log channel ID
            const logChannel = interaction.guild.channels.cache.get(logChannelId);
            if (logChannel) {
              const logEmbed = new EmbedBuilder()
                .setTitle('Command Executed')
                .setDescription(`The \`/release\` command was executed.`)
                .addFields(
                  { name: 'Executed by', value: `${interaction.user.tag}`, inline: true },
                  { name: 'User ID', value: `${interaction.user.id}`, inline: true },
                  { name: 'Channel', value: `${interaction.channel.name}`, inline: true },
                  { name: 'Link Provided', value: `${link}`, inline: false },
                )
                .setColor('#f1c40f')
                .setTimestamp();
      
              logChannel.send({ embeds: [logEmbed] });
            }
      

    // Acknowledge the interaction and respond with an ephemeral message
    await interaction.reply({ content: 'Session released!', ephemeral: true });

    // Send the embed publicly
    const message = await interaction.channel.send({
      content: '@everyone', // This line adds the @everyone mention
      embeds: [embed],
      components: [row],
      allowedMentions: { parse: ['everyone'] } // This ensures the mention is allowed
    });

    const filter = i => i.customId === 'session_link' && i.isButton();

    // Create a persistent interaction collector with no timeout
    const collector = message.createMessageComponentCollector({ filter: i => i.customId === 'session_link' && i.isButton() });

    collector.on('collect', async i => {
      if (!i.member.roles.cache.has(staffRoleId)) {
        await i.reply({ content: 'You do not have permission to click on this button!', ephemeral: true });
      } else {
        await i.reply({ content: `**Session Link:** ${link}`, ephemeral: true });
      }
    });

    // The collector will now stay active indefinitely, and the button will remain functional 24/7.
  }
};

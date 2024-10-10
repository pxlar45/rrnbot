const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('over')
    .setDescription('End a session')
    .addStringOption(option => 
      option.setName('start')
        .setDescription('This will tell when you started your session')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('end')
        .setDescription('This will tell when you ended your session')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('notes')
        .setDescription('You are able to add notes')
        .setRequired(false)),
  async execute(interaction) {
    await interaction.deferReply();
    
    const start = interaction.options.getString('start');
    const end = interaction.options.getString('end');
    const notes = interaction.options.getString('notes') || 'None';
    const logChannelId = '1288200489501986836'; // Channel ID for logging
    const staffRoleId = '1287409293448052776'; // Replace with your actual staff role ID

    if (!interaction.member.roles.cache.has(staffRoleId)) {
      await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle('Session Concluded')
      .setDescription(`Roblox Roleplay Network | Session Ended
        <@${interaction.user.id}> has ended the session. We Hop you enjoyed yourself in one of the many sessions we host!!\n\nStart Time: ${start}\nEnd Time: ${end}\nNotes: ${notes}`)
      .setColor('#f3ca9a')
      .setImage("https://media.discordapp.net/attachments/1261462831220658196/1288963603801706601/RRN_SESSION_OVER.png?ex=66f71866&is=66f5c6e6&hm=6828eb5248d3be2b9f193a059051494a72fb821ee5183d4eb5098bfe41c52e23&=&format=webp&quality=lossless")
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });

    

    // Log the command execution
    const logEmbed = new EmbedBuilder()
      .setTitle('Command Execution Log')
      .setDescription(`**Command:** /over\n**Executed By:** ${interaction.user.tag} (${interaction.user.id})\n**Start Time:** ${start}\n**End Time:** ${end}\n**Notes:** ${notes}`)
      .setColor('#3498db')
      .setTimestamp();

    // Send the log to the specified channel
    const logChannel = await interaction.client.channels.fetch(logChannelId);
    if (logChannel) {
      await logChannel.send({ embeds: [logEmbed] });
    } else {
      console.error(`Log channel with ID ${logChannelId} not found.`);
    }
  },
};

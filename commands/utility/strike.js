const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('strike')
    .setDescription('Strikes a user for a specific reason and gives them a role')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('This will strike the person')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('reason')
        .setDescription('This will tell them the reason')
        .setRequired(true))
        .addStringOption(option => 
          option.setName('evidence')
            .setDescription('This will give them the evidence')
            .setRequired(true))
    .addRoleOption(option => 
      option.setName('role')
        .setDescription('This will give them the role')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator), // Ensures only people with Manage Roles can use this command

  async execute(interaction) {
    // Get the user, reason, and role from the command options
    const targetUser = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    const role = interaction.options.getRole('role');
    const guildMember = await interaction.guild.members.fetch(targetUser.id);
    const evidence = interaction.options.getString('evidence');

    // Create the embed message for the DM
    const strikeEmbed = new EmbedBuilder()
      .setTitle('Roblox Roleplay Network | Staff strike')
      .setDescription(`You have been Staff Striked In Roblox Roleplay Network, \nReason: ${reason}.

\nEvidence: ${evidence}

Staff strikes are unappealable, meaning that this staff strike will stick with you and is unable to be appealed. If you have any concerns or questions, please do not hesitate to contact a High Ranking Individual.`)
      .setColor('#3498db')
      .setFooter({
        text: 'Roblox Roleplay Network',
        iconURL: 'https://cdn.discordapp.com/emojis/1288204791847325812.webp?size=96&quality=lossless'
      })
      .setTimestamp();

    try {
      // DM the user with the reason
      await targetUser.send({ embeds: [strikeEmbed] });

                  // Log the command execution as an embed
                  const logChannelId = '1288200489501986836'; // Replace with your log channel ID
                  const logChannel = interaction.guild.channels.cache.get(logChannelId);
                  if (logChannel) {
                    const logEmbed = new EmbedBuilder()
                      .setTitle('Command Executed')
                      .setDescription(`The \`/strike\` command was executed.`)
                      .addFields(
                        { name: 'Executed by', value: `${interaction.user.tag}`, inline: true },
                        { name: 'User ID', value: `${interaction.user.id}`, inline: true },
                        { name: 'Channel', value: `${interaction.channel.name}`, inline: true },
                      )
                      .setColor('#f1c40f')
                      .setTimestamp();
            
                    logChannel.send({ embeds: [logEmbed] });
                  }
            

      // Assign the role to the user
      await guildMember.roles.add(role);

      // Reply to the command executor (ephemeral)
      await interaction.reply({ content: `${targetUser} has been striked.`, ephemeral: true });

    } catch (error) {
      console.error('Error while striking the user:', error);
      // Reply with an error message if something goes wrong
      await interaction.reply({ content: 'There was an error trying to strike the user or assign the role.', ephemeral: true });
    }
  },
};

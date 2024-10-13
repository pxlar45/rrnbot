const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server-information')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .setDescription('Gives Server Information'),
    async execute(interaction) {
        const image = "https://media.discordapp.net/attachments/1261462831220658196/1295117350584188999/RRN_1.png?ex=670d7b86&is=670c2a06&hm=990e2a0685a3af629af5992ac4fa865bb2c06bd5d7f82726ae968995e91dc810&=&format=webp&quality=lossless";

        const embed1 = new EmbedBuilder()
            .setTitle('Server Information')
            .setDescription(`> Welcome to RRN, here you can get information about the server. Please read all the info below to make sure you dont accidentally break a rule.`)
            .setColor(`#f3eeee`);

        const embed2 = new EmbedBuilder()
            .setTitle('Server Regulations')
            .setDescription(`1. Be Respectful
Treat all members with kindness and respect. No harassment, bullying, or hate speech will be tolerated. Everyone is here to have fun!

2. Keep Content Safe for Work (SFW)

All chat, images, and content shared within this server must be appropriate for all ages. No NSFW, inappropriate, or offensive content.

3. No Spamming

Avoid spamming in any channels, whether it's through messages, emojis, links, or images. Keep the chat clean and readable for everyone.

4. Use Channels Appropriately

Each channel has a specific purpose. Make sure you're using the right channel for the right activity (e.g., roleplay in roleplay channels, memes in meme channels).

5. Follow Roleplay Guidelines

Realistic Roleplay Only: This is a realistic roleplay server. All roleplays should reflect real-life scenarios.
No Fail Roleplay: Don’t engage in unrealistic or non-serious roleplay actions (e.g., driving off a cliff for fun).
No Meta-Gaming or Power-Gaming: Don’t use out-of-character knowledge in-character. Don’t force actions on other players without consent.
Roleplay Cooldown: Give others a chance to roleplay properly and take turns in scenes. Don't hog the attention.

6. No Advertising or Self-Promotion

Advertising of any kind, whether for other Discord servers or personal content, is not allowed without staff approval.

7. Obey Staff Members

Staff members are here to help maintain the server. Please follow their instructions at all times. If you have an issue with a staff member, raise it privately with another member of the team.

8. Vehicle Regulations

Only use vehicles that are listed as approved for roleplay.
No Banned Vehicles: The banned vehicle list must be strictly followed.
No unrealistic modifications, speeds, or behavior with vehicles.

9. Respect the Server’s Roleplay Structure

No Random Deathmatch (RDM): You may not randomly attack or kill other players without proper roleplay initiation.
No Vehicle Deathmatch (VDM): Don't use vehicles to attack other players in a non-roleplay situation.
10. Ticketing and Strikes
If you break the rules, you may receive tickets or strikes based on the severity of the offense. Three strikes may result in a ban from the server.

11. No Impersonation

Do not impersonate other members, staff, or any official entities. This includes using similar usernames, avatars, or claiming authority you don’t have.

12. No Exploiting or Glitching

Do not use any cheats, exploits, or bugs in-game to gain an advantage or disrupt others' gameplay.

13. Reporting Issues

If you witness any rule-breaking or issues, report it to the staff through the appropriate ticket system or report channel.

14. Roleplay Respectfully

All members should contribute to an immersive and enjoyable roleplay experience. Disruptive or disrespectful behavior during roleplays will not be tolerated.`)
            .setColor(`#f3eeee`);
            
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('information_select')
            .setPlaceholder('Select an option')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Session Guidelines')
                    .setDescription('Guidlines for the session.')
                    .setValue('sguild'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Session Ping')
                    .setDescription('Gives the @Sessions role.')
                    .setValue('sping'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Emergency Services Server')
                    .setDescription('Link to ESS Server.')
                    .setValue('ess'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Greenville Server')
                    .setDescription('Link to GV Server.')
                    .setValue('GVserver'),
            );

        const row = new ActionRowBuilder().addComponents(selectMenu);

        await interaction.reply({ content: 'Command Sent Below.', ephemeral: true });

        async function sendEmbedMessages() {
            await interaction.channel.send({ embeds: [embed1, embed2], components: [row], files: [image] });
        }

        try {
            await sendEmbedMessages();
        } catch (error) {
            console.error('Error sending embed messages:', error);
        }
    },
};

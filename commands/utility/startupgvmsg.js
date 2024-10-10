const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionFlagsBits, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('startup-message-gv')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .setDescription('Gives Greenville Startup msg'),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const image = "https://media.discordapp.net/attachments/1261462831220658196/1288963545907724298/RRN_GV_STARTUP.png?ex=66fe5899&is=66fd0719&hm=c82ca11ebdb087e3de58ec1fca9c65456b1a6a6c96c0b7567a62178aeabca9ac&=&format=webp&quality=lossless"
        const embed1 = new EmbedBuilder()
            .setTitle('RRN | GV Startup')
            .setDescription("> Hey <@&1287409353074282598>, Welcome to <#1287393634882424884>, this is where our server staff's will host **[Greenville](https://rblx.games/891852901)** Roleplay Sessions for you Civilians to enjoy. If you want to get notified for a session there is a red button named 'Session Ping' if you click it, it gives you a A role, which pings you everytime a session occurs.")
            .setThumbnail("https://cdn.discordapp.com/attachments/1274435479831318692/1274445649479340052/SF_2.png?ex=66c2f040&is=66c19ec0&hm=a92aafc03acc090f44c7a2b2658a131b3d63e820e0038d02dd9a39774055580f&")
            .setColor(0x5de0e6);

        const embed2 = new EmbedBuilder()
            .setTitle('Startup Information')
            .setDescription(`
                - You will be notified here when a session starts! Please do not ask for sessions or re-invites.
                - DO NOT ask for sessions or start times. You will be pinged with the role Sessions when a session starts or in case of any re-invites. Asking will result in a mute.`)
            .setColor(0x5de0e6)
            .setFooter({
                text: 'Roblox Roleplay Network',
                iconURL: 'https://cdn.discordapp.com/emojis/1288204791847325812.webp?size=96&quality=lossless'
            });
        
        const button1 = new ButtonBuilder()
            .setCustomId('toggle_ping')
            .setLabel('Session Ping')
            .setStyle(ButtonStyle.Primary);

        const button2 = new ButtonBuilder()
            .setLabel('Banned Vehicle list')
            .setStyle(ButtonStyle.Link)
            .setURL('https://docs.google.com/spreadsheets/d/1dweIGDpbgV9P1XxpUplVw84iMcn3kG6PfgTGoMtGQeo/edit?usp=sharing');

        const button3 = new ButtonBuilder()
            .setLabel('Information')
            .setStyle(ButtonStyle.Link)
            .setURL('https://discord.com/channels/1258897081314312255/1287392096612778078');

        const row = new ActionRowBuilder()
            .addComponents(button1,button2, button3);

        await interaction.channel.send({ files: [image], embeds: [embed1, embed2], components: [row] });

        await interaction.editReply({ content: 'Startup message sent.' });
    },
};

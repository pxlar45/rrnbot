const { Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');

const transcriptDir = './transcripts';
if (!fs.existsSync(transcriptDir)) {
    fs.mkdirSync(transcriptDir, { recursive: true });
}

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        try {
            // Server Information Interaction
            if (interaction.isStringSelectMenu() && interaction.customId === 'sfembed') {
                let embedResponses = [];
                let components = [];

                switch (interaction.values[0]) {
                    case 'qouta':
                        const qouta = new EmbedBuilder()
                            .setDescription(`<@&1287409285105451102> & <@&1287409280105971722> : All Exempt
                                <@&1287409286338707590>(Middle Ranking): 5 points
                                <@&1287409291447242785>(Low ranking): 8 points.
                                <@&1287409290499461192> 5 points to pass training and become junior staff. 2 points per supervised session and 1 point per co host completed
                                
                                <@&1287409284493082635> and higher is only allowed to train <@&1287409290499461192>
                                
                                Staff In Training, Each Session Hosted = 2 Points
                                Staff In Training, Each Session Co-Hosted = 1 Point
                                
                                Junior Staff, Server Staff & Middle Ranking Team, Each Session Hosted = 3 Points.
                                Junior Staff, Server Staff & Middle Ranking Team, Each Session Co-Hosting = 2 Point`)
                                
                                .setColor(0x5de0e6);

                        if (!interaction.replied && !interaction.deferred) {
                            await interaction.reply({
                                embeds: [qouta],
                                ephemeral: true
                            });
                        }
                        return;

                        case 'sf':
                            const sf = new EmbedBuilder()
                                .setDescription(`1.Always stay professional and kind and respectful at all costs and times at RRN. It does not matter if the member is not respecting you; you always be professional and kind to a user at all times.

                                    2.You CANNOT harass any member in RRN no matter who it is.

                                   3.You are NOT allowed to leak any staff information at all costs to anyone. No matter who. All the things in RRN STAFF stays private.

                                   4.When warning a user in-game you are required to kick them from the session.

                                   5.You are responsible to resolve certain situations. Not cause any or start any.

                                   6.You CANNOT harass any member in RRN no matter who it is.`)
                                .setColor('#fa7878');
                        
                            if (!interaction.replied && !interaction.deferred) {
                                await interaction.reply({
                                    embeds: [sf],
                                    ephemeral: true
                                });
                            }
                            return;

                            case 'sh':
                                const sh = new EmbedBuilder()
                                    .setDescription('https://docs.google.com/document/d/1LAWtNYJ2apw8WzGdWOSbBKpIJncESBP6Z6kyqjbprRo')
                                    .setColor(0xf3eeee);
                    
                                if (!interaction.replied && !interaction.deferred) {
                                    await interaction.reply({
                                        embeds: [sh],
                                        ephemeral: true
                                    });
                                }
                                break;

                            case 'sd':
                                    const sd = new EmbedBuilder()
                                        .setDescription('https://docs.google.com/spreadsheets/d/1LUWeDYPq80Q8S_wDT0xqhqG4kXboNtcAhOiEMjs1nx8/edit?usp=sharing')
                                        .setColor(0xf3eeee);
                        
                                    if (!interaction.replied && !interaction.deferred) {
                                        await interaction.reply({
                                            embeds: [sd],
                                            ephemeral: true
                                        });
                                    }
                                    break;


                    case 'sc':
                        const sc = new EmbedBuilder()
                            .setDescription(`/startup
                                /early-access
                                /over
                                /release
                                /setting-up
                                /staff-access
                                /cohost
                                /re-invites
                                /mark
                                /cancel
                                /purge`)
                                .setColor('#fa7878');

                        embedResponses.push(sc);
                        break;
                }

                if (embedResponses.length > 0 && !interaction.replied && !interaction.deferred) {
                    await interaction.reply({
                        embeds: embedResponses,
                        components,
                        ephemeral: true
                    });
                }
            }
            // Server Ping Button Interaction
            else if (interaction.isButton() && interaction.customId === 'toggle_ping') {
                const roleId1 = '1273706492968570932';
                const member = interaction.member;

                if (member.roles.cache.has(roleId1)) {
                    await member.roles.remove(roleId1);
                    if (!interaction.replied && !interaction.deferred) {
                        await interaction.reply({
                            content: 'The <@&1273706492968570932> role has been removed from you.',
                            ephemeral: true
                        });
                    }
                } else {
                    await member.roles.add(roleId1);
                    if (!interaction.replied && !interaction.deferred) {
                        await interaction.reply({
                            content: 'You have been granted the <@&1273706492968570932> role.',
                            ephemeral: true
                        });
                    }
                }
            }
            // Ticketing System Interaction
            else if (interaction.isStringSelectMenu() && interaction.customId === 'ticket_select') {
                // Handle ticket creation
            } else if (interaction.isButton()) {
                // Handle ticket claiming, closing, reopening, etc.
            }
        } catch (error) {
            console.error(`Error handling interaction: ${error}`);
            if (!interaction.replied && !interaction.deferred) {
                try {
                    await interaction.reply({ content: 'An error occurred while handling your request.', ephemeral: true });
                } catch (replyError) {
                    console.error(`Failed to send error reply: ${replyError}`);
                }
            }
        }
    },
};

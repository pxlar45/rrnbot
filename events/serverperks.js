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
            
            if (interaction.isStringSelectMenu() && interaction.customId === 'sp') {
                let embedResponses = [];
                let components = [];

                if (interaction.values && interaction.values[0]) {
                    switch (interaction.values[0]) {
                        case 'nb':
                            const nitrooneto3 = new EmbedBuilder()
                                .setTitle('1-3 boosting perks')
                                .setDescription(`<@&1259918325014593638>
                                    <@&1287409349244883156>
                                    <@&1287463237176262802>
                                    <@&1287409339145125961>
                                    40k eco`)
                                .setColor('#1D4DDE');

                                const nitro4plus = new EmbedBuilder()
                                .setTitle('4+ boosting perks')
                                .setDescription(`All 3 perks
                                    <@&1287409338217922571>
                                    70K eco every week.`)
                                .setColor('#1D4DDE');

                            if (!interaction.replied && !interaction.deferred) {
                                await interaction.reply({
                                    embeds: [nitrooneto3, nitro4plus],
                                    ephemeral: true
                                });
                            }
                            return;

                        case 'rb':
                            const rb1 = new EmbedBuilder()
                                .setTitle('Robux Perks')
                                .setDescription(`BVE - 200
                                    UBVE - 450
                                    Early Access - 200
                                    @everyone ping: 550
                                    @here ping: 500
                                    Sponsership no ping: 200
                                    Sponsership @here ping: 350
                                    Sponsership @everyone ping: 600
                                    Full bundle partner (@everyone ping + custom channel) - 700
                                    Image Permisson - 150
                                    250k ECO - 200
                                    500k ECO - 400`)
                                .setColor('#1D4DDE');

                            if (!interaction.replied && !interaction.deferred) {
                                await interaction.reply({
                                    embeds: [rb1],
                                    ephemeral: true
                                });
                            }
                            return;

                        default:
                            throw new Error(`Unexpected select menu value: ${interaction.values[0]}`);
                    }
                } else {
                    throw new Error('No value provided in select menu interaction.');
                }

                if (embedResponses.length > 0 && !interaction.replied && !interaction.deferred) {
                    await interaction.reply({
                        embeds: embedResponses,
                        components,
                        ephemeral: true
                    });
                }
            }
        } catch (error) {
            console.error(`Error handling interaction: ${error.message}`);
            if (!interaction.replied && !interaction.deferred) {
                try {
                    await interaction.reply({ content: 'An error occurred while handling your request.', ephemeral: true });
                } catch (replyError) {
                    console.error(`Failed to send error reply: ${replyError.message}`);
                }
            }
        }
    },
};

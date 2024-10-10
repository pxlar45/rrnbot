const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const dataDirPath = path.join(__dirname, '../../data/vehicleData');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Register your vehicle.')
        .addIntegerOption(option =>
            option.setName('year')
                .setDescription('Vehicle Year')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('make')
                .setDescription('Vehicle Make')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('model')
                .setDescription('Vehicle Model')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('color')
                .setDescription('Vehicle Color')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('number-plate')
                .setDescription('Vehicle Number Plate')
                .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        try {
            const year = interaction.options.getInteger('year');
            const make = interaction.options.getString('make');
            const model = interaction.options.getString('model');
            const color = interaction.options.getString('color');
            const numberPlate = interaction.options.getString('number-plate');
            const userId = interaction.user.id;
            const userRoles = interaction.member.roles.cache;

            if (!fs.existsSync(dataDirPath)) {
                fs.mkdirSync(dataDirPath, { recursive: true });
            }

            const userFilePath = path.join(dataDirPath, `${userId}.json`);

            let vehicleData = [];
            if (fs.existsSync(userFilePath)) {
                vehicleData = JSON.parse(fs.readFileSync(userFilePath, 'utf8'));
            }

            let maxRegistrations = 5; // Default limit
            if (userRoles.has('11287409338217922571')) {
                maxRegistrations = 20;
            } else if (userRoles.has('1287409353074282598')) {
                maxRegistrations = 5;
            } 

            if (vehicleData.length >= maxRegistrations) {
                await interaction.editReply({ content: `You have reached the maximum number of vehicle registrations (${maxRegistrations}).`, ephemeral: true });
                return;
            }

            vehicleData.push({ year, make, model, color, numberPlate });
            fs.writeFileSync(userFilePath, JSON.stringify(vehicleData, null, 2), 'utf8');

            const embed = new EmbedBuilder()
                .setTitle('Vehicle Registered')
                .setDescription(`<@${interaction.user.id}> has registered their vehicle to the database. The information below is the vehicle information.
                
                **Vehicle Information:**
                
                Owner: <@${interaction.user.id}>
                Year: **${year}**
                Make: **${make}**
                Model: **${model}**
                Color: **${color}**
                Number Plate: **${numberPlate}**`)
                .setColor('#fa7878')
                .setFooter({
                    text: 'Roblox Roleplay Network',
                    iconURL: 'https://cdn.discordapp.com/emojis/1287421662232580106.webp?size=96&quality=lossless'
                });

            const targetChannel = await interaction.client.channels.fetch('1288194332138016860');
            if (targetChannel.isTextBased()) {
                await targetChannel.send({ embeds: [embed] });
            }

            // Ensure the interaction is properly acknowledged and reply with the success message
            await interaction.editReply({ content: 'Vehicle has been registered successfully. If you would like to view it, execute the command `/profile`.', ephemeral: true });
        } catch (error) {
            console.error('Error processing vehicle registration:', error);
            // If there's an error, send a reply with the error message
            await interaction.editReply({ content: 'There was an error while processing your request.', ephemeral: true });
        }
    },
};

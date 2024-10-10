const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');

const dataFolderPath = path.join(__dirname, '../../data/vehicleData');
const policeRecordsDirPath = path.join(__dirname, '../../data/policeRecords');
const licensesDirPath = path.join(__dirname, '../../data/licenses');
const ticketsDirPath = path.join(__dirname, '../../data/tickets');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Displays your or another user\'s profile.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Select a user to view their profile. If not selected, shows your profile.')),

    async execute(interaction) {
        const selectedUser = interaction.options.getUser('user') || interaction.user;
        const userId = selectedUser.id;
        const userTag = selectedUser.tag;

        // Load vehicle data for the user
        const userFilePath = path.join(dataFolderPath, `${userId}.json`);
        const policeRecordFilePath = path.join(policeRecordsDirPath, `${userId}.json`);
        const licenseFilePath = path.join(licensesDirPath, `${userId}.json`);
        const ticketFilePath = path.join(ticketsDirPath, `${userId}.json`);

        let vehicleData = [];
        if (fs.existsSync(userFilePath)) {
            vehicleData = JSON.parse(fs.readFileSync(userFilePath, 'utf8'));
        }

        let policeRecords = [];
        if (fs.existsSync(policeRecordFilePath)) {
            policeRecords = JSON.parse(fs.readFileSync(policeRecordFilePath, 'utf8'));
        }

        let licenseStatus = 'Active'; // Default license status
        if (fs.existsSync(licenseFilePath)) {
            const licenses = JSON.parse(fs.readFileSync(licenseFilePath, 'utf8'));
            if (licenses.length > 0) {
                const latestLicense = licenses[licenses.length - 1];
                // If the status is not set, default to 'Active'
                licenseStatus = latestLicense.status ? `**Status:** ${latestLicense.status}` : '**Status:** Active';
                licenseStatus += `\n**Date:** ${new Date(latestLicense.date).toLocaleString()}`;
            }
        }

        const vehicleList = vehicleData.length > 0
            ? vehicleData.map((v, index) =>
                `**${index + 1}.** Year: ${v.year}, Make: ${v.make}, Model: ${v.model}, Color: ${v.color}, Number Plate: ${v.numberPlate}`).join('\n')
            : 'No vehicles registered.';

        const arrestsList = policeRecords.length > 0
            ? policeRecords.map((r, index) =>
                `**${index + 1}.** Reason: ${r.reason}\nOffenses: ${r.offenses}\nPrice: ${r.price}\nExecuted By: ${r.executedBy}\nDate: ${new Date(r.date).toLocaleString()}`).join('\n\n')
            : 'No arrests found.';

        let ticketsList = 'No tickets found.';
        if (fs.existsSync(ticketFilePath)) {
            const tickets = JSON.parse(fs.readFileSync(ticketFilePath, 'utf8'));
            if (tickets.length > 0) {
                ticketsList = tickets.map((t, index) =>
                    `**${index + 1}.** Offense: ${t.offense}\nPrice: ${t.price}\nCount: ${t.count}\nDate: ${new Date(t.date).toLocaleString()}`).join('\n\n');
            }
        }

        const profileEmbed = new EmbedBuilder()
            .setTitle(`${selectedUser.username}'s Profile`)
            .setDescription(`
                **User:** <@${userId}>

                **Vehicles:**
                ${vehicleList}

                **Police Records:**
                ${arrestsList}

                **Tickets:**
                ${ticketsList}

                **License Status:**
                ${licenseStatus}
            `)
            .setColor(0x2B2D31)
            .setThumbnail(selectedUser.displayAvatarURL());

        await interaction.reply({ embeds: [profileEmbed] });
    },
};

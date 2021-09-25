const { Client, Intents, Collection, Interaction, Permissions } = require('discord.js');
const Guild = require('../models/guild');
module.exports = {
    name: 'help',
    description: 'pp',
    run: async (client, message, args) => {
        const guildSettings = await Guild.findOne({
            guildID: message.guild.id
        })
    }
}
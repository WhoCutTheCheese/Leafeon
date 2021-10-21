const { Client, Message, MessageActionRow, MessageButton, MessageEmbed, ButtonInteraction, Interaction } = require('discord.js');
module.exports = {
    commands: ['ping', 'latency'],
    minArgs: 0,
    maxArgs: 0,
    callback: async (client, bot, message, args, text) => {
        const pingMessage = await message.reply({ content: "<a:loading:899452664008552478> Calculating..." }).then(resultMessage => {
            const ping = resultMessage.createdTimestamp - message.createdTimestamp
            resultMessage.edit({ content: `<:greencheck:893615789251395584> Bot Latency: **${ping}ms**, API Latency: **${client.ws.ping}ms**` })
        })
    },
}
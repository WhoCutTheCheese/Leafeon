const Discord = require('discord.js');
module.exports = {
    name: 'ping',
    description: 'Pong.',
    run: async (client, message, args) => {
        message.reply({ content: "Pong! <a:lookinforwhoasked:853014801609261086>" })
    }
}
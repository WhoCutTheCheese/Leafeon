const { Client, Collection, Interaction, Permissions, MessageEmbed } = require('discord.js');
const Guild = require('../models/guild');
module.exports = {
    name: 'av',
    description: 'Pong.',
    run: async (client, message, args) => {
        const gSettings = await Guild.findOne({
            guildID: message.guild.id
        })
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
        if (!args[1]) {
            const av = new MessageEmbed()
                .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
                .setImage(`${message.author.displayAvatarURL({ dynamic: true })}`)
            message.channel.send({ embeds: [av] })
        }
        if (!user) { return message.channel.send({ content: "Invalid User" }); }
        const av = new MessageEmbed()
            .setAuthor(`${user.user.tag}`, user.user.displayAvatarURL({ dynamic: true }))
            .setImage(`${user.user.displayAvatarURL({ dynamic: true })}`)
        message.channel.send({ embeds: [av] })
    }
}
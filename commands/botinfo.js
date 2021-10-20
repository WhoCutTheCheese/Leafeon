const { Client, Message, MessageActionRow, MessageButton, MessageEmbed, ButtonInteraction, Interaction } = require('discord.js');
const Guild = require('../models/guild');
module.exports = {
    name: 'botinfo',
    description: 'Pong.',
    run: async (client, message, args) => {
        const serverSettings = await Guild.findOne({
            guildID: message.guild.id
        })
        const botInfo = new MessageEmbed()
            .setTitle("Grahmaham")
            .setColor(serverSettings.color)
            .addField("<:discovery:899895834500554752> Name:", `\`${client.user.username}\``, true)
            .addField("<:stage:899895834550882315> Creator & Developers:", `\`Creator:\` <@493453098199547905>`, true)
            .addField("<:blurplesheild:899895834861260840> Guilds:", `\`${client.guilds.cache.size}\``, true)
            .addField("<:5053_Gears:899827411217158194> Created:", `<t:${Math.floor(client.user.createdAt.getTime() / 1000)}:D>`, true)
            .addField("<:thread:899897701733388299> Library:", `\`discord.js\``, true)
            .setFooter(`Grahmaham Development`, message.author.displayAvatarURL({ dynamic: true }))
        message.channel.send({ embeds: [ botInfo ] })

    }
}
const { Client, Collection, Interaction, Permissions, MessageEmbed } = require('discord.js');
const Guild = require('../../models/guild');
module.exports = {
    commands: ['av', 'avatar', 'pfp'],
    minArgs: 0,
    maxArgs: 1,
    expectedArgs: ['<@user/user ID>'],
    callback: async (client, bot, message, args, text) => {
        const gSettings = await Guild.findOne({
            guildID: message.guild.id
        })
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
        if (!args[0]) {
            const av = new MessageEmbed()
                .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
                .setColor(gSettings.color)
                .setImage(`${message.author.displayAvatarURL({ dynamic: true })}`)
            return message.channel.send({ embeds: [av] })
        }
        if (!user) { return message.channel.send({ content: "Invalid User" }); }
        const av = new MessageEmbed()
            .setAuthor(`${user.user.tag}`, user.user.displayAvatarURL({ dynamic: true }))
            .setColor(gSettings.color)
            .setImage(`${user.user.displayAvatarURL({ dynamic: true })}`)
        message.channel.send({ embeds: [av] })
    }
}
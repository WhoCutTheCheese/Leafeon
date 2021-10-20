const { Client, Intents, Collection, Interaction, Permissions, MessageEmbed } = require('discord.js');
const Guild = require("../models/guild");
module.exports = {
    name: 'check',
    description: 'Pong.',
    run: async (client, message, args) => {
        if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) { return message.reply({ content: "You require `MANAGE_GUILD` to execute this command!" }) }
        const guildSettings = await Guild.findOne({
            guildID: message.guild.id,
        })
        const checkEmbed = new MessageEmbed()
            .setTitle("<:dnd:899897701930532864> Bot Permission Check")
            .setColor(guildSettings.color)
            .setDescription("Check if the bot has it's vital permissions.\n\n<:toggledon:899826904847241299> - The bot has permission\n<:toggledoff:899826903496687646> - The bot does not have permission")
            .setFooter("These permissions are vital for the bot to work at peak performance. Please do not go to support until these all read as on.", message.author.avatarURL({ dynamic: true }))
            if (message.guild.me.permissions.has(Permissions.FLAGS.SEND_MESSAGES)) {
                checkEmbed.addField("Send Messages", "Status: <:toggledon:899826904847241299>", true)
            } else if (!message.guild.me.permissions.has(Permissions.FLAGS.SEND_MESSAGES)) {
                checkEmbed.addField("Send Messages", "Status: <:toggledoff:899826903496687646>", true)
            }
            if (message.guild.me.permissions.has(Permissions.FLAGS.EMBED_LINKS)) {
                checkEmbed.addField("Embed Links", "Status: <:toggledon:899826904847241299>", true)
            } else if (!message.guild.me.permissions.has(Permissions.FLAGS.EMBED_LINKS)) {
                checkEmbed.addField("Embed Links", "Status: <:toggledoff:899826903496687646>", true)
            }
            if (message.guild.me.permissions.has(Permissions.FLAGS.ATTACH_FILES)) {
                checkEmbed.addField("Attach Files", "Status: <:toggledon:899826904847241299>", true)
            } else if (!message.guild.me.permissions.has(Permissions.FLAGS.ATTACH_FILES)) {
                checkEmbed.addField("Attach Filed", "Status: <:toggledoff:899826903496687646>", true)
            }
            if (message.guild.me.permissions.has(Permissions.FLAGS.READ_MESSAGE_HISTORY)) {
                checkEmbed.addField("Read Message History", "Status: <:toggledon:899826904847241299>", true)
            } else if (!message.guild.me.permissions.has(Permissions.FLAGS.READ_MESSAGE_HISTORY)) {
                checkEmbed.addField("Read Message History", "Status: <:toggledoff:899826903496687646>", true)
            }
            if (message.guild.me.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) {
                checkEmbed.addField("View Audit Log", "Status: <:toggledon:899826904847241299>", true)
            } else if (!message.guild.me.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) {
                checkEmbed.addField("View Audit Log", "Status: <:toggledoff:899826903496687646>", true)
            }
            if (message.guild.me.permissions.has(Permissions.FLAGS.USE_EXTERNAL_EMOJIS)) {
                checkEmbed.addField("Use External Emojis", "Status: <:toggledon:899826904847241299>", true)
            } else if (!message.guild.me.permissions.has(Permissions.FLAGS.USE_EXTERNAL_EMOJIS)) {
                checkEmbed.addField("Use External Emojis", "Status: <:toggledoff:899826903496687646>", true)
            }
            message.channel.send({ embeds: [checkEmbed] }).catch((err) => {
            console.error(err)
        }) 
    }
}
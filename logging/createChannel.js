const { Client, Message, Permissions, MessageActionRow, MessageButton, MessageEmbed, ButtonInteraction, Interaction, MessageReaction } = require('discord.js');
const Guild = require('../models/guild');
const Token = require('../models/tokens');
const Logs = require('../models/logs');
module.exports = async (client) => {
    setTimeout(() => {
        console.log("Loaded module: logging/createChannel.js successfully!")
    }, 1100)
    try {
        client.on('channelCreate', async function (channel) {
            const guildSettings = await Guild.findOne({
                guildID: channel.guild.id
            })
            const logs = await Logs.findOne({
                guildID: channel.guild.id
            })
            if (!logs) { return; }
            if (logs.channelLog == "None") { return; }
            if (logs.channelCreateLog == false) { return; }
            const logger = await client.channels.fetch(logs.channelLog).catch((err) => {
                console.error(err)
                console.log("There was an error with the module: logging/createChannel.js!")
            });

            if (!channel.guild.me.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
                if (!channel.guild.me.permissions.has(Permissions.FLAGS.SEND_MESSAGES)) { return; }
                if (!channel.guild.me.permissions.has(Permissions.FLAGS.EMBED_LINKS)) { return; }
                if (!logger.permissionsFor(logger.guild.me).has(Permissions.FLAGS.SEND_MESSAGES)) { return; }
                if (!logger.permissionsFor(logger.guild.me).has(Permissions.FLAGS.EMBED_LINKS)) { return; }
            }
            const AuditLogFetch = await channel.guild.fetchAuditLogs({
                limit: 1,
                type: "CHANNEL_CREATE"
            });
            const Entry = AuditLogFetch.entries.first();
            if (logs.showUser == false) {
                if (logs.bypassUser !== Entry.executor.id) {
                    send_log(client, channel.guild.id, "Channel Created", `A channel has been created.\n\n**Channel Name:** <#${channel.id}>\n**Executor:** **\`Hidden\`**\n**Executor ID: \`Hidden\`**`, Entry.executor.displayAvatarURL({dynamic: true }), channel.guild.iconURL({ dynamic: true }))
                }
            } else if (logs.showUser == true) {
                if (logs.bypassUser !== Entry.executor.id) {
                    send_log(client, channel.guild.id, "Channel Created", `A channel has been created.\n\n**Channel Name:** <#${channel.id}>\n**Executor:** **\`${Entry.executor.tag}\`**\n**Executor ID: \`${Entry.executor.id}\`**`, Entry.executor.displayAvatarURL({dynamic: true }), channel.guild.iconURL({ dynamic: true }))
                }
            }


        })
    } catch (err) {
        console.log("There was an error with the module: logging/createChannel.js!")
        console.log(err)
    }
}

async function send_log(client, guildid, title, description, avatar, guildicon) {
    try {
        const guildSettings = await Guild.findOne({
            guildID: guildid
        })
        const logs = await Logs.findOne({
            guildID: guildid
        })
        const log = new MessageEmbed()
            .setAuthor(title ? title.substr(0, 256) : "\u200b", guildicon)
            .setThumbnail(avatar)
            .setColor(guildSettings.color)
            .setDescription(description ? description.substr(0, 2048) : "\u200b")
            .setTimestamp()
        const logger = await client.channels.fetch(logs.channelLog).catch((err) => {
            console.error(err)
            console.log("There was an error with the module: logging/createChannel.js!")
        });
        logger.send({ embeds: [ log ] }).catch((err) => {
            console.error(err)
            console.log("There was an error with the module: logging/createChannel.js!")
        });
    } catch (err) {
        console.log("There was an error with the module: logging/createChannel.js!")
        console.log(err)
    }
}
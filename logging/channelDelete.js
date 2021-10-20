const { Client, Message, Permissions, MessageActionRow, MessageButton, MessageEmbed, ButtonInteraction, Interaction, MessageReaction } = require('discord.js');
const Guild = require('../models/guild');
const Token = require('../models/tokens');
const Logs = require('../models/logs');
module.exports = async (client) => {
    setTimeout(() => {
        console.log("Loaded module: logging/deleteChannel.js successfully!")
    }, 1100)
    try {
        client.on('channelDelete', async function (channel) {
            const guildSettings = await Guild.findOne({
                guildID: channel.guild.id
            })
            const logs = await Logs.findOne({
                guildID: channel.guild.id
            })
            if (!logs) { return; }
            if (logs.channelLog == "None") { return; }
            if (logs.channelDeleteLog == false) { return; }
            const logger = await client.channels.fetch(logs.channelLog).catch((err) => {
                console.error(err)
                console.log("There was an error with the module: logging/deleteChannel.js!")
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
            if (logs.bypassUser !== Entry.executor.id) {
                send_log(client, channel.guild.id, "Channel Deleted", `A channel has been deleted.\n\n**Channel Name:** #${channel.name}\n**Executor:** **\`${Entry.executor.tag}\`**\n**Executor ID: \`${Entry.executor.id}\`**`, Entry.executor.displayAvatarURL({
                    dynamic: true
                }), channel.guild.iconURL({ dynamic: true }))
            }

        })
    } catch (err) {
        console.log("There was an error with the module: logging/deleteChannel.js!")
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
            console.log("There was an error with the module: logging/deleteChannel.js!")
        });
        logger.send({ embeds: [ log ] }).catch((err) => {
            console.error(err)
            console.log("There was an error with the module: logging/deleteChannel.js!")
        });
    } catch (err) {
        console.log("There was an error with the module: logging/deleteChannel.js!")
        console.log(err)
    }
}
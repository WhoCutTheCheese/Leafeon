try {
    const { Client, Message, Permissions, MessageActionRow, MessageButton, MessageEmbed, ButtonInteraction, Interaction, MessageReaction, GuildAuditLogsEntry } = require('discord.js');
    const Guild = require('../../models/guild');
    const Logs = require('../../models/logs');
    module.exports = {
        commands: ['settings', 's'],
        minArgs: 0,
        maxArgs: 0,
        permissionError: "You require `MANAGE_GUILD` to execute this command.",
        callback: async (client, bot, message, args, text) => {
            if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return message.channel.send({ content: "Invalid Permissions: You need `MANAGE_GUILD` to use this command." });
            const guildSettings = await Guild.findOne({
                guildID: message.guild.id,
            })
            const logSettings = await Logs.findOne({
                guildID: message.guild.id
            })
            if (!args[1]) {
                const settingsEmbed = new MessageEmbed()
                    .setTitle("<:settings:899827411217158194> Logging Settings")
                    .setColor(guildSettings.color)
                    .setDescription("Displaying current guild Logging Settings\nFor more information on each settings, run `!!settings info`")
                    .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
                    if (logSettings.modChannel == "None") {
                        settingsEmbed.addField("**__Mod Logging Channel__**", `None`, true)
                    } else if (logSettings.modChannel != "None") {
                        settingsEmbed.addField("**__Mod Logging Channel__**", `<#${logSettings.modChannel}>`, true)
                    }
                    if (logSettings.msgChannel == "None") {
                        settingsEmbed.addField("**__Message Logging Channel__**", `None`, true)
                    } else if (logSettings.msgChannel != "None") {
                        settingsEmbed.addField("**__Message Logging Channel__**", `<#${logSettings.msgChannel}>`, true)
                    }
                    if (logSettings.channelLog == "None") {
                        settingsEmbed.addField("**__Channel Logging Channel__**", `None`, true)
                    } else if (logSettings.channelLog != "None") {
                        settingsEmbed.addField("**__Channel Logging Channel__**", `<#${logSettings.channelLog}>`, true)
                    }
                    if (logSettings.roleChannel == "None") {
                        settingsEmbed.addField("**__Role Logging Channel__**", `None`, true)
                    } else if (logSettings.roleChannel != "None") {
                        settingsEmbed.addField("**__Role Logging Channel__**", `<#${logSettings.roleChannel}>`, true)
                    }
                    if (logSettings.bypassUser == "None") {
                        settingsEmbed.addField("**__Bypass User__**", `None`, true)
                    } else if (logSettings.bypassUser != "None") {
                        settingsEmbed.addField("**__Bypass User__**", `<@${logSettings.bypassUser}>`, true)
                    }
                    if (logSettings.bypassRole == "None") {
                        settingsEmbed.addField("**__Bypass Role__**", `None`, true)
                    } else if (logSettings.bypassRole != "None") {
                        settingsEmbed.addField("**__Bypass Role__**", `<@&${logSettings.bypassRole}>`, true)
                    }
                    if (logSettings.bypassChannel == "None") {
                        settingsEmbed.addField("**__Bypass Channel__**", `None`, true)
                    } else if (logSettings.bypassChannel != "None") {
                        settingsEmbed.addField("**__Bypass Channel__**", `<#${logSettings.bypassChannel}>`, true)
                    }
                    if (logSettings.channelCreateLog == true) {
                        settingsEmbed.addField("**__Created Channel Logging__**", `true`, true)
                    } else if (logSettings.channelCreateLog == false) {
                        settingsEmbed.addField("**__Created Channel Logging__**", `false`, true)
                    }
                    if (logSettings.channelDeleteLog == true) {
                        settingsEmbed.addField("**__Deleted Channel Logging__**", `true`, true)
                    } else if (logSettings.channelDeleteLog == false) {
                        settingsEmbed.addField("**__Deleted Channel Logging__**", `false`, true)
                    }
                message.channel.send({ embeds: [settingsEmbed] }).catch((err) => {
                    console.error(err)
                })
            }
        },
        userPermissions: ["MANAGE_GUILD"]
    }
} catch (err) {
    console.error(err)
}
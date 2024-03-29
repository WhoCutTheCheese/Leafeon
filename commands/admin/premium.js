const Discord = require('discord.js');
const Tokens = require('../../models/tokens');
const Guild = require("../../models/guild");
const mongoose = require('mongoose');
module.exports = {
    commands: ["premium"],
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: "<Redeem/Revoke/Check/Status/Bal/Balence>",
    callback: async (client, bot, message, args, text) => {
        const hasToken = await Tokens.findOne({
            userID: message.author.id,
        })
        const guildSettings = await Guild.findOne({
            guildID: message.guild.id,
        })
        if (args[0] === "redeem") {
            if (hasToken.tokens === 0) return message.channel.send({ content: "You do not have a premium token to use." })
            if (guildSettings.premium === true) return message.channel.send({ content: "This guild already has premium!" })
            const premiumEnabled = new Discord.MessageEmbed()
                .setTitle("Premium")
                .setColor("GOLD")
                .setDescription(`<:discovery:899895834500554752> Premium has been enabled for **${message.guild.name}**`)
                .setFooter(`${message.author.tag} - ${message.guild.name}`)
            message.channel.send({ embeds: [premiumEnabled] })
            console.log(`Premium has been enabled for ${message.guild.name} (${message.guild.id}) by ${message.author.tag} (${message.author.id}). If this was unauthorized please revoke it forcefully.`)
            const math = hasToken.tokens - 1;
            const updateGuild = await Guild.findOneAndUpdate({
                guildID: message.guild.id
            }, {
                premium: true,
                premiumHolder: message.author.id,
            })
            const updateTokens = await Tokens.findOneAndUpdate({
                userID: message.author.id,
            }, {
                userID: message.author.id,
                userName: message.author.tag,
                tokens: math
            })
        } else if (args[0] === "revoke") {
            if (guildSettings.premium === false) return message.channel.send({ content: "This server does not have premium enabled. Or you were not the one who enabled premium." })
            if (guildSettings.premiumHolder !== message.author.id) return message.channel.send({ content: "You cannot revoke another user's premium!" })

            const disabledPremium = new Discord.MessageEmbed()
                .setTitle("Premium")
                .setColor("RED")
                .setDescription(`<:discovery:899895834500554752> Premium was disabled on **${message.guild.name}** and \`1\` premium token has been added to your balence`)
                .setFooter(`${message.author.tag} - ${message.guild.name}`)
            message.channel.send({ embeds: [disabledPremium] })
            console.log(`Premium was disabled on ${message.guild.name} (${message.guild.id}) by ${message.author.tag} (${message.author.id})`)
            const math2 = hasToken.tokens + 1
            const revokePrem = await Guild.findOneAndUpdate({
                guildID: message.guild.id,
            }, {
                premium: false,
                premiumHolder: "None"
            })
            const addToken = await Tokens.findOneAndUpdate({
                userID: message.author.id,
            }, {
                tokens: math2
            })
            await Guild.findOneAndUpdate({
                guildID: message.guild.id,
            }, {
                color: "ff5959"
            })

        } else if (!args[0]) {
            const premium = new Discord.MessageEmbed()
                .setTitle("Premium")
                .setColor("GOLD")
                .setDescription("Enable/Check/Revoke premium.")
                .addField("Premium Sub Commands", `\`${guildSettings.prefix}premium [Redeem/Revoke/Check/Status/Bal/Balence]\``)
                .setFooter(`${message.author.tag} - ${message.guild.name}`)
            return message.channel.send({ embeds: [premium] })
        } else if (args[0] === "check") {
            if (guildSettings.premiumHolder !== message.author.id) {
                if (guildSettings.premium == true) {
                    const yesPremiumNotHolder = new Discord.MessageEmbed()
                        .setTitle("Premium")
                        .setColor("GOLD")
                        .setDescription("View your current premium status.")
                        .addField("Premium Status:", "`ENABLED`", true)
                        .setFooter(`${message.author.tag} - ${message.guild.name}`)
                    return message.channel.send({ embeds: [yesPremiumNotHolder] })
                } else if (guildSettings.premium == false) {
                    const noPremiumNoHolder = new Discord.MessageEmbed()
                        .setTitle("Premium")
                        .setColor("GOLD")
                        .setDescription("View your current premium status.")
                        .addField("Premium Status:", "`DISABLED`", true)
                        .setFooter(`${message.author.tag} - ${message.guild.name}`)
                    return message.channel.send({ embeds: [noPremiumNoHolder] })

                }
            }
            const yesTokens = new Discord.MessageEmbed()
                .setTitle("Premium")
                .setColor("GOLD")
                .setDescription("View your current premium status.")
                .addField("Tokens:", `\`${hasToken.tokens}\``, true)
                .addField("Premium Status:", "`DISABLED`", true)
                .setFooter(`${message.author.tag} - ${message.guild.name}`)
            const yesPremium = new Discord.MessageEmbed()
                .setTitle("Premium")
                .setColor("GOLD")
                .setDescription("View your current premium status.")
                .addField("Tokens:", `\`${hasToken.tokens}\``, true)
                .addField("Premium Status:", "`ENABLED`", true)
                .setFooter(`${message.author.tag} - ${message.guild.name}`)
            const noTokens = new Discord.MessageEmbed()
                .setTitle("Premium")
                .setColor("RED")
                .setDescription("View your current premium status.")
                .addField("Tokens:", `\`${hasToken.tokens}\``, true)
                .addField("Premium Status:", "`DISABLED`", true)
                .setFooter(`${message.author.tag} - ${message.guild.name}`)
            if (hasToken.tokens == 0) return message.channel.send({ embeds: [noTokens] });
            if (guildSettings.premium == true) return message.channel.send({ embeds: [yesPremium] });
            if (hasToken.tokens > 0) return message.channel.send({ embeds: [yesTokens] })
        } else if (args[0] === "bal") {
            if (!hasToken) {
                const noTokensNoFile = new Discord.MessageEmbed()
                    .setTitle("Premium Balence")
                    .setColor("GOLD")
                    .setDescription("View your premium balence.")
                    .addField("Tokens:", `\`0\``)
                    .setFooter(`${message.author.tag} - ${message.guild.name}`)
                message.channel.send({ embeds: [noTokensNoFile] })
            }
            if (hasToken === 0) {
                const noTokens = new Discord.MessageEmbed()
                    .setTitle("Premium Balence")
                    .setColor("GOLD")
                    .setDescription("View your premium balence.")
                    .addField("Tokens:", `\`0\``)
                    .setFooter(`${message.author.tag} - ${message.guild.name}`)
                message.channel.send({ embeds: [noTokens] })
            }
            const yesTokens = new Discord.MessageEmbed()
                .setTitle("Premium Balence")
                .setColor("GOLD")
                .setDescription("View your premium balence.")
                .addField("Tokens:", `\`${hasToken.tokens}\``)
                .setFooter(`${message.author.tag} - ${message.guild.name}`)
            message.channel.send({ embeds: [yesTokens] })
        }
    }

}
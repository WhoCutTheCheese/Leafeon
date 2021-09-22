const Guild = require("../models/guild");
const { Permissions, MessageEmbed } = require('discord.js')
module.exports = {
    name: 'prefix',
    description: "Set your server's prefix.",
    run: async (bot, message, args) => {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) { return message.channel.send({ content: "You are unable to use this command!" }) };

        const settings = await Guild.findOne({
            guildID: message.guild.id
        });
        if (!args[1]) {
            const noPrefix = new MessageEmbed()
                .setTitle("Prefix")
                .setColor(`${settings.color}`)
                .setDescription("Change the prefix for your server.")
                .addField("Current Prefix:", `\`${settings.prefix}\``)
                .addField("Change Prefix:", `\`${settings.prefix}prefix <New Prefix/Reset>\``)
                .setTimestamp()
            return message.channel.send({ embeds: [noPrefix] })
        };

        if (args[1] === "reset") {
            await settings.updateOne({
                prefix: "!!"
            })
            const resetPrefix = new MessageEmbed()
                .setTitle("Prefix")
                .setColor("RED")
                .setDescription(":white_check_mark: Prefix has been reset, prefix is now `!!`")
            message.channel.send({ embeds: [resetPrefix] })
        } else {
            if (args[1].length > 3) {
                const tooLong = new MessageEmbed()
                    .setDescription(":x: This prefix is too long, please choose another.")
                    .setColor("RED")
                return message.channel.send({ embeds: [tooLong] })
            } else {
                await settings.updateOne({
                    prefix: args[1]
                });
                const setPrefix = new MessageEmbed()
                    .setTitle("Prefix")
                    .setColor(`GREEN`)
                    .addField("Prefix Updated", `Your guild's prefix has been updated to \`${args[1]}\``)
                    .setTimestamp()
                return message.channel.send({ embeds: [setPrefix] });
            }
        }

    }
}
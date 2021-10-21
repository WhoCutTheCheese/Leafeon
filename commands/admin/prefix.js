const Guild = require("../../models/guild");
const { Permissions, MessageEmbed } = require('discord.js')
module.exports = {
    commands: ["prefix", "p"],
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: "<prefix>",
    callback: async (client, bot, message, args, text) => {
        const settings = await Guild.findOne({
            guildID: message.guild.id
        });

        if (args[0] === "reset") {
            await settings.updateOne({
                prefix: "!!"
            })
            const resetPrefix = new MessageEmbed()
                .setTitle("Prefix")
                .setColor("RED")
                .setDescription("<:cautionchannel:899895834366312512> Prefix has been reset, prefix is now `!!`")
            message.channel.send({ embeds: [resetPrefix] })
        } else {
            if (args[0].length > 3) {
                const tooLong = new MessageEmbed()
                    .setDescription("<:cautionchannel:899895834366312512> This prefix is too long, please choose another.")
                    .setColor("RED")
                return message.channel.send({ embeds: [tooLong] })
            } else {
                await settings.updateOne({
                    prefix: args[0]
                });
                const setPrefix = new MessageEmbed()
                    .setTitle("Prefix")
                    .setColor(`GREEN`)
                    .addField("Prefix Updated", `<:cautionchannel:899895834366312512> Your guild's prefix has been updated to \`${args[0]}\``)
                    .setTimestamp()
                return message.channel.send({ embeds: [setPrefix] });
            }
        }

    },
    userPermissions: [ 'MANAGE_GUILD' ]
}
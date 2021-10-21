const { Client, Intents, Collection, Interaction, Permissions, MessageEmbed } = require('discord.js');
const Guild = require("../../models/guild");
module.exports = {
    commands: ['color', 'c', 'embed-color'],
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: "<reset/#hex color>",
    permissionError: "You require `MANAGE_GUILD` to execute this command.",
    callback: async (client, bot, message, args, text) => {
        const gSettings = await Guild.findOne({
            guildID: message.guild.id
        });
        const premiumReq = new MessageEmbed()
            .setTitle("Color")
            .setColor("GOLD")
            .setDescription("Set the embed color for your guild.")
            .addField("Color Sub Commands:", "`color [reset/hex]`")
            .addField("Aliases:", "`c, setcolor`")
            .setFooter("THIS IS A PREMIUM COMMAND", `${message.author.avatarURL()}`)
        if (gSettings.premium == false) return message.channel.send({ embeds: [premiumReq] });
        if (gSettings.premium == true) {
            if (args[0] === 'reset') {
                const reset = new MessageEmbed()
                    .setTitle("Color")
                    .setColor('ff5959')
                    .setDescription("<a:bongo:890307897312051221> Reset the server embed color to `#ff5959`")
                await Guild.findOneAndUpdate({
                    guildID: message.guild.id
                }, {
                    color: 'ff5959'
                })
                message.channel.send({ embeds: [reset] })
            } else if (args[0] !== "reset") {
                if (!args[0]) return message.channel.send({ content: "You need to supply a hex code." });
                if (!args[0].length >= 7) return message.channel.send({ content: "That is not a valid hex code." });
                let testingcolor = args[0].replace('#', '').toUpperCase();
                console.log(testingcolor)
                if (isHexColor(testingcolor) == false) return message.channel.send('This is not a valid hex code.')
                await Guild.findOneAndUpdate({
                    guildID: message.guild.id
                }, {
                    color: testingcolor
                })
                const color = new MessageEmbed()
                    .setTitle("Color")
                    .setColor(testingcolor)
                    .setDescription(`<a:bongo:890307897312051221> Your server embed color has been changed to \`#${testingcolor}\``)
                message.channel.send({ embeds: [color] })
            }
        }
    },
    userPermissions: ['MANAGE_GUILD']
}


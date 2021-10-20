const { MessageEmbed, Permissions, DiscordAPIError } = require('discord.js');
const Guild = require('../models/guild');
// regular function
function isHexColor (hex) {
    return typeof hex === 'string'
        && hex.length === 6
        && !isNaN(Number('0x' + hex))
  }
  isHexColor = hex => typeof hex === 'string' && hex.length === 6 && !isNaN(Number('0x' + hex))
module.exports = {
    name: "color",
    description: "Sets server embed colors.",
    run: async (client, message, args) => {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return message.channel.send({ content: "Invalid Permissions: You need `MANAGE_GUILD` to use this command." })
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
        if(gSettings.premium == true) {
            if(args[1] === 'reset') {
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
            } else if (args[1] !== "reset") {
                if (!args[1]) return message.channel.send({ content: "You need to supply a hex code." });
                if (!args[1].length >= 7) return message.channel.send({ content: "That is not a valid hex code." });
                let testingcolor = args[1].replace('#', '').toUpperCase();
                console.log(testingcolor)
                if(isHexColor(testingcolor) == false) return message.channel.send('This is not a valid hex code.')
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
    }
}
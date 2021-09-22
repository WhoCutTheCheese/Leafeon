const { MessageEmbed, Permissions, DiscordAPIError } = require('discord.js');
const Guild = require('../models/guild');
const Tokens = require('../models/tokens');
module.exports = {
    name: "color",
    description: "Sets server embed colors.",
    run: async (bot, message, args) => {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return message.channel.send({ content: "You do not have permission to use this command." });
        const gSettings = await Guild.findOne({
            guildID: message.guild.id
        });
        const tSettings = await Tokens.findOne({
            guildID: message.guild.id
        });
        if (!gSettings) return;
        const premiumReq = new MessageEmbed()
            .setTitle("Color")
            .setColor("GOLD")
            .setDescription("Set the embed color for your guild.")
            .addField("Color Sub Commands:", "`color [reset/hex]`")
            .addField("Aliases:", "`c, setcolor`")
            .setFooter("THIS IS A PREMIUM COMMAND", `${message.author.avatarURL()}`)
        if (!tSettings) return message.channel.send({ embeds: [premiumReq] });
        if(tSettings.guildID === message.guild.id) {
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
                if(!args[1].startsWith("#")) return message.channel.send({ content: "That is not a valid hex code." });
                const outcome = args[1].replace('#', '').toUpperCase();
                await Guild.findOneAndUpdate({
                    guildID: message.guild.id
                }, {
                    color: outcome
                })
                const color = new MessageEmbed()
                    .setTitle("Color")
                    .setColor(outcome)
                    .setDescription(`<a:bongo:890307897312051221> Your server embed color has been changed to \`#${outcome}\``)
                message.channel.send({ embeds: [color] });
            }
        }
    }
}
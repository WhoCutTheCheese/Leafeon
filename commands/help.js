try {
    const { Client, Message, MessageActionRow, MessageButton, MessageEmbed, ButtonInteraction, Interaction } = require('discord.js');
    const Guild = require('../models/guild');
    module.exports = {
        name: 'help',
        description: 'Respond to an application.',
        run: async (client, message, args) => {
            const invite = new MessageActionRow().addComponents(
                new MessageButton()
                    .setLabel("Invite")
                    .setStyle("LINK")
                    .setURL("https://discord.com/oauth2/authorize?client_id=890025136206544936&scope=bot&permissions=388303")
                        .setEmoji('📩'),
            )
            const guildSettings = await Guild.findOne({
                guildID: message.guild.id
            })
            const helpEmbedNoArgs = new MessageEmbed()
                .setTitle("<:tasklist:893604940696649858> Help\n")
                .setDescription("<a:coin:893603823459905536> **[Premium](https://patreon.com/Grahmaham)** | :newspaper: **[Features](https://grahmaham.gitbook.io/docs/)** | <:bughuntergold:893605760230109215> **[Support Server](https://discord.gg/VHcQu5nkv4)**\nFor more information on a command use `!!help [command]`")
                .addField("Current Guild Settings", `Prefix: \`${guildSettings.prefix}\`\nEmbed Color: \`#${guildSettings.color}\`\nPremium Status: \`${guildSettings.premium}\``)
                .setColor(guildSettings.color)
                .addField("User Commands", "`ping`, `userinfo`, `serverinfo`, `av`")
                .addField("Logging", "`logs`, `settings`, `bypassrole`, `bypasschannel`, `logchannel`")
                .addField("Administrator Commands", "`prefix`, `color`, `check`")
            let embedMessage = await message.channel.send({ embeds: [helpEmbedNoArgs], components: [invite] })
        }
    }
} catch (err) {
    console.error(err)
}

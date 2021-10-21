const { Client, Intents, Collection, Interaction, Permissions } = require('discord.js');
const fs = require('fs');
const path = require("path");
const mongoose = require("mongoose");
const Guild = require('./models/guild');
const Tokens = require('./models/tokens');
const Logs = require('./models/logs');
const bot = require('./package.json');
const config = require("./config.json")
const client = new Client({
    intents:
        [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_BANS,
            Intents.FLAGS.GUILD_PRESENCES,
            Intents.FLAGS.GUILD_MEMBERS,
            Intents.FLAGS.DIRECT_MESSAGES,
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        ]
});
client.mongoose = require('./utils/mongoose.js')
client.on('ready', async () => {
    client.user.setStatus('dnd')
    client.user.setActivity('you 👀 | !!help', {
        type: "WATCHING",
        url: "https://twitter.com/EveningVaporeon"
    })
    console.log("Grahmaham is starting...")

    setTimeout(function () {
        console.log("Grahmaham has started!")
    }, 5000);
    const baseFile = 'command_base.js'
    const commandBase = require(`./commands/${baseFile}`)
  
    const readCommands = (dir) => {
        const files = fs.readdirSync(path.join(__dirname, dir))
        for (const file of files) {
          const stat = fs.lstatSync(path.join(__dirname, dir, file))
          if (stat.isDirectory()) {
            readCommands(path.join(dir, file))
          } else if (file !== baseFile) {
            const option = require(path.join(__dirname, dir, file))
            commandBase(option)
          }
        }
      }
    
      readCommands('commands')
      commandBase.listen(client);
})



client.on('guildCreate', async guild => {
    const newGuild = new Guild({
        guildID: guild.id,
        guildName: guild.name,
        prefix: "!!",
        color: "ff5959",
        premium: false,
        premiumHolder: "None"
    })
    newGuild.save().catch(err => console.log(err));
})

client.on('guildDelete', async guild => {
    const guildS = await Guild.findOne({
        guildID: guild.id,
    })
    if (guildS.premium == true) {
        const tokens = await Tokens.findOne({
            userID: guildS.premiumHolder
        })
        await Tokens.findOneAndUpdate({
            userID: guildS.premiumHolder
        }, {
            tokens: tokens.tokens + 1
        })
        setTimeout(async function () {
            await Guild.findOneAndRemove({
                guildID: guild.id
            })
        }, 1000);
    } else if (guildS.premium == false) {
        await Guild.findOneAndRemove({
            guildID: guild.id
        })
    }
})

client.on('messageCreate', async message => {
    const guilds = Guild.findOne({
        guildID: message.guild.id,
    }, (err, guild) => {
        if (err) console.error(err)
        if (!guild) {
            const newGuild = new Guild({
                _id: mongoose.Types.ObjectId(),
                guildID: message.guild.id,
                guildName: message.guild.name,
                prefix: "!!",
                color: `ff5959`,
                premium: false,
                premiumHolder: "None"
            });
            newGuild.save()
                .then(result => message.channel.send({ content: "Whoops, looks like you dont have a database file, we're making one!" }))
                .catch(err => console.error(err))
        };
    });
    const logSettings = Logs.findOne({
        guildID: message.guild.id
    }, (err, logs) => {
        if (err) console.error(err)
        if (!logs) {
            const newLogs = new Logs({
                guildID: message.guild.id,
                guildName: message.guild.name,
                msgChannel: "None",
                channelLog: "None",
                roleChannel: "None",
                modChannel: "None",
                bypassRole: "None",
                bypassUser: "None",
                bypassChannel: "None",
                channelCreateLog: true,
                channelDeleteLog: true,
            });
            newLogs.save()
                .catch(err => console.error(err))
        }
    })
});
require("./logging/createChannel")(client);
require('./logging/channelDelete')(client);
client.mongoose.init();
client.login(config.token);
//client.login(process.env.token);
const { Client, Intents, Collection, Interaction, Permissions } = require('discord.js');
const fs = require('fs');
const mongoose = require("mongoose");
const Guild = require('./models/guild');
const Tokens = require('./models/tokens');
const Logs = require('./models/logs');
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
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}
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
})
client.on("interactionCreate", async (Interaction) => {
    if (Interaction.isButton()) {
    }
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
    await Guild.findOneAndRemove({
        guildID: guild.id
    })
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
});

client.on('messageCreate', async message => {
    const server = await Guild.findOne({
        guildID: message.guild.id
    })
    if(!server) { return; } 
    const prefix = `${server.prefix}`
    if (!message.content.startsWith(prefix)) { return; }
    if (!message.guild.me.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
        if (!message.guild.me.permissions.has(Permissions.FLAGS.SEND_MESSAGES)) { return; }
        if (!message.guild.me.permissions.has(Permissions.FLAGS.EMBED_LINKS)) { return; }
        if (!message.channel.permissionsFor(message.guild.me).has(Permissions.FLAGS.SEND_MESSAGES)) { return; }
        if (!message.channel.permissionsFor(message.guild.me).has(Permissions.FLAGS.EMBED_LINKS)) { return; }

    }
    let args = message.content.substring(prefix.length).split(" ");
    switch (args[0]) {
        case "ping":
            client.commands.get('ping').run(client, message, args);
            break
        case "prefix":
            client.commands.get('prefix').run(client, message, args);
            break
        case "color":
        case "setcolor":
        case "c":
            client.commands.get('color').run(client, message, args);
            break
        case "givepremium":
            client.commands.get('givepremium').run(client, message, args);
            break
        case "premium":
            client.commands.get('premium').run(client, message, args);
            break
        case "serverinfo":
        case "sinfo":
        case "server-info":
            client.commands.get('serverinfo').run(client, message, args);
            break
        case "userinfo":
        case "info":
        case "user-info":
            client.commands.get('userinfo').run(client, message, args);
            break
        case "av":
            client.commands.get('av').run(client, message, args);
            break
    }
})
client.mongoose.init();
client.login('ODkwMDI1MTM2MjA2NTQ0OTM2.YUpygA.3G6LjLfp6EkpvTcIO0n0m9QKem4');
//client.login(process.env.token);
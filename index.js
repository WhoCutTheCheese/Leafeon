const { Client, Intents, Collection } = require('discord.js');
const fs = require('fs');
const mongoose = require("mongoose");
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
const prefix = "."
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}
client.on('ready', async () => {
    client.user.setStatus('dnd')
    client.user.setActivity('Vaporeon coding me :D', {
        type: "STREAMING",
        url: "https://twitter.com/EveningVaporeon"
    })
    console.log("Leafeon is starting...")

    setTimeout(function () {
        console.log("Leafeon has started!")
    }, 5000);
})
const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
mongoose.connect("mongodb+srv://Zironic_Dev:CheeseCake101@cluster0.3ud4r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", dbOptions);
mongoose.Promise = global.Promise;
mongoose.connection.on('connected', () => {
    setTimeout(function () {
        console.log('Mongoose has successfully connected!');
    }, 100);
});
mongoose.connection.on('err', err => {
    console.error(`Mongoose connection error: \n${err.stack}`);
});
mongoose.connection.on('disconnected', () => {
    console.warn('Mongoose connection lost');
});
client.on('messageCreate', async message => {
    if (!message.content.startsWith(prefix)) return;
    let args = message.content.substring(prefix.length).split(" ");
    switch (args[0]) {
        case "ping":
            client.commands.get('ping').run(client, message, args);
            break
    }
})
//client.login('ODg5Mzg4Njk3NTcxNjkyNTQ1.YUghxQ.aNTFShOR3dFT13f_ISqh43kDAKU');
client.login(process.env.token);
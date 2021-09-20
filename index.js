const { Client, Intents, Collection } = require('discord.js');
const fs = require('fs');
const mongoose = require("mongoose");
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.mongoose = require('./utils/mongoose.js')
client.on('ready', async () => {
    client.user.setStatus('dnd')
    client.user.setActivity('Vaporeon coding me :D', {
        type: "STREAMING",
        url: "https://twitter.com/EveningVaporeon"
    })
        console.log("Leafeon is starting...")

    setTimeout(function(){ 
        console.log("Leafeon has started!")
     }, 5000);
})
client.mongoose.init();
client.login('ODg5Mzg4Njk3NTcxNjkyNTQ1.YUghxQ.aNTFShOR3dFT13f_ISqh43kDAKU');
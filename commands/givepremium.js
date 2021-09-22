const Discord = require('discord.js');
const mongoose = require('mongoose');
const Guild = require("../models/guild");
const Tokens = require("../models/tokens");
const {
    description
} = require('./premium');
module.exports = {
    name: "givepremium",
    description: "DEV ONLY",
    run: async (bot, message, args) => {
        if (message.author.id !== "493453098199547905") return;
        let person = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
        if (!args[1]) return;
        const settings = await Tokens.findOne({
            userID: person.id
        })
        if (!settings){
            const newTokens = await new Tokens({
                userID: person.id,
                guildID: "None",
                guildName: "None",
                tokens: 1,
            })
            newTokens.save()
                .then(result => console.log(result))
                .catch(err => console.error(err));
            message.channel.send({ content: "Gave that dude premium yea" })
        }
        if (settings) {
            const neweTokens = await Tokens.findOneAndUpdate({
                userID: person.id,
            }, {
                userID: person.id,
                guildID: "None",
                guildName: "None",
                tokens: 1,
            })
            message.channel.send({ content: "Gave that dude premium yea" })
        }


    }
}
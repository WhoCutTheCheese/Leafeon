const mongoose = require("mongoose");

let Schema = new mongoose.Schema({
    userID: String,
    guildID: String,
    guildName: String,
    tokens: Number,
})
module.exports = mongoose.model('tokens', Schema)
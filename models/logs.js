const mongoose = require('mongoose');

let Schema = new mongoose.Schema({
    guildID: String,
    guildName: String,
    msgChannel: String,
    channelLog: String,
    roleChannel: String,
    modChannel: String,
    bypassRole: String,
    bypassUser: String,
})
module.exports = mongoose.model("logs", Schema)
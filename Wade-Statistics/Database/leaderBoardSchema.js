const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    
    guildID: String,

    messageChannel: { type: String, default: null },
    voiceFetch: { type: String, default: null },
    messageFetch: { type: String, default: null }

});

module.exports = mongoose.model('wade_leaderBoard', userSchema);
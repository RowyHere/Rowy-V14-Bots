const mongoose = require('mongoose');

const voiceStatsSchema = mongoose.Schema({

    guildID: String,
    userID: String,

    channelID: String,
    channelData: Number,
    
});

module.exports = mongoose.model('wade_messageChannel', voiceStatsSchema);
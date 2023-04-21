const mongoose = require('mongoose');

const voiceStatsSchema = mongoose.Schema({

    guildID: String,
    userID: String,

    joinedAt: Number,
    
});

module.exports = mongoose.model('wade_voiceJoinedAt', voiceStatsSchema);
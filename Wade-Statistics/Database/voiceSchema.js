const mongoose = require('mongoose');

const voiceStatsSchema = mongoose.Schema({

    guildID: String,
    userID: String,

    totalVoice: Number,
    dailyVoice: Number,
    weeklyVoice: Number,

});

module.exports = mongoose.model('wade_voice', voiceStatsSchema);
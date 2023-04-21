const mongoose = require('mongoose');

const voiceStatsSchema = mongoose.Schema({

    guildID: String,
    userID: String,

    totalMessage: Number,
    dailyMessage: Number,
    weeklyMessage: Number,

});

module.exports = mongoose.model('wade_message', voiceStatsSchema);
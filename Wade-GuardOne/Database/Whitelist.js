const mongoose = require('mongoose');

const whitelist = new mongoose.Schema({
    
    guildID: { type: String, default: null },

    whitelist: { type: Array, default: [] }

});

module.exports = mongoose.model('wade_whitelist', whitelist);
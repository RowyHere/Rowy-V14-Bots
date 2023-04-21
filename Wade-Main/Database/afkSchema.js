const mongoose = require('mongoose');

const afk = mongoose.Schema({

    guildID: { type: String, default: "" },
    userID: { type: String, default: "" },
    reason: { type: String, default: "" },
    date: { type: Number, default: Date.now() }
    
    });

module.exports = mongoose.model("wade_afk", afk);
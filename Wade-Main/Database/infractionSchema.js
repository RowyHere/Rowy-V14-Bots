const mongoose = require('mongoose')

const cezaKayit = mongoose.Schema({

    guildID: String,
    executor: String,
    userID: String,

    Ban: { Type: Number, default: 0 },
    Jail: { Type: Number, default: 0 },
    CMute: { Type: Number, default: 0 },
    VMute: { Type: Number, default: 0 },
    punishmentPoint: { type: Number, default: 0 },
    
});

module.exports = mongoose.model('wade_infraction', cezaKayit)
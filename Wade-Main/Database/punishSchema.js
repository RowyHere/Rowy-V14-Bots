const mongoose = require('mongoose')

const cezaKayit = mongoose.Schema({

    guildID: String,
    executor: String,
    cezaID: Number,

    userID: String,
    punishmentAt: { type: Number, default: Date.now() },
    punishmentFinish: { type: String, default: "" },
    punishmentType: String,
    punishmentReason: String,
    punishmentContinue: { type: Boolean, default: false },

});

module.exports = mongoose.model('wade_punish', cezaKayit)
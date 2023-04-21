const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    
    guildID: String,
    userID: String,
    inviterID: { type: String, default: null }, // eğer inviterID null ise vanityCode kontrol eticek.

    total: {
        type: Number, default: 0, min: 0
    },
    regular: {
        type: Number, default: 0, min: 0
    },
    fake: {
        type: Number, default: 0, min: 0
    },
    leave: {
        type: Number, default: 0, min: 0
    },
    dailyInvites: {
        type: Number, default: 0, min: 0
    },
    weeklyInvites: {
        type: Number, default: 0, min: 0
    }

});

module.exports = mongoose.model('wade_invite', userSchema);
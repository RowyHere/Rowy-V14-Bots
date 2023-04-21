const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    
    guildID: String,
    userID: String,

    names: {
        type: Array, 
        default: []
    },

    womanRegister: {
        type: Number,
        default: 0
    },

    manRegister: {
        type: Number,
        default: 0
    }

});

module.exports = mongoose.model('wade_user', userSchema);
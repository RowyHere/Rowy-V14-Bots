const mongoose = require('mongoose');

const registerSchema = new mongoose.Schema({

    guildID: String,
    userID: String,

    names: {
        type: Array,
        default: []
    },

    totalRegister: Number,
    womanRegister: Number,
    manRegister: Number
    
});

module.exports = mongoose.model('registerSystem', registerSchema);
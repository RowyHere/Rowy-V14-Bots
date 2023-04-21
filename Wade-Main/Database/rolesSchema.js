const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({

    userID: { type: String, required: true },
    guildID: { type: String, required: true },
    role: { type: Array, default: [] },
    jailRoles: { type: Array, default: [] },

});

module.exports = mongoose.model('wade_roles', roleSchema);
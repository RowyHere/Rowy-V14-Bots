const mongoose = require("mongoose");

const registerData = mongoose.Schema({

    guildId: String,
    member: String,
    names: { type: Array, default: [] },
    
})

module.exports = mongoose.model("registerData", registerData)
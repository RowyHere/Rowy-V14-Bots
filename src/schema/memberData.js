const mongoose = require("mongoose");

const memberData = mongoose.Schema({

    guildId: String,
    member: String,
    totalReg: Number,
    womanReg: Number,
    manReg: Number
    
})

module.exports = mongoose.model("memberData", memberData)
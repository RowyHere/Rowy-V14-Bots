const mongoose = require("mongoose");

const serverData = mongoose.Schema({

    guildId: String,
    guildOwners: { type: Array, default: [] },


    vipRoles: { type: Array, default: [] },
    manRoles: { type: Array, default: [] },
    womanRoles: { type: Array, default: [] },
    familyRoles: { type: Array, default: [] },
    boosterRoles: { type: Array, default: [] },
    registerRoles: { type: Array, default: [] },
    commanderRoles: { type: Array, default: [] },
    unregisterRoles: { type: Array, default: [] },

    tagChannel: String,
    generalChannel: String,
    welcomeChannel: String,
    registerChannel: String,


    mainTag: String,
    noTag: String,

    tagMode: String

})

module.exports = mongoose.model("serverData", serverData)
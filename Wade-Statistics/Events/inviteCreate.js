const inviteSchema = require("../Database/inviteSchema");

module.exports = {
    name: "inviteCreate",
    async execute(invite) {

        const invites = await invite.guild.invites.fetch();

        const usesCode = new Map()
        invites.each(inv => usesCode.set(inv.code, inv.uses))

        global.guildInvites.set(invite.guild.id, usesCode)

    }
}
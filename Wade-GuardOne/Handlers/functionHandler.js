const client = require('./clientHandler')
const config = require("../Config/config")
const moment = require('moment')
require('moment-duration-format')
const { TextChannel } = require('discord.js')

const safeUser = require('../Database/Whitelist')
const configRoles = require('../Config/configRoles')

Promise.prototype.delete = function (time) {
    if (this) this.then(s => {
        if (s.deletable) {
            setTimeout(async () => {
                s.delete().catch(e => { });
            }, time * 1000)
        }
    });
};


TextChannel.prototype.wsend = async function (message) {
    const hooks = await this.fetchWebhooks();
    let webhook = hooks.find(a => a.name === client.user.username && a.owner.id === client.user.id);
    if (webhook) return webhook.send(message);
    webhook = await this.createWebhook({ name: client.user.username, avatar: client.user.avatarURL() });
    return webhook.send(message);
  };  

async function safeControl(guildID, memberID) {

    let userData = await safeUser.findOne({ guildID: guildID })

    let member = client.guilds.cache.get(config.server.sunucuID).members.resolve(memberID)

    if(!member || member.id === client.user.id || member.id === member.guild.ownerId || config.owners.includes(member.id) || userData.whitelist.some(x => member.id === x.id || member.roles.cache.get(x.id))) return true
    else return false
    
}

async function punish(memberID, Type) {

    let member = client.guilds.cache.get(config.server.sunucuID).members.resolve(memberID)
    if(!member) return;

    switch (Type) {
        case "ban":

            await member.guild.bans.create(member.id, { reason: `Wade Koruma` }).catch(err => {})

        break;

        case "jail":

            let roles = member.roles.cache.has(configRoles.boosterRoles) ? [configRoles.boosterRoles] : configRoles.jailRoles
            await member.roles.set(roles, { reason: `Wade Koruma` }).catch(err => {})

        break;
    }

}

class Wade {
    
    

}

module.exports = {
    safeControl,
    punish
};
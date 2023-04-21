const client = require('./clientHandler')
const config = require("../Config/config")
const moment = require('moment')
require('moment-duration-format')
const { TextChannel } = require('discord.js')

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

  global.sureCevir = function(veri){

    let sure = moment.duration(veri).format("H [saat], m [dakika], s [saniye]")

    return sure

}

class Wade {
    
    

}

module.exports = Wade;
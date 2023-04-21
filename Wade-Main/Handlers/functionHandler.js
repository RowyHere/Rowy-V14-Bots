const client = require('./clientHandler')
const userSchema = require("../Database/userSchema")
const config = require("../Config/config")

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

class Wade {
    
    

}

module.exports = Wade;
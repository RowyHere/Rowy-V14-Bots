const client = require('../Handlers/clientHandler')
const Discord = require("discord.js")
const { joinVoiceChannel } = require('@discordjs/voice')

const CronJob = require('cron').CronJob

const botConfig = require('../Config/config.js')

module.exports = {
    name: 'ready',
    async execute() {
        
        console.log("[+] Discord bağlantısı kuruldu.")

        client.user?.setPresence({ activities: [{ name: `Wade 💙 Atahan`, type: Discord.ActivityType.Playing }], status: 'idle' })

        let VoiceChannel = client.channels.resolve(botConfig.server["voiceID"]);

        let count = 0;
        Promise.resolve(voiceConnect(VoiceChannel))
        let timer = setInterval(async function() {
            count += 1;
    
            if(count === 5) {
            clearInterval(timer);
            }
            if(VoiceChannel) return await Promise.resolve(voiceConnect(VoiceChannel))
        }, 30 * 1000)

        let guild = client.guilds.cache.get(botConfig.server.sunucuID)

        guild.invites.fetch()
        .then(invites => {

            const codeUses = new Map();
            invites.each(inv => codeUses.set(inv.code, inv.uses));
            global.guildInvites.set(guild.id, codeUses)

        })

    }
}

function voiceConnect(channel) {
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    })
    return connection;
}
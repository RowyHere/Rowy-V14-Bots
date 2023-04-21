const client = require('../Handlers/clientHandler')
const Discord = require("discord.js")
const { joinVoiceChannel } = require('@discordjs/voice')

const CronJob = require('cron').CronJob

const botConfig = require('../Config/config.js')

module.exports = {
    name: 'ready',
    async execute() {
        
        console.log("[+] Discord bağlantısı kuruldu.")

<<<<<<< HEAD
        client.user?.setPresence({ activities: [{ name: `${botConfig.server.footer}`, type: Discord.ActivityType.Playing }], status: 'idle' })
=======
        client.user?.setPresence({ activities: [{ name: `Wade 💚 Rowy`, type: Discord.ActivityType.Playing }], status: 'idle' })
>>>>>>> 886c07ee05e17d6cebe868c40a16bfeb6eb5d454

        let VoiceChannel = client.channels.resolve(botConfig.server["voiceID"]);

        let count = 0;
        await Promise.resolve(voiceConnect(VoiceChannel))
        let timer = setInterval(async function() {
            count += 1;
    
            if(count === 5) {
            clearInterval(timer);
            }
            if(VoiceChannel) return await Promise.resolve(voiceConnect(VoiceChannel))
        }, 30 * 1000)

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

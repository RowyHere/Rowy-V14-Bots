const client = require('../Handlers/clientHandler')
const Discord = require("discord.js")
const { joinVoiceChannel } = require('@discordjs/voice')

const CronJob = require('cron').CronJob

const botRoles = require("../Config/configRoles")
const botConfig = require("../Config/config")
const botEmojis = require("../Config/configEmojis")
const botSilents = require("../Config/configSilent")
const botChannels = require("../Config/configChannels")

const userSchema = require("../Database/userSchema")
const rolesSchema = require('../Database/rolesSchema')
const punishSchema = require("../Database/punishSchema")
const infractionSchema = require("../Database/infractionSchema")

const ms = require('ms')

module.exports = {
    name: 'ready',
    async execute() {
        
        console.log("[+] Discord bağlantısı kuruldu.")

        client.user?.setPresence({ activities: [{ name: `Wade ❤️ Rowy`, type: Discord.ActivityType.Playing }], status: 'idle' })

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

        // her gün sabit 00.00 da kontrol etsin fakeleri.
        let fake = new CronJob(`0 0 * * *`, function() {
            fakeControl()
        })
        fake.start()

        setInterval(async () => { await voiceMuteControl() }, 1 * 1000);
        setInterval(async () => { await chatMuteControl() }, 3 * 1000);
        setInterval(async () => { await jailControl() }, 5 * 1000);

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

async function fakeControl() {

    client.guilds.cache.get(botConfig.server.sunucuID).members.cache.forEach(async member => {
     
    let fakeControl = Date.now()-member.user.createdTimestamp < 1000*60*60*24*botConfig.server.fakeDay

        if(fakeControl) {
            if(member.roles.cache.get(botRoles.Silent.Suspicious)) {
                member.roles.add(botRoles.Silent.Suspicious, `Şüpheli Hesap Kontrol Sistemi.`).catch(err => {});
            }
        } else {
            if(member.roles.cache.get(botRoles.Silent.Suspicious)) {
                member.roles.set([...botRoles.Register.unregRoles], `Şüpheli Hesap Kontrol Sistemi.`).catch(err => {});
            }
        }

    })
}

async function voiceMuteControl() {

    const server = client.guilds.cache.get(botConfig.server.sunucuID);
    punishSchema.find({ guildID: server.id, punishmentContinue: true, punishmentType: "VMUTE" }, async function(err, pdb) {
    if((!pdb) || (pdb.length < 1)) return null;

    for (var newPunishment of pdb) {

        let user = server.members.cache.get(newPunishment.userID);
        if(!user) return null;

        if(Date.now() >= newPunishment.punishmentFinish) {
            if((user.voice.channel) || (user.roles.cache.get(botRoles.Silent.VoiceMute))) {
            if(user.voice.channel) user.voice.setMute(false, `Voice Mute cezası bittiği sesli kanallara erişimi açıldı.`).catch(err => {});
            user.roles.remove(botRoles.Silent.VoiceMute, `Voice Mute cezası cezası bittiği için rolü geri aldım.`).catch(err => {});
            client.channels.resolve(botChannels.Logs.vmuteLog).wsend({ content: `${user} kullanıcısının **ses kanallarında** susturulma cezası <t:${Math.floor(Date.now() / 1000)}:R> sona erdiği için kaldırıldı.` })
            newPunishment.punishmentContinue = false;
            newPunishment.save();
            }
        } else {
            if(!user.roles.cache.get(botRoles.Silent.VoiceMute) || user.voice.serverMute === false) {
                if(user.voice.channel) user.voice.setMute(true, `Voice Mute cezası olduğu için sesli kanallarda susturuldu.`).catch(err => {});
                user.roles.add(botRoles.Silent.VoiceMute, `Voice Mute cezası olduğu için rolü tekrar verildi.`).catch(err => {});
            }
        }
    }
    })
}

async function chatMuteControl() {
    const server = client.guilds.cache.get(botConfig.server.sunucuID);
    punishSchema.find({ guildID: server.id, punishmentContinue: true, punishmentType: "CMUTE" }, async function(err, pdb) {
        if((!pdb) || (pdb.length < 1)) return null;

        for (var newPunishment of pdb) {

            let user = server.members.cache.get(newPunishment.userID);
            if(!user) return null;

            if(Date.now() >= newPunishment.punishmentFinish) {
                if((user.roles.cache.get(botRoles.Silent.ChatMute))) {
                    user.roles.remove(botRoles.Silent.ChatMute, `Chat Mute cezası sonlandırıldı.`).catch(err => {});
                    client.channels.resolve(botChannels.Logs.cmuteLog).wsend({ content: `${user} kullanıcısının **metin kanallarında** susturulma cezası <t:${Math.floor(Date.now() / 1000)}:R> sona erdiği için kaldırıldı.` })
                    newPunishment.punishmentContinue = false;
                    newPunishment.save();
                }
            } else {
                if(!user.roles.cache.get(botRoles.Silent.ChatMute)) {
                    user.roles.add(botRoles.Silent.ChatMute, `Chat Mute cezası olduğu için rolü tekrar verildi.`).catch(err => {});
                }
            }
        }
    })
}

async function jailControl() {
    const server = client.guilds.cache.get(botConfig.server.sunucuID);
    punishSchema.find({ guildID: server.id, punishmentContinue: true, punishmentType: "JAIL" }, async function(err, pdb) {
        if((!pdb) || (pdb.length < 1)) return null;
        for (var newPunishment of pdb) {

            let user = server.members.cache.get(newPunishment.userID);
            if(!user) return null;
            let oldRoles = await rolesSchema.findOne({ guildID: server.id, userID: user.id });
            if(Date.now() >= newPunishment.punishmentFinish) {
                if(user.roles.cache.get(rolbotRoles.Silent.Suspended)) {
                    user.roles.set([oldRoles.jailRoles], `Jail cezası bittiği için önceki rolleri geri verildi.`)
                    client.channels.resolve(botChannels.Logs.jailLog).wsend({ content: `${user} kullanıcısının **ses ve metin kanallarında** susturulma cezası <t:${Math.floor(Date.now() / 1000)}:R> sona erdiği için kaldırıldı.` })
                    newPunishment.punishmentContinue = false;
                    newPunishment.save();
                }
            } else {
                if(!user.roles.cache.get(botRoles.Silent.Suspended)) {
                    user.roles.add(botRoles.Silent.Suspended, `Jail cezası olduğu için rolü tekrar verildi.`).catch(err => {});
                }
            }
        }
    })
}
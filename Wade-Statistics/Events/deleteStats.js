const client = require('../Handlers/clientHandler')
const Discord = require("discord.js")
const { joinVoiceChannel } = require('@discordjs/voice')

const CronJob = require('cron').CronJob

const botConfig = require('../Config/config.js')
const voiceSchema = require('../Database/voiceSchema')
const messageSchema = require('../Database/messageSchema')
const invitesSchema = require('../Database/inviteSchema')

module.exports = {
    name: 'ready',
    async execute() {
        
        const daily = new CronJob("0 0 * * *", () => {
            client.guilds.cache.forEach(async (guild) => {
              guild.members.cache.forEach(async (member) => {
              await messageSchema.findOneAndUpdate({ guildID: botConfig.server.sunucuID, userID: member.user.id }, { $set: { dailyMessage: 0 } }, { upsert: true });
              await voiceSchema.findOneAndUpdate({ guildID: botConfig.server.sunucuID, userID: member.user.id }, { $set: { dailyVoice: 0 } }, { upsert: true });
              await invitesSchema.findOneAndUpdate({ guildID: botConfig.server.sunucuID, userID: member.user.id }, { $set: { dailyInvites: 0 } }, { upsert: true });
            });
        });
        console.log(`[00.00] Günlük veriler sıfırlandı.`)
        }, null, true, "Europe/Istanbul");
        daily.start();
        
        const weekly = new CronJob("0 0 * * 0", () => {
            client.guilds.cache.forEach(async (guild) => {
              guild.members.cache.forEach(async (member) => {
              await messageSchema.findOneAndUpdate({ guildID: botConfig.server.sunucuID, userID: member.user.id }, { $set: { weeklyMessage: 0 } }, { upsert: true });
              await voiceSchema.findOneAndUpdate({ guildID: botConfig.server.sunucuID, userID: member.user.id }, { $set: { weeklyVoice: 0 } }, { upsert: true });
              await invitesSchema.findOneAndUpdate({ guildID: botConfig.server.sunucuID, userID: member.user.id }, { $set: { weeklyInvites: 0 } }, { upsert: true });
            });
        });
        console.log(`[00.00] Haftalık veriler sıfırlandı.`)
        }, null, true, "Europe/Istanbul");
        weekly.start();

    }
}
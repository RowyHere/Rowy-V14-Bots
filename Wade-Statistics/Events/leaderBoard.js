const client = require('../Handlers/clientHandler')
const { EmbedBuilder, PermissionsBitField } = require('discord.js')
const Discord = require("discord.js")
const { joinVoiceChannel } = require('@discordjs/voice')

const CronJob = require('cron').CronJob
const leaderBoardSchema = require('../Database/leaderBoardSchema')
const voiceState = require('../Database/voiceSchema')
const messageSchema = require('../Database/messageSchema')

const botConfig = require('../Config/config.js')
const mongoose = require('mongoose')
module.exports = {
    name: 'ready',
    async execute() {

        mongoose.connection.on('on', async () => {

        let guild = client.guilds.resolve(botConfig.server.sunucuID)
        if(!guild) return;
        let ldb = await leaderBoardSchema.findOne({ guildID: guild.id })
        if(!ldb) return;
        let channel = guild.channels.resolve(ldb?.messageChannel)
        if(!channel) return;
        let voiceLeader = await channel.messages.fetch(ldb?.voiceFetch), messageLeader = await channel.messages.fetch(ldb?.messageFetch)
        if(!voiceLeader || !messageLeader) return;
        let voiceData = await voiceState.find({ guildID: guild.id }).sort({ weeklyVoice: -1 })
        let messageData = await messageSchema.find({ guildID: guild.id }).sort({ weeklyMessage: -1 })

        let voiceUsers = voiceData.splice(0, 10).filter(x => x.weeklyVoice > 0 && guild.members.resolve(x.userID)).map((x, i) => `\` ${i+1} \` ${guild.members.resolve(x.userID)} - \`${global.sureCevir(x.weeklyVoice)}\``)
        let messageUsers = messageData.splice(0, 10).filter(x => x.weeklyMessage > 0 && guild.members.resolve(x.userID)).map((x, i) => `\` ${i+1} \` ${guild.members.resolve(x.userID)} - \`${Number(x.weeklyMessage || 0).toLocaleString()} mesaj\``)

        const embed = new EmbedBuilder()
        .setColor("Random")
        .setFooter({
            text: `${botConfig.server.footer}`,
            iconURL: client.user?.displayAvatarURL({ dynamic: true })
        })
        .setTimestamp()

        const leaderboard = new CronJob("0 0 * * *", () => {

            messageLeaderBoard()
            voiceLeaderBoard()

        }, null, true, "Europe/Istanbul");
        leaderboard.start();

        async function messageLeaderBoard() {
            await messageLeader.edit({ embeds: [embed.setTitle("Mesaj Sıralaması").setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true })}).setDescription(`${messageUsers.length > 0 ? messageUsers.join("\n") : "`Veri bulunmuyor.`"}`)]})
        }
        async function voiceLeaderBoard() {
            await voiceLeader.edit({ embeds: [embed.setTitle("Ses Sıralaması").setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true })}).setDescription(`${voiceUsers.length > 0 ? voiceUsers.join("\n") : "`Veri bulunmuyor.`"}`)]})
        }

        })

    }
}
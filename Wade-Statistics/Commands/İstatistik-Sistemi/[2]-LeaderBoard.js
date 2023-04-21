const { ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField, StringSelectMenuBuilder, ComponentType, EmbedBuilder, codeBlock } = require("discord.js")

const inviteSchema = require('../../Database/inviteSchema')
const voiceState = require('../../Database/voiceSchema')
const voiceChannelState = require('../../Database/voiceChannelSchema')
const messageSchema = require('../../Database/messageSchema')
const messageChannelSchema = require('../../Database/messageChannelSchema')
const leaderBoardSchema = require('../../Database/leaderBoardSchema')

const moment = require('moment')
require('moment-duration-format')

module.exports = {
    name: 'leaderboard',
    aliases: [],
    description: "LeaderBoard Sistemi",
    discordPermissions: [],
    permissions: [],
    channels: [],
    ownerOnly: true,
    async execute(client, message, args, embed) {

        message.reply({ embeds: [embed.setDescription(`Leaderboard sistemi kuruldu.`)]}).delete(10)

        let voiceData = await voiceState.find({ guildID: message.guild.id }).sort({ weeklyVoice: -1 })
        let messageData = await messageSchema.find({ guildID: message.guild.id }).sort({ weeklyMessage: -1 })

        let voiceUsers = voiceData.splice(0, 10).filter(x => x.weeklyVoice > 0 && message.guild.members.resolve(x.userID)).map((x, i) => `\` ${i+1} \` ${message.guild.members.resolve(x.userID)} - \`${global.sureCevir(x.weeklyVoice)}\``)
        let messageUsers = messageData.splice(0, 10).filter(x => x.weeklyMessage > 0 && message.guild.members.resolve(x.userID)).map((x, i) => `\` ${i+1} \` ${message.guild.members.resolve(x.userID)} - \`${Number(x.weeklyMessage || 0).toLocaleString()} mesaj\``)

        let msg1 = await message.channel.send({ embeds: [embed.setTitle("Mesaj Sıralaması").setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true })}).setDescription(`${messageUsers.length > 0 ? messageUsers.join("\n") : "`Veri bulunmuyor.`"}`)]})
        let msg2 = await message.channel.send({ embeds: [embed.setTitle("Ses Sıralaması").setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true })}).setDescription(`${voiceUsers.length > 0 ? voiceUsers.join("\n") : "`Veri bulunmuyor.`"}`)]})

        await leaderBoardSchema.findOneAndUpdate({ guildID: message.guild.id }, { $set: { messageChannel: message.channel.id, voiceFetch: msg2.id, messageFetch: msg1.id }}, { upsert: true })

    }
}
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField, StringSelectMenuBuilder, ComponentType, EmbedBuilder, AttachmentBuilder } = require("discord.js")

const botRoles = require("../../Config/configRoles")
const botConfig = require("../../Config/config")
const botEmojis = require("../../Config/configEmojis")
const botSilents = require("../../Config/configSilent")
const botChannels = require("../../Config/configChannels")

const userSchema = require("../../Database/userSchema")
const punishSchema = require("../../Database/punishSchema")
const infractionSchema = require("../../Database/infractionSchema")

const voiceJoinedAt = require("../../Database/voiceJoinedAtSchema")

module.exports = {
    name: 'nerede',
    aliases: ['nerde'],
    description: "Nerede Sistemi",
    discordPermissions: [],
    permissions: [],
    channels: [],
    ownerOnly: false,
    async execute(client, message, args, embed) {

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) return message.channel.send({ embeds: [embed.setDescription(`Lütfen bir ${member == undefined ? "**üye**" : ""} belirtin.`)] }).delete(5)
        if(!member.voice.channel) return message.channel.send({ embeds: [embed.setDescription(`Belirttiğiniz üye ses kanalında bulunmuyor.`)] }).delete(5)

        let duration = await voiceJoinedAt.findOne({ guildID: message.guild.id, userID: member.id })

        let mic = member.voice.selfMute == true ? `**Kapalı**` : `**Acık**`
        let hop = member.voice.selfDeaf == true ? `**Kapalı**` : `**Acık**`
        let newText = ""

        newText += `Ses kanalına <t:${Math.floor(duration?.joinedAt / 1000)}:R> giriş yapmış.`

        message.reply({ embeds: [embed.setDescription(`Kullanıcı: ${member} (${member.voice.channel})\n\n${newText}\n\nKullanıcının Ek Bilgileri;\nMikrafon: ${mic}\nKulaklık: ${hop}`)] })


    }
}
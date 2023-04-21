const { codeBlock, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField, StringSelectMenuBuilder, ComponentType, EmbedBuilder } = require("discord.js")

const botRoles = require("../../Config/configRoles")
const botConfig = require("../../Config/config")
const botEmojis = require("../../Config/configEmojis")
const botSilents = require("../../Config/configSilent")
const botChannels = require("../../Config/configChannels")

const userSchema = require("../../Database/userSchema")
const punishSchema = require("../../Database/punishSchema")
const infractionSchema = require("../../Database/infractionSchema")

module.exports = {
    name: 'ihlal',
    aliases: ['punish'],
    description: "İhlal Sistemi",
    discordPermissions: [PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.MuteMembers, PermissionsBitField.Flags.MoveMembers, PermissionsBitField.Flags.Administrator],
    permissions: [...botRoles.allPermissions, ...botRoles.Moderation.commanderRoles],
    channels: [],
    ownerOnly: false,
    async execute(client, message, args, embed) {

        let member = message.mentions.members.first() || message.guild.members.resolve(args[0]) || message.member

        let idb = await infactionSchema.findOne({ guildID: message.guild.id, userID: member.id})
        if(!idb) return message.reply({ embeds: [embed.setDescription(`${member.id == message.author.id ? `Selam **${member.username}#${member.discriminator}**, Veritabanımda ihlal geçmişin bulunmuyor.` : `**${member.username}#${member.discriminator}** üyesine ait veritabanımda bir ihlal geçmişi bulunmuyor.`}`)] }).delete(10)

        let total = idb.Ban+idb.Jail+idb.CMute+idb.VMute

        if(member.id === message.author.id) {
            message.reply({ embeds: [embed.setDescription(`Selam **${member.username}#${member.discriminator}**, Toplamda \`${total}\` ihlalin bulunuyor.
            ${codeBlock("fix", `Daha önce verilen cezaların:
            (Ban: ${idb.Ban}, CMute: ${idb.CMute}, VMute: ${idb.VMute}, Jail: ${idb.Jail})`)}`)] }).delete(15)
        } else {
            message.reply({ embeds: [embed.setDescription(`**${member.username}#${member.discriminator}** üyesine ait toplamda \`${total}\` ihlali bulunuyor.
            ${codeBlock("fix", `Daha önce verilen cezalar:
(Ban: ${idb.Ban}, CMute: ${idb.CMute}, VMute: ${idb.VMute}, Jail: ${idb.Jail})`)}`)]}).delete(15)
        }
    }

}
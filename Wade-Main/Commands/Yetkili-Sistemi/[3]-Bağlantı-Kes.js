const { ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField, StringSelectMenuBuilder, ComponentType, EmbedBuilder } = require("discord.js")

const botRoles = require("../../Config/configRoles")
const botConfig = require("../../Config/config")
const botEmojis = require("../../Config/configEmojis")
const botSilents = require("../../Config/configSilent")
const botChannels = require("../../Config/configChannels")

const userSchema = require("../../Database/userSchema")
const punishSchema = require("../../Database/punishSchema")
const infractionSchema = require("../../Database/infractionSchema")

module.exports = {
    name: 'bağlantı-kes',
    aliases: ['kes','bk','ucur','massakakes','kodeskes'],
    description: "Bağlantı Kes Sistemi",
    discordPermissions: [PermissionsBitField.Flags.MuteMembers, PermissionsBitField.Flags.MoveMembers, PermissionsBitField.Flags.Administrator],
    permissions: [...botRoles.allPermissions, ...botRoles.Moderation.commanderRoles],
    channels: [],
    ownerOnly: false,
    async execute(client, message, args, embed) {

        let member = message.mentions.members.first() || message.guild.members.resolve(args[0]);
        if(!member) return message.reply({ embeds: [embed.setDescription(`Lütfen bir ${member == undefined ? "**üye**" : ""} belirtin.`)] }).delete(10)
        if(!member.voice.channel) return message.reply({ embeds: [embed.setDescription(`Belirttiğiniz üye ses kanalında bulunmuyor.`)] }).delete(10)

        if(member.voice.channel) {
            member.voice.disconnect([`Bağlantı kesme komutu kullanıldı. Yetkili: ${message.author.tag} (${message.author.id})`]);
            message.reply({ embeds: [embed.setDescription(`${member} üyesinin ses kanalına erişimi kesildi.`)] })
        }

    }
}
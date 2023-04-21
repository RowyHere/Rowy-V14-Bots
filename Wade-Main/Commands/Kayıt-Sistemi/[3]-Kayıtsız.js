const userSchema = require("../../Database/userSchema")
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField } = require("discord.js")
const emojis = require("../../Config/configEmojis")
const roles = require("../../Config/configRoles")
const config = require("../../Config/config")
const channels = require("../../Config/configChannels")

module.exports = {
    name: 'kayıtsız',
    aliases: ['kayitsiz'],
    description: "Kayitsiz Sistemi",
    discordPermissions: [PermissionsBitField.Flags.ManageRoles],
    permissions: [...roles.Register.staffRoles, ...roles.Moderation.commanderRoles],
    channels: [],
    ownerOnly: false,
    async execute(client, message, args, embed) {

        let member = message.mentions.members.first() || message.guild.members.resolve(args[0])
        if (!member) return message.reply({ embeds: [embed.setDescription(`Lütfen bir **${!member ? "üye" : ""}** belirtiniz.`)] }).delete(5)

        if(member.roles.highest.position >= message.member.roles.highest.position) return message.reply({ embeds: [embed.setDescription(`Belirtilen üye kayıtsıza gönderemezsin.`)] }).delete(5)
        if(roles.Register.unregRoles.some(x => member.roles.cache.has(x))) return message.reply({ embeds: [embed.setDescription(`Belirtilen üye zaten kayıtsızda.`)]})

        member.roles.set(roles.Register.unregRoles)
        member.setNickname(`${member.user.username.includes(config.server.tag) || member.user.discriminator.includes(config.server.discrimTag) ? config.server.noTag : config.server.noTag} İsim | Yaş`)

        message.reply({ embeds: [embed.setDescription(`${member} kullanıcısı başarıyla kayıtsıza gönderildi.`)] }).delete(10)
        client.channels.resolve(channels.Logs.unRegLog).send({ content: `**${member.user.username}#${member.user.discriminator}**, **${message.author.tag}** tarafından <t:${Math.floor(Date.now() / 1000)}> tarihinde (<t:${Math.floor(Date.now() / 1000)}:R>) kayıtsıza atıldı.` })

    }
}
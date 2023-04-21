const { ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField, StringSelectMenuBuilder, ComponentType, EmbedBuilder, AttachmentBuilder } = require("discord.js")

const botRoles = require("../../Config/configRoles")
const botConfig = require("../../Config/config")
const botEmojis = require("../../Config/configEmojis")
const botSilents = require("../../Config/configSilent")
const botChannels = require("../../Config/configChannels")

const userSchema = require("../../Database/userSchema")
const punishSchema = require("../../Database/punishSchema")
const infractionSchema = require("../../Database/infractionSchema")

module.exports = {
    name: 'zengin',
    aliases: ['booster'],
    description: "Zengin Sistemi",
    discordPermissions: [PermissionsBitField.Flags.ManageNicknames, PermissionsBitField.Flags.Administrator],
    permissions: [botRoles.General.boosterRoles],
    channels: [],
    ownerOnly: false,
    async execute(client, message, args, embed) {

        let member = message.member;
        let name = args.join(" ")
        if(name.length > 32) return message.channel.send({ embeds: [embed.setDescription(`İsim 32 karakterden fazla olamaz.`)]}).delete(5)
        let fixName = `${member.user.username.includes(botConfig.server.tag) || member.user.discriminator.includes(botConfig.server.discrimTag) ? botConfig.server.noTag : botConfig.server.noTag} ${name}`

        await member.setNickname(fixName).catch(err => { return message.reply({ embeds: [embed.setDescription(`İsim değiştirme işlemi sırasında bir hata oluştu.`)]}).delete(5) });
        await message.reply({ embeds: [embed.setDescription(`Başarıyla isminizi \`${fixName}\` olarak değiştirdim.`)]})
        client.channels.resolve(botChannels.Logs.nameLog).send({ content: `**${member.author.tag}** adını, <t:${Math.floor(Date.now() / 1000)}> tarihinde (<t:${Math.floor(Date.now() / 1000)}:R>) \`${fixName}\` olarak değiştirdi.` })
        await userSchema.findOneAndUpdate({ guildID: i.guild.id, userID: member.id }, { $push: { names: { name: fixName, type: `İsim Değiştirme`, executor: `<@${message.author.id}>` }}, }, { upsert: true })
        

    }
}
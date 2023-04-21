const userSchema = require("../../Database/userSchema")
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField } = require("discord.js")
const emojis = require("../../Config/configEmojis")
const roles = require("../../Config/configRoles")
const config = require("../../Config/config")
const channels = require("../../Config/configChannels")

module.exports = {
    name: 'names',
    aliases: ['isimler'],
    description: "İsimler Sistemi",
    discordPermissions: [PermissionsBitField.Flags.ManageNicknames],
    permissions: [...roles.Register.staffRoles, ...roles.Moderation.commanderRoles],
    channels: [],
    ownerOnly: false,
    async execute(client, message, args, embed) {

        let member = message.mentions.members.first() || message.guild.members.resolve(args[0]);
        if (!member) return message.reply({ embeds: [embed.setDescription(`Lütfen bir **${!member ? "üye" : ""}** belirtiniz.`)] }).delete(5)

        const data = await userSchema.findOne({ guildID: message.guild.id, userID: member.id })
        if (!data || !data.names.length > 0) return message.reply({ embeds: [embed.setDescription(`${member} kullanıcısının isim geçmişi bulunamadı.`)] }).delete(5)

        const names = data.names.reverse().slice(0, 15).map((x, i) => `\` ${i+1} \` \` ${x.name} \` (${x.type} - ${x.executor})`).join("\n")
        message.reply({ embeds: [embed.setDescription(`${member} kullanıcısının **${data.names.length}** adet geçmiş ismi bulundu;\n\n${names}`)] }).delete(15)

    }
}
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
    name: 'sil',
    aliases: ['del','temizle','delete'],
    description: "Sil Sistemi",
    discordPermissions: [PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.Administrator],
    permissions: [...botRoles.allPermissions, ...botRoles.Moderation.commanderRoles],
    channels: [],
    ownerOnly: false,
    async execute(client, message, args, embed) {

        let member = message.mentions.members.first() || message.guild.members.resolve(args[0]);

        if (member) {

            if (!args[1] || !Number(args[1]) || Number(args[1]) < 1 || Number(args[1]) > 100) return message.reply({ embeds: [embed.setDescription(`Lütfen **${!args[1] ? "bir miktar** belirtin." : !Number(args[1]) ? "bir sayı** belirtin." : Number(args[1]) < 1 ? "sayı 1**\'den yüksek olmalıdır." : "sayı 100**\'den düşük olmalıdır."}`)]}).delete(5)

            let messages = await message.channel.messages.fetch({ limit: args[1] })

            let memberMessage = messages.filter((s) => s.author.id === member.id)

            await message.channel.bulkDelete(memberMessage).then(msg => message.channel.send({ embeds: [embed.setDescription(`${member} kullanıcısına ait **${msg.size}** adet mesaj temizlendi!`)]}).delete(15)).catch(() => { })

        } else {

            if (!args[0] || !Number(args[0]) || Number(args[0]) < 1 || Number(args[0]) > 100) return message.reply({ embeds: [embed.setDescription(`Lütfen **${!args[0] ? "bir miktar** belirtin." : !Number(args[0]) ? "bir sayı** belirtin." : Number(args[0]) < 1 ? "sayı 1**\'den yüksek olmalıdır." : "sayı 100**\'den düşük olmalıdır."}`)]}).delete(5)

            message.channel.bulkDelete(Number(args[0])).then(msg => message.channel.send({ embeds: [embed.setDescription(`${message.channel} Kanalından **${msg.size}** adet mesaj temizlendi!`)]}).delete(15)).catch(() => { })

        }



    }
}
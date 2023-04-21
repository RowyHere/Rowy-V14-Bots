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
    name: 'cbilgi',
    aliases: ['cezabilgi','cb','ceza-bilgi','massaka-bilgi','kodes-bilgi','massakabilgi','kodesbilgi'],
    description: "Ceza Bilgi Sistemi",
    discordPermissions: [PermissionsBitField.Flags.ManageRoles, PermissionsBitField.Flags.MuteMembers, PermissionsBitField.Flags.MoveMembers, PermissionsBitField.Flags.Administrator],
    permissions: [...botRoles.allPermissions, ...botRoles.Moderation.commanderRoles],
    channels: [],
    ownerOnly: false,
    async execute(client, message, args, embed) {

        if(!args[0] || isNaN(args[0])) return message.reply({ embeds: [embed.setDescription(`Geçerli bir **ceza id** girin.`)] }).delete(5)
        let pdb = await punishSchema.findOne({ guildID: message.guild.id, cezaID: args[0] })
        if(!pdb) return message.reply({ embeds: [embed.setDescription(`Belirtilen **ceza id**\'ye sahip bir ceza bulunmuyor.`)]}).delete(5)

        message.reply({ embeds: [
            embed.setDescription(`
            **${args[0]}** Numaralı cezanın detaylı bilgileri aşağıda verilmiştir
            
            \`[•]\` **Yetkili:** ${message.guild.members.resolve(pdb.executor) || await client.users.fetch(pdb.executor).then(x => x.tag)} (\`${pdb.executor}\`)
            \`[•]\` **Kullanıcı:** ${message.guild.members.resolve(pdb.userID) || await client.users.fetch(pdb.userID).then(x => x.tag)} (\`${pdb.userID}\`)
            \`[•]\` **Ceza Türü:** ${replaceAll(pdb.punishmentType)}
            \`[•]\` **Ceza Sebebi:** ${pdb.punishmentReason}
            \`[•]\` **Ceza Başlangıç Tarihi:** <t:${Math.floor(pdb.punishmentAt / 1000)}:R>
            \`[•]\` **Ceza Bitiş Tarihi:** <t:${Math.floor(pdb.punishmentFinish / 1000)}:R>
            
            `)
        ]})

        function replaceAll(text) {
            return text.replace("CMUTE", "Metin Kanallarında Susturulma").replace("VMUTE", "Ses Kanallarında Susturulma").replace("JAIL", "Ses ve Metin Kanallarında Susturulma")
        }

    }
}
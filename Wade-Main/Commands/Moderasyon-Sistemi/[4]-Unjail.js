const { ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField, StringSelectMenuBuilder, ComponentType, EmbedBuilder } = require("discord.js")

const botRoles = require("../../Config/configRoles")
const botConfig = require("../../Config/config")
const botEmojis = require("../../Config/configEmojis")
const botSilents = require("../../Config/configSilent")
const botChannels = require("../../Config/configChannels")

const userSchema = require("../../Database/userSchema")
const punishSchema = require("../../Database/punishSchema")
const infractionSchema = require("../../Database/infractionSchema")
const rolesSchema = require("../../Database/rolesSchema")

module.exports = {
    name: 'unjail',
    aliases: ['unceza', 'unhapis', 'uncezalı', 'unjailed', 'unmassaka', 'unkodes'],
    description: "Unjail Sistemi",
    discordPermissions: [PermissionsBitField.Flags.ManageRoles],
    permissions: [...botRoles.Moderation.jailRoles, ...botRoles.Moderation.commanderRoles],
    channels: [],
    ownerOnly: false,
    async execute(client, message, args, embed) {

        let member = message.mentions.members.first() || message.guild.members.resolve(args[0]);
        let reason = args.slice(1).join(" ")
        if(!member || !reason) return message.reply({ embeds: [embed.setDescription(`Lütfen bir **${!member ? "üye" : !reason ? "sebep" : ""}** belirtiniz.`)] }).delete(5)
        
        if(member.id === message.author.id) return message.reply({ embeds: [embed.setDescription(`Kendini hapisten çıkaramazsın.`)] }).delete(5)
        if(member.id === client.user.id) return message.reply({ embeds: [embed.setDescription(`Botu hapisten çıkaramazsın.`)] }).delete(5)
        if(member.id === message.guild.ownerId) return message.reply({ embeds: [embed.setDescription(`Sunucu sahibini hapisten çıkaramazsın.`)] }).delete(5)
        if(member.roles.highest.position >= message.member.roles.highest.position) return message.reply({ embeds: [embed.setDescription(`Belirtilen üyeyi hapisten çıkaramazsın.`)] }).delete(5)
        if(!member.roles.cache.has(botRoles.Silent.Suspended)) return message.reply({ embeds: [embed.setDescription(`Belirtilen üye zaten hapisten çıkarılmış.`)] }).delete(5)
        
        let data = await punishSchema.findOne({ userID: member.id, punishmentContinue: true, punishmentType: "JAIL" })
        if(!data) return message.reply({ embeds: [embed.setDescription(`Belirtilen kullanıcının **ses** ve **metin** kanallarından uzaklaştırma cezası bulunmuyor.`)] }).delete(5)

        let dataRoles = await rolesSchema.findOne({ guildID: message.guild.id, userID: member.id });

        let count = await punishSchema.countDocuments().exec();
        count = count == 0 ? 1 : count + 1;
        
        await punishSchema.updateOne({ guildID: message.guild.id, userID: member.id, punishmentContinue: true, punishmentType: "JAIL" }, { $set: { punishmentContinue: false } }, { upsert: true })
        await new punishSchema({ guildID: message.guild.id, executor: message.author.id, userID: member.id, punishmentAt: Date.now(), punishmentFinish: null, punishmentType: "UN-JAIL", punishmentReason: reason, punishmentContinue: false, cezaID: count }).save()
        await member.roles.set(dataRoles.jailRoles).catch(err => { return message.reply({ embeds: [embed.setDescription(`Belirtilen üyenin rolleri verilirken bir hata oluştu.`)] }).delete(5) })

        let jailLog = client.channels.resolve(botChannels.Logs.jailLog)
        jail.wsend({ embeds: [
            new EmbedBuilder()
            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true })})
            .setTitle(`#${count} Numaralı Yeni Ceza`)
            .setColor('Random')
            .setFooter({ text: botConfig.server.footer, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`${member} (\`${member.id}\`) adlı kullanıcının ses ve metin kanallarına erişimi açıldı.`)
            .addFields({
                name: `#${count} Numaralı cezanın detaylı bilgileri;`,
                value: `
        \`[•]\` **Yetkili:** ${message.author} (\`${message.author.tag} - ${message.author.id}\`)
        \`[•]\` **Kullanıcı:** ${member} (\`${member.id}\`)
        \`[•]\` **İşlem:** Ses ve Metin kanallarına erişim açıldı (\`UN-JAIL\`)
        \`[•]\` **Tarih:** <t:${Math.floor(Date.now() / 1000)}> (<t:${Math.floor(Date.now() / 1000)}:R>)
        \`[•]\` **Sebep:** \`${reason}\``
            })
        ]})

        message.reply({ embeds: [embed.setDescription(`${member} (\`${member.id}\`) adlı kullanıcının **ses** ve **metin** kanallarına erişimi açıldı.`)] }).delete(10)

    }
}
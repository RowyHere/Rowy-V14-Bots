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
    name: 'unvmute',
    aliases: ['unvhat-mute', 'unvhatmute', 'unvm'],
    description: "UNVmute Sistemi",
    discordPermissions: [PermissionsBitField.Flags.MuteMembers, PermissionsBitField.Flags.ManageRoles, PermissionsBitField.Flags.MoveMembers],
    permissions: [...botRoles.Moderation.muteRoles, ...botRoles.Moderation.commanderRoles],
    channels: [],
    ownerOnly: false,
    async execute(client, message, args, embed) {

        let member = message.mentions.members.first() || message.guild.members.resolve(args[0]);
        let reason = args.slice(1).join(" ")
        if(!member || !reason) return message.reply({ embeds: [embed.setDescription(`Lütfen bir **${!member ? "üye" : !reason ? "sebep" : ""}** belirtiniz.`)] }).delete(5)
        
        if(member.id === message.author.id) return message.reply({ embeds: [embed.setDescription(`Kendini muteni açamazsın.`)] }).delete(5)
        if(member.id === client.user.id) return message.reply({ embeds: [embed.setDescription(`Botun mutesini açamazsın.`)] }).delete(5)
        if(member.id === message.guild.ownerId) return message.reply({ embeds: [embed.setDescription(`Sunucu sahibini mutesini açamazsın.`)] }).delete(5)
        if(member.roles.highest.position >= message.member.roles.highest.position) return message.reply({ embeds: [embed.setDescription(`Belirtilen üyeyi mutesini açamazsın.`)] }).delete(5)
        if(!member.roles.cache.has(botRoles.Silent.ChatMute)) return message.reply({ embeds: [embed.setDescription(`Belirtilen kullanıcının **ses** kanallarında aktif bir cezası bulunmuyor.`)] }).delete(5)

        let data = await punishSchema.findOne({ userID: member.id, punishmentContinue: true, punishmentType: "VMUTE" })
        if(!data) return message.reply({ embeds: [embed.setDescription(`Belirtilen üyenin cezası bulunamadı.`)] }).delete(5)

        let count = await punishSchema.countDocuments().exec();
        count = count == 0 ? 1 : count + 1;

        await punishSchema.updateOne({ guildID: message.guild.id, userID: member.id, punishmentContinue: true, punishmentType: "VMUTE" }, { $set: { punishmentContinue: false } }, { upsert: true })
        await new punishSchema({ guildID: message.guild.id, executor: message.author.id, userID: member.id, punishmentAt: Date.now(), punishmentFinish: null, punishmentType: "UN-VMUTE", punishmentReason: reason, punishmentContinue: false, cezaID: count }).save()
        await member.roles.remove(botRoles.Silent.VoiceMute, `UN-VMUTE | ${message.author.tag} - ${message.author.id} | ${reason}`)
        if(member.voice.channel) await member.voice.setMute(false, `UN-VMUTE | ${message.author.tag} - ${message.author.id} | ${reason}`)
        
        let vmute = client.channels.resolve(botChannels.Logs.vmuteLog)

        vmute.wsend({ embeds: [
            new Discord.EmbedBuilder()
            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true })})
            .setTitle(`#${count} Numaralı Yeni Ceza`)
            .setColor('Random')
            .setFooter({ text: botConfig.server.footer, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`${member} (\`${member.id}\`) adlı kullanıcının ses kanallarından bulunan susturulması açıldı.`)
            .addFields({
                name: `#${count} Numaralı cezanın detaylı bilgileri;`,
                value: `
        \`[•]\` **Yetkili:** ${message.author} (\`${message.author.tag} - ${message.author.id}\`)
        \`[•]\` **Kullanıcı:** ${member} (\`${member.id}\`)
        \`[•]\` **İşlem:** Ses Kanallarında Susturma Kaldırma (\`UN-Voice Mute\`)
        \`[•]\` **Tarih:** <t:${Math.floor(Date.now() / 1000)}> (<t:${Math.floor(Date.now() / 1000)}:R>)
        \`[•]\` **Sebep:** \`${reason}\``
            })
        ]})

        message.reply({ embeds: [embed.setDescription(`${member} (\`${member.id}\`) adlı kullanıcının **ses** kanallarına erişimi açıldı.`)] }).delete(10)


    }
}
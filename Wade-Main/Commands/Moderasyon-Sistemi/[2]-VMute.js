const { ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField, StringSelectMenuBuilder, ComponentType, EmbedBuilder } = require("discord.js")

const botRoles = require("../../Config/configRoles")
const botConfig = require("../../Config/config")
const botEmojis = require("../../Config/configEmojis")
const botSilents = require("../../Config/configSilent")
const botChannels = require("../../Config/configChannels")

const userSchema = require("../../Database/userSchema")
const punishSchema = require("../../Database/punishSchema")
const infractionSchema = require("../../Database/infractionSchema")

const ms = require('ms')

module.exports = {
    name: 'vmute',
    aliases: ['voice-mute', 'voicemute', 'vm'],
    description: "Vmute Sistemi",
    discordPermissions: [PermissionsBitField.Flags.MuteMembers, PermissionsBitField.Flags.ManageRoles, PermissionsBitField.Flags.MoveMembers],
    permissions: [...botRoles.Moderation.muteRoles, ...botRoles.Moderation.commanderRoles],
    channels: [],
    ownerOnly: false,
    async execute(client, message, args, embed) {

        let member = message.mentions.members.first() || message.guild.members.resolve(args[0]);

        if(!member) return message.reply({ embeds: [embed.setDescription(`Lütfen bir ${!member ? "üye" : ""} belirtiniz.`)] }).delete(5)
        
        if(member.id === message.author.id) return message.reply({ embeds: [embed.setDescription(`Kendini sustaramazsın.`)] }).delete(5)
        if(member.id === client.user.id) return message.reply({ embeds: [embed.setDescription(`Botu susturamazsın.`)] }).delete(5)
        if(member.id === message.guild.ownerId) return message.reply({ embeds: [embed.setDescription(`Sunucu Sahibini susturamazsın.`)] }).delete(5)
        if(member.roles.highest.position >= message.member.roles.highest.position) return message.reply({ embeds: [embed.setDescription(`Belirtilen üyeyi susturamazsın.`)] }).delete(5)
        if(member.roles.cache.has(botRoles.Silent.ChatMute)) return message.reply({ embeds: [embed.setDescription(`Belirtilen üye zaten metin kanallarında susturulmuş.`)] }).delete(5)

        let count = await punishSchema.countDocuments().exec();
        count = count == 0 ? 1 : count + 1;

        let Array = []
        botSilents.vmute.forEach(x => { Array.push({ label: x.label, description: x.description, value: x.value })})
        const row = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
            .setCustomId('select')
            .setPlaceholder('Yapılacak eylemi seçin.')
            .setOptions(Array)
        )

        let msg = await message.reply({ embeds: [embed.setDescription(`Lütfen yapılacak eylemi seçin.`)], components: [row] })
        let collector = await msg.createMessageComponentCollector({ ComponentType: ComponentType.StringSelect, time: 30 * 1000, max: 1 })

        collector.on('collect', async (interaction) => {

            if(interaction.user.id !== message.author.id) return interaction.reply({ embeds: [embed.setDescription(`Bu komutu sadece ${message.author} kullanabilir.`)], ephemeral: true })

            for (let i = 0; i < botSilents.vmute.length; i++) {

                const index = botSilents.vmute[i];
                let value = interaction.values[0];
                if(value === index.value) {
                    vmute(member, index.label, index.time, index.description, interaction, count)
                }

            }

        })

        collector.on('end', async (interaction) => {

            if(msg) msg.delete()

        })

        async function vmute (user, reason, time, timeLength, button, count) {

            const vmute = client.channels.resolve(botChannels.Logs.vmuteLog)

            let data = {
                guildID: message.guild.id,
                executor: message.author.id,
                cezaID: count,

                userID: user.id,
                punishmentAt: Date.now(),
                punishmentFinish: (Date.now() + ms(time)),
                punishmentType: "VMUTE",
                punishmentReason: reason,
                punishmentContinue: true,
            }

            await button.channel.send({ embeds: [
                embed.setDescription(`${message.member}, ${user} adlı kullanıcı başarıyla **ses** kanallarında susturuldu!`)
            ] })

            if(user.voice.channel) await user.voice.setMute(true, `Susturulma sebebi: ${reason} | Susturulma süresi: ${timeLength} | Yetkili: ${message.author.tag} (${message.author.id})`)
            await user.roles.add(botRoles.Silent.VoiceMute, `Susturulma sebebi: ${reason} | Susturulma süresi: ${timeLength} | Yetkili: ${message.author.tag} (${message.author.id})`)
            await new punishSchema(data).save()
            await infractionSchema.findOneAndUpdate({ guildID: message.guild.id, userID: user.id }, { $inc: { VMute: 1, punishmentPoint: botSilents.point.vmute }}, { upsert: true })

            vmute.wsend({
                embeds: [
                    new EmbedBuilder()
                    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true })})
                    .setTitle(`#${count} Numaralı Yeni Ceza`)
                    .setColor('Random')
                    .setFooter({ text: `${botConfig.server.footer}`, iconURL: client.user?.displayAvatarURL({ dynamic: true }) })
                    .setTimestamp()
                    .setDescription(`${user} (\`${user.id}\`) adlı kullanıcı ${button.user} tarafından ses kanallarında susturuldu.`)
                    .addFields({
                        name: `#${count} Numaralı cezanın detaylı bilgileri;`,
                        value: `
                        \`[•]\` **Yetkili:** ${button.user} (\`${button.user.tag} - ${button.user.id}\`)
                        \`[•]\` **Kullanıcı:** ${user} (\`${user.id}\`)
                        \`[•]\` **İşlem:** Ses Kanallarında Susturma (\`Voice Mute\`)
                        \`[•]\` **Tarih:** <t:${Math.floor(Date.now() / 1000)}> (<t:${Math.floor(Date.now() / 1000)}:R>)
                        \`[•]\` **Sebep:** \`${reason}\`
                        \`[•]\` **Süre:** \`${timeLength}\``
                    })
                
                ]   
            })

        }

    }
}
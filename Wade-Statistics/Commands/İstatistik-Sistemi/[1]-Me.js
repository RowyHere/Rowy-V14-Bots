const { ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField, StringSelectMenuBuilder, ComponentType, EmbedBuilder, codeBlock } = require("discord.js")

const inviteSchema = require('../../Database/inviteSchema')
const voiceState = require('../../Database/voiceSchema')
const voiceChannelState = require('../../Database/voiceChannelSchema')
const messageSchema = require('../../Database/messageSchema')
const messageChannelSchema = require('../../Database/messageChannelSchema')

const moment = require('moment')
require('moment-duration-format')

module.exports = {
    name: 'me',
    aliases: ['stat','stats'],
    description: "İstatistik Sistemi",
    discordPermissions: [],
    permissions: [],
    channels: [],
    ownerOnly: false,
    async execute(client, message, args, embed) {

        let member = message.mentions.members.first() || message.guild.members.resolve(args[0]) || message.member;

        let voiceData = await voiceState.findOne({ guildID: message.guild.id, userID: member.id })
        let voiceChannelData = await voiceChannelState.find({ guildID: message.guild.id, userID: member.id }).sort({ channelData: -1 })
        let voiceTop = voiceChannelData?.length > 0 ? voiceChannelData.splice(0, 5).filter(x => message.guild.channels.resolve(x.channelID)).map((x, i) => `\` ${i + 1} \` ${message.guild.channels.resolve(x.channelID)} - \`${global.sureCevir(Number(x.channelData))}\``).join('\n') : 'Veri bulunamadı!';
        let inviteData = await inviteSchema.findOne({ guildID: message.guild.id, userID: member.id });
        let messageData = await messageSchema.findOne({ guildID: message.guild.id, userID: member.id })
        let messageChannelData = await messageChannelSchema.find({ guildID: message.guild.id, userID: member.id }).sort({ channelData: -1 })
        let messageTop = messageChannelData?.length > 0 ? messageChannelData.splice(0, 5).filter(x => message.guild.channels.resolve(x.channelID)).map((x, i) => `\` ${i + 1} \` ${message.guild.channels.resolve(x.channelID)} - \`${x.channelData} mesaj\``).join('\n') : 'Veri bulunamadı!';

        let row = new ActionRowBuilder()
        .addComponents(

            new StringSelectMenuBuilder()
            .setCustomId("rowii")
            .setPlaceholder("Aşağıdan Günlük/Haftalık Verilinize Bakın!")
            .addOptions(
                {
                    label: "Günlük Veriler",
                    description: "Günlük Ses/Mesaj ve Davet bilgilerini öğrenirsiniz.",
                    value: "daily"
                },
                {
                    label: "Haftalık Veriler",
                    description: "Haftalık Ses/Mesaj ve Davet bilgilerini öğrenirsiniz.",
                    value: "weekly"
                }
            )

        )

        let msg = await message.reply({ components: [row], embeds: [embed.setDescription(`
        ${member.id == message.author.id ? `Selam ${member}, Aşağıda senin genel ses, mesaj ve davet istatistik bilgilerin gösteriliyor. Menüyü kullanarak **günlük ve haftalık** verilerine bakabilirsin.` : `${member} üyesine ait genel ses, mesaj ve davet istatistik bilgileri gösteriliyor. Menüyü kullanarak **günlük ve haftalık** verilerine bakabilirsin.`}`)
        .addFields( 
            { name: "Genel Mesaj", value: `${codeBlock("fix", `${messageData ? messageData.totalMessage : 0} mesaj`)}`, inline: true },
            { name: "Genel Ses", value: `${codeBlock("fix", moment.duration(voiceData ? voiceData.totalVoice : 0).format("H [saat], m [dakika], s [saniye]"))}`, inline: true },
            { name: "Genel Davet", value: `${codeBlock("fix", `${inviteData ? inviteData.total : 0} davet`)}`, inline: true },
            { name: "Sesli Kanal Sıralaması", value: `${voiceTop}`, inline: true },
            { name: "Metin Kanal Sıralaması", value: `${messageTop}`, inline: true },
        )        
        ]})

        let collector = msg.createMessageComponentCollector({ time: 30*1000, max: 2 })
        collector.on('collect', async (interaction) => {
            if(interaction.user.id !== message.author.id) return interaction.reply({ embeds: [embed.setDescription(`Bu işlemi sadece ${message.author} yapabilir.`)], ephemeral: true }).delete(5)

            switch(interaction.values[0]) {

                case "daily":
                    embed.data.description = null, embed.data.fields = null
                    interaction.reply({ ephemeral: true, embeds: [embed.setDescription(`
                    ${member.id == message.author.id ? `Selam ${member}, Aşağıda senin günlük ses, mesaj ve davet istatistik bilgilerin gösteriliyor.` : `${member} üyesine ait günlük ses, mesaj ve davet istatistik bilgileri gösteriliyor.`}`)
                    .addFields( 
                        { name: "Günlük Mesaj", value: `${codeBlock("fix", `${messageData ? messageData.dailyMessage : 0} mesaj`)}`, inline: true },
                        { name: "Günlük Ses", value: `${codeBlock("fix", moment.duration(voiceData ? voiceData.dailyVoice : 0).format("H [saat], m [dakika], s [saniye]"))}`, inline: true },
                        { name: "Günlük Davet", value: `${codeBlock("fix", `${inviteData ? inviteData.dailyInvites : 0} davet`)}`, inline: true },
                    )    
                ]})

                break;

                case "weekly":
                embed.data.description = null, embed.data.fields = null
                interaction.reply({ ephemeral: true, embeds: [embed.setDescription(`
                ${member.id == message.author.id ? `Selam ${member}, Aşağıda senin haftalık ses, mesaj ve davet istatistik bilgilerin gösteriliyor.` : `${member} üyesine ait haftalık ses, mesaj ve davet istatistik bilgileri gösteriliyor.`}`)
                .addFields( 
                    { name: "Haftalık Mesaj", value: `${codeBlock("fix", `${messageData ? messageData.weeklyMessage : 0} mesaj`)}`, inline: true },
                    { name: "Haftalık Ses", value: `${codeBlock("fix", moment.duration(voiceData ? voiceData.weeklyVoice : 0).format("H [saat], m [dakika], s [saniye]"))}`, inline: true },
                    { name: "Haftalık Davet", value: `${codeBlock("fix", `${inviteData ? inviteData.weeklyInvites : 0} davet`)}`, inline: true },
                )    
            ]})

                break;

            }

        })

        collector.on('end', () => {

            embed.data.description = null, embed.data.fields = null
            if(msg) msg.edit({ components: [], embeds: [embed.setDescription(`
            ${member.id == message.author.id ? `Selam ${member}, Aşağıda senin genel ses, mesaj ve davet istatistik bilgilerin gösteriliyor. Menüyü kullanarak **günlük ve haftalık** verilerine bakabilirsin.` : `${member} üyesine ait genel ses, mesaj ve davet istatistik bilgileri gösteriliyor. Menüyü kullanarak **günlük ve haftalık** verilerine bakabilirsin.`}`)
            .addFields( 
                { name: "Genel Mesaj", value: `${codeBlock("fix", `${messageData ? messageData.totalMessage : 0} mesaj`)}`, inline: true },
                { name: "Genel Ses", value: `${codeBlock("fix", moment.duration(voiceData ? voiceData.totalVoice : 0).format("H [saat], m [dakika], s [saniye]"))}`, inline: true },
                { name: "Genel Davet", value: `${codeBlock("fix", `${inviteData ? inviteData.total : 0} davet`)}`, inline: true },
                { name: "Sesli Kanal Sıralaması", value: `${voiceTop}`, inline: true },
                { name: "Metin Kanal Sıralaması", value: `${messageTop}`, inline: true },
            )        
            ]})

        })

    }
}
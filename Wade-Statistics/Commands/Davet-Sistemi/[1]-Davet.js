const { ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField, StringSelectMenuBuilder, ComponentType, EmbedBuilder } = require("discord.js")

const inviteSchema = require('../../Database/inviteSchema')

module.exports = {
    name: 'davetim',
    aliases: ['invites', 'davetlerim', 'davetler', 'davet'],
    description: "Davet Sistemi",
    discordPermissions: [],
    permissions: [],
    channels: [],
    ownerOnly: false,
    async execute(client, message, args, embed) {

        let member = message.mentions.members.first() || message.guild.members.resolve(args[0]) || message.member;

        let data = await inviteSchema.findOne({ guildID: message.guild.id, userID: member.id });

        message.channel.send({ embeds: [embed.setDescription(`${member.id === message.author.id ? `Selam ${member}, Aşağıda genel davet bilgilerin gösteriliyor.` : `${member} üyesine ait genel davet bilgileri gösteriliyor.` }
        
        Toplam **${data?.total || "0"}** ${member.id === message.author.id ? "davetin" : "daveti"} var. (Gerçek: \`${data?.regular || "0"}\`, Sahte: \`${data?.fake || "0"}\`, Çıkış: \`${data?.leave || "0"}\`)
        
        ${data?.inviterID === message.guild.id ? "**ÖZEL URL** ile giriş yapmış" : data?.inviterID == null ? "Sunucuya nasıl girdiğine dahil bir veri bulunamadı." : `<@${data?.inviterID}> kullanıcısı tarafından davet edilmiş`}`)] });


    }
}
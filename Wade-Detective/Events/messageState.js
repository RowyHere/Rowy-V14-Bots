const client = global.client;
const { AuditLogEvent, Events, EmbedBuilder, ButtonBuilder, ChannelType, codeBlock } = require('discord.js');

const botChannels = require("../Config/configChannels");

module.exports = {
    name: "messageDelete",
    async execute(message) {

        let logs = client.channels.cache.get(botChannels.messageLog)

        let fetchEntry = await message.guild.fetchAuditLogs({ type: AuditLogEvent.MessageDelete })
        let target = fetchEntry.entries.first()

        let embed = client.embed = new EmbedBuilder()
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
        .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true }) })
        .setColor('Random')
        .setTimestamp()

        if(message.content) {

            embed.setDescription(`
${message.author} kullanıcısı ${message.channel} kanalında __**mesajını sildi!**__
            
Kullanıcı: ${message.author} (\`${message.author.id} - ${message.author.tag}\`)
Kanal: ${message.channel} (\`${message.channel.id}\`)

Tarih: __<t:${Math.floor(Date.now() / 1000)}>__ (<t:${Math.floor(Date.now() / 1000)}:R>)
Mesaj: ${codeBlock("fix", message.content)}`)
            logs.wsend({ embeds: [embed] })
        }

        if(message.attachments.first()) {

            embed.setDescription(`
${message.author} kullanıcısı ${message.channel} kanalında __**paylaştığı fotoğrafı sildi!**__
                        
Kullanıcı: ${message.author} (\`${message.author.id} - ${message.author.tag}\`)
Kanal: ${message.channel} (\`${message.channel.id}\`)

Tarih: __<t:${Math.floor(Date.now() / 1000)}>__ (<t:${Math.floor(Date.now() / 1000)}:R>)`)
            embed.setImage(message.attachments.first().proxyURL)
            logs.wsend({ embeds: [embed] })

        }

    }
}
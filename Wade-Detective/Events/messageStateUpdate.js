const client = global.client;
const { AuditLogEvent, Events, EmbedBuilder, ButtonBuilder, ChannelType } = require('discord.js');

const botChannels = require("../Config/configChannels");

module.exports = {
    name: "messageUpdate",
    async execute(oldMessage, newMessage) {

        let logs = client.channels.cache.get(botChannels.messageLog)

        let embed = client.embed = new EmbedBuilder()
        .setAuthor({ name: oldMessage.guild.name, iconURL: oldMessage.guild.iconURL({ dynamic: true }) })
        .setFooter({ text: oldMessage.author.tag, iconURL: oldMessage.author.avatarURL({ dynamic: true }) })
        .setColor('Random')
        .setTimestamp()

        if(oldMessage.content !== newMessage.content) {

            embed.setDescription(`
${oldMessage.author} kullanıcısı ${oldMessage.channel} kanalında __**mesajını düzenledi!**__
            
Kullanıcı: ${oldMessage.author} (\`${oldMessage.author.id} - ${oldMessage.author.tag}\`)
Kanal: ${oldMessage.channel} (\`${oldMessage.channel.id}\`)

Eski Mesaj: __\`${oldMessage.content}\`__
Yeni Mesaj: __\`${newMessage.content}\`__ ([Mesaja git](${oldMessage.url}))

Tarih: __<t:${Math.floor(Date.now() / 1000)}>__ (<t:${Math.floor(Date.now() / 1000)}:R>)
`)
            logs.wsend({ embeds: [embed] })

        }


    }
}
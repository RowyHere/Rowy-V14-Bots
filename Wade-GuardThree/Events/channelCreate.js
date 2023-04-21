const botConfig =  require('../Config/config')
const botChannels = require('../Config/configChannels')

const { safeControl, punish } = require('../Handlers/functionHandler')
const { AuditLogEvent, ChannelType, EmbedBuilder } = require('discord.js')
const client = global.client;

module.exports = {
    name: 'channelCreate',
    async execute(channel) {

        let entry = await member.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.ChannelCreate }).then(x => x.entries.first());
        if(!entry || !entry.executor) return;
        let user = member.guild.members.resolve(entry.executor.id);

        const embed = new EmbedBuilder()
        .setColor("Random")
        .setFooter({
            text: `${botConfig.server.footer}`,
            iconURL: client.user?.displayAvatarURL({ dynamic: true })
        })
        .setTimestamp()

        let logChannel = client.channels.cache.get(botChannels.channelLog)

        let type;
        if((channel.type === ChannelType.GuildText) || (channel.type === ChannelType.GuildAnnouncement)) type = "`Yazı Kanalı`"
        if((channel.type === ChannelType.GuildVoice)) type = "`Ses Kanalı`"

        if(safeControl(member.guild.id, user.id)) {

            if(logChannel) return logChannel.send({ embeds: [embed.setDescription(`${user} adlı yetkili sunucuda kanal açtı, güvenilir listede olduğu için işlem uygulamadım.
                ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
                Yetkili: ${user} (\`${user.id}\`)
                Oluşturulan Kanal: ${channel.name} (\`${role.id}\`)
                Oluşturulan Kanal Türü: ${type}
                ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
                Tarih: <t:${Math.floor(Date.now() / 1000)}>`)
            ]})

        } else {
            punish(user.id, "jail")
            channel.delete({ reason: `Wade Channel Guard` })
            if(logChannel) logChannel.send({ embeds: [embed.setDescription(`${user} adlı yetkili sunucuda kanal açtı, eylemi gerçekleştiren kişiyi ses ve metin kanallarından uzaklaştırdım.
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Yetkili: ${user} (\`\`${user.id}\`\`)
            Oluşturulan Kanal: ${channel.name} (\`${role.id}\`)
            Oluşturulan Kanal Türü: ${type}
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Tarih: <t:${Math.floor(Date.now() / 1000)}>`)
        ]})
        }

    }
}
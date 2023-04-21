const botConfig =  require('../Config/config')
const botChannels = require('../Config/configChannels')

const { safeControl, punish } = require('../Handlers/functionHandler')
const { AuditLogEvent, ChannelType, EmbedBuilder } = require('discord.js')
const client = global.client;

module.exports = {
    name: 'channelDelete',
    async execute(channel) {

        let guild = role.guild;
        let entry = await guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.ChannelDelete }).then(audit => audit.entries.first());
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

            if(logChannel) return logChannel.send({ embeds: [embed.setDescription(`${user} adlı yetkili bir kanalı sildi, güvenilir listede olduğu için işlem uygulamadım.
                ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
                Yetkili: ${user} (\`${user.id}\`)
                Silinen Kanal: ${channel.name} (\`${channel.id}\`)
                Silinen Kanal Türü: ${type}
                ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
                Tarih: <t:${Math.floor(Date.now() / 1000)}>`)
            ]})
            

        } else {
            channel.clone({ reason: `Wade Channel Guard` }).then(async (hera) => {

                if(channel.parentId !== null) await hera.setParent(channel.parentId)
                await channel.setPosition(channel.position)

                if(channel.type === ChannelType.GuildCategory) await channel.guild.channels.cache.filter(damla_seni_seviyorum => damla_seni_seviyorum.parentId == channel.id).forEach(async (hera_kalp_rowy) => hera_kalp_rowy.setParent(hera.id))

            })
            punish(user.id, "ban")
            if(logChannel) logChannel.send({ embeds: [embed.setDescription(`${user} adlı yetkili bir kanalı sildi, eylemi gerçekleştiren kişiyi sunucudan uzaklaştırdım.
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Yetkili: ${user} (\`${user.id}\`)
            Silinen Kanal: ${channel.name} (\`${channel.id}\`)
            Silinen Kanal Türü: ${type}
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Tarih: <t:${Math.floor(Date.now() / 1000)}>`)
        ]})
        }

    }
}
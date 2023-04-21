const botConfig =  require('../Config/config')
const botChannels = require('../Config/configChannels')

const { safeControl, punish } = require('../Handlers/functionHandler')
const { AuditLogEvent, EmbedBuilder } = require('discord.js')
const client = global.client;

module.exports = {
    name: 'guildUpdate',
    async execute(oldGuild, newGuild) {
        let entry = await oldGuild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.GuildUpdate }).then(x => x.entries.first());
        if(!entry || !entry.executor) return;
        let user = oldGuild.members.resolve(entry.executor.id);

        const embed = new EmbedBuilder()
        .setColor("Random")
        .setFooter({
            text: `${botConfig.server.footer}`,
            iconURL: client.user?.displayAvatarURL({ dynamic: true })
        })
        .setTimestamp()

        let logChannel = client.channels.cache.get(botChannels.serverLog)

        if(safeControl(oldGuild.id, user.id)) {

            if(logChannel) return logChannel.send({ embeds: [embed.setDescription(`${user} adlı yetkili sunucu ayarlarını değiştirdi, güvenilir listede olduğu için işlem uygulamadım.
                ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
                Yetkili: ${user} (\`${user.id}\`)
                ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
                Tarih: <t:${Math.floor(Date.now() / 1000)}>`)
            ]})
            

        } else {
            punish(user.id, "ban")
            if(logChannel) logChannel.send({ embeds: [embed.setDescription(`${user} adlı yetkili sunucu ayarlarını değiştirdi, eylemi gerçekleştiren kişiyi sunucudan uzaklaştırdım.
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Yetkili: ${user} (\`${user.id}\`)
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Tarih: <t:${Math.floor(Date.now() / 1000)}>`)
        ]})
        }
    
        if(newGuild.name !== oldGuild.name) newGuild.setName(oldGuild.name, { reason: "Wade Server Guard" })
        if(oldGuild.iconURL() && newGuild.iconURL() !== oldGuild.iconURL()) newGuild.setIcon(oldGuild.iconURL({ dynamic: true }), { reason: "Wade Server Guard" })
        if(oldGuild.bannerURL() && newGuild.bannerURL() !== oldGuild.bannerURL()) newGuild.setBanner(oldGuild.bannerURL({ dynamic: true }), { reason: "Wade Server Guard" })

    }
}
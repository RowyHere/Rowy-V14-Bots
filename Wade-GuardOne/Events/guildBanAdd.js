const botConfig =  require('../Config/config')
const botChannels = require('../Config/configChannels')

const { safeControl, punish } = require('../Handlers/functionHandler')
const { AuditLogEvent, EmbedBuilder } = require('discord.js')
const client = global.client;

module.exports = {
    name: 'guildBanAdd',
    async execute(member) {

        let entry = await member.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.MemberBanAdd }).then(x => x.entries.first());
        if(!entry || !entry.executor) return;
        let user = member.guild.members.resolve(entry.executor.id);

        const embed = new EmbedBuilder()
        .setColor("Random")
        .setFooter({
            text: `${botConfig.server.footer}`,
            iconURL: client.user?.displayAvatarURL({ dynamic: true })
        })
        .setTimestamp()

        let logChannel = client.channels.cache.get(botChannels.banLog)

        if(safeControl(member.guild.id, user.id)) {

            if(logChannel) return logChannel.send({ embeds: [embed.setDescription(`${user} adlı yetkili ${member} adlı üyeyi sunucudan yasakladı, güvenilir listede olduğu için işlem uygulamadım.
                ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
                Yetkili: ${user} (\`${user.id}\`)
                Kullanıcı: ${member} (\`${member.id}\`)
                ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
                Tarih: <t:${Math.floor(Date.now() / 1000)}>`)
            ]})
            

        } else {
            punish(user.id, "jail")
            if(logChannel) logChannel.send({ embeds: [embed.setDescription(`${user} adlı yetkili ${member} adlı üyeyi sunucudan yasakladı, eylemi gerçekleştiren kişiyi ses ve metin kanallarından uzaklaştırdım.
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Yetkili: ${user} (\`\`${user.id}\`\`)
            Kullanıcı: ${member} (\`${member.id}\`)
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Tarih: <t:${Math.floor(Date.now() / 1000)}>`)
        ]})
        }

    }
}
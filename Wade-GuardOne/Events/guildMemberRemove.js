const botConfig =  require('../Config/config')
const botChannels = require('../Config/configChannels')

const { safeControl, punish } = require('../Handlers/functionHandler')
const { AuditLogEvent, EmbedBuilder } = require('discord.js')
const client = global.client;

module.exports = {
    name: 'guildMemberRemove',
    async execute(member) {

        let entry = await member.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.MemberKick }).then(x => x.entries.first());
        if(!entry || !entry.executor) return;
        let user = member.guild.members.resolve(entry.executor.id);

        let logChannel = client.channels.cache.get(botChannels.kickLog)

        if(safeControl(member.guild.id, user.id)) {

            if(logChannel) return logChannel.send({ embeds: [global.embed.setDescription(`${user} adlı yetkili ${member} adlı üyeyi sunucudan kickledi, güvenilir listede olduğu için işlem uygulamadım.
                ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
                Yetkili: ${user} (\`${user.id}\`)
                Kullanıcı: ${member.id} (\`${member.id}\`)
                ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
                Tarih: <t:${Math.floor(Date.now() / 1000)}>`)
            ]})
            

        } else {
            punish(user.id, "jail")
            if(logChannel) logChannel.send({ embeds: [global.embed.setDescription(`${user} adlı yetkili ${member} adlı üyeyi sunucudan kickledi, eylemi gerçekleştiren kişiyi ses ve metin kanallarından uzaklaştırdım.
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Yetkili: ${user} (\`${user.id}\`)
            Kullanıcı: ${member.id} (\`${member.id}\`)
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Tarih: <t:${Math.floor(Date.now() / 1000)}>`)
        ]})
        }

    }
}
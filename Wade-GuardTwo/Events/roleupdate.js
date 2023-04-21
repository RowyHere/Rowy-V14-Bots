const botConfig =  require('../Config/config')
const botChannels = require('../Config/configChannels')

const { safeControl, punish } = require('../Handlers/functionHandler')
const { AuditLogEvent, EmbedBuilder } = require('discord.js')
const client = global.client;

module.exports = {
    name: 'roleUpdate',
    async execute(oldRole, newRole) {

        let guild = role.guild;
        let entry = await guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.RoleUpdate }).then(audit => audit.entries.first());
        if(!entry || !entry.executor) return;
        let user = member.guild.members.resolve(entry.executor.id);

        const embed = new EmbedBuilder()
        .setColor("Random")
        .setFooter({
            text: `${botConfig.server.footer}`,
            iconURL: client.user?.displayAvatarURL({ dynamic: true })
        })
        .setTimestamp()

        let logChannel = client.channels.cache.get(botChannels.roleLog)

        if(safeControl(member.guild.id, user.id)) {

            if(logChannel) return logChannel.send({ embeds: [embed.setDescription(`${user} adlı yetkili bir rolü düzenledi, güvenilir listede olduğu için işlem uygulamadım.
                ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
                Yetkili: ${user} (\`${user.id}\`)
                Güncellenen Rol: ${role.name} (\`${role.id}\`)
                ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
                Tarih: <t:${Math.floor(Date.now() / 1000)}>`)
            ]})
            

        } else {
            newRole.edit(oldRole, { reason: `Wade Role Guard` })
            punish(user.id, "jail")
            if(logChannel) logChannel.send({ embeds: [embed.setDescription(`${user} adlı yetkili bir rolü düzenledi, eylemi gerçekleştiren kişiyi sunucudan uzaklaştırdım.
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Yetkili: ${user} (\`${user.id}\`)
            Güncellenen Rol: ${role.name} (\`${role.id}\`)
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Tarih: <t:${Math.floor(Date.now() / 1000)}>`)
        ]})
        }

    }
}

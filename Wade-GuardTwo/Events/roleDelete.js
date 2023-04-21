const botConfig =  require('../Config/config')
const botChannels = require('../Config/configChannels')

const { safeControl, punish } = require('../Handlers/functionHandler')
const { AuditLogEvent, EmbedBuilder } = require('discord.js')
const client = global.client;

module.exports = {
    name: 'roleDelete',
    async execute(role) {

        let guild = role.guild;
        let entry = await guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.RoleDelete }).then(audit => audit.entries.first());
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

            if(logChannel) return logChannel.send({ embeds: [embed.setDescription(`${user} adlı yetkili bir rolü sildi, güvenilir listede olduğu için işlem uygulamadım.
                ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
                Yetkili: ${user} (\`${user.id}\`)
                Silinen Rol: ${role.name} (\`${role.id}\`)
                ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
                Tarih: <t:${Math.floor(Date.now() / 1000)}>`)
            ]})
            

        } else {
            role.guild.roles.create({ name: role.name, reason: `Wade Role Guard`, permissions: role.permissions, color: role.color, position: role.position })
            punish(user.id, "ban")
            if(logChannel) logChannel.send({ embeds: [global.embed.setDescription(`${user} adlı yetkili bir rolü sildi, eylemi gerçekleştiren kişiyi sunucudan uzaklaştırdım.
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Yetkili: ${user} (\`${user.id}\`)
            Silinen Rol: ${role.name} (\`${role.id}\`)
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Tarih: <t:${Math.floor(Date.now() / 1000)}>`)
        ]})
        }

    }
}
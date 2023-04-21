const botConfig =  require('../Config/config')
const botChannels = require('../Config/configChannels')

const { safeControl, punish } = require('../Handlers/functionHandler')
const { AuditLogEvent, EmbedBuilder } = require('discord.js')
const client = global.client;

module.exports = {
    name: 'roleCreate',
    async execute(role) {

        let entry = await member.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.RoleCreate }).then(x => x.entries.first());
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

            if(logChannel) return logChannel.send({ embeds: [embed.setDescription(`${user} adlı yetkili sunucuda rol açtı, güvenilir listede olduğu için işlem uygulamadım.
                ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
                Yetkili: ${user} (\`${user.id}\`)
                Oluşturulan Rol: ${role.name} (\`${role.id}\`)
                ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
                Tarih: <t:${Math.floor(new Date.now() / 1000)}>`)
            ]})

        } else {
            punish(user.id, "jail")
            role.delete({ reason: `Wade Role Guard` })
            if(logChannel) logChannel.send({ embeds: [global.embed.setDescription(`${user} adlı yetkili sunucuda rol açtı, eylemi gerçekleştiren kişiyi ses ve metin kanallarından uzaklaştırdım.
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Yetkili: ${user} (\`\`${user.id}\`\`)
            Oluşturulan Rol: ${role.name} (\`${role.id}\`)
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Tarih: <t:${Math.floor(new Date.now() / 1000)}>`)
        ]})
        }

    }
}
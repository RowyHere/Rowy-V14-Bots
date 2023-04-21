const client = global.client;
const { AuditLogEvent, Events, EmbedBuilder, ButtonBuilder } = require('discord.js');

const botChannels = require("../Config/configChannels");

module.exports = {
    name: "guildMemberUpdate",
    async execute(oldMember, newMember) {

        let logs = client.channels.cache.get(botChannels.roleLog)
        let fetchRole = await oldMember.guild.fetchAuditLogs({ type: AuditLogEvent.MemberRoleUpdate })
        let target = fetchRole.entries.first()
        
        if(target.target.id == oldMember.id) {
        let isRemove = []
        oldMember.roles.cache.forEach(x => {
            if(!newMember.roles.cache.has(x.id)) isRemove.push(x.id)
        })
        let isAdd = []
        newMember.roles.cache.forEach(x => {
            if(!oldMember.roles.cache.has(x.id)) isAdd.push(x.id)
        })

        let embed = client.embed = new EmbedBuilder()
        .setAuthor({ name: oldMember.guild.name, iconURL: oldMember.guild.iconURL({ dynamic: true }) })
        .setFooter({ text: target.executor.tag, iconURL: target.executor.avatarURL({ dynamic: true }) })
        .setColor('Random')
        .setTimestamp()

        if(newMember.roles.cache.size < oldMember.roles.cache.size) {

        embed.setDescription(`${isRemove.map(x => `<@&${x}>`)} ${isRemove.length > 1 ? "rolleri" : "rolü"} ${oldMember} kullanıcısından, ${target.executor} tarafından __kaldırıldı.__`)
        embed.addFields(
            { name: "Eski Rolleri", value: `${oldMember.roles.cache.filter(x => x.id !== oldMember.guild.id).size > 0 ? oldMember.roles.cache.filter(x => x.id !== oldMember.guild.id).map(x => `<@&${x.id}>`).join(",") : "Üyenin önceki rolü bulunmuyor."}`},
            { name: "Yeni Rolleri", value: `${newMember.roles.cache.filter(x => x.id !== newMember.guild.id).size > 0 ? `${newMember.roles.cache.filter(x => x.id !== newMember.guild.id).map(x => `<@&${x.id}>`).join(",")} (Çıkartılan Rol: ${isRemove.map(x => `<@&${x}>`)})` : "Üyenin yeni rolü bulunmuyor."}`}
    
        )
        logs.wsend({ embeds: [embed]})

        } else {


        embed.setDescription(`${isAdd.map(x => `<@&${x}>`)} ${isAdd.length > 1 ? "rolleri" : "rolü"} ${oldMember} kullanıcısına, ${target.executor} tarafından __eklendi.__`)
        embed.addFields(
            { name: "Eski Rolleri", value: `${oldMember.roles.cache.filter(x => x.id !== newMember.guild.id).size > 0 ? `${oldMember.roles.cache.filter(x => x.id !== oldMember.guild.id).map(x => `<@&${x.id}>`).join(",")}` : "Üyenin önceki rolü bulunmuyor."}`},
            { name: "Yeni Rolleri", value: `${newMember.roles.cache.filter(x => x.id !== newMember.guild.id).size > 0 ? `${newMember.roles.cache.filter(x => x.id !== newMember.guild.id).map(x => `<@&${x.id}>`).join(",")} (Eklenen Rol: ${isAdd.map(x => `<@&${x}>`)})` : "Üyenin yeni rolü bulunmuyor."}`}
        )
        logs.wsend({ embeds: [embed]})

        }
    }

    }
}
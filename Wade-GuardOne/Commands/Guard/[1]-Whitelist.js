const { ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField, StringSelectMenuBuilder, ComponentType, EmbedBuilder, codeBlock } = require("discord.js")
const config = require('../../Config/config')

const guard = require('../../Database/Whitelist')

module.exports = {
    name: 'wl',
    aliases: ['whitelist'],
    description: "Koruma Sistemi",
    discordPermissions: [],
    permissions: [],
    channels: [],
    ownerOnly: true,
    async execute(client, message, args, embed) {

        let target;
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(role) target = role
        if(member) target = member

        if(!target) return message.reply({ embeds: [embed.setDescription(`Selam ${message.author}, **${message.guild.name}** sunucusu için güvenlik sistemine hoşgeldin!\n\nGüvenilir listeye rol eklemek/çıkarmak için;\n\` > \` \`${config.prefix}whitelist <@Role/ID>\`\nGüvenilir listeye üye eklemek/çıkarmak için;\n\` > \` \`${config.prefix}whitelist <@Rowy/ID>\``)] })
        let data = await guard.findOne({ guildID: message.guild.id })

        if(data?.whitelist.find(x => x.id === target.id)) await guard.updateOne({ guildID: message.guild.id }, { $pull: { whitelist: { id: `${target.id}`} }})
        else await guard.findOneAndUpdate({ guildID: message.guild.id }, { $push: { whitelist: { type: `${target.id === role?.id ? "role" : "member"}`, id: `${target.id}`}}}, { upsert: true })
        let data2 = await guard.findOne({ guildID: message.guild.id })

        message.reply({ embeds: [embed
        
        .setDescription(`
        Selam ${message.author}, ${data?.whitelist.find(x => x.id === target.id) ? `güvenilir listeden başarılı bir şekilde ${target.id === role?.id ? `${role} rolünü çıkardım.` : `${member} üyesini çıkardım.`}` : `güvenilir listeye başarılı bir şekilde ${target.id === role?.id ? `${role} rolünü ekledim.` : `${member} üyesini ekledim`}`}

        Güvenilir Üyeler: ${data2?.whitelist?.filter(x => x.type === "member").map(x => `<@${x.id}>`).join(`, `) || "Güvenilir üye bulunmuyor."}
        Güvenilir Roller: ${data2?.whitelist?.filter(x => x.type === "role").map(x => `<@&${x.id}>`).join(`, `) || "Güvenilir rol bulunmuyor."}
        
        Tam Güvenilir Üyeler: ${config.owners.map(x => `<@${x}>`).join(`, `)}`)]})

    }
}
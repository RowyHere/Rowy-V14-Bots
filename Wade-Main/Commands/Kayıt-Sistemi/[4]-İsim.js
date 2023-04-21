const userSchema = require("../../Database/userSchema")
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField } = require("discord.js")
const emojis = require("../../Config/configEmojis")
const roles = require("../../Config/configRoles")
const config = require("../../Config/config")
const channels = require("../../Config/configChannels")

module.exports = {
    name: 'isim',
    aliases: ['nick'],
    description: "İsim Sistemi",
    discordPermissions: [PermissionsBitField.Flags.ManageNicknames],
    permissions: [...roles.Register.staffRoles, ...roles.Moderation.commanderRoles],
    channels: [],
    ownerOnly: false,
    async execute(client, message, args, embed) {

        args = args.filter(a => a !== "" & a !== " ").splice(1)

        let member = message.mentions.members.first() || message.guild.members.resolve(args[0]);
        let name = args.filter(x => isNaN(x)).map(x => x.charAt(0).toLocaleUpperCase("TR")+x.slice(1)).join(" ");
        let age = args.filter(x => !isNaN(x))[0];

        if(!member || !name || !age) return message.reply({ embeds: [embed.setDescription(`Lütfen bir **${!member ? "üye" : !name ? "isim" : "yaş"}** belirtiniz.`)] }).delete(5)
        if(member.id === message.author.id) return message.reply({ embeds: [embed.setDescription(`Kendi isminizi değiştiremezsiniz.`)] }).delete(5)
        if(member.id === client.user.id) return message.reply({ embeds: [embed.setDescription(`Botun isminiz değiştiremezsiniz.`)] }).delete(5)
        if(member.id === message.guild.ownerId) return message.reply({ embeds: [embed.setDescription(`Sunucu sahibinin ismini değişemezsin.`)] }).delete(5)
        if(age < config.server.minAge) return message.reply({ embeds: [embed.setDescription(`Sunucumuza minimum yaşı **${config.server.minAge}** ve üstü olan kişiler kayıt olabilir.`)]})
        
        let fixNamed = `${member.user.username.includes(config.server.tag) || member.user.discriminator.includes(config.server.discrimTag) ? config.server.noTag : config.server.noTag} ${name} ' ${age}`
        await member.setNickname(fixNamed)

        client.channels.resolve(channels.Logs.nameLog).send({ content: `**${member.user.username}#${member.user.discriminator}** adı, **${message.author.tag}** tarafından <t:${Math.floor(Date.now() / 1000)}> tarihinde (<t:${Math.floor(Date.now() / 1000)}:R>) \`${fixNamed}\` olarak değiştirildi.` })
        await userSchema.findOneAndUpdate({ guildID: message.guild.id, userID: member.id }, { $push: { names: { name: fixNamed, type: "İsim Değiştirme", executor: `<@${message.author.id}>` }}, }, { upsert: true })

    }
}
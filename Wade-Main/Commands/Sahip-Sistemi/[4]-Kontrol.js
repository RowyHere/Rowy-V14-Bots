const { ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField, StringSelectMenuBuilder, ComponentType, EmbedBuilder, parseEmoji } = require("discord.js")

const botRoles = require("../../Config/configRoles")
const botConfig = require("../../Config/config")
const botEmojis = require("../../Config/configEmojis")
const botSilents = require("../../Config/configSilent")
const botChannels = require("../../Config/configChannels")

const userSchema = require("../../Database/userSchema")
const punishSchema = require("../../Database/punishSchema")
const infractionSchema = require("../../Database/infractionSchema")

module.exports = {
    name: "kontrol",
    aliases: ['control'],   
    description: "Kontrol Sistemi",
    discordPermissions: [PermissionsBitField.Flags.Administrator],
    permissions: [botRoles.Moderation.commanderRoles],
    channels: [],
    ownerOnly: false,
    async execute(client, message, args, embed) {

        let row = new ActionRowBuilder()
        .addComponents(

            new ButtonBuilder()
                .setCustomId("untagges")
                .setStyle(ButtonStyle.Secondary)
                .setLabel("Tag Dağıt"),
            new ButtonBuilder()
                .setCustomId("unroles")
                .setStyle(ButtonStyle.Secondary)
                .setLabel("Rolsüz Dağıt")

        )

        const totalTagges = message.guild.members.cache.filter(member => member.user.username.includes(botConfig.server.tag) || member.user.discriminator === botConfig.server.discrimTag && !member.roles.cache.has(botRoles.Register.tagRoles)).size
        const totalEveryone = message.guild.members.cache.filter(member => member.roles.cache.filter(roles => roles.id !== message.guild.id).size == 0).size

        let msg = await message.reply({ components: [row], embeds: [embed.setDescription(`Merhaba, \`${message.guild.name}\` sunucusu içerisi kontrol ekranına hoş geldin!\n\n\` > \` Tagı olup rolü olmayan kullanıcı sayısı: **${totalTagges}**\n\` > \` Hiç bir rolü bulunmayan kullanıcı sayısı: **${totalEveryone}**`)]})
        let collector = msg.createMessageComponentCollector({ time: 30*1000, max: 1 })


        collector.on("collect", async (interaction) => {
            if(interaction.user.id !== message.author.id) return interaction.reply({ embeds: [embed.setDescription(`Bu komutu sadece **${message.author.tag}** kullanabilir.`)], ephemeral: true })

            switch (interaction.customId) {

                case "untagges":

                    let tagges = message.guild.members.cache.filter(member => member.user.username.includes(botConfig.server.tag) || member.user.discriminator === botConfig.server.discrimTag && !member.roles.cache.has(botRoles.Register.tagRoles))

                    interaction.reply({ embeds: [embed.setDescription(`\`${tagges.size}\` adet kullanıcıya tag rolü veriliyor.`)], ephemeral: true })

                    tagges.map(x => x.roles.add(botRoles.Register.tagRoles))

                break;

                case "unroles":

                    let roles = message.guild.members.cache.filter(member => member.roles.cache.filter(roles => roles.id !== message.guild.id).size == 0)

                    interaction.reply({ embeds: [embed.setDescription(`\`${roles.size}\` adet kullanıcıya rol veriliyor.`)], ephemeral: true })

                    roles.map(x => x.roles.add(botRoles.Register.unregRoles))

                break;

            }

        })

    }
}
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField, StringSelectMenuBuilder, ComponentType, EmbedBuilder, AttachmentBuilder } = require("discord.js")

const botRoles = require("../../Config/configRoles")
const botConfig = require("../../Config/config")
const botEmojis = require("../../Config/configEmojis")
const botSilents = require("../../Config/configSilent")
const botChannels = require("../../Config/configChannels")

const userSchema = require("../../Database/userSchema")
const punishSchema = require("../../Database/punishSchema")
const infractionSchema = require("../../Database/infractionSchema")

module.exports = {
    name: 'bilgi',
    aliases: ['info','profil'],
    description: "Bilgi Sistemi",
    discordPermissions: [],
    permissions: [],
    channels: [],
    ownerOnly: false,
    async execute(client, message, args, embed) {

        let member = message.mentions.members.first() || message.guild.members.resolve(args[0]) || message.member
        await client.users.fetch(member.id, { force: true })

        let row = new ActionRowBuilder()
        .addComponents(

            new StringSelectMenuBuilder()
            .setCustomId('gereksiz')
            .setPlaceholder('Banner/Avatarını görüntülemek için tıkla!')
            .addOptions([
                {
                    label: 'Profil',
                    description: 'Kullanıcının profilini görüntülersiniz.',
                    value: 'profil',
                },
                {
                    label: 'Banner',
                    description: 'Kullanıcının bannerini görüntülersiniz.',
                    value: 'banner',
                },
                {
                    label: 'Avatar',
                    description: 'Kullanıcının avatarını görüntülersiniz.',
                    value: 'avatar',
                },
            ])

        )

        const joinPosFilter = [...message.guild.members.cache.filter(x => !x.user.bot).values()].sort((a, b) => a.joinedTimestamp - b.joinedTimestamp);
        const joinPos = joinPosFilter.map((u) => u.id).indexOf(member.id);

        let msg = await message.reply({ components: [row], embeds: [
            embed
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 2048 }))
            .addFields({ name: 'Kullanıcı Bilgileri', value: `\`•\` Hesap: ${member.user.tag} (${member})\n\`•\` Kullanıcı ID: ${member.user.id}\n\`•\` Kuruluş Tarihi: <t:${Math.floor(member.user.createdTimestamp / 1000)}> - (<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>)` })
            .addFields({ name: 'Sunucu Bilgileri', value: `\`•\` Sunucudaki İsmi: ${member.displayName ? member.displayName : member.user.username}\n\`•\` Katılım Tarihi: <t:${Math.floor(member.joinedTimestamp / 1000)}> - (<t:${Math.floor(member.joinedTimestamp / 1000)}:R>)\n\`•\` Katılım Sırası: ${joinPos}/${message.guild.memberCount}` })
            .addFields({ name: 'Diğer Bilgileri', value: `\`•\` Davet eden: **EKLENECEK**` })
        ]})

        let collector = msg.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 3 * 60000 })

        collector.on('collect', async (interaction) => {
            
                if(interaction.user.id !== message.author.id) return interaction.reply({ content: `Bu menüyü sadece <@${message.author.id}> kullanabilir.!`, ephemeral: true })
            
                switch(interaction.values[0]){

                    case 'profil':

                    interaction.update({ content: ``, components: [row], embeds: [embed], files: [] }).catch(err => {})

                    break;

                    case 'banner':

                    let attachment = new AttachmentBuilder(`${member.user.bannerURL({ dynamic: true, size: 2048 })}`, { name: `banner.png`})
                    if(member.user.bannerURL() === null) return interaction.update({ content: `[ \`${member.user.tag}\` ]\nKullanıcının bannerı bulunmamakta.`, components: [row], embeds: []})

                    interaction.update({ content: `[ \`${member.user.tag}\` ]`, components: [row], embeds: [], files: [attachment]})

                    break;

                    case 'avatar':

                    let attachment2 = new AttachmentBuilder(`${member.user.displayAvatarURL({ dynamic: true, size: 2048 })}`, { name: `avatar.png`})
                    if(member.user.displayAvatarURL() === null) return interaction.update({ content: `[ \`${member.user.tag}\` ]\nKullanıcının avatarı bulunmamakta.`, components: [row], embeds: []})

                    interaction.update({ content: `[ \`${member.user.tag}\` ]`, components: [row], embeds: [], files: [attachment2]})

                    break;

                }

        })

    }
}
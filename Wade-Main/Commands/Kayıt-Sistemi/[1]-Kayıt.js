const userSchema = require("../../Database/userSchema")
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField } = require("discord.js")
const emojis = require("../../Config/configEmojis")
const roles = require("../../Config/configRoles")
const config = require("../../Config/config")
const channels = require("../../Config/configChannels")

module.exports = {
    name: 'kayıt',
    aliases: ['kayit','erkek','kadin','kiz','kız','e','k','man','woman'],
    description: "Kayıt Sistemi",
    discordPermissions: [PermissionsBitField.Flags.ManageRoles],
    permissions: [...roles.Register.staffRoles, ...roles.Moderation.commanderRoles],
    channels: [channels.Register.registerChat],
    ownerOnly: false,
    async execute(client, message, args, embed) {

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        args = args.filter(a => a !== "" & a !== " ").splice(1)
        let name = args.filter(x => isNaN(x)).map(x => x.charAt(0).toLocaleUpperCase("TR")+x.slice(1)).join(" ");
        let age = args.filter(x => !isNaN(x))[0];

        if(!member || !name || !age) return message.reply({ embeds: [embed.setDescription(`Lütfen bir **${!member ? "üye" : !name ? "isim" : "yaş"}** belirtiniz.`)] }).delete(5)
        if(member.id === message.author.id) return message.reply({ embeds: [embed.setDescription(`Kendinizi kayıt edemezsiniz.`)] }).delete(5)
        if(member.id === client.user.id) return message.reply({ embeds: [embed.setDescription(`Botu kayıt edemezsiniz.`)] }).delete(5)
        if(member.id === message.guild.ownerId) return message.reply({ embeds: [embed.setDescription(`Sunucu sahibini kayıt edemezsiniz.`)] }).delete(5)
        if(age < config.server.minAge) return message.reply({ embeds: [embed.setDescription(`Sunucumuza minimum yaşı **${config.server.minAge}** ve üstü olan kişiler kayıt olabilir.`)]})
        if(member.roles.highest.position >= message.member.roles.highest.position) return message.reply({ embeds: [embed.setDescription(`Belirtilen üyenin rolü sizden yüksek veya aynı.`)] }).delete(5)
        
        const row = new ActionRowBuilder()
        .addComponents([
            new ButtonBuilder()
            .setCustomId("erkek")
            .setLabel("Erkek")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(emojis.Register.manEmoji),
            new ButtonBuilder()
            .setCustomId("kadin")
            .setLabel("Kadın")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(emojis.Register.womanEmoji),
            new ButtonBuilder()
            .setCustomId("iptal")
            .setLabel("İptal")
            .setStyle(ButtonStyle.Danger)
            .setEmoji(emojis.Register.cancelEmoji)
        ])

        const eRow = new ActionRowBuilder()
        .addComponents([
            new ButtonBuilder()
            .setCustomId("erkek")
            .setLabel("Erkek")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(emojis.Register.manEmoji)
            .setDisabled(true),
        ])

        const kRow = new ActionRowBuilder()
        .addComponents([
            new ButtonBuilder()
            .setCustomId("kadin")
            .setLabel("Kadın")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(emojis.Register.womanEmoji)
            .setDisabled(true),
        ])

        const iRow = new ActionRowBuilder()
        .addComponents([
            new ButtonBuilder()
            .setCustomId("iptal")
            .setLabel("İptal")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(emojis.Register.cancelEmoji)
            .setDisabled(true),
        ])

        let fixNamed = `${member.user.username.includes(config.server.tag) || member.user.discriminator.includes(config.server.discrimTag) ? config.server.noTag : config.server.noTag} ${name} ' ${age}`

        let userData = await userSchema.findOne({ guildID: message.guild.id, userID: member.id })
        let names;
        if(!userData?.names) names = "Kullanıcının veritabanında geçmiş isimleri bulunmuyor."
        else names = userData.names.reverse().slice(0, 10).map((x, i) => `\` ${i+1} \` \` ${x.name} \` (${x.type} - ${x.executor})`).join("\n")

        message.reply({ embeds: [embed.setDescription(`${member} adlı kullanıcının adı \` ${fixNamed} \` olarak değiştirilecek.

        **Kullanıcının geçmiş isimleri;**
        ${names}
        
        Kullanıcının önceki isimlerine ${config.prefix}isimler ${member} komutuyla bakarak kayıt işlemini gerçekleştirmeniz önerilir.`)], components: [row] }).then(async msg => {

            const collector = await msg.createMessageComponentCollector({ time: 30 * 1000, max: 1 });

            collector.on("collect", async (i) => {

                if(i.user.id !== message.author.id) return i.reply({ embeds: [embed.setDescription(`Bu işlemi sadece ${message.author} yapabilir.`)], ephemeral: true }).delete(5)

                if(i.customId === "erkek") {

                    await member.roles.set(roles.Register.manRoles)
                    await member.setNickname(fixNamed)
                    i.update({ embeds: [embed.setDescription(`${member} adlı kullanıcının adı \` ${fixNamed} \` olarak değiştirildi.`)], components: [eRow] })
                }

                if(i.customId === "kadin") {

                    await member.roles.set(roles.Register.womanRoles)
                    await member.setNickname(fixNamed)
                    i.update({ embeds: [embed.setDescription(`${member} adlı kullanıcının adı \` ${fixNamed} \` olarak değiştirildi.`)], components: [kRow] })

                }

                if(i.customId === "iptal") return i.update({ embeds: [embed.setDescription(`İşlem iptal edildi.`)], components: [iRow] })

                client.channels.resolve(channels.Register.generalChat).send({ content: `${member}, Aramıza hoşgeldin! Hadi herkes ona merhaba desin :wave:` }).delete(10)
                client.channels.resolve(channels.Logs.registerLog).send({ content: `**${member.user.username}#${member.user.discriminator}**, **${message.author.tag}** tarafından <t:${Math.floor(Date.now() / 1000)}> tarihinde (<t:${Math.floor(Date.now() / 1000)}:R>) \`${i.customId === "erkek" ? "Erkek" : "Kadın"}\` olarak kayıt edildi.` })
                await userSchema.findOneAndUpdate({ guildID: i.guild.id, userID: member.id }, { $push: { names: { name: fixNamed, type: i.customId === "erkek" ? roles.Register.manRoles.map(x => `<@&${x}>`) : roles.Register.womanRoles.map(x => `<@&${x}>`), executor: `<@${message.author.id}>` }}, }, { upsert: true })

            })

        })
    }
}
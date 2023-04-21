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
    name: 'git',
    aliases: [],
    description: "Git Sistemi",
    discordPermissions: [],
    permissions: [],
    channels: [],
    ownerOnly: false,
    async execute(client, message, args, embed) {

        let member = message.mentions.members.first() || message.guild.members.resolve(args[0]);
        if(!member) return message.channel.send({ embeds: [embed.setDescription(`Lütfen bir ${member == undefined ? "**üye**" : ""} belirtin.`)] }).delete(5)
        if(!message.member.voice.channel) return message.channel.send({ embeds: [embed.setDescription(`Herhangi bir ses kanalında bulunmuyorsunuz.`)]}).delete(5)
        if(member.user.bot) return message.channel.send({ embeds: [embed.setDescription(`Belirttiğiniz üye bir bot.`)] }).delete(5)
        if(member.user.id === message.author.id) return message.channel.send({ embeds: [embed.setDescription(`Kendinize gitemezsiniz.`)] }).delete(5)
        if(!member.voice.channel) return message.channel.send({ embeds: [embed.setDescription(`Belirttiğiniz üye ses kanalında bulunmuyor.`)] }).delete(5)
        if(message.member.voice.channel === member.voice.channel) return message.channel.send({ embeds: [embed.setDescription(`Belirttiğiniz üye ile aynı ses kanalında bulunuyorsunuz.`)] }).delete(5)
    
        let row = new ActionRowBuilder()
        .addComponents(
    
            new ButtonBuilder()
            .setStyle(ButtonStyle.Success)
            .setCustomId('onayla')
            .setLabel('Kabul Et'),
            new ButtonBuilder()
            .setStyle(ButtonStyle.Danger)
            .setCustomId('reddet')
            .setLabel('Reddet')
    
        )

        message.channel.send({ embeds: [embed.setDescription(`${member}, ${message.author} kullanıcısı bulunduğunuz sesli odaya (${member.voice.channel}) gelmek istiyor. Kabul ediyor musun?`)], components: [row] }).then(async (msg) => {

            let collector = msg.createMessageComponentCollector({ ComponentType: 2, time: 30000 });
            collector.on('collect', async (button) => {
    
                if(button.user.id !== member.id) return button.reply({ content: `Bu butonu sadece ${member} kullanıcısı kullanabilir.`, ephemeral: true });
                if(button.customId === 'onayla') {
    
                    button.deferUpdate();
                    await message.member.voice.setChannel(member.voice.channel);
                    if(msg) msg.edit({ embeds: [embed.setDescription(`${member}, ${message.author} kullanıcısı bulunduğunuz sesli odaya (${member.voice.channel}) gelmek istedi. Kabul etti.`)], components: [] }).delete(15)
                    collector.stop();
    
                } else if(button.customId === 'reddet') {
    
                    button.deferUpdate();
                    if(msg) msg.edit({ embeds: [embed.setDescription(`${member}, ${message.author} kullanıcısı bulunduğunuz sesli odaya (${member.voice.channel}) gelmek istedi. Reddetti.`)], components: [] }).delete(15)
                    collector.stop();
    
                }
    
            })
        })

    }
}
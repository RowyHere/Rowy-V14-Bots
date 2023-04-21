const config =  require('../Config/config')
const { EmbedBuilder, PermissionsBitField } = require('discord.js')

const botRoles = require("../Config/configRoles")
const botConfig = require("../Config/config")
const botEmojis = require("../Config/configEmojis")
const botSilents = require("../Config/configSilent")
const botChannels = require("../Config/configChannels")

const afkSchema = require("../Database/afkSchema")
const userSchema = require("../Database/userSchema")
const rolesSchema = require('../Database/rolesSchema')
const punishSchema = require("../Database/punishSchema")
const infractionSchema = require("../Database/infractionSchema")

const iltifatSayi = 0;

module.exports = {
    name: 'messageCreate',
    async execute(message) {

        let adb = await afkSchema.findOne({ guildID: botConfig.server.sunucuID, userID: message.author.id });
        if(adb) {

            message.reply({ embeds: [new EmbedBuilder().setColor('Random').setDescription(`Başarıyla afk modundan çıktınız. <t:${Math.floor(adb.date / 1000)}> (<t:${Math.floor(adb.date / 1000)}:R>) tarihinden beri AFK'ydınız.`)] }).delete(15)
            await afkSchema.deleteOne({ guildID: message.guild.id, userID: message.author.id });
            if(message.member.manageable && message.member.displayName.includes("[AFK]")) await message.member.setNickname(message.member.displayName.replace("[AFK]", ""));
    
        }
        if(!message.content.startsWith(config.prefix) && message.mentions.members.first()) {
        let adb2 = await afkSchema.findOne({ guildID: botConfig.server.sunucuID, userID: message.mentions.members.first().id });
        if(!adb2) return;
        message.reply({ embeds: [new EmbedBuilder().setColor('Random').setDescription(`${message.mentions.members.first()} kullanıcısı \`${adb2.reason}\` sebebiyle, <t:${Math.floor(adb2.date / 1000)}:R> afk oldu!.`)] }).then(x => setTimeout(() => x.delete(), 10000));
        }

        let client = message.client;
        let prefix = config.prefix;

        if(message.channel.id === botChannels.generalChat) {
            iltifatSayi ++;
            if(iltifatSayi >= 50) {
            iltifatSayi = 0;
            message.reply({content: botConfig.server.iltifatList[Math.floor(Math.random() * botConfig.server.iltifatList.length)]})
            }
        }

        let content = message.content.toLowerCase()
        if(content === "tag" || content === "!tag" || content === ".tag" || content === "tag at") {
    
            message.channel.send({ content: `${botConfig.server.tag+", \`#" + botConfig.server.discrimTag}\``})
    
        }

        if(!message.content.startsWith(prefix)) return

        let args = message.content.slice(prefix.length).trim().split(/ +/g);
        let command = args.shift().toLocaleLowerCase("TR");

        let cmd = client.commands.get(command) || client.commands.find(x => x.aliases.includes(command))
        if(!cmd) return;

        const embed = new EmbedBuilder()
        .setAuthor({
            name: message.author.username,
            iconURL: message.author.displayAvatarURL({ dynamic: true })
        })
        .setColor("Random")
        .setFooter({
            text: `${config.server.footer}`,
            iconURL: client.user?.displayAvatarURL({ dynamic: true })
        })
        .setTimestamp()

        if(cmd.ownerOnly) {

            if(!config.owners.includes(message.author.id)) return message.reply({ embeds: [embed.setDescription(`Bu komutu sadece geliştiri${config.owners.length > 1 ? "cilerim" : "cim"} kullanabilir.`)] }).delete(10) 

        }

        if(cmd.channels?.length > 0) {

            if(!cmd.channels.some(x => message.channel.id === x)) return message.reply({ embeds: [embed.setDescription(`Bu komutu bu kanalda kullanamazsin.`)] }).delete(10)

        }

        if(cmd.permissions?.length > 0 || cmd.discordPermissions?.length > 0) {

            if(![...cmd.permissions].some(x => message.member.roles.cache.has(x)) && ![...cmd.discordPermissions].some(x => message.member.permissions.has(x))) return message.reply({ embeds: [embed.setDescription(`Bu komutu kullanmak için yeterli yetkiniz bulunmamaktadır.`)] }).delete(10)

        }

        if(cmd) {
            cmd.execute(client, message, args, embed)
        }

    }
}
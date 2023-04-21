const { ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField, StringSelectMenuBuilder, ComponentType, EmbedBuilder, AttachmentBuilder } = require("discord.js")

const botRoles = require("../../Config/configRoles")
const botConfig = require("../../Config/config")
const botEmojis = require("../../Config/configEmojis")
const botSilents = require("../../Config/configSilent")
const botChannels = require("../../Config/configChannels")

const userSchema = require("../../Database/userSchema")
const punishSchema = require("../../Database/punishSchema")
const infractionSchema = require("../../Database/infractionSchema")

const Canvas = require('canvas')

module.exports = {
    name: "ship",
    aliases: [],
    description: "ship",
    category: "General",

    discordPermissions: [],
    permissions: [],
    botSahip: false,
    
    async execute(client, message, args, embed) {

        const canvas = Canvas.createCanvas(700, 250);
        const ctx = canvas.getContext('2d');

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.filter(x => x.user.bot === false && [...botRoles.Register.manRoles].some(r => message.member.roles.cache.get(r) ? [...botRoles.Register.womanRoles].some(r => x.roles.cache.get(r)) : [...botRoles.Register.manRoles].some(r => x.roles.cache.get(r)))).random()
        let background = await Canvas.loadImage("https://i.hizliresim.com/t8jxzi4.jpg")
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        let avatar = await Canvas.loadImage(`${message.author.avatarURL({ extension: "png" })}`);
        ctx.drawImage(avatar, 100, 25, 200, 200);

        let shipAvatar = await Canvas.loadImage(`${member.user.avatarURL({ extension: "png" })}`);
        ctx.drawImage(shipAvatar, 400, 25, 200, 200);
        let random;
        if(botConfig.owners.includes(message.author.id)) {
            random = 100
        } if(message.author.id === "852628541634773063") {
            random = -100
        } else {
            random = Math.floor(Math.random() * 99) + 1
        }

        const heart = await Canvas.loadImage('https://i.hizliresim.com/oruku2f.png');
        const maybe = await Canvas.loadImage('https://i.hizliresim.com/xt09xsi.png');
        const sad = await Canvas.loadImage('https://i.hizliresim.com/4dem6rr.png');

        let shipdurum;
        if(random < 10) shipdurum = "💔💔💔💔💔💔💔💔💔💔";
        if(random >= 10 && random < 20) shipdurum = "💖💔💔💔💔💔💔💔💔💔";
        if(random >= 20 && random < 30) shipdurum = "💖💖💔💔💔💔💔💔💔💔";
        if(random >= 30 && random < 40) shipdurum = "💖💖💖💔💔💔💔💔💔💔";
        if(random >= 40 && random < 50) shipdurum = "💖💖💖💖💔💔💔💔💔💔";
        if(random >= 50 && random < 60) shipdurum = "💖💖💖💖💖💔💔💔💔💔";
        if(random >= 60 && random < 70) shipdurum = "💖💖💖💖💖💖💔💔💔💔";
        if(random >= 70 && random < 80) shipdurum = "💖💖💖💖💖💖💖💔💔💔";
        if(random >= 80 && random < 90) shipdurum = "💖💖💖💖💖💖💖💖💔💔";
        if(random >= 90 && random < 98) shipdurum = "💖💖💖💖💖💖💖💖💖💔";
        if(random >= 98) shipdurum = "💖💖💖💖💖💖💖💖💖💖";

        let random30 = [
            "Bu iş olmaz sen bunu unut.",
            "Bu ilişkiyi bence bitirin.",
            "Biraz çabalarsan bir şeyler hisseticek."
        ]

        let random3070 = [
            "Eh biraz biraz bir şeyler var gibi.",
            "Azıcıkta olsa bir şeyler hissediyor sana :)"
        ]

        let random70 = [
            "Biraz daha uğraşırsan bu iş olacak gibi :)",
            "Biraz daha çabalarsanız olucak gibi?"
        ]

        if(random >= 70) {

            ctx.drawImage(heart, 275, 60, 150, 150);
            
            let attachment = new AttachmentBuilder(canvas.toBuffer(), { name: "ship.png" })
            embed.setDescription(`${member} ve ${message.author} bu iş oldu.
            
            ${shipdurum} **${random}%**`)
            embed.setImage('attachment://ship.png')
            message.reply({ content: `[ ${member} ]`, embeds: [embed], files: [attachment] });

        }

        if(random >= 30 && random < 70) {

            ctx.drawImage(maybe, 275, 60, 150, 150);
            let attachment = new AttachmentBuilder(canvas.toBuffer(), { name: "ship.png" })
            embed.setDescription(`${member} ve ${message.author} çabalarsanız olucak gibi?
            
            ${shipdurum} **${random}%**`)
            embed.setImage("attachment://ship.png")
            message.reply({ content: `[ ${member} ]`, embeds: [embed], files: [attachment] });

        }

        if(random < 30) {

            ctx.drawImage(sad, 275, 60, 150, 150);
            let attachment = new AttachmentBuilder(canvas.toBuffer(), { name: "ship.png" })
            embed.setDescription(`${member} ve ${message.author} bu ilişkiyi bitirin bence.
            
            ${shipdurum} **${random}%**`)
            embed.setImage("attachment://ship.png")
            message.reply({ content: `[ ${member} ]`, embeds: [embed], files: [attachment] });

        }


}

}
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField, StringSelectMenuBuilder, ComponentType, EmbedBuilder, AttachmentBuilder } = require("discord.js")

const botRoles = require("../../Config/configRoles")
const botConfig = require("../../Config/config")
const botEmojis = require("../../Config/configEmojis")
const botSilents = require("../../Config/configSilent")
const botChannels = require("../../Config/configChannels")

const afkSchema = require("../../Database/afkSchema")
const userSchema = require("../../Database/userSchema")
const punishSchema = require("../../Database/punishSchema")
const infractionSchema = require("../../Database/infractionSchema")

module.exports = {
    name: "afk",
    aliases: [],
    description: "afk",
    category: "General",

    discordPermissions: [],
    permissions: [],
    botSahip: false,
    
    async execute(client, message, args, embed) {

        if(message.member.displayName.includes("[AFK]")) return;
        let reason = args.join(" ") || "Belirtilmedi!";
        await afkSchema.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $set: { reason: reason, date: Date.now() } }, { upsert: true });

        message.reply({ embeds: [embed.setDescription(`Başarıyla afk moduna geçtiniz.`)] }).then(x => setTimeout(() => x.delete(), 5000));
        if(message.member.manageable) message.member.setNickname(`[AFK] ${message.member.displayName}`);

}

}
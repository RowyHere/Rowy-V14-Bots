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
    name: "emoji",
    aliases: ['emojiekle','addemoji'],   
    description: "Kilit Sistemi",
    discordPermissions: [PermissionsBitField.Flags.Administrator],
    permissions: [botRoles.Moderation.commanderRoles],
    channels: [],
    ownerOnly: false,
    async execute(client, message, args, embed) {

      const emoji = args[0];
      if(!emoji) return message.reply({ embeds: [embed.setDescription(`Bir emoji belirtmelisin.`)]}).delete(5)
      let emojiName = args.slice(1).join("_")
      if(!emojiName) return message.reply({ embeds: [embed.setDescription(`Bir emoji adı belirtmelisin.`)]}).delete(5)

      if(emoji.startsWith("https://cdn.discordapp.com/emojis/")) {

      let directlyEmoji = await message.guild.emojis.create({ attachment: emoji, name: emojiName || "noname" });

      return await message.reply({ embeds: [embed.setDescription(`Emoji başarıyla eklendi. ${directlyEmoji}`)]}).delete(10)

      }

      const parseCustomEmoji = parseEmoji(emoji);
      if(!parseCustomEmoji.id) return message.reply({ embeds: [embed.setDescription(`Lütfen geçerli bir emoji belirtmelisin.`)]}).delete(5)

      const emojiURL = `https://cdn.discordapp.com/emojis/${parseCustomEmoji.id}.${parseCustomEmoji.animated ? "gif" : "png"}`;

      const createEmoji = await message.guild.emojis.create({ attachment: emojiURL, name: emojiName || parseCustomEmoji.name });
      message.reply({ embeds: [embed.setDescription(`Emoji başarıyla oluşturuldu. ${createEmoji}`)]}).delete(10)


    }
}
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField, StringSelectMenuBuilder, ComponentType, EmbedBuilder } = require("discord.js")

const botRoles = require("../../Config/configRoles")
const botConfig = require("../../Config/config")
const botEmojis = require("../../Config/configEmojis")
const botSilents = require("../../Config/configSilent")
const botChannels = require("../../Config/configChannels")

const userSchema = require("../../Database/userSchema")
const punishSchema = require("../../Database/punishSchema")
const infractionSchema = require("../../Database/infractionSchema")

module.exports = {
    name: "kilit",
    aliases: ['kilitle', 'lock', 'unlock'],    
    description: "Kilit Sistemi",
    discordPermissions: [PermissionsBitField.Flags.Administrator],
    permissions: [botRoles.Moderation.commanderRoles],
    channels: [],
    ownerOnly: false,
    async execute(client, message, args, embed) {

      if (message.channel.permissionsFor(message.guild.id).has(PermissionsBitField.Flags.SendMessages)) {
        await message.channel.permissionOverwrites.edit(message.guild.id, { SendMessages: false });
        await message.reply({ embeds: [embed.setDescription("<#" + message.channel + "> kanalı başarıyla kilitlendi.")] }).delete(10)
      } else {
        await message.channel.permissionOverwrites.edit(message.guild.id, { SendMessages: null });
        await message.reply({ embeds: [embed.setDescription("<#" + message.channel + "> kanalının kilit başarıyla açıldı.")] }).delete(10)
      };

    }
}
const Discord = require("discord.js");
const config = require('../../config.json');

let Server = require("../schema/serverData")

module.exports = {
  name: "taglı-alım",
  description: "taglı-alım.",
  aliases: ["taglıalım", "taglialim", "tagli-alim"],
  usage: "tagli-alım",
  cooldown: 1,
  /**@param {Discord.Message} messageCreate
   * @param {Array} args
   * @param {Discord.Client} client
   */
  async execute(message, args, client) {

    let serverData = await Server.findOne({ guildId: message.guild.id })

    if (!serverData.guildOwners.includes(message.author.id) && !message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) { return message.channel.send(`yetkiniz yeterli değil.`) }

    if (!serverData.tagMode) { 
      
      await Server.findOneAndUpdate({ guildId: message.guild.id }, { $set: { tagMode: "acik" } }, { $upsert: true }) 
      message.channel.send({ content: `${message.author}, Taglı alım modunu başarıyla açtınız.` })

      return

  }

    if (serverData.tagMode === "acik") {

      await Server.findOneAndUpdate({ guildId: message.guild.id }, { $set: { tagMode: "kapali" } }, { $upsert: true })
      message.channel.send({ content: `${message.author}, Taglı alım modunu başarıyla kapattınız.` })

    } else if (serverData.tagMode === "kapali") {

      await Server.findOneAndUpdate({ guildId: message.guild.id }, { $set: { tagMode: "acik" } }, { $upsert: true })
      message.channel.send({ content: `${message.author}, Taglı alım modunu başarıyla açtınız.` })

    }

  },
};
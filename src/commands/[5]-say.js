const Discord = require("discord.js");
const config = require('../../config.json');

let Server = require("../schema/serverData")

module.exports = {
  name: "say",
  description: "say.",
  aliases: ["say"],
  usage: "say",
  cooldown: 5,
  /**@param {Discord.Message} messageCreate
   * @param {Array} args
   * @param {Discord.Client} client
   */
  async execute(message, args, client) {

    let serverData = await Server.findOne({ guildId: message.guild.id })

    if (!serverData.guildOwners.includes(message.author.id) && !message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) { return message.channel.send(`yetkiniz yeterli değil.`) }

    let tag = await message.guild.members.cache.filter(member => (member.user.username.includes(serverData.mainTag))).size;
    let inVoice = message.guild.members.cache.filter(x => x.voice.channel).size
    let inBotVoice = message.guild.members.cache.filter(x => x.voice.channel && x.user.bot).size

    message.channel.send({
      embeds: [new Discord.MessageEmbed()
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
        .setDescription(`
    \`❯\` Şu anda toplam **${inVoice - inBotVoice}** (**+${inBotVoice || "0"} bot**) kişi seslide.
    \`❯\` Sunucuda **${message.guild.memberCount}** adet üye var (**${message.guild.members.cache.filter(member => member.presence && member.presence.status !== "offline").size}** Aktif)
    \`❯\` Toplamda **${tag}** kişi tagımızı alarak bizi desteklemiş.
    \`❯\` Toplamda **${message.guild.premiumSubscriptionCount}** adet boost basılmış! (**${message.guild.premiumTier.replace("NONE", "0")}** seviye)`)

      ]
    })

  },
};
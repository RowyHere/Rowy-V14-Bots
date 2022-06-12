const Discord = require("discord.js");
const config = require('../../config.json');

const Register = require("../schema/registerData")
let Server = require("../schema/serverData")

module.exports = {
  name: "kayıtsız",
  description: "Kayıtsız atarsınız.",
  aliases: ["kayitsiz"],
  usage: "kayıtsız @User",
  cooldown: 5,
  /**@param {Discord.Message} messageCreate
   * @param {Array} args
   * @param {Discord.Client} client
   */
  async execute(message, args, client) {


    let serverData = await Server.findOne({ guildId: message.guild.id })

    if (![...serverData.commanderRoles, ...serverData.registerRoles].some(x => message.member.roles.cache.get(x)) && !message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) { return message.channel.send(`yetkiniz yeterli değil.`) }

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if (!member) {
      return message.channel.send({ content: "<@" + message.author.id + ">, Komutu yanlış kullandınız ``" + config.prefix + "kayıtsız [@Rowy/ID]``" }).then(async (msg) => { setTimeout(() => { msg.delete() }, 5000) });
    }

    if (member.id === message.author.id) {
      return message.channel.send({ content: "``Kendinizi kayıtsız atmaya`` çalıştığınız için işlemler durduruldu!", }).then(async (msg) => { setTimeout(() => { msg.delete() }, 5000) });
    }
    if (member.id === message.guild.ownerId) {
      return message.channel.send({ content: "Kullanıcı ``Sunucu Sahibi`` olduğu için işlemler durduruldu!" }).then(async (msg) => { setTimeout(() => { msg.delete() }, 5000) });
    }
    if (member.roles.highest.position >= message.member.roles.highest.position) {
      return message.channel.send({ content: "Kullanıcı sizden ``Üst`` veya ``Aynı`` rolde bulunduğu için işlemler durduruldu!" }).then(async (msg) => { setTimeout(() => { msg.delete() }, 5000) });
    }

    member.setNickname(`${member.user.username.includes(serverData.mainTag) ? serverData.mainTag : serverData.noTag} İsim ' Yaş`)
    member.roles.set([...serverData.unregisterRoles])
    message.channel.send({ content: `Kullanıcı başarılı bir şekilde kayıtsıza atıldı.`})

  }
}
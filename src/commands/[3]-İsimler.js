const Discord = require("discord.js");
const config = require('../../config.json');

const Register = require("../schema/registerData")
let Server = require("../schema/serverData")

module.exports = {
  name: "isimler",
  description: "İsimlere bakarsınız.",
  aliases: ["names"],
  usage: "isimler @User",
  cooldown: 5,
  /**@param {Discord.Message} messageCreate
   * @param {Array} args
   * @param {Discord.Client} client
   */
  async execute(message, args, client) {

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    let serverData = await Server.findOne({ guildId: message.guild.id })

    if (![...serverData.commanderRoles, ...serverData.registerRoles].some(x => message.member.roles.cache.get(x)) && !message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) { return message.channel.send(`yetkiniz yeterli değil.`) }

    if (!member) {
      return message.channel.send({ content: "<@" + message.author.id + ">, Komutu yanlış kullandınız ``" + config.prefix + "isimler [@Rowy/ID]``" }).then(async (msg) => { setTimeout(() => { msg.delete() }, 5000) });
    }

    const row = new Discord.MessageActionRow()
      .addComponents(
        new Discord.MessageButton()
          .setCustomId('geri')
          .setLabel("Önceki Sayfa")
          .setEmoji("⬅️")
          .setStyle('PRIMARY'),
        new Discord.MessageButton()
          .setCustomId('cancel')
          .setLabel("İptal")
          .setStyle('DANGER'),
        new Discord.MessageButton()
          .setCustomId('ileri')
          .setLabel("Sonraki Sayfa")
          .setEmoji("➡️")
          .setStyle('PRIMARY'),
      );

    let registerData = await Register.findOne({ guildId: message.guild.id, member: member.id })
    if (!registerData) return message.channel.send({ content: `Kullanıcının veritabanında ismi bulunmamakta` }).then(async (msg) => { setTimeout(() => { msg.delete() }, 5000) })
    let rowyPage = 1;

    let checkNames = registerData.names.reverse().map(((value, index) => `\`\`${index + 1}.\`\` \`\`${value.name}\`\` (${value.role}) - ${value.executor}`))

    message.channel.send({
      embeds: [new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`${member} üyesinin toplamda **${registerData ? registerData.names.length : "0"}** isim kayıtı bulundu\n\n${checkNames.slice(rowyPage == 1 ? 0 : rowyPage * 10 - 10, rowyPage * 10).join("\n")}`)]
    }).then(async (msg) => {

      var iFilter = x => x.user.id === message.author.id;
      const collector = msg.createMessageComponentCollector({ filter: iFilter, componentType: "BUTTON", time: 30000 })

      if (checkNames.length > 10) {

        msg.edit({ components: [row] })

        collector.on('collect', async (interaction) => {

          if (interaction.customId === "ileri") {

            if (checkNames.slice((rowyPage + 1) * 10 - 10, (rowyPage + 1) * 10).length <= 0) return;
            msg.edit({ components: [row] })


            rowyPage += 1

            let historyNamesCheck = checkNames.slice(rowyPage == 1 ? 0 : rowyPage * 10 - 10, rowyPage * 10).join("\n");

            msg.edit({
              embeds: [new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setDescription(`${member} üyesinin toplamda **${registerData ? registerData.names.length : "0"}** isim kayıtı bulundu\n\n${historyNamesCheck}`)]
            })

            interaction.deferUpdate();

          }

          if (interaction.customId === "geri") {

            if (checkNames.slice((rowyPage - 1) * 10 - 10, (rowyPage + 1) * 10).length <= 0) return;
            msg.edit({ components: [row] })


            rowyPage -= 1

            let historyNamesCheck = checkNames.slice(rowyPage == 1 ? 0 : rowyPage * 10 - 10, rowyPage * 10).join("\n");

            msg.edit({
              embeds: [new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setDescription(`${member} üyesinin toplamda **${registerData ? registerData.names.length : "0"}** isim kayıtı bulundu\n\n${historyNamesCheck}`)]
            })

            interaction.deferUpdate();

          }

          if (interaction.customId === "cancel") {

            if (msg) msg.delete().catch(x => { })

          }

        })

        collector.on('end', async () => {

          if (msg) msg.delete().catch(x => { })

        })

      }

    })

  }
}
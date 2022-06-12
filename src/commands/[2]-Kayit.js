const Discord = require("discord.js");
const config = require('../../config.json');

const Register = require("../schema/registerData")
const Staff = require("../schema/memberData")
let Server = require("../schema/serverData")

module.exports = {
  name: "kayit",
  description: "Kayıt yaparsınız.",
  aliases: ["e", "k", "erkek", "kadin", "man", "men", "woman", "women", "kayıt"],
  usage: "K @User",
  cooldown: 5,
  /**@param {Discord.Message} messageCreate
   * @param {Array} args
   * @param {Discord.Client} client
   */
  async execute(message, args, client) {

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    let serverData = await Server.findOne({ guildId: message.guild.id })

    if (![...serverData.commanderRoles, ...serverData.registerRoles].some(x => message.member.roles.cache.get(x)) && !message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) { return message.channel.send(`yetkiniz yeterli değil.`) }

    let row = new Discord.MessageActionRow()
      .addComponents(

        new Discord.MessageButton()
          .setCustomId("man")
          .setLabel("Erkek")
          .setStyle("PRIMARY"),
        new Discord.MessageButton()
          .setCustomId("woman")
          .setLabel("Kadın")
          .setStyle("SUCCESS"),
        new Discord.MessageButton()
          .setCustomId("cancel")
          .setLabel("İptal")
          .setStyle("DANGER")
      )

    let Name = args[1];
    let Age = args[2];

    if (!member || !Name || isNaN(Age)) {
      return message.channel.send({ content: "<@" + message.author.id + ">, Komutu yanlış kullandınız ``" + config.prefix + "k [@Rowy/ID] <İsim> <Yaş>``" }).then(async (msg) => { setTimeout(() => { msg.delete() }, 5000) });
    }

    if (member.id === message.author.id) {
      return message.channel.send({ content: "``Kendinizi kayıt etmeye`` çalıştığınız için işlemler durduruldu!", }).then(async (msg) => { setTimeout(() => { msg.delete() }, 5000) });
    }
    if (member.id === message.guild.ownerId) {
      return message.channel.send({ content: "Kullanıcı ``Sunucu Sahibi`` olduğu için işlemler durduruldu!" }).then(async (msg) => { setTimeout(() => { msg.delete() }, 5000) });
    }
    if (member.roles.highest.position >= message.member.roles.highest.position) {
      return message.channel.send({ content: "Kullanıcı sizden ``Üst`` veya ``Aynı`` rolde bulunduğu için işlemler durduruldu!" }).then(async (msg) => { setTimeout(() => { msg.delete() }, 5000) });
    }
    let rowyName = `${member.user.username.includes(serverData.mainTag) ? serverData.mainTag : serverData.noTag} ${Name[0].toUpperCase().replace("i", "İ") + Name.substring(1)} \' ${Age}`

    let registerData = await Register.findOne({ guildId: message.guild.id, member: member.id })


    member.setNickname(rowyName)

    if(serverData.tagMode === "acik") {

      if(![...serverData.vipRoles, ...serverData.boosterRoles].some(x => member.roles.cache.get(x)) && !member.user.username.includes(serverData.mainTag)) return message.channel.send({ embeds: [new Discord.MessageEmbed()
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
        .setFooter({ text: "Taglı alım modu aktifleştirilmiş." })
        .setColor("RANDOM")
        .setDescription(`${member} üyesinin ismini \"${rowyName}\" olarak değiştirdim, fakat kayıt işlemi yapamazsınız.
        
        üyesininde tagımız olmadığı için, ${serverData.boosterRoles.map(x => `<@&${x}>`)}, ${serverData.vipRoles.map(x => `<@&${x}>`)} rollerinden biri olmadığı için kayıt işlemini durduruldu!`)] }).then(async (msg) => { setTimeout(() => { msg.delete() }, 10000) });

    }

    message.channel.send({

      embeds: [new Discord.MessageEmbed()
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
        .setDescription(`${member} üyesinin ismi \"${rowyName}\" olarak değiştirildi, bu üye daha önce bu isimlerle kayıt olmuş.

        üyesinin toplamda ${registerData ? "**" + registerData.names.length + "** isim kaydı bulundu! (Son **5** tanesi listelenmiştir)" : "**0** isim kaydı bulundu!"} 
        ${registerData ? registerData.names.reverse().slice(0, 5).map((value, index) => `\`\`${index + 1}.\`\` \`\`${value.name}\`\` (${value.role}) - ${value.executor}`).join("\n") : "Veri tabanında geçmiş ismi bulunmamaktadır."}
        
        Üyesinin önceki isimlerine \`\`${config.prefix}isimler <@Rowy/ID>\`\` komutuyla bakarak kayıt işlemini gerçekleştirmeniz önerilir.`)
        .setFooter({ text: "Lütfen 30 saniye alttaki butonlara basarak kullanıcının cinsiyetini belirleyin." })
      ],
      components: [row]

    }).then(async (msg) => {

      let iFilter = x => x.user.id === message.author.id
      let collector = msg.createMessageComponentCollector({ filter: iFilter, componentType: "BUTTON", max: 1, time: 30000 })

      collector.on('collect', async (interaction) => {

        if (interaction.customId === "man") {

          await Register.findOneAndUpdate({ guildId: message.guild.id, member: member.user.id }, { $push: { names: { name: rowyName, role: serverData.manRoles.map(x => `<@&${x}>`), executor: `<@${message.author.id}>` } } }, { upsert: true })

          await Staff.findOneAndUpdate({ guildId: message.guild.id, member: message.author.id }, { $push: { totalReg: 1, womanReg: 0, manReg: 1 } }, { upsert: true })

          member.roles.set([...serverData.manRoles]).then(x => {

            if (member.user.username.includes(serverData.mainTag)) {
              member.roles.add([...serverData.familyRoles])
            }

          })

          client.channels.cache.get(serverData.registerChannel).send({ content: `${member} (\`\`${member.id}\`\`) adlı kullanıcı ${serverData.manRoles.map(x => `<@&${x}>`).join(", ")} rolleriyle aramıza katıldı!` })
          client.channels.cache.get(serverData.generalChannel).send({ content: `${member} adlı kullanıcı aramıza katıldı! Hadi ona merhaba de :wave:` }).then(async (msg) => { setTimeout(() => { msg.delete() }, 7500) });

        }

        if (interaction.customId === "woman") {

          await Staff.findOneAndUpdate({ guildId: message.guild.id, member: message.author.id }, { $push: { totalReg: 1, womanReg: 1, manReg: 0 } }, { upsert: true })

          await Register.findOneAndUpdate({ guildId: message.guild.id, member: member.user.id }, { $push: { names: { name: rowyName, role: serverData.womanRoles.map(x => `<@&${x}>`), executor: `<@${message.author.id}>` } } }, { upsert: true })

          member.roles.set([...serverData.womanRoles]).then(x => {

            if (member.user.username.includes(serverData.mainTag)) {
              member.roles.add([...serverData.familyRoles])
            }

          })

          client.channels.cache.get(serverData.registerChannel).send({ content: `${member} (\`\`${member.id}\`\`) adlı kullanıcı ${serverData.womanRoles.map(x => `<@&${x}>`).join(", ")} rolleriyle aramıza katıldı!` })
          client.channels.cache.get(serverData.generalChannel).send({ content: `${member} adlı kullanıcı aramıza katıldı! Hadi ona merhaba de :wave:` }).then(async (msg) => { setTimeout(() => { msg.delete() }, 7500) });

        }

        if (interaction.customId === "cancel") {

          member.setNickname(`${member.user.username.includes(serverData.mainTag) ? serverData.mainTag : serverData.noTag} İsim \' Yaş`)

        }

      })

      collector.on('end', async () => {

        if (msg) msg.delete().catch(err => { })

      })

    })

  }
}
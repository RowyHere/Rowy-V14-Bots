const Discord = require("discord.js");
const config = require('../../config.json');

let setupData = require("../schema/serverData")

module.exports = {
  name: "setup",
  description: "Setup sistemi.",
  aliases: ["kur"],
  usage: "kur <tür> <değer>",
  cooldown: 1,
  /**@param {Discord.Message} messageCreate
   * @param {Array} args
   * @param {Discord.Client} client
   */
  async execute(message, args, client) {

    if((!config.developers.includes(message.author.id)) && (!config.owners.includes(message.author.id))) { return message.channel.send(`yetkiniz yeterli değil.`) }

    let choice = args[0]

    if (!choice) {

      message.channel.send({
        embeds: [new Discord.MessageEmbed()
          .setColor("RANDOM")
          .setThumbnail(message.author.avatarURL({ dynamic: true }))
          .addFields(

            { name: "```Sunucu Sahip Ayarları```", value: `${config.prefix}kur guildOwners @Rowy` },
            { name: "```Yetkili Ayarları```", value: `${config.prefix}kur commanderRoles @Roles\n${config.prefix}kur registerRoles @Roles` },
            { name: "```Aile Ayarları```", value: `${config.prefix}kur mainTag (TAG)\n${config.prefix}kur twoTag (TAG)\n${config.prefix}kur familyRoles @Roles` },
            { name: "```Rol Ayarları```", value: `${config.prefix}kur manRoles @Roles\n${config.prefix}kur womanRoles @Roles\n${config.prefix}kur unregisterRoles @Roles\n${config.prefix}kur vipRoles @Roles\n${config.prefix}kur boosterRoles @Roles` },
            { name: "```Kanal Ayarları```", value: `${config.prefix}kur welcomeLog #Channel\n${config.prefix}kur generalChat #Channel\n${config.prefix}kur tagLog #Channel\n${config.prefix}kur registerLog #Channel` }
          )
          .setFooter({ text: config.prefix + "setup durum yazarak, setup sisteminin durumuna bakabilirsiniz." })
          .setAuthor({ name: "Kurulum Paneli", iconURL: message.guild.iconURL({ dynamic: true }) })

        ],
      })

    }

    let serverData = await setupData.findOne({ guildId: message.guild.id })

    if (choice === "durum" || choice === "status" || choice === "check") {

      message.channel.send({
        embeds: [new Discord.MessageEmbed()
          .setColor("RANDOM")
          .setThumbnail(message.author.avatarURL({ dynamic: true }))
          .addFields(

            { name: "```Sunucu Sahip Ayarları```", value: `Sunucu Sahipleri: ${serverData.guildOwners ? serverData.guildOwners.map(x => `<@${x}>`) : "``Sunucu sahipleri ayarlanmamış.``"}` },
            { name: "```Yetkili Ayarları```", value: `Yetkili Rolleri:${serverData.commanderRoles ? serverData.commanderRoles.map(x => `<@&${x}>`) : "``Yetkili rolleri ayarlanmamış``"}\nTeyitci Rolleri: ${serverData.registerRoles ? serverData.registerRoles.map(x => `<@&${x}>`) : "``Teyitci rolleri ayarlanmamış``"}` },
            { name: "```Aile Ayarları```", value: `Main Tag: ${serverData.mainTag ? `\`\`${serverData.mainTag}\`\`` : "``Sunucu tagı ayarlanmamış.``"}\nİkinci Tag: ${serverData.noTag ? `\`\`${serverData.noTag}\`\`` : "``Sunucu ikinci tagı ayarlanmamış.``"}\nFamily Rolleri: ${serverData.familyRoles ? serverData.familyRoles.map(x => `<@&${x}>`) : "``Family rolleri ayarlanmamış.``"}` },
            { name: "```Rol Ayarları```", value: `Erkek Rolleri: ${serverData.manRoles ? serverData.manRoles.map(x => `<@&${x}>`) : "``Erkek rolleri ayarlanmamış.``"}\nKadın Rolleri: ${serverData.womanRoles ? serverData.womanRoles.map(x => `<@&${x}>`) : "``Kadın rolleri ayarlanmamış.``"}\nKayıtsız Rolleri: ${serverData.unregisterRoles ? serverData.unregisterRoles.map(x => `<@&${x}>`) : "``Kayıtsız rolleri ayarlanmamış.``"}\nVIP Rolleri: ${serverData.vipRoles ? serverData.vipRoles.map(x => `<@&${x}>`) : "``Özel kişi rolleri ayarlanmamış.``"}\nBooster Rolleri: ${serverData.boosterRoles ? serverData.boosterRoles.map(x => `<@&${x}>`) : "``Destekci rolleri ayarlanmamış.``"}` },
            { name: "```Kanal Ayarları```", value: `Hoşgeldin Kanalı: ${serverData.welcomeChannel ? "<#" + serverData.welcomeChannel + ">" : "``Hoşgeldin kanalı ayarlanmamış``"}\nSohbet Kanalı: ${serverData.generalChannel ? "<#" + serverData.generalChannel + ">" : "``Sohbet kanalı ayarlanmamış.``"}\nTag Kanalı: ${serverData.tagChannel ? "<#" + serverData.tagChannel + ">" : "``Tag kanalı ayarlanmamış.``"}\nKayıt Log Kanalı: ${serverData.registerChannel ? "<#" + serverData.registerChannel + ">" : "``Kayıt log kanalı ayarlanmamış.``"}` }

          )
          .setAuthor({ name: message.guild.name + " Sunucusunun ayarlari", iconURL: message.guild.iconURL({ dynamic: true }) })
        ]
      })

    }

    if (choice === "guildOwners") {

      let fetchOwners;

      if (message.mentions.users.size >= 1) {

        fetchOwners = message.mentions.users.map(x => x.id)

      } else {

        if (!fetchOwners) return message.channel.send("Sunucu sahiplerini belirtmen gerekiyor.")

      }

      await setupData.findOneAndUpdate({ guildId: message.guild.id }, { $set: { guildOwners: fetchOwners } }, { upsert: true }).then(x => {
        message.channel.send("Sunucu sahipleri " + fetchOwners.map(x => `<@${x}>`).join(", ") + " olarak ayarlandı.")
      })

    }

    if (choice === "manRoles" || choice === "erkekRolleri") {

      let fetchRoles;

      if (message.mentions.roles.size >= 1) {

        fetchRoles = message.mentions.roles.map(x => x.id)

      } else {

        if (!fetchRoles) return message.channel.send("Erkek rollerini belirtmen gerekiyor.")

      }

      await setupData.findOneAndUpdate({ guildId: message.guild.id }, { $set: { manRoles: fetchRoles } }, { upsert: true }).then(x => {
        message.channel.send("Erkek rolleri " + fetchRoles.map(x => `<@&${x}>`).join(", ") + " olarak ayarlandı.")
      })

    }

    if (choice === "womanRoles" || choice === "kadınRolleri") {

      let fetchRoles;

      if (message.mentions.roles.size >= 1) {

        fetchRoles = message.mentions.roles.map(x => x.id)

      } else {

        if (!fetchRoles) return message.channel.send("Kadın rollerini belirtmen gerekiyor.")

      }

      await setupData.findOneAndUpdate({ guildId: message.guild.id }, { $set: { womanRoles: fetchRoles } }, { upsert: true }).then(x => {
        message.channel.send("Kadın rolleri " + fetchRoles.map(x => `<@&${x}>`).join(", ") + " olarak ayarlandı.")
      })

    }

    if (choice === "familyRoles" || choice === "aileRolleri") {

      let fetchRoles;

      if (message.mentions.roles.size >= 1) {

        fetchRoles = message.mentions.roles.map(x => x.id)

      } else {

        if (!fetchRoles) return message.channel.send("Aile rollerini belirtmen gerekiyor.")

      }

      await setupData.findOneAndUpdate({ guildId: message.guild.id }, { $set: { familyRoles: fetchRoles } }, { upsert: true }).then(x => {
        message.channel.send("Aile rolleri " + fetchRoles.map(x => `<@&${x}>`).join(", ") + " olarak ayarlandı.")
      })

    }

    if (choice === "unregisterRoles" || choice === "kayitsizRolleri") {

      let fetchRoles;

      if (message.mentions.roles.size >= 1) {

        fetchRoles = message.mentions.roles.map(x => x.id)

      } else {

        if (!fetchRoles) return message.channel.send("Kayıtsız rollerini belirtmen gerekiyor.")

      }

      await setupData.findOneAndUpdate({ guildId: message.guild.id }, { $set: { unregisterRoles: fetchRoles } }, { upsert: true }).then(x => {
        message.channel.send("Kayıtsız rolleri " + fetchRoles.map(x => `<@&${x}>`).join(", ") + " olarak ayarlandı.")
      })

    }

    if (choice === "commanderRoles" || choice === "yetkiliRolleri") {

      let fetchRoles;

      if (message.mentions.roles.size >= 1) {

        fetchRoles = message.mentions.roles.map(x => x.id)

      } else {

        if (!fetchRoles) return message.channel.send("Yetkili rollerini belirtmen gerekiyor.")

      }

      await setupData.findOneAndUpdate({ guildId: message.guild.id }, { $set: { commanderRoles: fetchRoles } }, { upsert: true }).then(x => {
        message.channel.send("Yetkili rolleri " + fetchRoles.map(x => `<@&${x}>`).join(", ") + " olarak ayarlandı.")
      })

    }

    if (choice === "registerRoles" || choice === "kayitciRolleri") {

      let fetchRoles;

      if (message.mentions.roles.size >= 1) {

        fetchRoles = message.mentions.roles.map(x => x.id)

      } else {

        if (!fetchRoles) return message.channel.send("Kayıtcı rollerini belirtmen gerekiyor.")

      }

      await setupData.findOneAndUpdate({ guildId: message.guild.id }, { $set: { registerRoles: fetchRoles } }, { upsert: true }).then(x => {
        message.channel.send("Kayıtcı rolleri " + fetchRoles.map(x => `<@&${x}>`).join(", ") + " olarak ayarlandı.")
      })

    }

    if (choice === "boosterRoles" || choice === "destekciRolleri") {

      let fetchRoles;

      if (message.mentions.roles.size >= 1) {

        fetchRoles = message.mentions.roles.map(x => x.id)

      } else {

        if (!fetchRoles) return message.channel.send("Destekci rollerini belirtmen gerekiyor.")

      }

      await setupData.findOneAndUpdate({ guildId: message.guild.id }, { $set: { boosterRoles: fetchRoles } }, { upsert: true }).then(x => {
        message.channel.send("Destekci rolleri " + fetchRoles.map(x => `<@&${x}>`).join(", ") + " olarak ayarlandı.")
      })

    }

    if (choice === "vipRoles" || choice === "özelRolleri") {

      let fetchRoles;

      if (message.mentions.roles.size >= 1) {

        fetchRoles = message.mentions.roles.map(x => x.id)

      } else {

        if (!fetchRoles) return message.channel.send("Özel kişi rollerini belirtmen gerekiyor.")

      }

      await setupData.findOneAndUpdate({ guildId: message.guild.id }, { $set: { vipRoles: fetchRoles } }, { upsert: true }).then(x => {
        message.channel.send("Özel kişi rolleri " + fetchRoles.map(x => `<@&${x}>`).join(", ") + " olarak ayarlandı.")
      })

    }

    if (choice === "mainTag") {

      let select = args[1]

      if (!select) return message.channel.send("Sunucu tagını belirtmen gerekiyor.")

      await setupData.findOneAndUpdate({ guildId: message.guild.id }, { $set: { mainTag: select } }, { upsert: true }).then(x => {
        message.channel.send("Sunucu tagı ``" + select + "`` olarak ayarlandı.")
      })

    }

    if (choice === "twoTag") {

      let select = args[1]

      if (!select) return message.channel.send("Sunucu ikinci tagını belirtmen gerekiyor.")

      await setupData.findOneAndUpdate({ guildId: message.guild.id }, { $set: { noTag: select } }, { upsert: true }).then(x => {
        message.channel.send("Sunucu ikinci tagı ``" + select + "`` olarak ayarlandı.")
      })

    }

    if(choice === "welcomeLog" || choice === "hoşgeldinKanalı") {

      let fetchChannels;

      if (message.mentions.channels.first()) {

        fetchChannels = message.mentions.channels.first().id

      } else {

        if (!fetchChannels) return message.channel.send("Hoşgeldin kanalını belirtmen gerekiyor.")

      }

      await setupData.findOneAndUpdate({ guildId: message.guild.id }, { $set: { welcomeChannel: fetchChannels } }, { upsert: true }).then(x => {
        message.channel.send("Hoşgeldin kanalı <#" + fetchChannels + "> olarak ayarlandı.")
      })

    }

    if(choice === "generalChat" || choice === "sohbetKanalı") {

      let fetchChannels;

      if (message.mentions.channels.first()) {

        fetchChannels = message.mentions.channels.first().id

      } else {

        if (!fetchChannels) return message.channel.send("Hoşgeldin kanalını belirtmen gerekiyor.")

      }

      await setupData.findOneAndUpdate({ guildId: message.guild.id }, { $set: { generalChannel: fetchChannels } }, { upsert: true }).then(x => {
        message.channel.send("Sohbet kanalı <#" + fetchChannels + "> olarak ayarlandı.")
      })

    }
    if(choice === "tagLog") {

      let fetchChannels;

      if (message.mentions.channels.first()) {

        fetchChannels = message.mentions.channels.first().id

      } else {

        if (!fetchChannels) return message.channel.send("Hoşgeldin kanalını belirtmen gerekiyor.")

      }

      await setupData.findOneAndUpdate({ guildId: message.guild.id }, { $set: { tagChannel: fetchChannels } }, { upsert: true }).then(x => {
        message.channel.send("Tag kanalı <#" + fetchChannels + "> olarak ayarlandı.")
      })

    }
    if(choice === "registerLog" || choice === "kayıtLog") {

      let fetchChannels;

      if (message.mentions.channels.first()) {

        fetchChannels = message.mentions.channels.first().id

      } else {

        if (!fetchChannels) return message.channel.send("Hoşgeldin kanalını belirtmen gerekiyor.")

      }

      await setupData.findOneAndUpdate({ guildId: message.guild.id }, { $set: { registerChannel: fetchChannels } }, { upsert: true }).then(x => {
        message.channel.send("Kayıt Log kanalı <#" + fetchChannels + "> olarak ayarlandı.")
      })

    }

  }
}
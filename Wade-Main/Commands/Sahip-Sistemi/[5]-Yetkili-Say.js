const { ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField, StringSelectMenuBuilder, ComponentType, EmbedBuilder, parseEmoji } = require("discord.js")

const botRoles = require("../../Config/configRoles")
const botConfig = require("../../Config/config")
const botEmojis = require("../../Config/configEmojis")
const botSilents = require("../../Config/configSilent")
const botChannels = require("../../Config/configChannels")

const userSchema = require("../../Database/userSchema")
const punishSchema = require("../../Database/punishSchema")
const infractionSchema = require("../../Database/infractionSchema")

const wait = require("util").promisify(setTimeout);

module.exports = {
    name: "yetkili-say",
    aliases: ['ysay','yetkilisay'],   
    description: "Yetkili Kontrol Sistemi",
    discordPermissions: [PermissionsBitField.Flags.Administrator],
    permissions: [botRoles.Moderation.commanderRoles],
    channels: [],
    ownerOnly: false,
    async execute(client, message, args, embed) {
      
      const staffPermissions = message.guild.members.cache.filter(m => [...botRoles.allPermissions].some(x => m.roles.cache.get(x)))
      const staffPermissionsOnline = message.guild.members.cache.filter(m => [...botRoles.allPermissions].some(x => m.roles.cache.get(x)) && m.presence && m.presence.status !== 'offline')
      const staffPermissionsOnlineVoice = message.guild.members.cache.filter(m => [...botRoles.allPermissions].some(x => m.roles.cache.get(x)) && m.voice.channel && m.presence && m.presence.status !== 'offline')        
      const staffPermissionsVoice = message.guild.members.cache.filter(m => [...botRoles.allPermissions].some(x => m.roles.cache.get(x)) && !m.voice.channel && m.presence && m.presence.status !== 'offline')

      let row = new ActionRowBuilder()
      .addComponents(

          new StringSelectMenuBuilder()
          .setCustomId('yetkiliSay')
          .setPlaceholder('Yapılacak eylemi seçin.')
          .addOptions(
              { label: "Yetkili Ses Kontrol", value: "yetkiliSesKontrol", description: "Yetkili ses kanallarında olup olmadığını kontrol eder." },
              { label: "Yetkili Ses Çağır", value: "yetkiliSesCagir", description: "Yetkili ses kanallarında olmayan yetkilileri çağırır." },
              { label: "Yetkililer", value: "yetkililer", description: "Yetkili sayısını gösterir." },
          )

      )
      
      message.reply({ components: [row] }).then(async (msg) => {

        let collector = msg.createMessageComponentCollector({ componentType: 3, time: 60000 });
        collector.on('collect', async (i) => {
            if(i.member.permissions.has(8n) || [...botRoles.ownerRoles,...botRoles.mainOwnerRoles].some(x => i.member.roles.cache.get(x))) {
                let menuChoice = i.values[0];
                if(menuChoice === "yetkiliSesKontrol") {
                    
                    msg.edit({ embeds: [], content: `Yetkililerin ses kanallarında olup olmadığını kontrol ediyorum...`, components: [] })

                    let yetkiliSesKontrol = staffPermissionsVoice.map(x => `${x} - ${x.user.tag}`).join('\n')

                    setTimeout(() => { 

                    msg.edit({ embeds: [embed.setDescription(`Ses kanallarında aktif olmayan yetkililerimiz:\n${yetkiliSesKontrol || "Veri bulunamadı."}`)], components: [] }).delete(15)

                    }, 3500)

                }
                if(menuChoice === "yetkiliSesCagir") {

                    let rtx = 0;

                    msg.edit({ embeds: [], content: `Yetkilileri ses kanallarına çağırmaya çalışıyorum... (Bu işlem biraz uzun sürebilir)`, components: [] })

                    setTimeout(() => {

                        msg.edit({ embeds: [embed.setDescription("Yetkilileri ses kanalına çağırma işlemini başlattım.")], components: [] }).delete(15)

                    }, 3500)

                    if(rtx == 100) message.channel.send({ content: `Ratelimit koruması aktifleştirildi. Proxyler tekrar aktif!` })

                    staffPermissionsVoice.forEach(async (x, index) => {

                        rtx++
                        index++
                        wait(index * 500)
                        x.send({ content: `Merhaba ${x}, Sunucumuzun ses aktifliği arttırmak için herhangi bir ses odasına geçebilir misin?` }).catch(() => { message.channel.send({ content: `${x} isimli yetkiliye özel mesajları kapalı olduğu için mesaj atamıyorum, Lütfen seslere geçebilir misin? müsait değilseniz **Sleep Room** kanalına geçebilirsin.` }) })

                    })

                }
                if(menuChoice === "yetkililer") {

                    msg.edit({ embeds: [], content: `Yetkili sayısını hesaplıyorum...`, components: [] })

                    let yetkiliSay = staffPermissions.map(x => `${x} - ${x.user.tag}`).join(', ')

                    setTimeout(() => {

                        msg.edit({ embeds: [], content: `\`\`\`md\n# Toplam yetkili sayısı: ${staffPermissions.size}\n# Çevrimiçi yetkili Sayısı: ${staffPermissionsOnline.size}\n# Çevrimdışı yetkili sayısı: ${staffPermissions.size - staffPermissionsOnline.size}\n# Seste bulunan Yetkili sayısı: ${staffPermissionsOnlineVoice.size}\n# Seste bulunmayan Yetkili sayısı: ${staffPermissionsVoice.size}\`\`\``, components: [] }).delete(15)

                    }, 3500)


                }

            
            } else {
                i.reply({ content: 'Bu komutu kullanmak için yeterli yetkiniz bulunmuyor.', ephemeral: true })
            }

            })

    })
    
  }
}
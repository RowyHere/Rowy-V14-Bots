const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: "say",
    description: "say.",
    aliases: ["say"],
    usage: "{prefix}say",
    cooldown: 1,
    /**@param {Discord.Message} messageCreate
     * @param {Array} args
     * @param {Discord.Client} client
     */
    async execute(message, args, client, config) {

      let data = client.registerSystem.fetchData({ guild: message.guild })
      if(!data) return message.channel.send({ content: "<@" + message.author.id + ">, Sunucu için kayıt sistemi kurulu değil. `` " + config.prefix + "setup ``" }).then(async (msg) => { setTimeout(() => { msg.delete() }, 5000) });

      let totalMembers = message.guild.memberCount;
      let onlineMembers = message.guild.members.cache.filter(m => m.presence && m.presence.status !== "offline").size;
      let tagges = await message.guild.members.cache.filter(member => (member.user.username.includes(data.mainTag))).size;
      let totalBooster = message.guild.premiumSubscriptionCount;
      let totalBoosterLevel = message.guild.premiumTier;
      let inVoice = message.guild.members.cache.filter(x => x.voice.channel).size
      let inBotVoice = message.guild.members.cache.filter(x => x.voice.channel && x.user.bot).size

        let embed = new EmbedBuilder({

            color: await client.registerSystem.randomColors(),
            author: { name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) },
            description: `\` ❯ \` Şu anda toplam **${inVoice - inBotVoice}** (**+${inBotVoice || "0"} bot**) kişi seslide.
            \` ❯ \` Sunucuda **${totalMembers}** adet üye var (**${onlineMembers}** Aktif)
            \` ❯ \` Toplamda **${tagges}** kişi tagımızı alarak bizi desteklemiş.
            \` ❯ \` Toplamda **${totalBooster}** adet booster bulunmakta. (**${totalBoosterLevel}** seviye)
            `

        })

        message.channel.send({ embeds: [embed] })

    },
  };
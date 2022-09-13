module.exports = {
    name: "isimler",
    description: "İsimlerini gösterir.",
    aliases: ["names","isimler","İsimler","history"],
    usage: "{prefix}isimler <@Rowy/ID>",
    cooldown: 1,
    /**@param {Discord.Message} messageCreate
     * @param {Array} args
     * @param {Discord.Client} client
     */
    async execute(message, args, client, config) {

      let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  
      if (!member) return message.channel.send({ content: "<@" + message.author.id + ">, Komutu yanlış kullandınız `` " + config.prefix + "isimler <@Rowy/ID> ``" }).then(async (msg) => { setTimeout(() => { msg.delete() }, 5000) });
    
      client.registerSystem.fetchNames({ message: message, member: member });
  
    },
  };
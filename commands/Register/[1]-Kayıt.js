module.exports = {
  name: "kayit",
  description: "Kayıt yaparsınız.",
  aliases: ["kayıt","e","k","erkek","kız","kadın","bay","bayan","man","woman"],
  usage: "{prefix}kayit <@Rowy/ID> <İsim> <Yaş>",
  cooldown: 1,
  /**@param {Discord.Message} messageCreate
   * @param {Array} args
   * @param {Discord.Client} client
   */
  async execute(message, args, client, config) {
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    let name = args[1];
    let age = args[2];

    if (!member || !name || isNaN(age)) return message.channel.send({ content: "<@" + message.author.id + ">, Komutu yanlış kullandınız `` " + config.prefix + "k <@Rowy/ID> <İsim> <Yaş> ``" }).then(async (msg) => { setTimeout(() => { msg.delete() }, 5000) });

    let fixedNamed = `${member.user.username.includes(config.tag) ? config.tag : config.untag} ${name} | ${age}`;

    client.registerSystem.createRegister({ message: message, member: member, name: fixedNamed });

  },
};
module.exports = {
    name: "setup",
    description: "Kurulum Komutu",
    aliases: ["Kurulum","kurulum","Setup"],
    usage: "{prefix}Kurulum",
    cooldown: 1,
    /**@param {Discord.Message} messageCreate
     * @param {Array} args
     * @param {Discord.Client} client
     */
    async execute(message, args, client, config) {

        await client.registerSystem.createSetup({ message: message, args: args, config: config });
  
    },
  };
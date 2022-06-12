const { GuildMember, TextChannel, MessageEmbed } = require("discord.js");

module.exports = function (client) {

  client.fetchUser = async (userID) => {
    try {
      return await client.users.fetch(userID);
    } catch (err) {
      return undefined;
    }
  };

  client.fetchBan = async (guild, userID) => {
    try {
      return await guild.fetchBan(userID);
    } catch (err) {
      return undefined;
    }
  };

  const emojis = {
    0: "",
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
    7: "",
    8: "",
    9: ""
  };
  
  client.emojiConverter = function(number) {
    var newText = "";
    var arr = Array.from(number);
    for (var x = 0; x < arr.length; x++) {
      newText += (emojis[arr[x]] === "" ? arr[x] : emojis[arr[x]]);
    }
    return newText;
  };

  client.wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  
  TextChannel.prototype.wsend = async function (message) {
    const hooks = await this.fetchWebhooks();
    let webhook = hooks.find(a => a.name === client.user.username && a.owner.id === client.user.id);
    if (webhook) return webhook.send(message);
    webhook = await this.createWebhook(client.user.username, { avatar: client.user.avatarURL() });
    return webhook.send(message);
  };

};
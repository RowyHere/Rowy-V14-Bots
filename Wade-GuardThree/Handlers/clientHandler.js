const Discord = require('discord.js');
const client = global.client = new Discord.Client({ intents: [3276799], partials: [Discord.Partials.GuildMember, Discord.Partials.Channel, Discord.Partials.User] });
const config = require('../Config/config');
client.login(config.token);

client.commands = new Discord.Collection();
client.guildInvites = global.guildInvites = new Discord.Collection();

module.exports = client
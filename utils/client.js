const config = require('../config');
const { Client } = require('discord.js');

const client = new Client({ intents: config.intents, allowedMentions: { parse: ['users', 'roles'], repliedUser: false } });

module.exports = client;
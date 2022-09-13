const client = require('./utils/client');
const config = require('./config');
require('./database/connect');
require('./utils/loader');

client.login(config.token)

const registerSystem = require('./system/registerSystem')

const register = client.registerSystem = new registerSystem(client)

client.on('ready', () => {
    console.log(`[+] Logged in as ${client.user.tag}!`);
});
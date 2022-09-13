const { Collection } = require("discord.js");
const client = require('./client')

client.commands = new Collection()
client.cooldowns = new Collection()

const fs = require('fs');

/*              Commands                */
const commandFiles = fs.readdirSync("./src/commands")
console.log("Loading commands...");
for (const file of commandFiles) {
    const command = fs.readdirSync(`./src/commands/${file}`).filter(file => file.endsWith('.js'));
    for (const files of command) {
        const command = require(`../commands/${file}/${files}`);
        client.commands.set(command.name, command);
        console.log(`[+] Loaded command ${command.name}`);
    }

}
/*              Commands                */

/*                Events                */

const requestEvent = (event) => require(`../events/${event}`);
client.on('messageCreate', messageCreate => requestEvent('messageCreate')(messageCreate, client));

/*                Events                */
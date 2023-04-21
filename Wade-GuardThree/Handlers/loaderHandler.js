const mongoose = require('mongoose');
const config = require('../Config/config');
const fs = require('fs');
const client = require('./clientHandler');

async function connect() {

    mongoose.set('strictQuery', true);
    mongoose.connect(config.database.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(async(sex) => {

        console.log("[+] Mongoose bağlantısı kuruldu.")

    })

    }

    async function fetchCommands(active = true) {

        if(!active) return;

        const commandFiles = fs.readdirSync('./Commands')
        console.log(`[+] ${commandFiles.length} adet komut klasörü yüklendi.`)
        for (const file of commandFiles) {
            
            let commands = fs.readdirSync(`./Commands/${file}/`).filter(file => file.endsWith('.js'));
            for (const files of commands) {

                let command = require(`../Commands/${file}/${files}`)
                client.commands.set(command.name, command)
            }

        }

    }

    async function fetchEvents(active = true) {

        if(!active) return;

        const eventFiles = fs.readdirSync('./Events').filter(file => file.endsWith('.js'));
        console.log(`[+] ${eventFiles.length} adet event dosyası yüklendi.`)
        for (const event of eventFiles) {
        let events = require(`../Events/${event}`)
        client.on(events.name, events.execute)
        }

    }

module.exports = {
    connect,
    fetchCommands,
    fetchEvents
}
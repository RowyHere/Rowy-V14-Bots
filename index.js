const Discord = require("discord.js");
const client = global.client = new Discord.Client({ intents: [98303] })

const config = require("./config.json")

require("./src/function/functions")(client)
require("./src/handler/eventHandler")(client)
require("./src/handler/mongoHandler")

let Server = require("./src/schema/serverData")

client.login(config.token)

client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

const fs = require("fs");

const commander = fs.readdirSync('./src/commands').filter(files => files.endsWith('.js'));

console.log("[!] Komutlar yükleniyor...")
for (const files of commander) {
    const command = require(`./src/commands/${files}`);
    client.commands.set(command.name, command);
    const date = new Date()
    console.log("[+] Komut Yüklendi " + command.name)
}

const { joinVoiceChannel } = require('@discordjs/voice');

client.on("ready", async () => {

    let fetchChannel = client.channels.cache.get(config.voiceChannelId)
    if(!fetchChannel) return;

    if(fetchChannel) joinVoiceChannel({
        channelId: fetchChannel.id,
        guildId: fetchChannel.guild.id,
        adapterCreator: fetchChannel.guild.voiceAdapterCreator
    })

    let serverData = await Server.findOne({ guildId: client.guilds.cache.first().id })

    client.user.setActivity("Rowy 💙")
    if (serverData && !serverData.tagMode) {
        await Server.findOneAndUpdate({ guildId: client.guilds.cache.first().id }, { $set: { tagMode: "kapali" } }, { $upsert: true })
    }
    setInterval(() => {

        client.user.setActivity(config.activities)

    }, 300000)
    console.log("[+] Bot " + client.user.username + "  adiyle baslatildi!")

})

client.on('messageCreate', async (message) => {

    if (message.content === '!join') {
        joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator
        })
    }

})

client.on('userUpdate', async (oldUser, newUser) => {

    if (oldUser.bot || newUser.bot || (oldUser.username === newUser.username)) return;

    let serverData = await Server.findOne({ guildId: config.guildId })

    const guild = global.client.guilds.cache.get(config.guildId)
    if (!guild) return;
    const member = guild.members.cache.get(oldUser.id)
    if (!member) return;

    let channel = client.channels.cache.get(serverData.tagChannel)

    if (serverData.tagMode === "acik") {

        if (oldUser.username.includes(serverData.mainTag) && !newUser.username.includes(serverData.mainTag)) {

            member.roles.set([...serverData.unregisterRoles])

            channel.wsend({ content: `${member}, \`\`${serverData.mainTag}\`\` tagımızı çıkardığı için, **${serverData.familyRoles.map(x => `<@&${x}>`).join(", ")}** ${serverData.familyRoles.length > 1 ? "rollerini" : "rolünü"} aldım ve kayıtsıza gönderdim.`, allowedMentions: { parse: [] } })

        }

        if (!oldUser.username.includes(serverData.mainTag) && newUser.username.includes(serverData.mainTag)) {

            member.roles.add([...serverData.familyRoles])

            channel.wsend({ content: `${member}, \`\`${serverData.mainTag}\`\` tagımızı aldığı için **${serverData.familyRoles.map(x => `<@&${x}>`).join(", ")}** ${serverData.familyRoles.length > 1 ? "rollerini" : "rolünü"} verdim.`, allowedMentions: { parse: [] } })

        }

    } else if (serverData.tagMode === "kapali") {

        if (oldUser.username.includes(serverData.mainTag) && !newUser.username.includes(serverData.mainTag)) {

            member.roles.remove([...serverData.familyRoles])

            channel.wsend({ content: `${member}, \`\`${serverData.mainTag}\`\` tagımızı çıkarttığı için **${serverData.familyRoles.map(x => `<@&${x}>`).join(", ")}** ${serverData.familyRoles.length > 1 ? "rollerini" : "rolünü"} aldım ve üye olarak yeniledim.`, allowedMentions: { parse: [] } })

        } else if (!oldUser.username.includes(serverData.mainTag) && newUser.user.username.includes(serverData.mainTag)) {

            member.roles.add([...serverData.familyRoles])

            channel.wsend({ content: `${member}, \`\`${serverData.mainTag}\`\` tagımızı aldığı için **${serverData.familyRoles.map(x => `<@&${x}>`).join(", ")}** ${serverData.familyRoles.length > 1 ? "rollerini" : "rolünü"} verdim.`, allowedMentions: { parse: [] } })

        }

    }

})
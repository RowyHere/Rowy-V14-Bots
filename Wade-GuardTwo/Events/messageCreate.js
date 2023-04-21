const config =  require('../Config/config')
const { EmbedBuilder, PermissionsBitField } = require('discord.js')


module.exports = {
    name: 'messageCreate',
    async execute(message) {

        let client = message.client;
        let prefix = config.prefix;

        if(!message.content.startsWith(prefix)) return

        let args = message.content.slice(prefix.length).trim().split(/ +/g);
        let command = args.shift().toLocaleLowerCase("TR");

        let cmd = client.commands.get(command) || client.commands.find(x => x.aliases.includes(command))
        if(!cmd) return;

        const embed = global.embed = new EmbedBuilder()
        .setAuthor({
            name: message.author.username,
            iconURL: message.author.displayAvatarURL({ dynamic: true })
        })
        .setColor("Random")
        .setFooter({
            text: `${config.server.footer}`,
            iconURL: client.user?.displayAvatarURL({ dynamic: true })
        })
        .setTimestamp()

        if(cmd.ownerOnly) {

            if(!config.owners.includes(message.author.id)) return message.reply({ embeds: [embed.setDescription(`Bu komutu sadece geliştiri${config.owners.length > 1 ? "cilerim" : "cim"} kullanabilir.`)] }).delete(10) 

        }

        if(cmd.channels?.length > 0) {

            if(!cmd.channels.some(x => message.channel.id === x)) return message.reply({ embeds: [embed.setDescription(`Bu komutu bu kanalda kullanamazsin.`)] }).delete(10)

        }

        if(cmd.permissions?.length > 0 || cmd.discordPermissions?.length > 0) {

            if(![...cmd.permissions].some(x => message.member.roles.cache.has(x)) && ![...cmd.discordPermissions].some(x => message.member.permissions.has(x))) return message.reply({ embeds: [embed.setDescription(`Bu komutu kullanmak için yeterli yetkiniz bulunmamaktadır.`)] }).delete(10)

        }

        if(cmd) {
            cmd.execute(client, message, args, embed)
        }

    }
}
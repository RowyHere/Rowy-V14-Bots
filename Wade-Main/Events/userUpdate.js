const config =  require('../Config/config')
const botConfig =  require('../Config/config')
const channels =  require('../Config/configChannels')
const emojis =  require('../Config/configEmojis')
const roles =  require('../Config/configRoles')
const { EmbedBuilder, PermissionsBitField } = require('discord.js')

module.exports = {
    name: 'userUpdate',
    async execute(oldUser, newUser) {

        let guild = client.guilds.cache.get(config.server.sunucuID)
        let member = guild.members.resolve(newUser.id)

        let tagLog = client.channels.resolve(channels.Logs.tagLog)
        let tagRole = roles.Register.tagRoles

            if(!oldUser.username.includes(config.server.tag) && newUser.username.includes(config.server.tag)) {

                await member.roles.add(tagRole)
            
            tagLog.wsend({
                content: `${member} [\` ${member.id} \`]`,
                embeds: [new EmbedBuilder()
                .setAuthor({ name: member.guild.name, iconURL: member.guild.iconURL({ dynamic: true })})
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setColor('Random')
                .setDescription(`${member} kullanıcısı tagımızı alarak <t:${Math.floor(Date.now() / 1000)}:R> aramıza katıldı.
                
                \` > \` İsim Değişikliği: \` ${oldUser.username} \` => \` ${newUser.username} \`
                \` > \` Anlık taglı üye: **${await guild.members.cache.filter(m => m.user.username.includes(config.server.tag) || m.user.discriminator.includes(config.server.discrimTag)).size}**`)
            
            ]
            })

        } else if(oldUser.username.includes(config.server.tag) && !newUser.username.includes(config.server.tag)) {

            await member.roles.remove(tagRole)

            tagLog.wsend({
                content: `${member} [\` ${member.id} \`]`,
                embeds: [new EmbedBuilder()
                .setAuthor({ name: member.guild.name, iconURL: member.guild.iconURL({ dynamic: true })})
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setColor('Random')
                .setDescription(`${member} kullanıcısı tagımızı <t:${Math.floor(Date.now() / 1000)}:R> bıraktı.
                
                \` > \` İsim Değişikliği: \` ${oldUser.username} \` => \` ${newUser.username} \`
                \` > \` Anlık taglı üye: **${await guild.members.cache.filter(m => m.user.username.includes(config.server.tag) || m.user.discriminator.includes(config.server.discrimTag)).size}**`)
            
            ]
            })

        }

        if(oldUser.discriminator == (botConfig.server.discrimTag) && newUser.discriminator !== (botConfig.server.discrimTag)) {

            await member.roles.remove(tagRole)

            tagLog.wsend({ 
                content: `${member} [\` ${member.id} \`]`, 
                embeds: [new EmbedBuilder()
                .setAuthor({ name: member.guild.name, iconURL: member.guild.iconURL({ dynamic: true })})
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setColor('Random')
                .setDescription(`${member} kullanıcısı tagımızı <t:${Math.floor(Date.now() / 1000)}:R> bıraktı.
                
                \` > \` İsim Değişikliği: \` ${oldUser.username}#${oldUser.discriminator} \` => \` ${newUser.username}#${newUser.discriminator} \`
                \` > \` Anlık taglı üye: **${await guild.members.cache.filter(m => m.user.username.includes(botConfig.sunucuMainTag) || m.user.discriminator.includes(botConfig.sunucuEtiket)).size}**
                `)
            ]
        })

        } else if(oldUser.discriminator !== (botConfig.server.discrimTag) && newUser.discriminator == (botConfig.server.discrimTag)) {
        
            await member.roles.add(tagRole)

            tagLog.wsend({ 
                content: `${member} [\` ${member.id} \`]`, 
                embeds: [new EmbedBuilder()
                .setAuthor({ name: member.guild.name, iconURL: member.guild.iconURL({ dynamic: true })})
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setColor('Random')
                .setDescription(`${member} kullanıcısı tagımızı alarak <t:${Math.floor(Date.now() / 1000)}:R> aramıza katıldı.
                
                \` > \` İsim Değişikliği: \` ${oldUser.username}#${oldUser.discriminator} \` => \` ${newUser.username}#${newUser.discriminator} \`
                \` > \` Anlık taglı üye: **${await guild.members.cache.filter(m => m.user.username.includes(botConfig.sunucuMainTag) || m.user.discriminator.includes(botConfig.sunucuEtiket)).size}**
                `)
            ]
        })

        }

    }
}
const client = global.client;
const { AuditLogEvent, Events, EmbedBuilder, ButtonBuilder } = require('discord.js');

const botChannels = require("../Config/configChannels");
const botEmojis = require("../Config/configEmojis");

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState) {

        let logs = client.channels.cache.get(botChannels.voiceLog)
        if (!logs) return;

        let oldMember = oldState?.member
        let newMember = newState?.member

        let newChannel = newState?.channel
        let oldChannel = oldState?.channel

        if(oldMember?.user.bot || newMember?.user.bot) return;

        let embed = client.embed = new EmbedBuilder()
        .setAuthor({ name: newState.guild.name, iconURL: newState.guild.iconURL({ dynamic: true }) })
        .setFooter({ text: newMember.user.username + "#" + newMember.user.discriminator, iconURL: newMember.user.avatarURL({ dynamic: true })})
        .setColor('Random')
        .setTimestamp()
        
        if(!oldState.channelId && newState.channelId) {
        embed.setDescription(`
${newMember} kullanıcısı sesli sohbetlere __**giriş yaptı!**__

Kullanıcı: ${newMember} (\`${newMember.id} - ${newMember.user.username + "#" + newMember.user.discriminator}\`)
Kanal: ${newState.channel} (\`${newState.channel.id}\`)
Tarih: __<t:${Math.floor(Date.now() / 1000)}>__ (<t:${Math.floor(Date.now() / 1000)}:R>)

**Odadaki Kullanıcılar** (\`${newChannel.members.size}\`)
${newChannel.members.size > 0 ? newChannel.members.map(x => `${x.voice.selfMute ? botEmojis.selfMute : botEmojis.unSelfMuted} ${x.voice.selfDeaf ? botEmojis.selfDeaf : botEmojis.unSelfDeafed} ${x.voice.selfVideo ? botEmojis.selfVideo : botEmojis.unSelfVideo} ${x.voice.streaming ? botEmojis.streaming : botEmojis.unStreaming} ${x}`).join("\n") : "Odada kullanıcı bulunmamakta!"}`)
            logs.wsend({ embeds: [embed]})

        } else if(oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
            embed.setDescription(`
${newMember} kullanıcısı ${oldChannel} kanalından ${newChannel} kanalına __**geçiş yaptı!**__

Kullanıcı: ${newMember} (\`${newMember.id} - ${newMember.user.username + "#" + newMember.user.discriminator}\`)
Eski Kanal: ${oldChannel} (\`${oldChannel.id}\`)
Yeni Kanal: ${newChannel} (\`${newChannel.id}\`)
Tarih: __<t:${Math.floor(Date.now() / 1000)}>__ (<t:${Math.floor(Date.now() / 1000)}:R>)

**Yeni Odadaki Kullanıcılar** (\`${newChannel.members.size}\`)
${newChannel.members.size > 0 ? newChannel.members.map(x => `${x.voice.selfMute ? botEmojis.selfMute : botEmojis.unSelfMuted} ${x.voice.selfDeaf ? botEmojis.selfDeaf : botEmojis.unSelfDeafed} ${x.voice.selfVideo ? botEmojis.selfVideo : botEmojis.unSelfVideo} ${x.voice.streaming ? botEmojis.streaming : botEmojis.unStreaming} ${x}`).join("\n") : "Odada kullanıcı bulunmamakta!"}`)
            logs.wsend({ embeds: [embed]})
        } else if(oldState.channelId && !newState.channelId) {
        embed.setDescription(`
${newMember} kullanıcısı sesli sohbetlerden __**çıkış yaptı!**__
            
Kullanıcı: ${newMember} (\`${newMember.id} - ${newMember.user.username + "#" + newMember.user.discriminator}\`)
Kanal: ${oldChannel} (\`${oldChannel.id}\`)
Tarih: __<t:${Math.floor(Date.now() / 1000)}>__ (<t:${Math.floor(Date.now() / 1000)}:R>)
            
**Odadaki Kullanıcılar** (\`${oldChannel.members.size}\`)
${oldChannel.members.size > 0 ? oldChannel.members.map(x => `${x.voice.selfMute ? botEmojis.selfMute : botEmojis.unSelfMuted} ${x.voice.selfDeaf ? botEmojis.selfDeaf : botEmojis.unSelfDeafed} ${x.voice.selfVideo ? botEmojis.selfVideo : botEmojis.unSelfVideo} ${x.voice.streaming ? botEmojis.streaming : botEmojis.unStreaming} ${x}`).join("\n") : "Odada kullanıcı bulunmamakta!"}`)
                        logs.wsend({ embeds: [embed]})
        }

}
}
const Discord = require('discord.js');
const inviteSchema = require('../Database/inviteSchema');

const botConfig = require('../Config/config');
const botChannels = require('../Config/configChannels');

module.exports = {
    name: 'guildMemberRemove',    
    async execute(member) {

        const invChannel = member.guild.channels.resolve(botChannels.Logs.inviteChannel);
        const fakeControl = Date.now()-member.user.createdTimestamp < 1000*60*60*24*botConfig.server.fakeDay

        const inviteUser = await inviteSchema.findOne({ guildID: member.guild.id, userID: member.id })
        let inviter;
        try {
        inviter = await client.users.fetch(inviteUser.inviterID)
        } catch(err) {
        inviter = member.guild.id
        }
        
        switch (inviter) {
            case member.guild.id:

                invChannel.send({ content: `**${member.user.tag}** <t:${Math.floor(Date.now() / 1000)}:R> sunucumuzdan ayrıldı, **ÖZEL URL** ile giriş yapmıştı. ${fakeControl ? "`❌`": ""}`});

            break;

            case inviteUser.inviterID:
        
                await inviteSchema.findOneAndUpdate({ guildID: member.guild.id, userID: inviter.id }, { $inc: { total: -1, regular: -1, leave: 1, dailyInvites: -1, weeklyInvites: -1, fake: fakeControl ? -1 : 0 } }, { upsert: true })
    
                const data = await inviteSchema.findOne({ guildID: member.guild.id, userID: inviter.id });

                invChannel.send({ content: `**${inviter.tag}** (**${data.total+1}**) daveti ile sunucuya katılan **${member.user.tag}**, <t:${Math.floor(Date.now() / 1000)}:R> sunucudan ayrıldı. kalan daveti: **${data.total}** ${fakeControl ? "`❌`": ""}`});

            break;
        }

    }
}
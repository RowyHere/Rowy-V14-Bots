const Discord = require('discord.js');
const inviteSchema = require('../Database/inviteSchema');

const botConfig = require('../Config/config');
const botChannels = require('../Config/configChannels');

module.exports = {
    name: 'guildMemberAdd',    
    async execute(member) {

        const invChannel = member.guild.channels.resolve(botChannels.Logs.inviteChannel);
        const fakeControl = Date.now()-member.user.createdTimestamp < 1000*60*60*24*botConfig.server.fakeDay

        const cachedInvites = global.guildInvites.get(member.guild.id) || new Discord.Collection().clone();
        const invites = await member.guild.invites.fetch();
        const invite = await invites.find(inv => cachedInvites.get(inv.code) < inv.uses) || member.guild.vanityURLCode;

        const codeUses = new Map();
        invites.each(inv => codeUses.set(inv.code, inv.uses));
    
        global.guildInvites.set(member.guild.id, codeUses);

        switch (invite) {
            case member.guild.vanityURLCode:

                await inviteSchema.findOneAndUpdate({ guildID: member.guild.id, userID: member.id }, { $set: { inviterID: member.guild.id } }, { upsert: true });
                if(invChannel) invChannel.send({ content: `**${member.user.tag}** <t:${Math.floor(Math.floor(Date.now() / 1000))}:R> sunucuya **ÖZEL URL** ile katıldı! ${fakeControl === true ? "`❌`": ""}`});
                
            break;

            default:

                const inviter = await client.users.fetch(invite.inviter.id)

                await inviteSchema.findOneAndUpdate({ guildID: member.guild.id, userID: member.id }, { $set: { inviterID: invite.inviter.id } }, { upsert: true });
                await inviteSchema.findOneAndUpdate({ guildID: member.guild.id, userID: invite.inviter.id }, { $inc: { total: 1, regular: 1, dailyInvites: 1, weeklyInvites: 1, fake: fakeControl ? 1 : 0 } }, { upsert: true });
        
                const data = await inviteSchema.findOne({ guildID: member.guild.id, userID: invite.inviter.id })

                invChannel.send({ content: `**${member.user.tag}** <t:${Math.floor(Date.now() / 1000)}:R> **${!inviter ? "Deleted User#0000" : inviter.tag}** (**${data.total}**) daveti ile sunucuya katıldı! ${fakeControl === true ? "`❌`": ""}`});

            break;
        }

    }
}
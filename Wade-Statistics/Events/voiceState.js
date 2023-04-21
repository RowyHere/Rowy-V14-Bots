const client = global.client;

const voiceSchema = require('../Database/voiceSchema')
const voiceChannelSchema = require('../Database/voiceChannelSchema')
const voiceJoined = require('../Database/voiceJoinedAtSchema')

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState) {

    if ((oldState.member && oldState.member.user.bot) || (newState.member && newState.member.user.bot)) return;

    if(!oldState.channelId && newState.channelId) return voiceJoined.findOneAndUpdate({ guildID: oldState.guild.id, userID: newState.id }, { $set: { joinedAt: Date.now() } }, { upsert: true })

    let voiceDate = await voiceJoined.findOne({ guildID: oldState.guild.id, userID: oldState.id });
    if(!voiceDate?.joinedAt) await voiceJoined.findOneAndUpdate({ userID: oldState.id }, { $set: { joinedAt: Date.now() } }, { upsert: true })
    let converter = Date.now() - voiceDate.joinedAt
    let pinnedDate = voiceDate.joinedAt
    if (oldState.channelId && !newState.channelId) {

        await voiceJoined.deleteOne({ joinedAt: pinnedDate });
        await voiceSchema.findOneAndUpdate({ guildID: oldState.guild.id, userID: oldState.id }, { $inc: { totalVoice: converter, dailyVoice: converter, weeklyVoice: converter } }, { upsert: true });
        await voiceChannelSchema.findOneAndUpdate({ guildID: oldState.guild.id, userID: oldState.id, channelID: oldState.channel.id }, { $inc: { channelData: converter }}, { upsert: true})
        
    } else if (oldState.channelId && newState.channelId) {
    
        await voiceSchema.findOneAndUpdate({ guildID: oldState.guild.id, userID: oldState.id }, { $inc: { totalVoice: converter, dailyVoice: converter, weeklyVoice: converter } }, { upsert: true });
        await voiceJoined.findOneAndUpdate({ guildID: oldState.guild.id, userID: oldState.id }, { $set: { joinedAt: Date.now() } });
        await voiceChannelSchema.findOneAndUpdate({ guildID: oldState.guild.id, userID: oldState.id, channelID: oldState.channel.id }, { $inc: { channelData: converter }}, { upsert: true})

    }

    }
}
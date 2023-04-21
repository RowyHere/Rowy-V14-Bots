const client = global.client;

module.exports = {
    name: 'voiceUpdateState',
    async execute(oldState, newState) {

    if ((oldState.member && oldState.member.user.bot) || (newState.member && newState.member.user.bot)) return;

    if(!oldState.channelId && newState.channelId) await global.channelDuration.set(oldState.member.id, Date.now())

    if (oldState.channelId && !newState.channelId) {

        await global.channelDuration.delete(oldState.member.id);

    } else if (oldState.channelId && newState.channelId) {
    
        await global.channelDuration.set(oldState.member.id, Date.now());
    
    }

    }
}